"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductosController = void 0;
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
const tsoa_1 = require("tsoa");
const zodValidate_1 = require("../utils/zodValidate");
const ProductosModel_1 = require("../models/ProductosModel");
const productos_service_1 = require("../services/productos.service");
const checkPermissions_1 = require("../utils/checkPermissions");
const tsoa_2 = require("tsoa");
const token_middleware_1 = require("../middleware/token.middleware");
const stockBajo_service_1 = require("../services/notificaciones/stockBajo.service");
const reposicion_service_1 = require("../services/notificaciones/reposicion.service");
const productoVencido_service_1 = require("../services/notificaciones/productoVencido.service");
const client_1 = require("@prisma/client");
let ProductosController = class ProductosController extends tsoa_1.Controller {
    /**
     * Obtiene todos los productos con filtros opcionales.
     *
     * 👉 [Documentación general en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/productos.controller)
     */
    // Obtener productos con filtros
    async getAll(req, nombre, categoria, estado, fechaAdquisicionDesde, fechaAdquisicionHasta, fechaVencimientoDesde, fechaVencimientoHasta) {
        const filters = {};
        const { id, tipoUsuario, rol, empresaId, rolEquipo } = req.user;
        // Solo para INDIVIDUAL forzamos que vea solo sus productos
        if (tipoUsuario === "INDIVIDUAL") {
            filters.usuarioId = id;
        }
        // Empresarial puede ver productos de todos los miembros de su empresa
        if (tipoUsuario === "EMPRESARIAL" && empresaId) {
            filters.empresaId = empresaId;
        }
        if (nombre)
            filters.nombre = nombre;
        if (categoria)
            filters.categoria = categoria;
        if (estado)
            filters.estado = estado;
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
        return await (0, productos_service_1.getAllProductos)(filters);
    }
    /**
     * Obtiene las categorías únicas para los productos según tipoUsuario.
     *
     * 👉 [Documentación general en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/productos.controller)
     */
    // Obtener categorías únicas
    async obtenerCategorias(tipoUsuario) {
        try {
            if (!tipoUsuario) {
                this.setStatus(400);
                return { message: "Se requiere el tipoUsuario para obtener las categorías." };
            }
            const categorias = await (0, productos_service_1.getCategoriasUnicas)(tipoUsuario);
            return categorias;
        }
        catch (error) {
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
    async getByCategoria(categoria) {
        if (!categoria?.trim()) {
            this.setStatus(400);
            return { message: "La categoría es requerida" };
        }
        try {
            const productos = await (0, productos_service_1.getProductosPorCategoria)(categoria);
            if (!productos.length) {
                this.setStatus(404);
                return { message: "No se encontraron productos en esa categoría" };
            }
            return productos;
        }
        catch (error) {
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
    async getNombresProductosDelUsuario(idUsuario) {
        const productos = await prismaClient_1.default.productos.findMany({
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
    async getCantidadPorCategoria() {
        try {
            const resultados = await (0, productos_service_1.getCantidadPorCategoria)();
            return resultados.map((item) => ({
                categoria: item.categoria ?? "Sin categoría",
                cantidad: item._count.id
            }));
        }
        catch (error) {
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
    async getCantidadPorRangoPrecio() {
        try {
            const resultados = await (0, productos_service_1.getCantidadPorRangoPrecio)();
            return Object.entries(resultados).map(([rango, cantidad]) => ({
                rango,
                cantidad
            }));
        }
        catch (error) {
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
    async getById(id) {
        const numericId = Number(id);
        if (isNaN(numericId) || numericId <= 0) {
            this.setStatus(400);
            return { message: "ID inválido" };
        }
        const producto = await (0, productos_service_1.getProductoById)(numericId);
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
    async create(req, requestBody) {
        const { rol, id } = req.user;
        if (!rol || typeof id !== "number") {
            this.setStatus(401);
            return { message: "No se pudo identificar al usuario." };
        }
        const rolParaPermiso = rol === "EQUIPO" ? req.user?.rolEquipo : rol;
        if (!rolParaPermiso || !(0, checkPermissions_1.puede)("crear", rolParaPermiso)) {
            this.setStatus(403);
            return { message: "No tienes permiso para crear productos." };
        }
        const parsed = (0, zodValidate_1.zodValidate)(ProductosModel_1.productoSchema, requestBody);
        if (!parsed.success) {
            this.setStatus(400);
            return {
                message: "Datos inválidos",
                detalles: parsed.error
            };
        }
        try {
            const nuevoProducto = await (0, productos_service_1.createProducto)({
                ...parsed.data,
                precio: Number(parsed.data.precio),
                usuarioId: id,
            });
            // Registro en historial
            await prismaClient_1.default.histInv.create({
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
        }
        catch (error) {
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
    async updateProducto(req, id, body) {
        const rol = req.user?.rol;
        const idUsuarioToken = req.user?.id;
        const rolParaPermiso = rol === "EQUIPO" ? req.user?.rolEquipo : rol;
        if (!rolParaPermiso || !(0, checkPermissions_1.puede)("editar", rolParaPermiso)) {
            this.setStatus(403);
            return { message: "No tienes permiso para editar productos." };
        }
        const productoExistente = await (0, productos_service_1.obtenerProductoPorId)(id);
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
        const parsed = (0, zodValidate_1.zodValidate)(ProductosModel_1.productoSchema.partial(), body);
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
            await (0, productos_service_1.updateProducto)(id, {
                ...resto,
                ...(precio !== undefined && { precio: Number(precio) }),
            });
            const productoActualizado = await (0, productos_service_1.obtenerProductoPorId)(id);
            if (productoActualizado) {
                await (0, stockBajo_service_1.notificarStockBajo)([productoActualizado]);
                await (0, reposicion_service_1.notificarReposicionRecomendada)([productoActualizado]);
                await (0, productoVencido_service_1.notificarProductoVencido)([productoActualizado]);
                await prismaClient_1.default.histInv.create({
                    data: {
                        productoId: productoActualizado.id,
                        usuarioId: idUsuarioToken,
                        accion: client_1.AccionHistorial.modificado,
                        cantidad_anterior: productoExistente.cantidad,
                        cantidad_nueva: productoActualizado.cantidad,
                        precio_anterior: productoExistente.precio,
                        precio_nuevo: productoActualizado.precio,
                        fechaCambio: new Date(),
                    },
                });
            }
            return { message: "Producto actualizado correctamente" };
        }
        catch (error) {
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
    async deleteProducto(req, id) {
        const rol = req.user?.rol;
        const rolParaPermiso = rol === "EQUIPO" ? req.user?.rolEquipo : rol;
        if (!rolParaPermiso || !(0, checkPermissions_1.puede)("eliminar", rolParaPermiso)) {
            this.setStatus(403);
            return { message: "No tienes permiso para eliminar productos." };
        }
        try {
            // Buscar producto antes de eliminar
            const producto = await (0, productos_service_1.obtenerProductoPorId)(id);
            const idUsuarioToken = req.user?.id;
            if (!producto) {
                this.setStatus(404);
                return { message: "Producto no encontrado" };
            }
            // Registrar en historial antes de borrar
            await prismaClient_1.default.histInv.create({
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
            await (0, productos_service_1.deleteProducto)(id);
            return { message: "Producto eliminado correctamente" };
        }
        catch (error) {
            console.error("🚨 Error al eliminar:", error);
            if (error instanceof Error && error.message.includes("no encontrado")) {
                this.setStatus(404);
                return { message: "Producto no encontrado" };
            }
            this.setStatus(500);
            return { message: "Error al eliminar producto" };
        }
    }
};
exports.ProductosController = ProductosController;
__decorate([
    (0, tsoa_1.Security)("jwt"),
    (0, tsoa_2.Middlewares)([token_middleware_1.autenticarToken]),
    (0, tsoa_1.Get)("/"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __param(3, (0, tsoa_1.Query)()),
    __param(4, (0, tsoa_1.Query)()),
    __param(5, (0, tsoa_1.Query)()),
    __param(6, (0, tsoa_1.Query)()),
    __param(7, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ProductosController.prototype, "getAll", null);
__decorate([
    (0, tsoa_1.Get)("/categorias"),
    __param(0, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductosController.prototype, "obtenerCategorias", null);
__decorate([
    (0, tsoa_1.Get)("/por-categoria"),
    __param(0, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductosController.prototype, "getByCategoria", null);
__decorate([
    (0, tsoa_1.Get)('/nombres/:idUsuario'),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductosController.prototype, "getNombresProductosDelUsuario", null);
__decorate([
    (0, tsoa_1.Get)("/cantidad-por-categoria"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductosController.prototype, "getCantidadPorCategoria", null);
__decorate([
    (0, tsoa_1.Get)("/cantidad-por-rango-precio"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductosController.prototype, "getCantidadPorRangoPrecio", null);
__decorate([
    (0, tsoa_1.Get)("/{id}"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductosController.prototype, "getById", null);
__decorate([
    (0, tsoa_1.SuccessResponse)("201", "Producto creado correctamente"),
    (0, tsoa_1.Response)("400", "Datos inválidos"),
    (0, tsoa_1.Security)("jwt"),
    (0, tsoa_2.Middlewares)([token_middleware_1.autenticarToken]),
    (0, tsoa_1.Post)("/"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProductosController.prototype, "create", null);
__decorate([
    (0, tsoa_1.Put)("/{id}"),
    (0, tsoa_1.Security)("jwt"),
    (0, tsoa_2.Middlewares)([token_middleware_1.autenticarToken]),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], ProductosController.prototype, "updateProducto", null);
__decorate([
    (0, tsoa_1.Delete)("/{id}"),
    (0, tsoa_1.Security)("jwt"),
    (0, tsoa_2.Middlewares)([token_middleware_1.autenticarToken]),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], ProductosController.prototype, "deleteProducto", null);
exports.ProductosController = ProductosController = __decorate([
    (0, tsoa_1.Route)("/productos"),
    (0, tsoa_1.Tags)("productos")
], ProductosController);
