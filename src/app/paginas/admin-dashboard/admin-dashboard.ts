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
    sitioWeb: ''
  };


  nuevaDisponibilidad = {
    programadorId: 0,
    fecha: '',
    hora: ''
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

  private async cargarAsesorias(): Promise<void> {
    const listaProgramadores = this.programadores;
    const listaAsesorias: Asesoria[] = await this.asesoriasService.getAsesorias();

    this.asesorias = listaAsesorias.map(asesoria => {
      const programadorEncontrado = listaProgramadores.find(p => p.id === asesoria.programadorId);
      return {
        ...asesoria,
        programadorNombre: programadorEncontrado ? programadorEncontrado.nombre : 'Sin Asignar'
      };
    });
  }

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
      const existente = this.programadores.find(p => p.id === this.programadorEditandoId);

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
      sitioWeb: ''
    };
    this.programadorEditandoId = null;
  }

  async crearDisponibilidad() {
    if (
      !this.nuevaDisponibilidad.programadorId ||
      !this.nuevaDisponibilidad.fecha ||
      !this.nuevaDisponibilidad.hora
    ) {
      alert('Selecciona programador, fecha y hora');
      return;
    }

    await this.disponibilidadesService.crearDisponibilidad({
      programadorId: this.nuevaDisponibilidad.programadorId,
      fecha: this.nuevaDisponibilidad.fecha,
      hora: this.nuevaDisponibilidad.hora,
    });

    this.disponibilidades = await this.disponibilidadesService.getTodas();

    this.nuevaDisponibilidad = {
      programadorId: 0,
      fecha: '',
      hora: ''
    };

    this.mensajeDisponibilidad = 'Horario registrado correctamente';
    setTimeout(() => (this.mensajeDisponibilidad = ''), 3000);
  }

  obtenerNombreProgramador(id: number): string {
    const programador = this.programadores.find(p => p.id === id);
    return programador ? programador.nombre : 'ID ' + id;
  }

  async guardarUsuario(u: Usuario & { uid: string }) {
    await this.usuariosService.actualizarUsuarioRolYProgramador(
      u.uid,
      u.rol,
      u.rol === 'programador' ? (u.programadorId ?? null) : null
    );

    if (u.rol === 'programador' && u.programadorId != null) {
      await this.programadoresService.actualizarDuenioYContacto(
        u.programadorId,
        u.uid,
        u.email,
        u.fotoUrl
      );
    } 

    else if (u.programadorId != null) {
      await this.programadoresService.actualizarDuenioYContacto(
        u.programadorId,
        null,
        null,
      );
    }

    alert('Usuario actualizado correctamente');
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
      sitioWeb: p.sitioWeb || ''
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
      sitioWeb: ''
    };
  }

  async eliminarProgramador(p: Programador) {
    const confirmar = confirm(`¿Seguro que deseas eliminar al programador "${p.nombre}"?`);
    if (!confirmar) return;

    await this.programadoresService.eliminarProgramador(p.id);
    this.programadores = await this.programadoresService.getProgramadores();
  }

}
