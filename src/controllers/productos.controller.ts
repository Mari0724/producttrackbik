import prisma from '../utils/prismaClient';
import { Body, Controller, Delete, Get, Path, Put, Query, Security, Request, Res, Route, Post, SuccessResponse, Response, Tags } from "tsoa";
import { ProductosDTO } from "../models/ProductosDTO";
import { zodValidate } from "../utils/zodValidate";
import { productoSchema } from "../models/ProductosModel";
import { getAllProductos, getProductoById, createProducto, updateProducto, deleteProducto,
  getCategoriasUnicas, getCantidadPorCategoria, getProductosPorCategoria, getCantidadPorRangoPrecio, obtenerProductoPorId
} from "../services/productos.service";
import { ResponseMessage, ResponseMessageWithData } from "../interfaces/ResponseMenssage";
import { AuthenticatedRequest } from "../types/autheticatedRequest";
import { puede } from "../utils/checkPermissions";
import { Middlewares } from "tsoa";
import { autenticarToken } from "../middleware/token.middleware";
import { notificarStockBajo } from "../services/notificaciones/stockBajo.service";
import { notificarReposicionRecomendada } from "../services/notificaciones/reposicion.service";
import { notificarProductoVencido } from "../services/notificaciones/productoVencido.service";
import { AccionHistorial } from '@prisma/client';

@Route("/productos")
@Tags("productos")
export class ProductosController extends Controller {
  /**
   * Obtiene todos los productos con filtros opcionales.
   * 
   * 👉 [Documentación general en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/productos.controller)
   */
  // Obtener productos con filtros
  @Security("jwt")
  @Middlewares([autenticarToken])
  @Get("/")
  public async getAll(
    @Request() req: AuthenticatedRequest,
    @Query() nombre?: string,
    @Query() categoria?: string,
    @Query() estado?: string,
    @Query() fechaAdquisicionDesde?: string,
    @Query() fechaAdquisicionHasta?: string,
    @Query() fechaVencimientoDesde?: string,
    @Query() fechaVencimientoHasta?: string,
  ): Promise<any[]> {
    const filters: any = {};
    const { id, tipoUsuario, rol, empresaId, rolEquipo } = req.user!;

    // Solo para INDIVIDUAL forzamos que vea solo sus productos
    if (tipoUsuario === "INDIVIDUAL") {
      filters.usuarioId = id;
    }

    // Empresarial puede ver productos de todos los miembros de su empresa
    if (tipoUsuario === "EMPRESARIAL" && empresaId) {
      filters.empresaId = empresaId;
    }

    if (nombre) filters.nombre = nombre;
    if (categoria) filters.categoria = categoria;
    if (estado) filters.estado = estado;

    if (fechaAdquisicionDesde || fechaAdquisicionHasta) {
      filters.fechaAdquisicion = {
        ...(fechaAdquisicionDesde && { gte: new Date(fechaAdquisicionDesde) }),
        ...(fechaAdquisicionHasta && { lte: new Date(fechaAdquisicionHasta) }),
      };
    }

    if (fechaVencimientoDesde || fechaVencimientoHasta) {
      filters.fechaVencimiento = {
        ...(fechaVencimientoDesde && { gte: new Date(fechaVencimientoDesde) }),
        ...(fechaVencimientoHasta && { lte: new Date(fechaVencimientoHasta) }),
      };
    }

    return await getAllProductos(filters);
  }

  /**
   * Obtiene las categorías únicas para los productos según tipoUsuario.
   * 
   * 👉 [Documentación general en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/productos.controller)
   */
  // Obtener categorías únicas
  @Get("/categorias")
  public async obtenerCategorias(
    @Query() tipoUsuario?: string
  ): Promise<string[] | ResponseMessage> {
    try {
      if (!tipoUsuario) {
        this.setStatus(400);
        return { message: "Se requiere el tipoUsuario para obtener las categorías." };
      }

      const categorias = await getCategoriasUnicas(tipoUsuario);
      return categorias;
    } catch (error) {
      console.error("🚨 Error al obtener categorías:", error);
      this.setStatus(500);
      return { message: "Error interno al obtener categorías" };
    }
  }

  /**
   * Devuelve todos los productos en una categoría específica.
   * 
   * 👉 [Documentación general en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/productos.controller)
   */
  // Obtener productos por categoría
  @Get("/por-categoria")
  public async getByCategoria(@Query() categoria: string): Promise<any> {
    if (!categoria?.trim()) {
      this.setStatus(400);
      return { message: "La categoría es requerida" };
    }

    try {
      const productos = await getProductosPorCategoria(categoria);
      if (!productos.length) {
        this.setStatus(404);
        return { message: "No se encontraron productos en esa categoría" };
      }

      return productos;
    } catch (error) {
      console.error(error);
      this.setStatus(500);
      return { message: "Error al obtener productos por categoría" };
    }
  }

