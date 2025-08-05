import prisma from '../../utils/prismaClient';
import { TipoNotificacion, productos as Producto } from '@prisma/client';
import { puedeNotificar } from '../../utils/notificaciones/preferenciasNotificaciones';

/**
 * Envía notificaciones de productos vencidos.
 * Si se proporcionan productos, solo evalúa esos.
 */
export async function notificarProductoVencido(productosOpcionales?: Producto[]) {
  const hoy = new Date();
  let productosConUsuario: (Producto & {
    usuario: {
      idUsuario: number;
      tipoUsuario: string | null;
      empresaId: number | null;
    };
  })[] = [];

  if (productosOpcionales && productosOpcionales.length > 0) {
    productosConUsuario = await prisma.productos.findMany({
      where: {
        id: { in: productosOpcionales.map(p => p.id) },
        fechaVencimiento: { lt: hoy },
        eliminadoEn: null,
      },
      include: {
        usuario: true,
      },
    });
  } else {
    productosConUsuario = await prisma.productos.findMany({
      where: {
        fechaVencimiento: { lt: hoy },
        eliminadoEn: null,
      },
      include: {
        usuario: true,
      },
    });
  }

  for (const producto of productosConUsuario) {
    const usuario = producto.usuario;
    const titulo = `Producto vencido: ${producto.nombre}`;
    const mensaje = `El producto "${producto.nombre}" ha vencido el ${producto.fechaVencimiento?.toLocaleDateString()}.`;

    if (usuario.tipoUsuario === 'INDIVIDUAL') {
      if (await puedeNotificar(usuario.idUsuario, 'PRODUCTO_VENCIDO')) {
        await prisma.notificaciones.create({
          data: {
            idUsuario: usuario.idUsuario,
            tipo: TipoNotificacion.PRODUCTO_VENCIDO,
            titulo,
            mensaje,
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
        if (await puedeNotificar(miembro.idUsuario, 'PRODUCTO_VENCIDO')) {
          await prisma.notificaciones.create({
            data: {
              idUsuario: miembro.idUsuario,
              tipo: TipoNotificacion.PRODUCTO_VENCIDO,
              titulo,
              mensaje,
            },
          });
        }
      }
    }
  }
}