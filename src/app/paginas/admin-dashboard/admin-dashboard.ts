import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Asesoria } from '../../modelos/asesoria';
import { Programadores } from '../../servicios/programadores';
import { Asesorias } from '../../servicios/asesorias';
import { Disponibilidad } from '../../modelos/disponibilidad';
import { Disponibilidades } from '../../servicios/disponibilidades';
import { Programador } from '../../modelos/programador';
import { RolUsuario, Usuario } from '../../modelos/usuario';
import { Usuarios } from '../../servicios/usuarios';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard implements OnInit {
  asesorias: any[] = [];
  programadores: Programador[] = [];
  disponibilidades: Disponibilidad[] = [];
  usuarios: (Usuario & { uid: string })[] = [];
  rolesPosibles: RolUsuario[] = ['visitante', 'admin', 'programador'];
  programadorEditandoId: number | null = null;

  nuevoProgramador = {
    nombre: '',
    especialidad: '',
    descripcion: '',
    emailContacto: '',
    githubUrl: '',
    linkedinUrl: '',
    sitioWeb: '',
  };

  // Formularios de horarios
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
    programadorId: 0,
    diasSeleccionados: [] as number[],
    horaInicio: '',
    horaFin: '',
  };

  formBloqueo = {
    programadorId: 0,
    fecha: '',
    horaInicio: '',
    horaFin: '',
    todoElDia: false,
  };

  mensajeDisponibilidad = '';

  constructor(
    private asesoriasService: Asesorias,
    private programadoresService: Programadores,
    private disponibilidadesService: Disponibilidades,
    private usuariosService: Usuarios
  ) {}

  async ngOnInit(): Promise<void> {
    this.programadores = await this.programadoresService.getProgramadores();
    this.disponibilidades = await this.disponibilidadesService.getTodas();
    this.usuarios = await this.usuariosService.getUsuarios();
    console.log('USUARIOS CARGADOS:', this.usuarios);
    await this.cargarAsesorias();
  }

  //  Asesorías

  private async cargarAsesorias(): Promise<void> {
    const listaProgramadores = this.programadores;
    const listaAsesorias: Asesoria[] = await this.asesoriasService.getAsesorias();

    this.asesorias = listaAsesorias.map((asesoria) => {
      const programadorEncontrado = listaProgramadores.find(
        (p) => p.id === asesoria.programadorId
      );
      return {
        ...asesoria,
        programadorNombre: programadorEncontrado
          ? programadorEncontrado.nombre
          : 'Sin Asignar',
      };
    });
  }

  //  Programadores (crear/editar)

  async crearProgramador() {
    if (!this.nuevoProgramador.nombre || !this.nuevoProgramador.especialidad) {
      alert('Nombre y especialidad son obligatorios');
      return;
    }

    // CREAR
    if (this.programadorEditandoId === null) {
      await this.programadoresService.crearProgramador({
        nombre: this.nuevoProgramador.nombre,
        especialidad: this.nuevoProgramador.especialidad,
        descripcion: this.nuevoProgramador.descripcion,
        emailContacto: this.nuevoProgramador.emailContacto || undefined,
        githubUrl: this.nuevoProgramador.githubUrl || undefined,
        linkedinUrl: this.nuevoProgramador.linkedinUrl || undefined,
        sitioWeb: this.nuevoProgramador.sitioWeb || undefined,
        proyectos: [],
      });
    } else {
      // EDITAR
      const existente = this.programadores.find(
        (p) => p.id === this.programadorEditandoId
      );

      await this.programadoresService.actualizarProgramador({
        id: this.programadorEditandoId,
        nombre: this.nuevoProgramador.nombre,
        especialidad: this.nuevoProgramador.especialidad,
        descripcion: this.nuevoProgramador.descripcion,
        fotoUrl: existente?.fotoUrl,
        emailContacto: existente?.emailContacto,
        githubUrl: existente?.githubUrl,
        linkedinUrl: existente?.linkedinUrl,
        sitioWeb: existente?.sitioWeb,
        duenioUid: existente?.duenioUid,
        proyectos: existente?.proyectos ?? [],
      });
    }

    this.programadores = await this.programadoresService.getProgramadores();

    this.nuevoProgramador = {
      nombre: '',
      especialidad: '',
      descripcion: '',
      emailContacto: '',
      githubUrl: '',
      linkedinUrl: '',
      sitioWeb: '',
    };
    this.programadorEditandoId = null;
  }

  editarProgramador(p: Programador) {
    this.programadorEditandoId = p.id;
    this.nuevoProgramador = {
      nombre: p.nombre,
      especialidad: p.especialidad,
      descripcion: p.descripcion,
      emailContacto: p.emailContacto || '',
      githubUrl: p.githubUrl || '',
      linkedinUrl: p.linkedinUrl || '',
      sitioWeb: p.sitioWeb || '',
    };
  }

  cancelarEdicionProgramador() {
    this.programadorEditandoId = null;
    this.nuevoProgramador = {
      nombre: '',
      especialidad: '',
      descripcion: '',
      emailContacto: '',
      githubUrl: '',
      linkedinUrl: '',
      sitioWeb: '',
    };
  }

  async eliminarProgramador(p: Programador) {
    const confirmar = confirm(
      `¿Seguro que deseas eliminar al programador "${p.nombre}"?`
    );
    if (!confirmar) return;

    await this.programadoresService.eliminarProgramador(p.id);
    this.programadores = await this.programadoresService.getProgramadores();
  }

  //  Horarios 

  async crearHorarioRecurrente() {
    const f = this.formHorarioRecurrente;

    if (
      !f.programadorId ||
      !f.horaInicio ||
      !f.horaFin ||
      !f.diasSeleccionados.length
    ) {
      alert('Selecciona programador, días y rango de horas');
      return;
    }

    for (const dia of f.diasSeleccionados) {
      await this.disponibilidadesService.crearDisponibilidad({
        programadorId: f.programadorId,
        tipo: 'recurrente',
        diaSemana: dia,
        horaInicio: f.horaInicio,
        horaFin: f.horaFin,
      });
    }

    this.disponibilidades = await this.disponibilidadesService.getTodas();

    this.formHorarioRecurrente = {
      programadorId: 0,
      diasSeleccionados: [],
      horaInicio: '',
      horaFin: '',
    };

    this.mensajeDisponibilidad =
      'Horario recurrente registrado correctamente.';
    setTimeout(() => (this.mensajeDisponibilidad = ''), 3000);
  }

  async crearBloqueo() {
    const f = this.formBloqueo;

    if (!f.programadorId || !f.fecha) {
      alert('Selecciona programador y fecha');
      return;
    }

    let horaInicio = f.horaInicio;
    let horaFin = f.horaFin;

    if (f.todoElDia) {
      horaInicio = '00:00';
      horaFin = '23:59';
    }

    if (!horaInicio || !horaFin) {
      alert('Indica el rango de horas o marca "Todo el día".');
      return;
    }

    await this.disponibilidadesService.crearDisponibilidad({
      programadorId: f.programadorId,
      tipo: 'bloqueo',
      fecha: f.fecha,
      horaInicio,
      horaFin,
    });

    this.disponibilidades = await this.disponibilidadesService.getTodas();

    this.formBloqueo = {
      programadorId: 0,
      fecha: '',
      horaInicio: '',
      horaFin: '',
      todoElDia: false,
    };

    this.mensajeDisponibilidad = 'Bloqueo registrado correctamente.';
    setTimeout(() => (this.mensajeDisponibilidad = ''), 3000);
  }

  async eliminarDisponibilidad(d: Disponibilidad) {
    const confirmar = confirm('¿Seguro que deseas eliminar este registro de disponibilidad?');
    if (!confirmar) return;

    await this.disponibilidadesService.eliminarPorId(d.id);
    this.disponibilidades = await this.disponibilidadesService.getTodas();
  }

  obtenerNombreProgramador(id: number): string {
    const programador = this.programadores.find((p) => p.id === id);
    return programador ? programador.nombre : 'ID ' + id;
  }

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

  //  Usuarios

  async guardarUsuario(u: Usuario & { uid: string }) {
    await this.usuariosService.actualizarUsuarioRolYProgramador(
      u.uid,
      u.rol,
      u.rol === 'programador' ? u.programadorId ?? null : null
    );

    if (u.rol === 'programador' && u.programadorId != null) {
      await this.programadoresService.actualizarDuenioYContacto(
        u.programadorId,
        u.uid,
        u.email,
        u.fotoUrl
      );
    } else if (u.programadorId != null) {
      await this.programadoresService.actualizarDuenioYContacto(
        u.programadorId,
        null,
        null
      );
    }

    alert('Usuario actualizado correctamente');
  }

    toggleDiaRecurrente(dia: number, seleccionado: boolean) {
    const dias = this.formHorarioRecurrente.diasSeleccionados;
    if (seleccionado) {
      if (!dias.includes(dia)) {
        dias.push(dia);
      }
    } else {
      const i = dias.indexOf(dia);
      if (i >= 0) {
        dias.splice(i, 1);
      }
    }
  }
}