  /**
   * Devuelve los nombres de los productos registrados por un usuario.
   * 👉 [Documentación general en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/productos.controller)
   */
  // Devuelve los nombres de los productos del usuario
  @Get('/nombres/:idUsuario')
  public async getNombresProductosDelUsuario(@Path() idUsuario: number) {
    const productos = await prisma.productos.findMany({
      where: { usuarioId: idUsuario, eliminadoEn: null },
      select: { nombre: true },
    });

    return productos.map(p => p.nombre);
  }

  /**
   * Obtiene la cantidad de productos agrupados por categoría.
   * 
   * 👉 [Documentación general en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/productos.controller)
   */
  // Cantidad de productos por categoría
  @Get("/cantidad-por-categoria")
  public async getCantidadPorCategoria(): Promise<any> {
    try {
      const resultados = await getCantidadPorCategoria();
      return resultados.map((item: any) => ({
        categoria: item.categoria ?? "Sin categoría",
        cantidad: item._count.id
      }));
    } catch (error) {
      console.error("🚨 Error al obtener cantidades:", error);
      this.setStatus(500);
      return { message: "Error interno al obtener cantidades por categoría" };
    }
  }

  /**
   * Obtiene la cantidad de productos agrupados por rangos de precio.
   * 
   * 👉 [Documentación general en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/productos.controller)
   */
  // Cantidad de productos por rango de precio
  @Get("/cantidad-por-rango-precio")
  public async getCantidadPorRangoPrecio(): Promise<any> {
    try {
      const resultados = await getCantidadPorRangoPrecio();
      return Object.entries(resultados).map(([rango, cantidad]) => ({
        rango,
        cantidad
      }));
    } catch (error) {
      console.error("🚨 Error al obtener cantidades por precio:", error);
      this.setStatus(500);
      return { message: "Error interno al obtener cantidades por rango de precio" };
    }
  }

  /**
   * Obtiene un producto por su ID.
   * 
   * 👉 [Documentación general en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/productos.controller)
   */
  // Obtener producto por ID
  @Get("/{id}")
  public async getById(@Path() id: string): Promise<any> {
    const numericId = Number(id);

    if (isNaN(numericId) || numericId <= 0) {
      this.setStatus(400);
      return { message: "ID inválido" };
    }

    const producto = await getProductoById(numericId);
    if (!producto) {
      this.setStatus(404);
      return { message: "Producto no encontrado" };
    }

    return producto;
  }

  /**
   * Crea un nuevo producto en la base de datos.
   * 
   * 👉 [Documentación general en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/productos.controller)
   *
   * @param requestBody Objeto con los datos del producto
   */
  // Crear producto
  @SuccessResponse("201", "Producto creado correctamente")
  @Response("400", "Datos inválidos")
  @Security("jwt")
  @Middlewares([autenticarToken])
  @Post("/")
  public async create(
    @Request() req: AuthenticatedRequest,
    @Body() requestBody: ProductosDTO
  ): Promise<ResponseMessageWithData<any> | ResponseMessage> {
    const { rol, id } = req.user!;
    if (!rol || typeof id !== "number") {
      this.setStatus(401);
      return { message: "No se pudo identificar al usuario." };
    }

    const rolParaPermiso = rol === "EQUIPO" ? req.user?.rolEquipo : rol;

    if (!rolParaPermiso || !puede("crear", rolParaPermiso)) {
      this.setStatus(403);
      return { message: "No tienes permiso para crear productos." };
    }

    const parsed = zodValidate(productoSchema, requestBody);
    if (!parsed.success) {
      this.setStatus(400);
      return {
        message: "Datos inválidos",
        detalles: parsed.error
      };
    }

    try {
      const nuevoProducto = await createProducto({
        ...parsed.data,
        precio: Number(parsed.data.precio),
        usuarioId: id,
      });

      // Registro en historial
      await prisma.histInv.create({
        data: {
          productoId: nuevoProducto.id,
          usuarioId: id,
          accion: 'agregado',
          cantidad_anterior: 0,
          cantidad_nueva: nuevoProducto.cantidad,
          precio_anterior: 0,
          precio_nuevo: nuevoProducto.precio,
          fechaCambio: new Date(),
        },
      });

      this.setStatus(201);
      return {
        message: "Producto creado correctamente",
        data: nuevoProducto
      };
    } catch (error) {
      console.error("🚨 Error al crear producto:", error);
      this.setStatus(500);
      return { message: "Error interno al crear el producto" };
    }
  }

