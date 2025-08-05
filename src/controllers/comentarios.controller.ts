import { Controller, Get, Post, Path, Route, Tags, Put, Body, Delete } from 'tsoa';
import {
  obtenerComentariosPorProducto,
  crearComentario,
  actualizarComentario,
  eliminarComentario,
} from '../services/comentarios.service';
import { ComentarioDTO } from '../models/ComentarioDTO';

interface CrearComentarioBody {
  idUsuario: number;
  idProducto: number;
  comentario: string;
}

interface ActualizarComentarioBody {
  comentario: string;
}

@Route('comentarios')
@Tags('Comentarios')
export class ComentariosController extends Controller {

  /**
   * Obtiene los comentarios asociados a un producto.
   * 
   * 👉 [Documentación completa del controlador en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/comentarios.controller)
   * 
   * @param productoId ID del producto.
   * @returns Lista de comentarios.
   * 
   */
  @Get('{productoId}')
  public async getComentariosPorProducto(
    @Path() productoId: number
  ): Promise<ComentarioDTO[]> {
    return await obtenerComentariosPorProducto(productoId);
  }

  /**
   * Crea un nuevo comentario para un producto.
   * 
   * 👉 [Documentación completa del controlador en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/comentarios.controller)
   * 
   * @param body Datos del comentario.
   * @returns Comentario creado.
   * 
   */
  @Post('/')
  public async crearComentario(
    @Body() body: CrearComentarioBody
  ): Promise<ComentarioDTO> {
    return await crearComentario(body.idUsuario, body.idProducto, body.comentario);
  }

  /**
   * Actualiza un comentario existente.
   * 
   * 👉 [Documentación completa del controlador en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/comentarios.controller)
   * 
   * @param idComentario ID del comentario.
   * @param body Nuevo contenido del comentario.
   * @returns Comentario actualizado.
   */
  @Put('{idComentario}')
  public async actualizarComentario(
    @Path() idComentario: number,
    @Body() body: ActualizarComentarioBody
  ): Promise<ComentarioDTO> {
    return await actualizarComentario(idComentario, body.comentario);
  }

  /**
   * Elimina un comentario existente.
   * 
   * 👉 [Documentación completa del controlador en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/comentarios.controller)
   * 
   * @param idComentario ID del comentario.
   * @returns Mensaje de confirmación.
   */
  @Delete('{idComentario}')
  public async eliminarComentario(
    @Path() idComentario: number
  ): Promise<{ mensaje: string }> {
    return await eliminarComentario(idComentario);
  }
}