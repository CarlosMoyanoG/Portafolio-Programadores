import { Injectable } from '@angular/core';
import { Asesoria } from '../modelos/asesoria';

@Injectable({
  providedIn: 'root',
})

export class Asesorias {
  private asesorias: Asesoria[] = [];
  private ultimoId = 0; //CONTADOR

  crearAsesoria(nueva: Omit<Asesoria, 'id' | 'estado'>){ //Extraer objeto excepto el id
    this.ultimoId++;
    const asesoria: Asesoria = { id: this.ultimoId, estado: 'pendiente', ...nueva};
    this.asesorias.push(asesoria);
    console.log("Asesoria creada: ", asesoria)

    return asesoria;
  }

  getAsesorias(): Asesoria[] {
    return this.asesorias;
  }

  actualizarAsesoria(id: number, cambios: Partial<Asesoria>): void {
    const index = this.asesorias.findIndex(a => a.id === id);
    if (index !== -1) {
      this.asesorias[index] = { ...this.asesorias[index], ...cambios };
      console.log('Asesoría actualizada:', this.asesorias[index]);
    }
  }
} 
