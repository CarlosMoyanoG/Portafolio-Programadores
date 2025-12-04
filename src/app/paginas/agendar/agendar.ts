import { Component } from '@angular/core';
import { Programador } from '../../modelos/programador';
import { Programadores } from '../../servicios/programadores';
import { Asesorias } from '../../servicios/asesorias';
import { Disponibilidades } from '../../servicios/disponibilidades';
import { Disponibilidad } from '../../modelos/disponibilidad';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Autenticacion } from '../../servicios/autenticacion';

@Component({
  selector: 'app-agendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agendar.html',
  styleUrl: './agendar.scss',
})
export class Agendar {
  programadores: Programador[] = [];

  form = {
    programadorId: 0,
    nombreCliente: '',
    emailCliente: '',
    fecha: '',
    hora: '',
    descripcionProyecto: '',
  };

  mensajeExito = '';

  disponibilidadesProgramador: Disponibilidad[] = [];
  horasDisponibles: string[] = [];

  sinHorarios = false;

  constructor(
    private programadoresService: Programadores,
    private asesoriasService: Asesorias,
    private disponibilidadesService: Disponibilidades,
    private route: ActivatedRoute,
    private auth: Autenticacion
  ) {
    const email = this.auth.usuarioActual.email;
    if (email) {
      this.form.emailCliente = email;
    }
  }

  async ngOnInit(): Promise<void> {
    this.programadores = await this.programadoresService.getProgramadores();

    const progIdParam = this.route.snapshot.queryParamMap.get('programadorId');
    if (progIdParam) {
      this.form.programadorId = +progIdParam;
      await this.cargarDisponibilidades(this.form.programadorId);
    }
  }

  //  Utilidades de tiempo

  private minutosDesdeHora(hora: string): number {
    const [h, m] = hora.split(':').map((n) => parseInt(n, 10));
    return h * 60 + m;
  }

  private horaDesdeMinutos(min: number): string {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${h.toString().padStart(2, '0')}:${m
      .toString()
      .padStart(2, '0')}`;
  }

  private diaSemanaDesdeFecha(fecha: string): number {
    const d = new Date(fecha + 'T00:00:00');
    return d.getDay();
  }

  async cargarDisponibilidades(programadorId: number) {
    this.disponibilidadesProgramador =
      await this.disponibilidadesService.getPorProgramador(programadorId);

    this.horasDisponibles = [];
    this.form.hora = '';
    this.sinHorarios = false;

    if (this.form.fecha) {
      await this.generarHorasDisponibles();
    }
  }

  async cambiosProgramador(id: number) {
    this.form.programadorId = id;
    this.form.fecha = '';
    this.form.hora = '';
    this.horasDisponibles = [];
    this.sinHorarios = false;

    if (id) {
      await this.cargarDisponibilidades(id);
    }
  }

  async cambioFecha() {
    this.form.hora = '';
    this.horasDisponibles = [];
    if (this.form.programadorId && this.form.fecha) {
      await this.generarHorasDisponibles();
    }
  }

  seleccionarHora(hora: string) {
    this.form.hora = hora;
  }

  private async generarHorasDisponibles() {
    if (!this.form.programadorId || !this.form.fecha) {
      this.horasDisponibles = [];
      this.sinHorarios = false;
      return;
    }

    const diaSemana = this.diaSemanaDesdeFecha(this.form.fecha);
    const baseSlots: string[] = [];

    for (const d of this.disponibilidadesProgramador) {
      if (
        d.tipo === 'recurrente' &&
        d.diaSemana === diaSemana &&
        d.horaInicio &&
        d.horaFin
      ) {
        const inicio = this.minutosDesdeHora(d.horaInicio);
        const fin = this.minutosDesdeHora(d.horaFin);

        for (let t = inicio; t + 60 <= fin; t += 60) {
          baseSlots.push(this.horaDesdeMinutos(t));
        }
      }
    }

    for (const d of this.disponibilidadesProgramador) {
      if ((!d.tipo || d.tipo === 'puntual') && d.fecha === this.form.fecha && d.hora) {
        baseSlots.push(d.hora);
      }
    }

    let disponibles = Array.from(new Set(baseSlots));

    const bloqueos = this.disponibilidadesProgramador
      .filter(
        (d) =>
          d.tipo === 'bloqueo' &&
          d.fecha === this.form.fecha &&
          d.horaInicio &&
          d.horaFin
      )
      .map((d) => ({
        inicio: this.minutosDesdeHora(d.horaInicio!),
        fin: this.minutosDesdeHora(d.horaFin!),
      }));

    const asesoriasDia =
      await this.asesoriasService.getAsesoriasPorProgramadorYFecha(
        this.form.programadorId,
        this.form.fecha
      );

    const horasOcupadas = asesoriasDia
      .filter((a) => a.estado !== 'rechazada')
      .map((a) => a.hora);

    disponibles = disponibles.filter((hora) => {
      const inicio = this.minutosDesdeHora(hora);
      const fin = inicio + 60;

      if (horasOcupadas.includes(hora)) return false;

      for (const b of bloqueos) {
        if (inicio < b.fin && fin > b.inicio) {
          return false;
        }
      }

      return true;
    });

    this.horasDisponibles = disponibles.sort();
    this.sinHorarios = this.horasDisponibles.length === 0;
  }


  async onSubmit() {
    if (!this.form.programadorId) {
      alert('Debes seleccionar un programador');
      return;
    }

    if (!this.form.fecha) {
      alert('Debes seleccionar una fecha');
      return;
    }

    if (!this.form.hora) {
      alert('Debes seleccionar una hora disponible');
      return;
    }

    if (this.sinHorarios) {
      alert(
        'Este programador no tiene horarios disponibles para esa fecha. Elige otra.'
      );
      return;
    }

    await this.asesoriasService.crearAsesoria({
      programadorId: this.form.programadorId,
      nombreCliente: this.form.nombreCliente,
      emailCliente: this.form.emailCliente,
      fecha: this.form.fecha,
      hora: this.form.hora,
      descripcionProyecto: this.form.descripcionProyecto,
    });

    this.mensajeExito =
      'Tu solicitud fue enviada. Recibirás la confirmación del programador cuando apruebe o rechace la asesoría.';

    this.form.nombreCliente = '';
    this.form.fecha = '';
    this.form.hora = '';
    this.form.descripcionProyecto = '';
    this.horasDisponibles = [];
    this.sinHorarios = false;
  }
}
