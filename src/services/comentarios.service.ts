import prisma from '../utils/prismaClient';
import { ComentarioDTO } from '../models/ComentarioDTO';
import { notificarComentarioProducto } from '../services/notificaciones/comentarioProducto.service';

function mapComentarioToDTO(comentario: any): ComentarioDTO {
  return {
    idComentario: comentario.idComentario,
    idUsuario: comentario.idUsuario,
    idProducto: comentario.idProducto,
    comentario: comentario.comentario,
    fechaComentario: comentario.fechaComentario,
    estado: comentario.estado,
    createdAt: comentario.createdAt,
    updatedAt: comentario.updatedAt,
  };
}

export async function obtenerComentariosPorProducto(productoId: number): Promise<ComentarioDTO[]> {
  const comentarios = await prisma.comentarios.findMany({
    where: { idProducto: productoId },
    orderBy: { fechaComentario: 'desc' },
  });

  return comentarios.map(mapComentarioToDTO);
}

export async function crearComentario(
  idUsuario: number,
  idProducto: number,
  comentario: string
): Promise<ComentarioDTO> {
  const nuevo = await prisma.comentarios.create({
    data: {
      idUsuario,
      idProducto,
      comentario,
      fechaComentario: new Date(),
      estado: 'pendiente',
    },
  });

  await notificarComentarioProducto(nuevo.idComentario);

  return mapComentarioToDTO(nuevo);
}

export async function actualizarComentario(
  idComentario: number,
  nuevoTexto: string
): Promise<ComentarioDTO> {
  const actualizado = await prisma.comentarios.update({
    where: { idComentario },
    data: {
      comentario: nuevoTexto,
      updatedAt: new Date(),
    },
  });

  return mapComentarioToDTO(actualizado);
}

export async function eliminarComentario(idComentario: number): Promise<{ mensaje: string }> {
  await prisma.comentarios.delete({
    where: { idComentario },
  });

  return { mensaje: 'Comentario eliminado' };
}