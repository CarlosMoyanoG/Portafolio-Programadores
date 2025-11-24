import { Injectable } from '@angular/core';
import { Disponibilidad } from '../modelos/disponibilidad';

@Injectable({
  providedIn: 'root',
})
export class Disponibilidades {
  private lista: Disponibilidad[] = [];
  private ultimoId = 0;

  crearDisponibilidad(data: Omit<Disponibilidad, 'id'>): Disponibilidad {
    this.ultimoId++;
    const nueva: Disponibilidad = { id: this.ultimoId, ...data };
    this.lista.push(nueva);
    console.log('Disponibilidad creada:', nueva);
    return nueva;
  }

  getTodas(): Disponibilidad[] {
    return this.lista;
  }

  getPorProgramador(programadorId: number): Disponibilidad[] {
    return this.lista.filter(d => d.programadorId === programadorId);
  }
}
