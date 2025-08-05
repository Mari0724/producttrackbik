import { Controller, Get, Put, Path, Body, Route, Tags } from 'tsoa';
import prisma from '../utils/prismaClient';

@Route('preferencias-notificaciones')
@Tags('Preferencias de Notificaciones')
export class PreferenciasNotificacionesController extends Controller {
  /**
   * Obtiene las preferencias de notificación de un usuario específico.
   * Si no existen en la base de datos, se devuelven valores por defecto.
   *
   * 👉 [Documentación general en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/preferencias.controller)
   * 
   * @param idUsuario ID del usuario
   * @returns Objeto con las preferencias de notificación
   */
  @Get('{idUsuario}')
  public async obtenerPreferencias(
    @Path() idUsuario: number
  ): Promise<{
    stockBajo: boolean;
    productoVencido: boolean;
    comentarios: boolean;
    reposicion: boolean;
    actualizacion: boolean;
  }> {
    const prefs = await prisma.preferenciasNotificaciones.findUnique({
      where: { idUsuario },
    });

    return {
      stockBajo: prefs?.stockBajo ?? true,
      productoVencido: prefs?.productoVencido ?? true,
      comentarios: prefs?.comentarios ?? true,
      reposicion: prefs?.reposicion ?? true,
      actualizacion: prefs?.actualizacion ?? true,
    };
  }

  /**
   * Crea o actualiza las preferencias de notificación de un usuario.
   *
   * 👉 [Documentación general en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/preferencias.controller)
   * 
   * @param idUsuario ID del usuario
   * @param body Objeto con las preferencias a modificar
   * @returns Mensaje de confirmación
   */
  @Put('{idUsuario}')
  public async actualizarPreferencias(
    @Path() idUsuario: number,
    @Body()
    body: {
      stockBajo?: boolean;
      productoVencido?: boolean;
      comentarios?: boolean;
      reposicion?: boolean;
      actualizacion?: boolean;
    }
  ): Promise<{ mensaje: string }> {
    // Crea o actualiza
    await prisma.preferenciasNotificaciones.upsert({
      where: { idUsuario },
      update: body,
      create: {
        idUsuario,
        stockBajo: body.stockBajo ?? true,
        productoVencido: body.productoVencido ?? true,
        comentarios: body.comentarios ?? true,
        reposicion: body.reposicion ?? true,
        actualizacion: body.actualizacion ?? true,
      },
    });

    return { mensaje: 'Preferencias actualizadas correctamente' };
  }
}