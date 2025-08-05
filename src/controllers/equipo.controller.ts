import {
  Controller, Get, Post, Put, Delete, Route, Tags,
  Body, Path, Query, Security, Request
} from "tsoa";
import { EquipoService } from "../services/equipo.service";
import { EquipoDTO } from "../models/EquipoDTO";

const equipoService = new EquipoService();

@Route("equipo")
@Tags("Equipo")
export class EquipoController extends Controller {

  /**
   * Crea un nuevo miembro del equipo.
   * 
   * 👉 [Documentación completa del controlador en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/equipo.controller)
   */
  @Security("jwt")
  @Post()
  async crearEquipo(@Body() data: EquipoDTO, @Request() req: any) {

    if (!(req.user.tipoUsuario === "EMPRESARIAL" || req.user.rol === "ADMIN")) {
      this.setStatus(403);
      return { mensaje: "Acceso denegado. Solo empresas o administradores pueden crear usuarios de equipo." };
    }

    let empresaId: number;

    if (req.user.rol === "ADMIN") {
      if (!data.empresaId) {
        this.setStatus(400);
        return { mensaje: "El campo empresaId es obligatorio cuando el usuario es ADMIN." };
      }
      empresaId = data.empresaId;
    } else {
      empresaId = req.user.id;
    }

    const creado = await equipoService.crearEquipo(data, empresaId);
    return creado;
  }

  /**
   * Obtiene todos los miembros del equipo de una empresa.
   * 
   * 👉 [Documentación completa del controlador en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/equipo.controller)
   */
  @Security("jwt")
  @Get()
  async obtenerTodosLosEquipos(@Request() req: any) {
    if (!(req.user.tipoUsuario === "EMPRESARIAL" || req.user.rol === "ADMIN")) {
      this.setStatus(403);
      return { mensaje: "Acceso denegado. Solo empresas o administradores pueden ver el equipo." };
    }
    const empresaId: number | undefined = req.user.rol === "ADMIN" ? undefined : req.user.id;
    return await equipoService.obtenerTodosLosEquipos(empresaId);
  }

  /**
   * Filtra los miembros del equipo según parámetros.
   * 
   * 👉 [Documentación completa del controlador en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/equipo.controller)
   */
  @Security("jwt")
  @Get("filtrar")
  async filtrarEquipos(
    @Query() nombreCompleto?: string,
    @Query() correo?: string,
    @Query() rolEquipo?: "LECTOR" | "COMENTARISTA" | "EDITOR",
    @Query() estado?: "activo" | "inactivo",
    @Query() perfilCompleto?: "true" | "false",
    @Request() req?: any
  ) {
    if (!(req.user.tipoUsuario === "EMPRESARIAL" || req.user.rol === "ADMIN")) {
      this.setStatus(403);
      return { mensaje: "Acceso denegado. Solo empresas o administradores pueden filtrar el equipo." };
    }

    const empresaId = req.user.rol === "ADMIN" ? undefined : req.user.id;

    return await equipoService.filtrarEquipos({
      nombreCompleto,
      correo,
      rolEquipo,
      estado,
      perfilCompleto: perfilCompleto !== undefined ? perfilCompleto === "true" : undefined, // Conversión de string a boolean
      empresaId,
    });
  }

  /**
   * Obtiene un miembro del equipo por su ID.
   * 
   * 👉 [Documentación completa del controlador en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/equipo.controller)
   */
  @Security("jwt")
  @Get("{id}")
  async obtenerEquipoPorId(@Path() id: number, @Request() req: any) {
    if (!(req.user.tipoUsuario === "EMPRESARIAL" || req.user.rol === "ADMIN")) {
      this.setStatus(403);
      return { mensaje: "Acceso denegado. Solo empresas o administradores pueden ver miembros del equipo." };
    }

    const equipo = await equipoService.obtenerEquipoPorId(id);

    if (req.user.rol !== "ADMIN" && equipo.empresaId !== req.user.id) {
      this.setStatus(403);
      return { mensaje: "Este equipo no pertenece a tu empresa." };
    }

    return equipo;
  }

  /**
   * Actualiza un miembro del equipo.
   * 
   * 👉 [Documentación completa del controlador en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/equipo.controller)
   */
  @Security("jwt")
  @Put("{id}")
  async actualizarEquipo(@Path() id: number, @Body() data: Partial<EquipoDTO>, @Request() req: any) {
    if (!(req.user.tipoUsuario === "EMPRESARIAL" || req.user.rol === "ADMIN")) {
      this.setStatus(403);
      return { mensaje: "Acceso denegado. Solo empresas o administradores pueden actualizar el equipo." };
    }

    const empresaId = req.user.rol === "ADMIN" ? undefined : req.user.id;

    return await equipoService.actualizarEquipo(id, data, empresaId);
  }

  /**
   * Realiza eliminación lógica de un miembro del equipo.
   * 
   * 👉 [Documentación completa del controlador en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/equipo.controller)
   */
  @Security("jwt")
  @Delete("eliminar-logico/{id}")
  async eliminarLogico(@Path() id: number, @Request() req: any) {
    if (!(req.user.tipoUsuario === "EMPRESARIAL" || req.user.rol === "ADMIN")) {
      this.setStatus(403);
      return { mensaje: "Acceso denegado. Solo empresas o administradores pueden eliminar miembros del equipo." };
    }

    const equipo = await equipoService.obtenerEquipoPorId(id);
    if (!equipo) {
      this.setStatus(404);
      return { mensaje: "Miembro no encontrado." };
    }

    if (req.user.rol !== "ADMIN" && equipo.empresaId !== req.user.id) {
      this.setStatus(403);
      return { mensaje: "Este miembro no pertenece a tu empresa." };
    }

    return await equipoService.eliminarLogico(id, req.user.rol === "ADMIN" ? undefined : req.user.id);
  }

  /**
   * Elimina todos los miembros del equipo de una empresa.
   * 
   * 👉 [Documentación completa del controlador en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/equipo.controller)
   */
  @Security("jwt")
  @Delete("todos/{empresaId}")
  async eliminarTodoElEquipo(@Path() empresaId: number, @Request() req: any) {
    if (req.user.rol !== "ADMIN" && req.user.id !== empresaId) {
      this.setStatus(403);
      return { mensaje: "Acceso denegado. No puedes eliminar todos los usuarios de otra empresa." };
    }

    return await equipoService.eliminarTodoElEquipo(empresaId);
  }
}