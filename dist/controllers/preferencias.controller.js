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
exports.PreferenciasNotificacionesController = void 0;
const tsoa_1 = require("tsoa");
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
let PreferenciasNotificacionesController = class PreferenciasNotificacionesController extends tsoa_1.Controller {
    /**
     * Obtiene las preferencias de notificación de un usuario específico.
     * Si no existen en la base de datos, se devuelven valores por defecto.
     *
     * 👉 [Documentación general en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/preferencias.controller)
     *
     * @param idUsuario ID del usuario
     * @returns Objeto con las preferencias de notificación
     */
    async obtenerPreferencias(idUsuario) {
        const prefs = await prismaClient_1.default.preferenciasNotificaciones.findUnique({
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
    async actualizarPreferencias(idUsuario, body) {
        // Crea o actualiza
        await prismaClient_1.default.preferenciasNotificaciones.upsert({
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
};
exports.PreferenciasNotificacionesController = PreferenciasNotificacionesController;
__decorate([
    (0, tsoa_1.Get)('{idUsuario}'),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PreferenciasNotificacionesController.prototype, "obtenerPreferencias", null);
__decorate([
    (0, tsoa_1.Put)('{idUsuario}'),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PreferenciasNotificacionesController.prototype, "actualizarPreferencias", null);
exports.PreferenciasNotificacionesController = PreferenciasNotificacionesController = __decorate([
    (0, tsoa_1.Route)('preferencias-notificaciones'),
    (0, tsoa_1.Tags)('Preferencias de Notificaciones')
], PreferenciasNotificacionesController);
