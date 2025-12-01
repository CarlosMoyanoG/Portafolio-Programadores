import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Programador } from '../../modelos/programador';
import { Asesoria, EstadoAsesoria } from '../../modelos/asesoria';
import { Programadores } from '../../servicios/programadores';
import { Asesorias } from '../../servicios/asesorias';
import { Autenticacion } from '../../servicios/autenticacion';
import { Proyecto, TipoParticipacion, TipoSeccionProyecto } from '../../modelos/proyecto';

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
  ultimaNotificacion?: Asesoria;
  tecnologiasTexto = ''; 
  editandoProyectoId: number | null = null;
  tiposSeccion: TipoSeccionProyecto[] = ['academico', 'laboral'];
  tiposParticipacion: TipoParticipacion[] = ['Frontend', 'Backend', 'Base de Datos', 'Fullstack'];

   // CRUD proyectos
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

  constructor(private programadorService: Programadores, private asesoriasService: Asesorias, private auth: Autenticacion) {}

  async ngOnInit(): Promise<void> {
    await this.cargarDatos();
  }

  private async cargarDatos(): Promise<void> {
  const programadorId = this.auth.usuarioActual.programadorId ?? 1;

  this.programador = await this.programadorService.getProgramadorById(programadorId);
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
  }
}

  async actualizarEstado(a: Asesoria): Promise<void> {
    await this.asesoriasService.actualizarAsesoria(a.id, {
      estado: a.estado,
    });

    this.mensajeExito = `Asesoría #${a.id} actualizada correctamente`;
    this.ultimaNotificacion = { ...a };

    setTimeout(() => {
      this.mensajeExito = '';
    }, 3000);
  }

  // ---------- CRUD DE PROYECTOS ------------

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
      .map(t => t.trim())
      .filter(t => t.length > 0);

    this.nuevoProyecto.tecnologias = tecnologiasLimpias;
    const proyectosActuales = [...(this.programador.proyectos || [])];

    if (this.editandoProyectoId == null) {
      const nuevoId =
        proyectosActuales.length > 0
          ? Math.max(...proyectosActuales.map(p => p.id)) + 1
          : Date.now();

      const proyectoAGuardar: Proyecto = {
        ...this.nuevoProyecto,
        id: nuevoId,
      };

      proyectosActuales.push(proyectoAGuardar);
    } else {
      const idx = proyectosActuales.findIndex(p => p.id === this.editandoProyectoId);
      if (idx !== -1) {
        proyectosActuales[idx] = { ...this.nuevoProyecto, id: this.editandoProyectoId };
      }
    }

    await this.programadorService.actualizarProyectosProgramador(
      this.programador.id,
      proyectosActuales
    );

    this.programador.proyectos = proyectosActuales;
    this.mensajeExito = this.editandoProyectoId == null
      ? 'Proyecto creado correctamente.'
      : 'Proyecto actualizado correctamente.';

    this.prepararNuevoProyecto();

    setTimeout(() => (this.mensajeExito = ''), 3000);
  }

  async eliminarProyecto(p: Proyecto): Promise<void> {
    if (!this.programador) return;

    const confirmar = confirm(`¿Seguro que deseas eliminar el proyecto "${p.nombre}"?`);
    if (!confirmar) return;

    const proyectosActuales = (this.programador.proyectos || []).filter(
      proj => proj.id !== p.id
    );

    await this.programadorService.actualizarProyectosProgramador(
      this.programador.id,
      proyectosActuales
    );

    this.programador.proyectos = proyectosActuales;
  }
}