  /**
   * Actualiza un producto existente.
   * 
   * 👉 [Documentación general en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/productos.controller)
   */
  @Put("/{id}")
  @Security("jwt")
  @Middlewares([autenticarToken])
  public async updateProducto(
    @Request() req: AuthenticatedRequest,
    @Path() id: number,
    @Body() body: any
  ): Promise<ResponseMessage> {
    const rol = req.user?.rol;
    const idUsuarioToken = (req.user as any)?.id;

    const rolParaPermiso = rol === "EQUIPO" ? req.user?.rolEquipo : rol;

    if (!rolParaPermiso || !puede("editar", rolParaPermiso)) {
      this.setStatus(403);
      return { message: "No tienes permiso para editar productos." };
    }

    const productoExistente = await obtenerProductoPorId(id);
    if (!productoExistente) {
      this.setStatus(404);
      return { message: "Producto no encontrado." };
    }

    const esPropietario = Number(productoExistente.usuarioId) === Number(idUsuarioToken);
    const esEditorConPermiso = rolParaPermiso === "EDITOR" || rolParaPermiso === "ADMIN";

    // Solo permitimos si es propietario o tiene rol alto
    if (!esPropietario && !esEditorConPermiso) {
      this.setStatus(403);
      return { message: "No puedes editar productos de otro usuario." };
    }

    const { id: _, ...bodySinId } = body;

    const parsed = zodValidate(productoSchema.partial(), body);

    if (!parsed.success) {
      this.setStatus(400);
      console.error("❌ Errores de validación Zod:", parsed.error);
      return {
        message: "Datos inválidos",
        detalles: parsed.error,
      };
    }

    try {
      const { precio, ...resto } = parsed.data;

      await updateProducto(id, {
        ...resto,
        ...(precio !== undefined && { precio: Number(precio) }),
      });

      const productoActualizado = await obtenerProductoPorId(id);

      if (productoActualizado) {
        await notificarStockBajo([productoActualizado]);
        await notificarReposicionRecomendada([productoActualizado]);
        await notificarProductoVencido([productoActualizado]);

        await prisma.histInv.create({
          data: {
            productoId: productoActualizado.id,
            usuarioId: idUsuarioToken,
            accion: AccionHistorial.modificado,
            cantidad_anterior: productoExistente.cantidad,
            cantidad_nueva: productoActualizado.cantidad,
            precio_anterior: productoExistente.precio,
            precio_nuevo: productoActualizado.precio,
            fechaCambio: new Date(),
          },
        });
      }

      return { message: "Producto actualizado correctamente" };

    } catch (error) {
      console.error("🚨 Error al actualizar producto:", JSON.stringify(error, null, 2));
      console.error("🔍 Detalle completo:", error);
      if (error instanceof Error && error.message.includes("no encontrado")) {
        this.setStatus(404);
        return { message: "Producto no encontrado" };
      }

      this.setStatus(500);
      return { message: "Error al actualizar producto" };
    }
  }

  /**
   * Elimina un producto de la base de datos.
   * 
   * 👉 [Documentación general en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/productos.controller)
   */
  // Eliminar producto
  @Delete("/{id}")
  @Security("jwt")
  @Middlewares([autenticarToken])
  public async deleteProducto(
    @Request() req: AuthenticatedRequest,
    @Path() id: number
  ): Promise<ResponseMessage> {
    const rol = req.user?.rol;
    const rolParaPermiso = rol === "EQUIPO" ? req.user?.rolEquipo : rol;

    if (!rolParaPermiso || !puede("eliminar", rolParaPermiso)) {
      this.setStatus(403);
      return { message: "No tienes permiso para eliminar productos." };
    }

    try {
      // Buscar producto antes de eliminar
      const producto = await obtenerProductoPorId(id);
      const idUsuarioToken = (req.user as any)?.id;

      if (!producto) {
        this.setStatus(404);
        return { message: "Producto no encontrado" };
      }

      // Registrar en historial antes de borrar
      await prisma.histInv.create({
        data: {
          productoId: producto.id,
          usuarioId: idUsuarioToken,
          accion: 'eliminado',
          cantidad_anterior: producto.cantidad,
          cantidad_nueva: 0,
          precio_anterior: producto.precio,
          precio_nuevo: 0,
          fechaCambio: new Date(),
        },
      });

      // Eliminar el producto
      await deleteProducto(id);
      return { message: "Producto eliminado correctamente" };
    } catch (error) {
      console.error("🚨 Error al eliminar:", error);
      if (error instanceof Error && error.message.includes("no encontrado")) {
        this.setStatus(404);
        return { message: "Producto no encontrado" };
      }

      this.setStatus(500);
      return { message: "Error al eliminar producto" };
    }
  }
}