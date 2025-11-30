import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Programador } from '../../modelos/programador';
import { Asesoria, EstadoAsesoria } from '../../modelos/asesoria';
import { Programadores } from '../../servicios/programadores';
import { Asesorias } from '../../servicios/asesorias';
import { Autenticacion } from '../../servicios/autenticacion';

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

  constructor(private programadorService: Programadores, private asesoriasService: Asesorias, private auth: Autenticacion) {}

  async ngOnInit(): Promise<void> {
    await this.cargarDatos();
  }

  private async cargarDatos(): Promise<void> {
    const programadorId = this.auth.usuarioActual.programadorId ?? 1;

    this.programador = this.programadorService.getProgramadorById(programadorId);
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
}
