import prisma from '../../utils/prismaClient';

export async function marcarNotificacionComoLeida(idNotificacion: number) {
  await prisma.notificaciones.update({
    where: { idNotificacion },
    data: { leida: true }
  });
}