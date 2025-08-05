import prisma from '../prismaClient';

const TIPOS_VALIDOS = [
  'STOCK_BAJO',
  'PRODUCTO_VENCIDO',
  'COMENTARIO_EQUIPO',
  'REPOSICION_RECOMENDADA',
  'ACTUALIZACION_APP',
] as const;

type TipoValido = typeof TIPOS_VALIDOS[number];

export async function puedeNotificar(idUsuario: number, tipo: string): Promise<boolean> {
  const prefs = await prisma.preferenciasNotificaciones.findUnique({
    where: { idUsuario },
  });

  if (!prefs) return true;

  const tipoNormalizado = tipo.toUpperCase() as string;

  if (!TIPOS_VALIDOS.includes(tipoNormalizado as TipoValido)) {
    return true;
  }

  const mapa: Record<TipoValido, boolean> = {
    STOCK_BAJO: prefs.stockBajo,
    PRODUCTO_VENCIDO: prefs.productoVencido,
    COMENTARIO_EQUIPO: prefs.comentarios,
    REPOSICION_RECOMENDADA: prefs.reposicion,
    ACTUALIZACION_APP: prefs.actualizacion,
  };

  return mapa[tipoNormalizado as TipoValido];
}