import prisma from '../../utils/prismaClient';
import { TipoNotificacion } from '@prisma/client';
import { puedeNotificar } from '../../utils/notificaciones/preferenciasNotificaciones';

export async function notificarComentarioProducto(idComentario: number) {
  const comentario = await prisma.comentarios.findUnique({
    where: { idComentario },
    include: {
      producto: {
        include: {
          usuario: true,
        },
      },
    },
  });

  if (!comentario || !comentario.producto || !comentario.producto.usuario) {
    console.warn('❌ No se encontró el comentario, producto o su usuario.');
    return;
  }

  const usuarioProducto = comentario.producto.usuario;

  if (!usuarioProducto.empresaId) {
    console.warn('⚠️ El usuario dueño del producto no pertenece a una empresa.');
    return;
  }

  const miembros = await prisma.users.findMany({
    where: {
      empresaId: usuarioProducto.empresaId,
    },
  });

  if (miembros.length === 0) {
    console.warn('⚠️ No se encontraron miembros en la empresa.');
    return;
  }

  const titulo = `Nuevo comentario en producto: ${comentario.producto.nombre}`;
  const mensaje = `Se ha comentado el producto "${comentario.producto.nombre}": "${comentario.comentario}"`;

  const notificaciones = [];

  for (const miembro of miembros) {
    if (await puedeNotificar(miembro.idUsuario, 'COMENTARIO_EQUIPO')) {
      notificaciones.push({
        idUsuario: miembro.idUsuario,
        tipo: TipoNotificacion.COMENTARIO_EQUIPO,
        titulo,
        mensaje,
        leida: false,
      });
    }
  }

  if (notificaciones.length > 0) {
    await prisma.notificaciones.createMany({
      data: notificaciones,
    });
  }
}