import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Programador } from '../../modelos/programador';
import { Programadores } from '../../servicios/programadores';
import { Proyecto } from '../../modelos/proyecto';

@Component({
  selector: 'app-portafolio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './portafolio.html',
  styleUrl: './portafolio.scss',
})
export class Portafolio implements OnInit {

  programador?: Programador;
  proyectosAcademicos: Proyecto[] = [];
  proyectosLaborales: Proyecto[] = [];

  constructor(
    private route: ActivatedRoute,
    private programadoresService: Programadores
  ) {}

  async ngOnInit(): Promise<void> {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? +idParam : 0;

    this.programador = await this.programadoresService.getProgramadorById(id);

    if (this.programador && this.programador.proyectos) {
      this.proyectosAcademicos = this.programador.proyectos.filter(
        p => p.seccion === 'academico'
      );
      this.proyectosLaborales = this.programador.proyectos.filter(
        p => p.seccion === 'laboral'
      );
    }
  }
}
