import { Injectable } from '@angular/core';
import { Asesoria } from '../modelos/asesoria';

@Injectable({
  providedIn: 'root',
})

export class Asesorias {
  private asesorias: Asesoria[] = [];
  private ultimoId = 0; //CONTADOR

  crearAsesoria(nueva: Omit<Asesoria, 'id'>){ //Extraer objeto excepto el id
    this.ultimoId++;
    const asesoria: Asesoria = { id: this.ultimoId, ...nueva};
    this.asesorias.push(asesoria);

    return asesoria;
  }

  getAsesorias(): Asesoria[] {
    return this.asesorias;
  }
} 
