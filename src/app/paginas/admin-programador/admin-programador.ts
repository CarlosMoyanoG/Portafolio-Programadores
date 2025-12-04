import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Programador } from '../../modelos/programador';
import { Asesoria, EstadoAsesoria } from '../../modelos/asesoria';
import { Programadores } from '../../servicios/programadores';
import { Asesorias } from '../../servicios/asesorias';
import { Autenticacion } from '../../servicios/autenticacion';
import {Proyecto,TipoParticipacion,TipoSeccionProyecto} from '../../modelos/proyecto';
import { Disponibilidades } from '../../servicios/disponibilidades';
import { Disponibilidad } from '../../modelos/disponibilidad';

@Component({
  selector: 'app-admin-programador',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-programador.html',
  styleUrl: './admin-programador.scss',
})

export class AdminProgramador implements OnInit {
  mensajeExito = '';
  asesorias: Asesoria[] = [];
  programador: Programador | undefined;
  estadosPosibles: EstadoAsesoria[] = ['pendiente', 'aprobada', 'rechazada'];

  // Perfil
  perfilEditando = false;
  perfilForm = {
    nombre: '',
    especialidad: '',
    descripcion: '',
    emailContacto: '',
    githubUrl: '',
    linkedinUrl: '',
    sitioWeb: '',
  };

  // Horarios propios
  horarios: Disponibilidad[] = [];
  diasSemana = [
    { valor: 1, etiqueta: 'Lunes' },
    { valor: 2, etiqueta: 'Martes' },
    { valor: 3, etiqueta: 'Miércoles' },
    { valor: 4, etiqueta: 'Jueves' },
    { valor: 5, etiqueta: 'Viernes' },
    { valor: 6, etiqueta: 'Sábado' },
    { valor: 0, etiqueta: 'Domingo' },
  ];

  formHorarioRecurrente = {
    diasSeleccionados: [] as number[],
    horaInicio: '',
    horaFin: '',
  };

  formBloqueo = {
    fecha: '',
    horaInicio: '',
    horaFin: '',
    todoElDia: false,
  };

  // Proyectos
  tecnologiasTexto = '';
  editandoProyectoId: number | null = null;
  tiposSeccion: TipoSeccionProyecto[] = ['academico', 'laboral'];
  tiposParticipacion: TipoParticipacion[] = [
    'Frontend',
    'Backend',
    'Base de Datos',
    'Fullstack',
  ];

  nuevoProyecto: Proyecto = {
    id: 0,
    nombre: '',
    descripcion: '',
    seccion: 'academico',
    participacion: 'Frontend',
    tecnologias: [],
    repoUrl: '',
    demoUrl: '',
  };

  constructor(
    private programadorService: Programadores,
    private asesoriasService: Asesorias,
    private auth: Autenticacion,
    private disponibilidadesService: Disponibilidades
  ) {}

  async ngOnInit(): Promise<void> {
    await this.cargarDatos();
  }

  //  Carga inicial

  private async cargarDatos(): Promise<void> {
    const programadorId = this.auth.usuarioActual.programadorId ?? 1;

    this.programador = await this.programadorService.getProgramadorById(
      programadorId
    );
    const todas_asesorias = await this.asesoriasService.getAsesorias();

    if (this.programador) {
      const listaFiltrada: Asesoria[] = [];

      for (let i = 0; i < todas_asesorias.length; i++) {
        const asesoria = todas_asesorias[i];

        if (asesoria.programadorId === this.programador.id) {
          listaFiltrada.push(asesoria);
        }
      }

      this.asesorias = listaFiltrada;
      this.cargarPerfilForm();
      await this.cargarHorarios();
    }
  }

  private async cargarHorarios(): Promise<void> {
    if (!this.programador) return;
    this.horarios = await this.disponibilidadesService.getPorProgramador(
      this.programador.id
    );
  }

  //  Perfil

  private cargarPerfilForm(): void {
    if (!this.programador) return;

    this.perfilForm = {
      nombre: this.programador.nombre,
      especialidad: this.programador.especialidad,
      descripcion: this.programador.descripcion,
      emailContacto: this.programador.emailContacto || '',
      githubUrl: this.programador.githubUrl || '',
      linkedinUrl: this.programador.linkedinUrl || '',
      sitioWeb: this.programador.sitioWeb || '',
    };
  }

