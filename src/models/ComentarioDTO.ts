export interface ComentarioDTO {
  idComentario: number;
  idUsuario: number;
  idProducto: number;
  comentario: string;
  fechaComentario: Date;
  estado: string;
  createdAt: Date;
  updatedAt: Date;
}