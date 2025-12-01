export type EstadoAsesoria = 'pendiente' | 'aprobada' | 'rechazada';

export interface Asesoria {
  id: number;
  programadorId: number;
  nombreCliente: string;
  emailCliente: string;
  fecha: string;
  hora: string;
  descripcionProyecto: string;
  estado: EstadoAsesoria;
  mensajeRespuesta?: string;
}
