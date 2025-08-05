import { Controller, Get, Path, Route, Tags, } from "tsoa";
import { obtenerHistorialInventario } from "../services/historial.service";
import { HistorialInventarioDTO } from "../types/historial";

@Route("historial")
@Tags("Historial")
export class HistorialController extends Controller {
    
  /**
   * Obtiene el historial de movimientos del inventario por usuario.
   * 
   * 👉 [Documentación completa del controlador en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/historial.controller)
   * 
   * @param idUsuario ID del usuario.
   * @returns Lista de registros de historial.
   */
    @Get("/usuario/{idUsuario}")
    public async obtenerHistorialPorUsuario(
        @Path() idUsuario: number
    ): Promise<HistorialInventarioDTO[]> {
        return await obtenerHistorialInventario(idUsuario);
    }
}