import { Injectable } from '@angular/core';
import { Programador } from '../modelos/programador';

@Injectable({
  providedIn: 'root',
})
export class Programadores {

  private programadores: Programador[] = [
    {
      id: 1,
      nombre: 'Paz Guerrero',
      especialidad: 'Frontend con Angular',
      descripcion: 'Desarrollo de SPA, maquetación responsive y consumo de APIs REST.',
      proyectos: [
        {
          id: 1,
          titulo: 'Panel administrativo',
          descripcion: 'Dashboard para gestión de ventas.',
          tecnologias: ['Angular', 'Tailwind', 'Firebase']
        }
      ]
    },
    {
      id: 2,
      nombre: 'Carlos López',
      especialidad: 'Backend con Node.js',
      descripcion: 'Creación de APIs, autenticación y bases de datos.',
      proyectos: [
        {
          id: 2,
          titulo: 'API para e-commerce',
          descripcion: 'Manejo de productos, usuarios y pedidos.',
          tecnologias: ['Node', 'Express', 'MongoDB']
        }
      ]
    }
  ];

  getProgramadores(): Programador[] {
    return this.programadores;
  }

  getProgramadorById(id: number): Programador | undefined {
    return this.programadores.find(p => p.id === id);
  }
}
