import prisma from '../../utils/prismaClient';
import { TipoNotificacion, productos as Producto } from '@prisma/client';
import { puedeNotificar } from '../../utils/notificaciones/preferenciasNotificaciones';

export async function notificarReposicionRecomendada(productosOpcionales?: Producto[]) {
  let recordatorios: any[] = [];

  if (productosOpcionales?.length) {
    recordatorios = await prisma.recorStock.findMany({
      where: {
        productoId: { in: productosOpcionales.map((p) => p.id) },
      },
      include: {
        producto: { include: { usuario: true } },
      },
    });
  } else {
    recordatorios = await prisma.recorStock.findMany({
      include: {
        producto: { include: { usuario: true } },
      },
    });
  }

  for (const recordatorio of recordatorios) {
    const { producto } = recordatorio;
    const { usuario } = producto;
    const cantidadActual = producto.cantidad;
    const cantidadMinima = recordatorio.cantidadMinima;

    const umbralCritico = Math.min(8, Math.floor(cantidadMinima / 8));
    if (cantidadActual <= umbralCritico) continue;

    if (cantidadActual >= cantidadMinima) continue;

    const titulo = `Reposición recomendada: ${producto.nombre}`;
    const mensaje = `El producto "${producto.nombre}" tiene ${cantidadActual} unidades, por debajo del mínimo recomendado (${cantidadMinima}).`;

    if (usuario.tipoUsuario === 'INDIVIDUAL') {
      if (await puedeNotificar(usuario.idUsuario, 'REPOSICION_RECOMENDADA')) {
        await prisma.notificaciones.create({
          data: {
            idUsuario: usuario.idUsuario,
            tipo: TipoNotificacion.REPOSICION_RECOMENDADA,
            titulo,
            mensaje,
            fechaEnvio: new Date(),
          },
        });
      }
      continue;
    }

    if (usuario.tipoUsuario === 'EMPRESARIAL' && usuario.empresaId) {
      const miembros = await prisma.users.findMany({
        where: { empresaId: usuario.empresaId },
      });

      for (const miembro of miembros) {
        if (await puedeNotificar(miembro.idUsuario, 'REPOSICION_RECOMENDADA')) {
          await prisma.notificaciones.create({
            data: {
              idUsuario: miembro.idUsuario,
              tipo: TipoNotificacion.REPOSICION_RECOMENDADA,
              titulo,
              mensaje,
              fechaEnvio: new Date(),
            },
          });
        }
      }
    }
  }
}
