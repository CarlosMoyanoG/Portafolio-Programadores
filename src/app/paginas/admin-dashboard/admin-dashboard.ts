import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Asesoria } from '../../modelos/asesoria';
import { Programadores } from '../../servicios/programadores';
import { Asesorias } from '../../servicios/asesorias';
import { Disponibilidad } from '../../modelos/disponibilidad';
import { Disponibilidades } from '../../servicios/disponibilidades';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard implements OnInit {

  asesorias: any[] = [];
  programadores: any[] = [];
  disponibilidades: Disponibilidad[] = [];

  nuevoProgramador = {
    nombre: '',
    especialidad: '',
    descripcion: ''
  };

  nuevaDisponibilidad = {
    programadorId: 0,
    fecha: '',
    hora: ''
  };

  mensajeDisponibilidad = '';

  constructor( private asesoriasService: Asesorias, private programadoresService: Programadores, private disponibilidadesService: Disponibilidades) {
    this.programadores = this.programadoresService.getProgramadores();
    this.disponibilidades = this.disponibilidadesService.getTodas();
  }

  async ngOnInit(): Promise<void> {
    await this.cargarAsesorias();
  }

  // ====== ASESORÍAS (Firebase) ======

  private async cargarAsesorias(): Promise<void> {
    const listaProgramadores = this.programadoresService.getProgramadores();
    const listaAsesorias: Asesoria[] = await this.asesoriasService.getAsesorias();

    this.asesorias = listaAsesorias.map(asesoria => {
      const programadorEncontrado = listaProgramadores.find(p => p.id === asesoria.programadorId);
      return {
        ...asesoria,
        programadorNombre: programadorEncontrado ? programadorEncontrado.nombre : 'Sin Asignar'
      };
    });

    console.log('Asesorías desde Firestore:', this.asesorias);
  }

  // ====== PROGRAMADORES (en memoria) ======

  crearProgramador() {
    if (!this.nuevoProgramador.nombre || !this.nuevoProgramador.especialidad) {
      alert('Nombre y especialidad son obligatorios');
      return;
    }

    this.programadoresService.crearProgramador({
      nombre: this.nuevoProgramador.nombre,
      especialidad: this.nuevoProgramador.especialidad,
      descripcion: this.nuevoProgramador.descripcion,
      proyectos: []
    });

    this.programadores = this.programadoresService.getProgramadores();

    this.nuevoProgramador = {
      nombre: '',
      especialidad: '',
      descripcion: ''
    };
  }

  // ====== DISPONIBILIDADES (en memoria) ======

  crearDisponibilidad() {
    if (
      !this.nuevaDisponibilidad.programadorId ||
      !this.nuevaDisponibilidad.fecha ||
      !this.nuevaDisponibilidad.hora
    ) {
      alert('Selecciona programador, fecha y hora');
      return;
    }

    this.disponibilidadesService.crearDisponibilidad({
      programadorId: this.nuevaDisponibilidad.programadorId,
      fecha: this.nuevaDisponibilidad.fecha,
      hora: this.nuevaDisponibilidad.hora
    });

    this.disponibilidades = this.disponibilidadesService.getTodas();

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
}