  editarPerfil(): void {
    this.perfilEditando = true;
    this.cargarPerfilForm();
  }

  cancelarEdicionPerfil(): void {
    this.perfilEditando = false;
    this.cargarPerfilForm();
  }

  async guardarPerfil(): Promise<void> {
    if (!this.programador) return;

    if (
      !this.perfilForm.nombre.trim() ||
      !this.perfilForm.especialidad.trim()
    ) {
      alert('Nombre y especialidad son obligatorios');
      return;
    }

    const actualizado: Programador = {
      ...this.programador,
      nombre: this.perfilForm.nombre.trim(),
      especialidad: this.perfilForm.especialidad.trim(),
      descripcion: this.perfilForm.descripcion.trim(),
      emailContacto: this.perfilForm.emailContacto || undefined,
      githubUrl: this.perfilForm.githubUrl || undefined,
      linkedinUrl: this.perfilForm.linkedinUrl || undefined,
      sitioWeb: this.perfilForm.sitioWeb || undefined,
    };

    await this.programadorService.actualizarProgramador(actualizado);
    this.programador = actualizado;
    this.perfilEditando = false;

    this.mensajeExito = 'Perfil actualizado correctamente.';
    setTimeout(() => (this.mensajeExito = ''), 3000);
  }

  //  Horarios propios

  nombreDiaSemana(dia?: number): string {
    const mapa: { [k: number]: string } = {
      0: 'Domingo',
      1: 'Lunes',
      2: 'Martes',
      3: 'Miércoles',
      4: 'Jueves',
      5: 'Viernes',
      6: 'Sábado',
    };
    return dia != null ? mapa[dia] ?? '' : '';
  }

  descripcionDia(d: Disponibilidad): string {
    if (d.tipo === 'recurrente' && d.diaSemana != null) {
      return this.nombreDiaSemana(d.diaSemana);
    }
    if (d.fecha) return d.fecha;
    return '—';
  }

  descripcionRango(d: Disponibilidad): string {
    if (d.horaInicio && d.horaFin) {
      return `${d.horaInicio} - ${d.horaFin}`;
    }
    if (d.hora) return d.hora;
    return '—';
  }

  async crearHorarioRecurrenteProgramador() {
    if (!this.programador) return;

    const f = this.formHorarioRecurrente;

    if (!f.horaInicio || !f.horaFin || !f.diasSeleccionados.length) {
      alert('Selecciona días y rango de horas');
      return;
    }

    for (const dia of f.diasSeleccionados) {
      await this.disponibilidadesService.crearDisponibilidad({
        programadorId: this.programador.id,
        tipo: 'recurrente',
        diaSemana: dia,
        horaInicio: f.horaInicio,
        horaFin: f.horaFin,
      });
    }

    await this.cargarHorarios();

    this.formHorarioRecurrente = {
      diasSeleccionados: [],
      horaInicio: '',
      horaFin: '',
    };

    this.mensajeExito = 'Horarios recurrentes guardados.';
    setTimeout(() => (this.mensajeExito = ''), 3000);
  }

  async crearBloqueoProgramador() {
    if (!this.programador) return;

    const f = this.formBloqueo;

    if (!f.fecha) {
      alert('Selecciona una fecha');
      return;
    }

    let horaInicio = f.horaInicio;
    let horaFin = f.horaFin;

    if (f.todoElDia) {
      horaInicio = '00:00';
      horaFin = '23:59';
    }

    if (!horaInicio || !horaFin) {
      alert('Indica el rango de horas o marca "Todo el día"');
      return;
    }

    await this.disponibilidadesService.crearDisponibilidad({
      programadorId: this.programador.id,
      tipo: 'bloqueo',
      fecha: f.fecha,
      horaInicio,
      horaFin,
    });

    await this.cargarHorarios();

    this.formBloqueo = {
      fecha: '',
      horaInicio: '',
      horaFin: '',
      todoElDia: false,
    };

    this.mensajeExito = 'Bloqueo registrado.';
    setTimeout(() => (this.mensajeExito = ''), 3000);
  }

