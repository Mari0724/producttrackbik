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
exports.LogController = void 0;
const tsoa_1 = require("tsoa");
const log_service_1 = require("../services/log.service");
const log_service_2 = require("../services/log.service");
let LogController = class LogController extends tsoa_1.Controller {
    /**
     * Inicia sesión en el sistema con correo y contraseña.
     *
     * 👉 [Documentación general en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/log.controller)
     *
     * @param body Datos de inicio de sesión.
     * @returns Token de autenticación y datos del usuario.
     *
     */
    async login(body) {
        const { user, token, requiereCompletarPerfil } = await (0, log_service_1.validarCredenciales)(body.correo, body.password);
        return {
            token,
            requiereCompletarPerfil,
            user: {
                idUsuario: user.idUsuario,
                username: user.username,
                correo: user.correo,
                rol: user.rol,
                tipoUsuario: user.tipoUsuario,
                rolEquipo: user.rolEquipo || "",
                perfilCompleto: user.perfilCompleto,
                empresaId: user.empresaId,
            },
        };
    }
    /**
     * Solicita el restablecimiento de contraseña.
     *
     * 👉 [Documentación general en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/log.controller)
     */
    async solicitarReset(body) {
        const service = new log_service_2.LogService();
        return await service.solicitarReset(body.correo);
    }
    /**
     * Confirma el restablecimiento de contraseña con el token recibido.
     *
     * 👉 [Documentación general en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/log.controller)
     */
    async confirmarReset(body) {
        const service = new log_service_2.LogService();
        return await service.confirmarReset(body.token, body.nuevaContrasena);
    }
};
exports.LogController = LogController;
__decorate([
    (0, tsoa_1.Post)("login"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LogController.prototype, "login", null);
__decorate([
    (0, tsoa_1.Post)("solicitar-reset"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LogController.prototype, "solicitarReset", null);
__decorate([
    (0, tsoa_1.Post)("confirmar-reset"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LogController.prototype, "confirmarReset", null);
exports.LogController = LogController = __decorate([
    (0, tsoa_1.Route)("auth"),
    (0, tsoa_1.Tags)("Autenticación")
], LogController);
