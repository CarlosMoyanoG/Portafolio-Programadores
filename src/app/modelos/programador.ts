import { Proyecto } from "./proyecto";

export interface Programador {
  id: number;
  nombre: string;
  especialidad: string;
  descripcion: string;

  fotoUrl?: string;
  emailContacto?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  sitioWeb?: string;

  proyectos: Proyecto[];
}

