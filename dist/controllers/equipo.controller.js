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
exports.EquipoController = void 0;
const tsoa_1 = require("tsoa");
const equipo_service_1 = require("../services/equipo.service");
const equipoService = new equipo_service_1.EquipoService();
let EquipoController = class EquipoController extends tsoa_1.Controller {
    /**
     * Crea un nuevo miembro del equipo.
     *
     * 👉 [Documentación completa del controlador en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/equipo.controller)
     */
    async crearEquipo(data, req) {
        if (!(req.user.tipoUsuario === "EMPRESARIAL" || req.user.rol === "ADMIN")) {
            this.setStatus(403);
            return { mensaje: "Acceso denegado. Solo empresas o administradores pueden crear usuarios de equipo." };
        }
        let empresaId;
        if (req.user.rol === "ADMIN") {
            if (!data.empresaId) {
                this.setStatus(400);
                return { mensaje: "El campo empresaId es obligatorio cuando el usuario es ADMIN." };
            }
            empresaId = data.empresaId;
        }
        else {
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
    async obtenerTodosLosEquipos(req) {
        if (!(req.user.tipoUsuario === "EMPRESARIAL" || req.user.rol === "ADMIN")) {
            this.setStatus(403);
            return { mensaje: "Acceso denegado. Solo empresas o administradores pueden ver el equipo." };
        }
        const empresaId = req.user.rol === "ADMIN" ? undefined : req.user.id;
        return await equipoService.obtenerTodosLosEquipos(empresaId);
    }
    /**
     * Filtra los miembros del equipo según parámetros.
     *
     * 👉 [Documentación completa del controlador en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/equipo.controller)
     */
    async filtrarEquipos(nombreCompleto, correo, rolEquipo, estado, perfilCompleto, req) {
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
    async obtenerEquipoPorId(id, req) {
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
    async actualizarEquipo(id, data, req) {
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
    async eliminarLogico(id, req) {
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
    async eliminarTodoElEquipo(empresaId, req) {
        if (req.user.rol !== "ADMIN" && req.user.id !== empresaId) {
            this.setStatus(403);
            return { mensaje: "Acceso denegado. No puedes eliminar todos los usuarios de otra empresa." };
        }
        return await equipoService.eliminarTodoElEquipo(empresaId);
    }
};
exports.EquipoController = EquipoController;
__decorate([
    (0, tsoa_1.Security)("jwt"),
    (0, tsoa_1.Post)(),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EquipoController.prototype, "crearEquipo", null);
__decorate([
    (0, tsoa_1.Security)("jwt"),
    (0, tsoa_1.Get)(),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EquipoController.prototype, "obtenerTodosLosEquipos", null);
__decorate([
    (0, tsoa_1.Security)("jwt"),
    (0, tsoa_1.Get)("filtrar"),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __param(3, (0, tsoa_1.Query)()),
    __param(4, (0, tsoa_1.Query)()),
    __param(5, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], EquipoController.prototype, "filtrarEquipos", null);
__decorate([
    (0, tsoa_1.Security)("jwt"),
    (0, tsoa_1.Get)("{id}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], EquipoController.prototype, "obtenerEquipoPorId", null);
__decorate([
    (0, tsoa_1.Security)("jwt"),
    (0, tsoa_1.Put)("{id}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __param(2, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], EquipoController.prototype, "actualizarEquipo", null);
__decorate([
    (0, tsoa_1.Security)("jwt"),
    (0, tsoa_1.Delete)("eliminar-logico/{id}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], EquipoController.prototype, "eliminarLogico", null);
__decorate([
    (0, tsoa_1.Security)("jwt"),
    (0, tsoa_1.Delete)("todos/{empresaId}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], EquipoController.prototype, "eliminarTodoElEquipo", null);
exports.EquipoController = EquipoController = __decorate([
    (0, tsoa_1.Route)("equipo"),
    (0, tsoa_1.Tags)("Equipo")
], EquipoController);
