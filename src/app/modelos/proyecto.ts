export type TipoSeccionProyecto = 'academico' | 'laboral';

export type TipoParticipacion =
  | 'Frontend'
  | 'Backend'
  | 'Base de Datos'
  | 'Fullstack';

export interface Proyecto {
  id: number;
  nombre: string;
  descripcion: string;
  seccion: TipoSeccionProyecto;    
  participacion: TipoParticipacion; 
  tecnologias: string[];
  repoUrl?: string;
  demoUrl?: string;
}
