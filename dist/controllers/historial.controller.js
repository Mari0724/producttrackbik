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
exports.HistorialController = void 0;
const tsoa_1 = require("tsoa");
const historial_service_1 = require("../services/historial.service");
let HistorialController = class HistorialController extends tsoa_1.Controller {
    /**
     * Obtiene el historial de movimientos del inventario por usuario.
     *
     * 👉 [Documentación completa del controlador en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/historial.controller)
     *
     * @param idUsuario ID del usuario.
     * @returns Lista de registros de historial.
     */
    async obtenerHistorialPorUsuario(idUsuario) {
        return await (0, historial_service_1.obtenerHistorialInventario)(idUsuario);
    }
};
exports.HistorialController = HistorialController;
__decorate([
    (0, tsoa_1.Get)("/usuario/{idUsuario}"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], HistorialController.prototype, "obtenerHistorialPorUsuario", null);
exports.HistorialController = HistorialController = __decorate([
    (0, tsoa_1.Route)("historial"),
    (0, tsoa_1.Tags)("Historial")
], HistorialController);
