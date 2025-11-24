import { Component } from '@angular/core';
import { Programador } from '../../modelos/programador';
import { Programadores } from '../../servicios/programadores';
import { Asesorias } from '../../servicios/asesorias';
import { Disponibilidades } from '../../servicios/disponibilidades';
import { Disponibilidad } from '../../modelos/disponibilidad';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
    descripcionProyecto: ''
  };

  mensajeExito = '';

  disponibilidadesProgramador: Disponibilidad[] = [];
  selectedSlotId = 0;

  constructor(
    private programadoresService: Programadores,
    private asesoriasService: Asesorias,
    private disponibilidadesService: Disponibilidades,
    private route: ActivatedRoute
  ) {
    this.programadores = this.programadoresService.getProgramadores();

    const progIdParam = this.route.snapshot.queryParamMap.get('programadorId');
    if (progIdParam) {
      this.form.programadorId = +progIdParam;
      this.cargarDisponibilidades(+progIdParam);
    }
  }

  cargarDisponibilidades(programadorId: number) {
    this.disponibilidadesProgramador =
      this.disponibilidadesService.getPorProgramador(programadorId);
    this.selectedSlotId = 0;
  }

  onProgramadorChange(id: number) {
    this.cargarDisponibilidades(id);
    this.form.fecha = '';
    this.form.hora = '';
  }

  onSlotChange(slotId: number) {
    const slot = this.disponibilidadesProgramador.find(d => d.id === slotId);
    if (slot) {
      this.form.fecha = slot.fecha;
      this.form.hora = slot.hora;
    }
  }

  onSubmit() {
    if (!this.form.programadorId) {
      alert('Debes seleccionar un programador');
      return;
    }

    this.asesoriasService.crearAsesoria({
      programadorId: this.form.programadorId,
      nombreCliente: this.form.nombreCliente,
      emailCliente: this.form.emailCliente,
      fecha: this.form.fecha,
      hora: this.form.hora,
      descripcionProyecto: this.form.descripcionProyecto
    });

    this.mensajeExito = 'Asesoría agendada correctamente';

    this.form.nombreCliente = '';
    this.form.emailCliente = '';
    this.form.fecha = '';
    this.form.hora = '';
    this.form.descripcionProyecto = '';
    this.selectedSlotId = 0;
  }
}
