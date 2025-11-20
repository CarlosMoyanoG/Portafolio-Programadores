import { Component } from '@angular/core';
import { Programador } from '../../modelos/programador';
import { Programadores } from '../../servicios/programadores';
import { Asesorias } from '../../servicios/asesorias';
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

  constructor(private programadoresService: Programadores, private asesoriasService: Asesorias, private route: ActivatedRoute) {
    
    this.programadores = this.programadoresService.getProgramadores();
    const progIdParam = this.route.snapshot.queryParamMap.get('programadorId');

    if (progIdParam) {
      this.form.programadorId = +progIdParam;
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
  }
}
