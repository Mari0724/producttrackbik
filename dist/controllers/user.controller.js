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
exports.UserController = void 0;
const tsoa_1 = require("tsoa");
const UserModel_1 = require("../models/UserModel");
const zodValidate_1 = require("../utils/zodValidate");
const user_service_1 = require("../services/user.service");
const UserDTO_1 = require("../models/UserDTO");
let UserController = class UserController extends tsoa_1.Controller {
    constructor() {
        super();
    }
    /**
     * Obtiene todos los usuarios con filtros opcionales.
     *
     * 👉 [Documentación general en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/user.controller)
     */
    // Obtener 
    async getAll(username, correo, nombreCompleto, telefono, nit, estado, rol, tipoUsuario, rolEquipo) {
        const filters = {};
        if (username)
            filters.username = username;
        if (correo)
            filters.correo = correo;
        if (nombreCompleto)
            filters.nombreCompleto = nombreCompleto;
        if (telefono)
            filters.telefono = telefono;
        if (nit)
            filters.nit = nit;
        if (estado && ["activo", "inactivo"].includes(estado)) {
            filters.estado = estado;
        }
        if (rol && ["USUARIO", "EQUIPO", "ADMIN", "DESARROLLADOR"].includes(rol)) {
            filters.rol = rol;
        }
        if (tipoUsuario && ["INDIVIDUAL", "EMPRESARIAL"].includes(tipoUsuario)) {
            filters.tipoUsuario = tipoUsuario;
        }
        if (rolEquipo && ["LECTOR", "COMENTARISTA", "EDITOR"].includes(rolEquipo)) {
            filters.rolEquipo = rolEquipo;
        }
        const users = await (0, user_service_1.getAllUsers)(filters);
        return users;
    }
    /**
     * Obtiene un usuario por su ID.
     *
     * 👉 [Documentación general en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/user.controller)
     */
    // Obtener un usuario por ID
    async getById(id) {
        // Intentar convertir el id a número entero
        const numericId = Number(id);
        if (isNaN(numericId) || numericId <= 0) {
            const res = { message: "ID inválido" };
            return res;
        }
        // Llamar servicio con id numérico
        const user = await (0, user_service_1.getUserById)(numericId);
        if (!user) {
            this.setStatus(404);
            const res = { message: "Usuario no encontrado" };
            return res;
        }
        return user;
    }
    /**
     * Crea un nuevo usuario.
     *
     * 👉 [Documentación general en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/user.controller)
     */
    // Crear usuario
    async create(requestBody) {
        const parsed = (0, zodValidate_1.zodValidate)(UserModel_1.userSchema, requestBody);
        if (!parsed.success) {
            this.setStatus(400);
            return {
                message: "Datos inválidos",
                detalles: parsed.error,
            };
        }
        if (parsed.data.rol === "EQUIPO" && !parsed.data.empresaId) {
            this.setStatus(400);
            return {
                message: "empresaId es obligatorio para usuarios con rol EQUIPO",
            };
        }
        if (parsed.data.rol !== "EQUIPO" && parsed.data.empresaId) {
            this.setStatus(400);
            return {
                message: "Solo se debe asignar empresaId a usuarios con rol EQUIPO",
            };
        }
        try {
            const { user, token } = await (0, user_service_1.createUser)(parsed.data);
            this.setStatus(201);
            return {
                message: "Usuario creado correctamente",
                token, // <--- devuelvo token aquí
            };
        }
        catch (error) {
            this.setStatus(400);
            return {
                message: error.message || "Error al crear usuario",
            };
        }
    }
    /**
     * Obtiene información de una empresa por ID de usuario.
     *
     * 👉 [Documentación general en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/user.controller)
     */
    //buscar por empresa 
    async getEmpresaByIdController(id) {
        try {
            const empresa = await (0, user_service_1.getEmpresaById)(id);
            return {
                idUsuario: empresa.idUsuario,
                nombreEmpresa: empresa.nombreEmpresa,
                nit: empresa.nit,
                correo: empresa.correo,
                direccion: empresa.direccion,
                telefono: empresa.telefono,
            };
        }
        catch (error) {
            if (error.message.includes("no encontrada")) {
                this.setStatus(404);
            }
            else {
                this.setStatus(400);
            }
            return { message: error.message };
        }
    }
    /**
    * Cambia la contraseña de un usuario.
    *
    * 👉 [Documentación general en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/user.controller)
    */
    async cambiarContrasena(body) {
        const { id, currentPassword, newPassword } = body;
        try {
            const result = await (0, user_service_1.changeUserPassword)(id, currentPassword, newPassword);
            return result;
        }
        catch (error) {
            console.error("Error en cambiarContrasena:", error);
            if (error instanceof Error) {
                this.setStatus(400); // Bad Request
                return { message: error.message };
            }
            this.setStatus(500); // Internal Server Error
            return { message: "Error inesperado al cambiar la contraseña" };
        }
    }
    /**
     * Actualiza los datos de un usuario.
     *
     * 👉 [Documentación general en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/user.controller)
     */
    // Modificar usuaro con su ID
    async updateUsuario(id, body) {
        // Validación especial para evitar mal uso del campo empresaId
        try {
            if (body.rol && body.rol !== "EQUIPO" && body.empresaId) {
                this.setStatus(400);
                return {
                    message: "No se puede asignar empresaId a usuarios que no son del rol EQUIPO",
                };
            }
            // Actualizar usuario (incluye hash de contraseña si se envía)
            await (0, user_service_1.updateUser)(id, body);
            return { message: "Usuario actualizado correctamente" };
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error && error.message.includes("no encontrado")) {
                this.setStatus(404);
                return { message: "Usuario no encontrado" };
            }
            this.setStatus(500);
            return { message: "Error al actualizar usuario" };
        }
    }
    /**
     * Reactiva un usuario inactivo.
     *
     * 👉 [Documentación general en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/user.controller)
     */
    //Reactivar usuario
    async reactivarUsuario(id) {
        try {
            await (0, user_service_1.reactivarUsuario)(id);
            return { message: "Usuario reactivado correctamente" };
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error && error.message.includes("no encontrado")) {
                this.setStatus(404);
                return { message: "Usuario no encontrado" };
            }
            else if (error instanceof Error && error.message.includes("ya está activo")) {
                this.setStatus(400);
                return { message: "El usuario ya está activo" };
            }
            this.setStatus(400);
            return { message: "No se pudo reactivar el usuario" };
        }
    }
    /**
     * Elimina (soft delete) un usuario por su ID.
     *
     * 👉 [Documentación general en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/user.controller)
     */
    async deleteUsuario(id) {
        try {
            await (0, user_service_1.deleteUser)(id);
            return { message: "Usuario eliminado correctamente" };
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error && error.message.includes("no encontrado")) {
                this.setStatus(404);
                return { message: "Usuario no encontrado" };
            }
            this.setStatus(500);
            return { message: "Error al eliminar usuario" };
        }
    }
};
exports.UserController = UserController;
__decorate([
    (0, tsoa_1.Get)("/"),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __param(3, (0, tsoa_1.Query)()),
    __param(4, (0, tsoa_1.Query)()),
    __param(5, (0, tsoa_1.Query)()),
    __param(6, (0, tsoa_1.Query)()),
    __param(7, (0, tsoa_1.Query)()),
    __param(8, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAll", null);
__decorate([
    (0, tsoa_1.Get)("/{id}"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getById", null);
__decorate([
    (0, tsoa_1.SuccessResponse)("201", "Usuario creado correctamente"),
    (0, tsoa_1.Response)("400", "Datos inválidos"),
    (0, tsoa_1.Post)("/"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
__decorate([
    (0, tsoa_1.Security)("jwt"),
    (0, tsoa_1.Get)("/empresa/{id}"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getEmpresaByIdController", null);
__decorate([
    (0, tsoa_1.Put)("/cambiarContrasena"),
    (0, tsoa_1.Tags)("Usuarios"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserDTO_1.ChangePasswordDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "cambiarContrasena", null);
__decorate([
    (0, tsoa_1.Put)("{id}"),
    (0, tsoa_1.SuccessResponse)("200", "Usuario actualizado"),
    (0, tsoa_1.Response)("404", "Usuario no encontrado"),
    (0, tsoa_1.Response)("500", "Error del servidor"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUsuario", null);
__decorate([
    (0, tsoa_1.Put)("/{id}/reactivar"),
    (0, tsoa_1.SuccessResponse)("200", "Usuario reactivado"),
    (0, tsoa_1.Response)("404", "Usuario no encontrado"),
    (0, tsoa_1.Response)("400", "No se pudo reactivar el usuario"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "reactivarUsuario", null);
__decorate([
    (0, tsoa_1.Delete)("{id}"),
    (0, tsoa_1.SuccessResponse)("200", "Usuario eliminado"),
    (0, tsoa_1.Response)("404", "Usuario no encontrado"),
    (0, tsoa_1.Response)("500", "Error del servidor"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUsuario", null);
exports.UserController = UserController = __decorate([
    (0, tsoa_1.Route)("usuarios") //Todas las rutas dentro del controlador comenzarán con /usuarios.
    ,
    (0, tsoa_1.Tags)("Usuarios") //Agrupa todas las rutas de este controlador bajo el tag Usuarios
    ,
    __metadata("design:paramtypes", [])
], UserController);
