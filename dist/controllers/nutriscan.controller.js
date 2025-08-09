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
exports.NutriScanController = void 0;
const tsoa_1 = require("tsoa");
const nutriscan_service_1 = require("../services/nutriscan.service");
const NutriScanModel_1 = require("../models/NutriScanModel");
let NutriScanController = class NutriScanController extends tsoa_1.Controller {
    constructor() {
        super(...arguments);
        this.service = new nutriscan_service_1.NutriScanService();
    }
    /**
     * Crea un nuevo análisis de producto usando NutriScan.
     *
     * 👉 [Documentación general en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/nutriscan.controller)
     * @param body Datos del análisis (sin idUsuario).
     * @returns El análisis creado.
     */
    // Crear análisis
    async create(body, req) {
        const usuario = req.user;
        const puedeUsarNutriScan = usuario.tipoUsuario === "INDIVIDUAL" ||
            usuario.rol === "ADMIN" ||
            usuario.rol === "DESARROLLADOR";
        if (!puedeUsarNutriScan) {
            this.setStatus(403);
            return { message: "Acceso denegado: No tienes permiso para usar NutriScan." };
        }
        try {
            const parsedBody = NutriScanModel_1.NutriScanSchemaWithoutUserId.parse(body);
            const isTest = usuario.rol === "DESARROLLADOR";
            const created = await this.service.create(parsedBody, usuario.id, isTest);
            this.setStatus(201);
            return created;
        }
        catch (error) {
            this.setStatus(400);
            return {
                message: error instanceof Error
                    ? error.message
                    : "Ocurrió un error al procesar la solicitud.",
            };
        }
    }
    /**
     * Obtiene todos los análisis (admin o desarrollador).
     *
     * 👉 [Documentación general en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/nutriscan.controller)
     */
    async findAll(req) {
        const usuario = req.user;
        if (usuario.rol === "ADMIN") {
            return this.service.findAll();
        }
        if (usuario.rol === "DESARROLLADOR") {
            return this.service.findTestsByUser(usuario.id);
        }
        this.setStatus(403);
        return {
            message: "Acceso denegado: solo disponible para auditoría o pruebas.",
        };
    }
    /**
     * Obtiene todos los análisis de un usuario (solo ADMIN).
     *
     * 👉 [Documentación general en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/nutriscan.controller)
     * @param usuarioId ID del usuario.
     */
    async findByUserId(usuarioId, req) {
        const usuario = req.user;
        if (usuario.rol !== "ADMIN") {
            this.setStatus(403);
            return { message: "Acceso denegado: solo disponible para auditoría." };
        }
        return this.service.findByUserId(usuarioId);
    }
    /**
     * Obtiene todos los análisis de un usuario (solo ADMIN).
     *
     * 👉 [Documentación general en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/nutriscan.controller)
     * @param usuarioId ID del usuario.
     */
    async update(id, body, req) {
        const usuario = req.user;
        if (usuario.rol !== "ADMIN") {
            this.setStatus(403);
            return { message: "Acceso denegado: solo disponible para auditoría." };
        }
        try {
            const parsedBody = NutriScanModel_1.NutriScanUpdateSchema.parse(body);
            return await this.service.update(id, parsedBody);
        }
        catch (error) {
            this.setStatus(400);
            return {
                message: error instanceof Error
                    ? error.message
                    : "Ocurrió un error al actualizar el análisis.",
            };
        }
    }
    /**
     * Elimina un análisis de NutriScan.
     *
     * 👉 [Documentación general en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/nutriscan.controller)
     * @param id ID del análisis.
     */
    async delete(id, req) {
        const usuario = req.user;
        if (usuario.rol !== "ADMIN") {
            this.setStatus(403);
            return { message: "Acceso denegado: solo disponible para auditoría." };
        }
        return this.service.delete(id);
    }
};
exports.NutriScanController = NutriScanController;
__decorate([
    (0, tsoa_1.SuccessResponse)("201", "Registro creado"),
    (0, tsoa_1.Response)("400", "Datos inválidos"),
    (0, tsoa_1.Response)("403", "Acceso denegado"),
    (0, tsoa_1.Security)("jwt"),
    (0, tsoa_1.Post)(),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NutriScanController.prototype, "create", null);
__decorate([
    (0, tsoa_1.Security)("jwt"),
    (0, tsoa_1.Get)(),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NutriScanController.prototype, "findAll", null);
__decorate([
    (0, tsoa_1.Security)("jwt"),
    (0, tsoa_1.Get)("usuario/{usuarioId}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], NutriScanController.prototype, "findByUserId", null);
__decorate([
    (0, tsoa_1.Security)("jwt"),
    (0, tsoa_1.Put)("{id}"),
    (0, tsoa_1.Response)("400", "Datos inválidos"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __param(2, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], NutriScanController.prototype, "update", null);
__decorate([
    (0, tsoa_1.Security)("jwt"),
    (0, tsoa_1.Delete)("{id}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], NutriScanController.prototype, "delete", null);
exports.NutriScanController = NutriScanController = __decorate([
    (0, tsoa_1.Route)("nutriscan"),
    (0, tsoa_1.Tags)("NutriScan")
], NutriScanController);
