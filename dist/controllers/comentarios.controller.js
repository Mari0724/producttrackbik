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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComentariosController = void 0;
const tsoa_1 = require("tsoa");
const comentarios_service_1 = require("../services/comentarios.service");
let ComentariosController = class ComentariosController extends tsoa_1.Controller {
    /**
     * Obtiene los comentarios asociados a un producto.
     *
     * 👉 [Documentación completa del controlador en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/comentarios.controller)
     *
     * @param productoId ID del producto.
     * @returns Lista de comentarios.
     *
     */
    async getComentariosPorProducto(productoId) {
        return await (0, comentarios_service_1.obtenerComentariosPorProducto)(productoId);
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
    async crearComentario(body) {
        return await (0, comentarios_service_1.crearComentario)(body.idUsuario, body.idProducto, body.comentario);
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
    async actualizarComentario(idComentario, body) {
        return await (0, comentarios_service_1.actualizarComentario)(idComentario, body.comentario);
    }
    /**
     * Elimina un comentario existente.
     *
     * 👉 [Documentación completa del controlador en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/comentarios.controller)
     *
     * @param idComentario ID del comentario.
     * @returns Mensaje de confirmación.
     */
    async eliminarComentario(idComentario) {
        return await (0, comentarios_service_1.eliminarComentario)(idComentario);
    }
};
exports.ComentariosController = ComentariosController;
__decorate([
    (0, tsoa_1.Get)('{productoId}'),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ComentariosController.prototype, "getComentariosPorProducto", null);
__decorate([
    (0, tsoa_1.Post)('/'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ComentariosController.prototype, "crearComentario", null);
__decorate([
    (0, tsoa_1.Put)('{idComentario}'),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ComentariosController.prototype, "actualizarComentario", null);
__decorate([
    (0, tsoa_1.Delete)('{idComentario}'),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ComentariosController.prototype, "eliminarComentario", null);
exports.ComentariosController = ComentariosController = __decorate([
    (0, tsoa_1.Route)('comentarios'),
    (0, tsoa_1.Tags)('Comentarios')
], ComentariosController);
