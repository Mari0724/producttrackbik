import prisma from '../utils/prismaClient';

export async function actualizarPreferencias(
  idUsuario: number,
  data: Partial<{
    stockBajo: boolean;
    productoVencido: boolean;
    comentarios: boolean;
    reposicion: boolean;
    actualizacion: boolean;
  }>
) {
  const existentes = await prisma.preferenciasNotificaciones.findUnique({
    where: { idUsuario }
  });

  if (existentes) {
    return prisma.preferenciasNotificaciones.update({
      where: { idUsuario },
      data
    });
  } else {
    return prisma.preferenciasNotificaciones.create({
      data: {
        idUsuario,
        stockBajo: data.stockBajo ?? true,
        productoVencido: data.productoVencido ?? true,
        comentarios: data.comentarios ?? true,
        reposicion: data.reposicion ?? true,
        actualizacion: data.actualizacion ?? true
      }
    });
  }
}