  async eliminarDisponibilidadProgramador(d: Disponibilidad) {
    const confirmar = confirm(
      '¿Seguro que deseas eliminar este registro de disponibilidad?'
    );
    if (!confirmar) return;

    await this.disponibilidadesService.eliminarPorId(d.id);
    await this.cargarHorarios();
  }

  //  Asesorías

  async actualizarEstado(a: Asesoria): Promise<void> {
    await this.asesoriasService.actualizarAsesoria(a.id, {
      estado: a.estado,
      mensajeRespuesta: a.mensajeRespuesta ?? '',
    });

    this.mensajeExito = `Asesoría #${a.id} actualizada correctamente`;

    setTimeout(() => {
      this.mensajeExito = '';
    }, 3000);
  }

  //  Proyectos

  prepararNuevoProyecto(): void {
    this.editandoProyectoId = null;
    this.nuevoProyecto = {
      id: 0,
      nombre: '',
      descripcion: '',
      seccion: 'academico',
      participacion: 'Frontend',
      tecnologias: [],
      repoUrl: '',
      demoUrl: '',
    };
    this.tecnologiasTexto = '';
  }

  editarProyecto(p: Proyecto): void {
    this.editandoProyectoId = p.id;
    this.nuevoProyecto = { ...p };
    this.tecnologiasTexto = p.tecnologias.join(', ');
  }

  cancelarEdicion(): void {
    this.prepararNuevoProyecto();
  }

  async guardarProyecto(): Promise<void> {
    if (!this.programador) return;

    if (!this.nuevoProyecto.nombre || !this.nuevoProyecto.descripcion) {
      alert('Nombre y descripción son obligatorios');
      return;
    }

    const tecnologiasLimpias = this.tecnologiasTexto
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    this.nuevoProyecto.tecnologias = tecnologiasLimpias;
    const proyectosActuales = [...(this.programador.proyectos || [])];

    if (this.editandoProyectoId == null) {
      const nuevoId =
        proyectosActuales.length > 0
          ? Math.max(...proyectosActuales.map((p) => p.id)) + 1
          : Date.now();

      const proyectoAGuardar: Proyecto = {
        ...this.nuevoProyecto,
        id: nuevoId,
      };

      proyectosActuales.push(proyectoAGuardar);
    } else {
      const idx = proyectosActuales.findIndex(
        (p) => p.id === this.editandoProyectoId
      );
      if (idx !== -1) {
        proyectosActuales[idx] = {
          ...this.nuevoProyecto,
          id: this.editandoProyectoId,
        };
      }
    }

    await this.programadorService.actualizarProyectosProgramador(
      this.programador.id,
      proyectosActuales
    );

    this.programador.proyectos = proyectosActuales;
    this.mensajeExito =
      this.editandoProyectoId == null
        ? 'Proyecto creado correctamente.'
        : 'Proyecto actualizado correctamente.';

    this.prepararNuevoProyecto();

    setTimeout(() => (this.mensajeExito = ''), 3000);
  }

  async eliminarProyecto(p: Proyecto): Promise<void> {
    if (!this.programador) return;

    const confirmar = confirm(
      `¿Seguro que deseas eliminar el proyecto "${p.nombre}"?`
    );
    if (!confirmar) return;

    const proyectosActuales = (this.programador.proyectos || []).filter(
      (proj) => proj.id !== p.id
    );

    await this.programadorService.actualizarProyectosProgramador(
      this.programador.id,
      proyectosActuales
    );

    this.programador.proyectos = proyectosActuales;
  }

  toggleDiaRecurrenteProgramador(dia: number, seleccionado: boolean){
    const dias = this.formHorarioRecurrente.diasSeleccionados;
    if(seleccionado){
      if(!dias.includes(dia)){
        dias.push(dia);
      }
    } else {
      const index = dias.indexOf(dia);
      if(index > -1){
        dias.splice(index, 1);
      }
    }
  }
}
