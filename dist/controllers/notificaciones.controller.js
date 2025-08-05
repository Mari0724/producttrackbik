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
exports.NotificacionesController = void 0;
const tsoa_1 = require("tsoa");
const stockBajo_service_1 = require("../services/notificaciones/stockBajo.service");
const productoVencido_service_1 = require("../services/notificaciones/productoVencido.service");
const comentarioProducto_service_1 = require("../services/notificaciones/comentarioProducto.service");
const reposicion_service_1 = require("../services/notificaciones/reposicion.service");
const actualizacion_service_1 = require("../services/notificaciones/actualizacion.service");
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
const client_1 = require("@prisma/client");
let NotificacionesController = class NotificacionesController extends tsoa_1.Controller {
    /**
     * Envia notificaciones de productos con stock bajo.
     *
     * 👉 [Documentación general en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/notificaciones.controller
     * )
     */
    async enviarNotificacionStockBajo(body) {
        const productos = body?.productos;
        await (0, stockBajo_service_1.notificarStockBajo)(productos);
        return { mensaje: 'Notificaciones de stock bajo enviadas correctamente' };
    }
    /**
     * Envia notificaciones de productos vencidos.
     *
     * 👉 [Documentación general en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/notificaciones.controller)
     */
    async enviarNotificacionProductoVencido(body) {
        const productos = body?.productos;
        if (productos && productos.length > 0) {
            await (0, productoVencido_service_1.notificarProductoVencido)(productos);
        }
        else {
            await (0, productoVencido_service_1.notificarProductoVencido)(); // Si no se pasan productos, notifica todos los vencidos
        }
        return { mensaje: 'Notificaciones de producto vencido enviadas correctamente' };
    }
    /**
     * Envia notificación de nuevo comentario en producto.
     *
     * 👉 [Documentación general en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/notificaciones.controller)
     */
    async enviarNotificacionComentarioProducto(body) {
        await (0, comentarioProducto_service_1.notificarComentarioProducto)(body.idComentario);
        return { mensaje: 'Notificaciones de comentario enviadas correctamente' };
    }
    /**
     * Envia notificaciones de productos con recomendación de reposición.
     */
    async enviarNotificacionReposicionRecomendada(body) {
        const productos = body?.productos;
        await (0, reposicion_service_1.notificarReposicionRecomendada)(productos);
        return { mensaje: 'Notificaciones de reposición recomendada enviadas correctamente' };
    }
    /**
     * Envia notificaciones de actualizaciones de la aplicación.
     *
     * 👉 [Documentación general en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/notificaciones.controller)
     */
    async enviarNotificacionActualizacionApp(body) {
        const { titulo, mensaje } = body;
        await (0, actualizacion_service_1.notificarActualizacionApp)(titulo, mensaje);
        return { mensaje: 'Notificaciones de actualización de la app enviadas correctamente' };
    }
    /**
     * Obtiene las notificaciones asociadas a un usuario.
     *
     * 👉 [Documentación general en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/notificaciones.controller)
     * @param idUsuario ID del usuario.
     * @returns Lista de notificaciones recibidas.
     */
    async obtenerNotificacionesPorUsuario(idUsuario) {
        const preferencias = await prismaClient_1.default.preferenciasNotificaciones.findFirst({
            where: { idUsuario },
        });
        if (!preferencias) {
            await prismaClient_1.default.preferenciasNotificaciones.create({
                data: {
                    idUsuario,
                    stockBajo: true,
                    productoVencido: true,
                    comentarios: true,
                    reposicion: true,
                    actualizacion: true,
                },
            });
        }
        const tiposPermitidos = [
            ...(preferencias?.stockBajo ? [client_1.TipoNotificacion.STOCK_BAJO] : []),
            ...(preferencias?.productoVencido ? [client_1.TipoNotificacion.PRODUCTO_VENCIDO] : []),
            ...(preferencias?.comentarios ? [client_1.TipoNotificacion.COMENTARIO_EQUIPO] : []),
            ...(preferencias?.reposicion ? [client_1.TipoNotificacion.REPOSICION_RECOMENDADA] : []),
            ...(preferencias?.actualizacion ? [client_1.TipoNotificacion.ACTUALIZACION_APP] : []),
        ];
        const notificaciones = await prismaClient_1.default.notificaciones.findMany({
            where: {
                idUsuario,
                tipo: { in: tiposPermitidos },
            },
            orderBy: { fechaEnvio: 'desc' },
            take: 20,
        });
        return notificaciones.map((n) => ({
            idNotificacion: n.idNotificacion,
            tipo: n.tipo,
            titulo: n.titulo,
            mensaje: n.mensaje,
            leida: n.leida,
            fechaEnvio: n.fechaEnvio,
        }));
    }
    /**
     * Marca una notificación como leída.
     *
     * 👉 [Documentación general en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/notificaciones.controller)
     * @param idNotificacion ID de la notificación.
     */
    async marcarComoLeida(idNotificacion) {
        await prismaClient_1.default.notificaciones.update({
            where: {
                idNotificacion,
            },
            data: {
                leida: true,
            },
        });
        return { mensaje: 'Notificación marcada como leída' };
    }
    /**
     * Actualiza las preferencias de notificación de un usuario.
     *
     * 👉 [Documentación general en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/notificaciones.controller)
     * @param idUsuario ID del usuario.
     */
    async actualizarPreferencias(idUsuario, body) {
        await prismaClient_1.default.preferenciasNotificaciones.update({
            where: { idUsuario },
            data: {
                ...body,
            },
        });
        return { mensaje: 'Preferencias actualizadas correctamente' };
    }
};
exports.NotificacionesController = NotificacionesController;
__decorate([
    (0, tsoa_1.Post)('/stock-bajo'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificacionesController.prototype, "enviarNotificacionStockBajo", null);
__decorate([
    (0, tsoa_1.Post)('/producto-vencido'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificacionesController.prototype, "enviarNotificacionProductoVencido", null);
__decorate([
    (0, tsoa_1.Post)('/comentario-producto'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificacionesController.prototype, "enviarNotificacionComentarioProducto", null);
__decorate([
    (0, tsoa_1.Post)('/reposicion-recomendada'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificacionesController.prototype, "enviarNotificacionReposicionRecomendada", null);
__decorate([
    (0, tsoa_1.Post)('/actualizacion-app'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificacionesController.prototype, "enviarNotificacionActualizacionApp", null);
__decorate([
    (0, tsoa_1.Get)('/usuario/{idUsuario}'),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NotificacionesController.prototype, "obtenerNotificacionesPorUsuario", null);
__decorate([
    (0, tsoa_1.Patch)('/{idNotificacion}'),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NotificacionesController.prototype, "marcarComoLeida", null);
__decorate([
    (0, tsoa_1.Patch)('/preferencias/{idUsuario}'),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], NotificacionesController.prototype, "actualizarPreferencias", null);
exports.NotificacionesController = NotificacionesController = __decorate([
    (0, tsoa_1.Route)('notificaciones'),
    (0, tsoa_1.Tags)('Notificaciones')
], NotificacionesController);
