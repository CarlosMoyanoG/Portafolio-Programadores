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
      descripcion:
        'Desarrollo de SPA, maquetación responsive y consumo de APIs REST.',
      fotoUrl: 'https://via.placeholder.com/160x160?text=Paz',
      emailContacto: 'paz.guerrero@example.com',
      githubUrl: 'https://github.com/usuario-ejemplo',
      linkedinUrl: 'https://linkedin.com/in/usuario-ejemplo',
      sitioWeb: 'https://portfolio-ejemplo.dev',
      proyectos: [
        {
          id: 1,
          nombre: 'Panel administrativo de ventas',
          descripcion:
            'Dashboard para monitoreo de ventas, clientes y productos en tiempo real.',
          seccion: 'laboral',
          participacion: 'Frontend',
          tecnologias: ['Angular', 'Tailwind', 'Firebase'],
          repoUrl: 'https://github.com/usuario-ejemplo/panel-ventas',
          demoUrl: 'https://panel-ventas.web.app'
        },
        {
          id: 2,
          nombre: 'Gestor de tareas académico',
          descripcion:
            'Aplicación para registrar actividades y trabajos de la universidad.',
          seccion: 'academico',
          participacion: 'Frontend',
          tecnologias: ['Angular', 'CSS', 'LocalStorage'],
          repoUrl: 'https://github.com/usuario-ejemplo/gestor-tareas',
          demoUrl: ''
        }
      ]
    },
    {
      id: 2,
      nombre: 'Carlos López',
      especialidad: 'Backend con Node.js',
      descripcion:
        'Creación de APIs REST, autenticación y manejo de bases de datos.',
      fotoUrl: 'https://via.placeholder.com/160x160?text=Carlos',
      emailContacto: 'carlos.lopez@example.com',
      githubUrl: 'https://github.com/usuario-backend',
      linkedinUrl: '',
      sitioWeb: '',
      proyectos: [
        {
          id: 3,
          nombre: 'API para e-commerce',
          descripcion:
            'Servicio backend para gestión de productos, usuarios y pedidos.',
          seccion: 'laboral',
          participacion: 'Backend',
          tecnologias: ['Node', 'Express', 'MongoDB'],
          repoUrl: 'https://github.com/usuario-backend/api-ecommerce',
          demoUrl: ''
        },
        {
          id: 4,
          nombre: 'API académica para biblioteca',
          descripcion:
            'Proyecto académico para gestionar préstamos y catálogos de libros.',
          seccion: 'academico',
          participacion: 'Backend',
          tecnologias: ['Node', 'Express', 'PostgreSQL'],
          repoUrl: '',
          demoUrl: ''
        }
      ]
    }
  ];

  private ultimoId = 2;

  getProgramadores(): Programador[] {
    return this.programadores;
  }

  getProgramadorById(id: number): Programador | undefined {
    return this.programadores.find(p => p.id === id);
  }

  crearProgramador(data: Omit<Programador, 'id'>): Programador {
    this.ultimoId++;
    const nuevoProg: Programador = {id: this.ultimoId,...data};
    this.programadores.push(nuevoProg);
    console.log('Programador creado:', nuevoProg);
    return nuevoProg;
  }

  eliminarProgramador(id: number): void {
    const listaTemporal: Programador[] = [];
    
    for (let i = 0; i < this.programadores.length; i++) {
      const programador = this.programadores[i];

      if (programador.id !== id) {
        listaTemporal.push(programador);
      }
    }

    this.programadores = listaTemporal;
  }
}
