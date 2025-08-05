"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterRoutes = RegisterRoutes;
const runtime_1 = require("@tsoa/runtime");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const user_controller_1 = require("./../controllers/user.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const productos_controller_1 = require("./../controllers/productos.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const preferencias_controller_1 = require("./../controllers/preferencias.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const nutriscan_controller_1 = require("./../controllers/nutriscan.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const notificaciones_controller_1 = require("./../controllers/notificaciones.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const log_controller_1 = require("./../controllers/log.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const historial_controller_1 = require("./../controllers/historial.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const equipo_controller_1 = require("./../controllers/equipo.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const comentarios_controller_1 = require("./../controllers/comentarios.controller");
const jwt_1 = require("./../utils/jwt");
const expressAuthenticationRecasted = jwt_1.expressAuthentication;
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const models = {
    "ResponseMessageWithToken": {
        "dataType": "refObject",
        "properties": {
            "message": { "dataType": "string", "required": true },
            "detalles": { "dataType": "any" },
            "token": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserDTO": {
        "dataType": "refObject",
        "properties": {
            "username": { "dataType": "string", "required": true },
            "correo": { "dataType": "string", "required": true },
            "password": { "dataType": "string", "required": true },
            "nombreCompleto": { "dataType": "string", "required": true },
            "telefono": { "dataType": "string", "required": true },
            "direccion": { "dataType": "string", "required": true },
            "fotoPerfil": { "dataType": "string" },
            "tipoUsuario": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["INDIVIDUAL"] }, { "dataType": "enum", "enums": ["EMPRESARIAL"] }] },
            "nombreEmpresa": { "dataType": "string" },
            "nit": { "dataType": "string" },
            "rol": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["USUARIO"] }, { "dataType": "enum", "enums": ["EQUIPO"] }, { "dataType": "enum", "enums": ["ADMIN"] }, { "dataType": "enum", "enums": ["DESARROLLADOR"] }], "required": true },
            "rolEquipo": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["LECTOR"] }, { "dataType": "enum", "enums": ["COMENTARISTA"] }, { "dataType": "enum", "enums": ["EDITOR"] }] },
            "estado": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["activo"] }, { "dataType": "enum", "enums": ["inactivo"] }] },
            "empresaId": { "dataType": "double" },
            "perfilCompleto": { "dataType": "boolean" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ChangePasswordDTO": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "double", "required": true },
            "currentPassword": { "dataType": "string", "required": true },
            "newPassword": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ResponseMessage": {
        "dataType": "refObject",
        "properties": {
            "message": { "dataType": "string", "required": true },
            "detalles": { "dataType": "any" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_UserDTO_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "username": { "dataType": "string" }, "correo": { "dataType": "string" }, "password": { "dataType": "string" }, "nombreCompleto": { "dataType": "string" }, "telefono": { "dataType": "string" }, "direccion": { "dataType": "string" }, "fotoPerfil": { "dataType": "string" }, "tipoUsuario": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["INDIVIDUAL"] }, { "dataType": "enum", "enums": ["EMPRESARIAL"] }] }, "nombreEmpresa": { "dataType": "string" }, "nit": { "dataType": "string" }, "rol": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["USUARIO"] }, { "dataType": "enum", "enums": ["EQUIPO"] }, { "dataType": "enum", "enums": ["ADMIN"] }, { "dataType": "enum", "enums": ["DESARROLLADOR"] }] }, "rolEquipo": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["LECTOR"] }, { "dataType": "enum", "enums": ["COMENTARISTA"] }, { "dataType": "enum", "enums": ["EDITOR"] }] }, "estado": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["activo"] }, { "dataType": "enum", "enums": ["inactivo"] }] }, "empresaId": { "dataType": "double" }, "perfilCompleto": { "dataType": "boolean" } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ResponseMessageWithData_any_": {
        "dataType": "refObject",
        "properties": {
            "message": { "dataType": "string", "required": true },
            "detalles": { "dataType": "any" },
            "data": { "dataType": "any", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "_36_Enums.EstadoProducto": {
        "dataType": "refAlias",
        "type": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["DISPONIBLE"] }, { "dataType": "enum", "enums": ["AGOTADO"] }, { "dataType": "enum", "enums": ["RESERVADO"] }, { "dataType": "enum", "enums": ["VENCIDO"] }, { "dataType": "enum", "enums": ["ELIMINADO"] }], "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EstadoProducto": {
        "dataType": "refAlias",
        "type": { "ref": "_36_Enums.EstadoProducto", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ProductosDTO": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "double" },
            "codigoBarras": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }] },
            "codigoQR": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }] },
            "nombre": { "dataType": "string", "required": true },
            "descripcion": { "dataType": "string", "required": true },
            "cantidad": { "dataType": "double", "required": true },
            "precio": { "dataType": "double", "required": true },
            "fechaAdquisicion": { "dataType": "string", "required": true },
            "fechaVencimiento": { "dataType": "string", "required": true },
            "usuarioId": { "dataType": "double", "required": true },
            "estado": { "ref": "EstadoProducto", "required": true },
            "imagen": { "dataType": "string", "required": true },
            "categoria": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "JsonValue": {
        "dataType": "refAlias",
        "type": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "double" }, { "dataType": "boolean" }, { "ref": "JsonObject" }, { "ref": "JsonArray" }, { "dataType": "enum", "enums": [null] }], "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "JsonObject": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": {}, "additionalProperties": { "ref": "JsonValue" }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "JsonArray": {
        "dataType": "refObject",
        "properties": {},
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "_36_Enums.TipoUsuario": {
        "dataType": "refAlias",
        "type": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["INDIVIDUAL"] }, { "dataType": "enum", "enums": ["EMPRESARIAL"] }], "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LoginResponse": {
        "dataType": "refObject",
        "properties": {
            "token": { "dataType": "string", "required": true },
            "requiereCompletarPerfil": { "dataType": "boolean", "required": true },
            "user": { "dataType": "nestedObjectLiteral", "nestedProperties": { "empresaId": { "dataType": "union", "subSchemas": [{ "dataType": "double" }, { "dataType": "enum", "enums": [null] }], "required": true }, "perfilCompleto": { "dataType": "boolean", "required": true }, "rolEquipo": { "dataType": "string", "required": true }, "tipoUsuario": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }], "required": true }, "rol": { "dataType": "string", "required": true }, "correo": { "dataType": "string", "required": true }, "username": { "dataType": "string", "required": true }, "idUsuario": { "dataType": "double", "required": true } }, "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LoginRequest": {
        "dataType": "refObject",
        "properties": {
            "correo": { "dataType": "string", "required": true },
            "password": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SolicitudResetDTO": {
        "dataType": "refObject",
        "properties": {
            "correo": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ConfirmacionResetDTO": {
        "dataType": "refObject",
        "properties": {
            "token": { "dataType": "string", "required": true },
            "nuevaContrasena": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "HistorialInventarioDTO": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "double", "required": true },
            "productoId": { "dataType": "double", "required": true },
            "nombreProducto": { "dataType": "string", "required": true },
            "accion": { "dataType": "string", "required": true },
            "cantidad_anterior": { "dataType": "double", "required": true },
            "cantidad_nueva": { "dataType": "double", "required": true },
            "precio_anterior": { "dataType": "double", "required": true },
            "precio_nuevo": { "dataType": "double", "required": true },
            "fechaCambio": { "dataType": "datetime", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "_36_Enums.rolEquipo": {
        "dataType": "refAlias",
        "type": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["LECTOR"] }, { "dataType": "enum", "enums": ["COMENTARISTA"] }, { "dataType": "enum", "enums": ["EDITOR"] }], "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EquipoDTO": {
        "dataType": "refObject",
        "properties": {
            "username": { "dataType": "string", "required": true },
            "correo": { "dataType": "string", "required": true },
            "password": { "dataType": "string", "required": true },
            "nombreCompleto": { "dataType": "string", "required": true },
            "telefono": { "dataType": "string", "required": true },
            "direccion": { "dataType": "string", "required": true },
            "fotoPerfil": { "dataType": "string" },
            "rolEquipo": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["LECTOR"] }, { "dataType": "enum", "enums": ["COMENTARISTA"] }, { "dataType": "enum", "enums": ["EDITOR"] }], "required": true },
            "estado": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["activo"] }, { "dataType": "enum", "enums": ["inactivo"] }] },
            "empresaId": { "dataType": "double" },
            "perfilCompleto": { "dataType": "boolean" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_EquipoDTO_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "username": { "dataType": "string" }, "correo": { "dataType": "string" }, "password": { "dataType": "string" }, "nombreCompleto": { "dataType": "string" }, "telefono": { "dataType": "string" }, "direccion": { "dataType": "string" }, "fotoPerfil": { "dataType": "string" }, "rolEquipo": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["LECTOR"] }, { "dataType": "enum", "enums": ["COMENTARISTA"] }, { "dataType": "enum", "enums": ["EDITOR"] }] }, "estado": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["activo"] }, { "dataType": "enum", "enums": ["inactivo"] }] }, "empresaId": { "dataType": "double" }, "perfilCompleto": { "dataType": "boolean" } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ComentarioDTO": {
        "dataType": "refObject",
        "properties": {
            "idComentario": { "dataType": "double", "required": true },
            "idUsuario": { "dataType": "double", "required": true },
            "idProducto": { "dataType": "double", "required": true },
            "comentario": { "dataType": "string", "required": true },
            "fechaComentario": { "dataType": "datetime", "required": true },
            "estado": { "dataType": "string", "required": true },
            "createdAt": { "dataType": "datetime", "required": true },
            "updatedAt": { "dataType": "datetime", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CrearComentarioBody": {
        "dataType": "refObject",
        "properties": {
            "idUsuario": { "dataType": "double", "required": true },
            "idProducto": { "dataType": "double", "required": true },
            "comentario": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ActualizarComentarioBody": {
        "dataType": "refObject",
        "properties": {
            "comentario": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new runtime_1.ExpressTemplateService(models, { "noImplicitAdditionalProperties": "throw-on-extras", "bodyCoercion": true });
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
function RegisterRoutes(app) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
    const argsUserController_getAll = {
        username: { "in": "query", "name": "username", "dataType": "string" },
        correo: { "in": "query", "name": "correo", "dataType": "string" },
        nombreCompleto: { "in": "query", "name": "nombreCompleto", "dataType": "string" },
        telefono: { "in": "query", "name": "telefono", "dataType": "string" },
        nit: { "in": "query", "name": "nit", "dataType": "string" },
        estado: { "in": "query", "name": "estado", "dataType": "string" },
        rol: { "in": "query", "name": "rol", "dataType": "string" },
        tipoUsuario: { "in": "query", "name": "tipoUsuario", "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["INDIVIDUAL"] }, { "dataType": "enum", "enums": ["EMPRESARIAL"] }] },
        rolEquipo: { "in": "query", "name": "rolEquipo", "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["LECTOR"] }, { "dataType": "enum", "enums": ["COMENTARISTA"] }, { "dataType": "enum", "enums": ["EDITOR"] }] },
    };
    app.get('/usuarios', ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController)), ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController.prototype.getAll)), async function UserController_getAll(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsUserController_getAll, request, response });
            const controller = new user_controller_1.UserController();
            await templateService.apiHandler({
                methodName: 'getAll',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsUserController_getById = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
    };
    app.get('/usuarios/:id', ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController)), ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController.prototype.getById)), async function UserController_getById(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsUserController_getById, request, response });
            const controller = new user_controller_1.UserController();
            await templateService.apiHandler({
                methodName: 'getById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsUserController_create = {
        requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "UserDTO" },
    };
    app.post('/usuarios', ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController)), ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController.prototype.create)), async function UserController_create(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsUserController_create, request, response });
            const controller = new user_controller_1.UserController();
            await templateService.apiHandler({
                methodName: 'create',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsUserController_getEmpresaByIdController = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.get('/usuarios/empresa/:id', authenticateMiddleware([{ "jwt": [] }]), ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController)), ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController.prototype.getEmpresaByIdController)), async function UserController_getEmpresaByIdController(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsUserController_getEmpresaByIdController, request, response });
            const controller = new user_controller_1.UserController();
            await templateService.apiHandler({
                methodName: 'getEmpresaByIdController',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsUserController_cambiarContrasena = {
        body: { "in": "body", "name": "body", "required": true, "ref": "ChangePasswordDTO" },
    };
    app.put('/usuarios/cambiarContrasena', ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController)), ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController.prototype.cambiarContrasena)), async function UserController_cambiarContrasena(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsUserController_cambiarContrasena, request, response });
            const controller = new user_controller_1.UserController();
            await templateService.apiHandler({
                methodName: 'cambiarContrasena',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsUserController_updateUsuario = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        body: { "in": "body", "name": "body", "required": true, "ref": "Partial_UserDTO_" },
    };
    app.put('/usuarios/:id', ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController)), ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController.prototype.updateUsuario)), async function UserController_updateUsuario(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsUserController_updateUsuario, request, response });
            const controller = new user_controller_1.UserController();
            await templateService.apiHandler({
                methodName: 'updateUsuario',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsUserController_reactivarUsuario = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.put('/usuarios/:id/reactivar', ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController)), ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController.prototype.reactivarUsuario)), async function UserController_reactivarUsuario(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsUserController_reactivarUsuario, request, response });
            const controller = new user_controller_1.UserController();
            await templateService.apiHandler({
                methodName: 'reactivarUsuario',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsUserController_deleteUsuario = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.delete('/usuarios/:id', ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController)), ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController.prototype.deleteUsuario)), async function UserController_deleteUsuario(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsUserController_deleteUsuario, request, response });
            const controller = new user_controller_1.UserController();
            await templateService.apiHandler({
                methodName: 'deleteUsuario',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsProductosController_getAll = {
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
        nombre: { "in": "query", "name": "nombre", "dataType": "string" },
        categoria: { "in": "query", "name": "categoria", "dataType": "string" },
        estado: { "in": "query", "name": "estado", "dataType": "string" },
        fechaAdquisicionDesde: { "in": "query", "name": "fechaAdquisicionDesde", "dataType": "string" },
        fechaAdquisicionHasta: { "in": "query", "name": "fechaAdquisicionHasta", "dataType": "string" },
        fechaVencimientoDesde: { "in": "query", "name": "fechaVencimientoDesde", "dataType": "string" },
        fechaVencimientoHasta: { "in": "query", "name": "fechaVencimientoHasta", "dataType": "string" },
    };
    app.get('/productos', authenticateMiddleware([{ "jwt": [] }]), ...((0, runtime_1.fetchMiddlewares)(productos_controller_1.ProductosController)), ...((0, runtime_1.fetchMiddlewares)(productos_controller_1.ProductosController.prototype.getAll)), async function ProductosController_getAll(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsProductosController_getAll, request, response });
            const controller = new productos_controller_1.ProductosController();
            await templateService.apiHandler({
                methodName: 'getAll',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsProductosController_obtenerCategorias = {
        tipoUsuario: { "in": "query", "name": "tipoUsuario", "dataType": "string" },
    };
    app.get('/productos/categorias', ...((0, runtime_1.fetchMiddlewares)(productos_controller_1.ProductosController)), ...((0, runtime_1.fetchMiddlewares)(productos_controller_1.ProductosController.prototype.obtenerCategorias)), async function ProductosController_obtenerCategorias(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsProductosController_obtenerCategorias, request, response });
            const controller = new productos_controller_1.ProductosController();
            await templateService.apiHandler({
                methodName: 'obtenerCategorias',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsProductosController_getByCategoria = {
        categoria: { "in": "query", "name": "categoria", "required": true, "dataType": "string" },
    };
    app.get('/productos/por-categoria', ...((0, runtime_1.fetchMiddlewares)(productos_controller_1.ProductosController)), ...((0, runtime_1.fetchMiddlewares)(productos_controller_1.ProductosController.prototype.getByCategoria)), async function ProductosController_getByCategoria(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsProductosController_getByCategoria, request, response });
            const controller = new productos_controller_1.ProductosController();
            await templateService.apiHandler({
                methodName: 'getByCategoria',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsProductosController_getNombresProductosDelUsuario = {
        idUsuario: { "in": "path", "name": "idUsuario", "required": true, "dataType": "double" },
    };
    app.get('/productos/nombres/:idUsuario', ...((0, runtime_1.fetchMiddlewares)(productos_controller_1.ProductosController)), ...((0, runtime_1.fetchMiddlewares)(productos_controller_1.ProductosController.prototype.getNombresProductosDelUsuario)), async function ProductosController_getNombresProductosDelUsuario(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsProductosController_getNombresProductosDelUsuario, request, response });
            const controller = new productos_controller_1.ProductosController();
            await templateService.apiHandler({
                methodName: 'getNombresProductosDelUsuario',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsProductosController_getCantidadPorCategoria = {};
    app.get('/productos/cantidad-por-categoria', ...((0, runtime_1.fetchMiddlewares)(productos_controller_1.ProductosController)), ...((0, runtime_1.fetchMiddlewares)(productos_controller_1.ProductosController.prototype.getCantidadPorCategoria)), async function ProductosController_getCantidadPorCategoria(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsProductosController_getCantidadPorCategoria, request, response });
            const controller = new productos_controller_1.ProductosController();
            await templateService.apiHandler({
                methodName: 'getCantidadPorCategoria',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsProductosController_getCantidadPorRangoPrecio = {};
    app.get('/productos/cantidad-por-rango-precio', ...((0, runtime_1.fetchMiddlewares)(productos_controller_1.ProductosController)), ...((0, runtime_1.fetchMiddlewares)(productos_controller_1.ProductosController.prototype.getCantidadPorRangoPrecio)), async function ProductosController_getCantidadPorRangoPrecio(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsProductosController_getCantidadPorRangoPrecio, request, response });
            const controller = new productos_controller_1.ProductosController();
            await templateService.apiHandler({
                methodName: 'getCantidadPorRangoPrecio',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsProductosController_getById = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
    };
    app.get('/productos/:id', ...((0, runtime_1.fetchMiddlewares)(productos_controller_1.ProductosController)), ...((0, runtime_1.fetchMiddlewares)(productos_controller_1.ProductosController.prototype.getById)), async function ProductosController_getById(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsProductosController_getById, request, response });
            const controller = new productos_controller_1.ProductosController();
            await templateService.apiHandler({
                methodName: 'getById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsProductosController_create = {
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
        requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "ProductosDTO" },
    };
    app.post('/productos', authenticateMiddleware([{ "jwt": [] }]), ...((0, runtime_1.fetchMiddlewares)(productos_controller_1.ProductosController)), ...((0, runtime_1.fetchMiddlewares)(productos_controller_1.ProductosController.prototype.create)), async function ProductosController_create(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsProductosController_create, request, response });
            const controller = new productos_controller_1.ProductosController();
            await templateService.apiHandler({
                methodName: 'create',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsProductosController_updateProducto = {
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        body: { "in": "body", "name": "body", "required": true, "dataType": "any" },
    };
    app.put('/productos/:id', authenticateMiddleware([{ "jwt": [] }]), ...((0, runtime_1.fetchMiddlewares)(productos_controller_1.ProductosController)), ...((0, runtime_1.fetchMiddlewares)(productos_controller_1.ProductosController.prototype.updateProducto)), async function ProductosController_updateProducto(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsProductosController_updateProducto, request, response });
            const controller = new productos_controller_1.ProductosController();
            await templateService.apiHandler({
                methodName: 'updateProducto',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsProductosController_deleteProducto = {
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.delete('/productos/:id', authenticateMiddleware([{ "jwt": [] }]), ...((0, runtime_1.fetchMiddlewares)(productos_controller_1.ProductosController)), ...((0, runtime_1.fetchMiddlewares)(productos_controller_1.ProductosController.prototype.deleteProducto)), async function ProductosController_deleteProducto(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsProductosController_deleteProducto, request, response });
            const controller = new productos_controller_1.ProductosController();
            await templateService.apiHandler({
                methodName: 'deleteProducto',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsPreferenciasNotificacionesController_obtenerPreferencias = {
        idUsuario: { "in": "path", "name": "idUsuario", "required": true, "dataType": "double" },
    };
    app.get('/preferencias-notificaciones/:idUsuario', ...((0, runtime_1.fetchMiddlewares)(preferencias_controller_1.PreferenciasNotificacionesController)), ...((0, runtime_1.fetchMiddlewares)(preferencias_controller_1.PreferenciasNotificacionesController.prototype.obtenerPreferencias)), async function PreferenciasNotificacionesController_obtenerPreferencias(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsPreferenciasNotificacionesController_obtenerPreferencias, request, response });
            const controller = new preferencias_controller_1.PreferenciasNotificacionesController();
            await templateService.apiHandler({
                methodName: 'obtenerPreferencias',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsPreferenciasNotificacionesController_actualizarPreferencias = {
        idUsuario: { "in": "path", "name": "idUsuario", "required": true, "dataType": "double" },
        body: { "in": "body", "name": "body", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "actualizacion": { "dataType": "boolean" }, "reposicion": { "dataType": "boolean" }, "comentarios": { "dataType": "boolean" }, "productoVencido": { "dataType": "boolean" }, "stockBajo": { "dataType": "boolean" } } },
    };
    app.put('/preferencias-notificaciones/:idUsuario', ...((0, runtime_1.fetchMiddlewares)(preferencias_controller_1.PreferenciasNotificacionesController)), ...((0, runtime_1.fetchMiddlewares)(preferencias_controller_1.PreferenciasNotificacionesController.prototype.actualizarPreferencias)), async function PreferenciasNotificacionesController_actualizarPreferencias(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsPreferenciasNotificacionesController_actualizarPreferencias, request, response });
            const controller = new preferencias_controller_1.PreferenciasNotificacionesController();
            await templateService.apiHandler({
                methodName: 'actualizarPreferencias',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsNutriScanController_create = {
        body: { "in": "body", "name": "body", "required": true, "dataType": "any" },
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
    };
    app.post('/nutriscan', authenticateMiddleware([{ "jwt": [] }]), ...((0, runtime_1.fetchMiddlewares)(nutriscan_controller_1.NutriScanController)), ...((0, runtime_1.fetchMiddlewares)(nutriscan_controller_1.NutriScanController.prototype.create)), async function NutriScanController_create(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsNutriScanController_create, request, response });
            const controller = new nutriscan_controller_1.NutriScanController();
            await templateService.apiHandler({
                methodName: 'create',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsNutriScanController_findAll = {
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
    };
    app.get('/nutriscan', authenticateMiddleware([{ "jwt": [] }]), ...((0, runtime_1.fetchMiddlewares)(nutriscan_controller_1.NutriScanController)), ...((0, runtime_1.fetchMiddlewares)(nutriscan_controller_1.NutriScanController.prototype.findAll)), async function NutriScanController_findAll(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsNutriScanController_findAll, request, response });
            const controller = new nutriscan_controller_1.NutriScanController();
            await templateService.apiHandler({
                methodName: 'findAll',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsNutriScanController_findByUserId = {
        usuarioId: { "in": "path", "name": "usuarioId", "required": true, "dataType": "double" },
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
    };
    app.get('/nutriscan/usuario/:usuarioId', authenticateMiddleware([{ "jwt": [] }]), ...((0, runtime_1.fetchMiddlewares)(nutriscan_controller_1.NutriScanController)), ...((0, runtime_1.fetchMiddlewares)(nutriscan_controller_1.NutriScanController.prototype.findByUserId)), async function NutriScanController_findByUserId(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsNutriScanController_findByUserId, request, response });
            const controller = new nutriscan_controller_1.NutriScanController();
            await templateService.apiHandler({
                methodName: 'findByUserId',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsNutriScanController_update = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        body: { "in": "body", "name": "body", "required": true, "dataType": "any" },
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
    };
    app.put('/nutriscan/:id', authenticateMiddleware([{ "jwt": [] }]), ...((0, runtime_1.fetchMiddlewares)(nutriscan_controller_1.NutriScanController)), ...((0, runtime_1.fetchMiddlewares)(nutriscan_controller_1.NutriScanController.prototype.update)), async function NutriScanController_update(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsNutriScanController_update, request, response });
            const controller = new nutriscan_controller_1.NutriScanController();
            await templateService.apiHandler({
                methodName: 'update',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsNutriScanController_delete = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
    };
    app.delete('/nutriscan/:id', authenticateMiddleware([{ "jwt": [] }]), ...((0, runtime_1.fetchMiddlewares)(nutriscan_controller_1.NutriScanController)), ...((0, runtime_1.fetchMiddlewares)(nutriscan_controller_1.NutriScanController.prototype.delete)), async function NutriScanController_delete(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsNutriScanController_delete, request, response });
            const controller = new nutriscan_controller_1.NutriScanController();
            await templateService.apiHandler({
                methodName: 'delete',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsNotificacionesController_enviarNotificacionStockBajo = {
        body: { "in": "body", "name": "body", "dataType": "nestedObjectLiteral", "nestedProperties": { "productos": { "dataType": "array", "array": { "dataType": "nestedObjectLiteral", "nestedProperties": { "id": { "dataType": "double", "required": true } } } } } },
    };
    app.post('/notificaciones/stock-bajo', ...((0, runtime_1.fetchMiddlewares)(notificaciones_controller_1.NotificacionesController)), ...((0, runtime_1.fetchMiddlewares)(notificaciones_controller_1.NotificacionesController.prototype.enviarNotificacionStockBajo)), async function NotificacionesController_enviarNotificacionStockBajo(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsNotificacionesController_enviarNotificacionStockBajo, request, response });
            const controller = new notificaciones_controller_1.NotificacionesController();
            await templateService.apiHandler({
                methodName: 'enviarNotificacionStockBajo',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsNotificacionesController_enviarNotificacionProductoVencido = {
        body: { "in": "body", "name": "body", "dataType": "nestedObjectLiteral", "nestedProperties": { "productos": { "dataType": "array", "array": { "dataType": "nestedObjectLiteral", "nestedProperties": { "id": { "dataType": "double", "required": true } } } } } },
    };
    app.post('/notificaciones/producto-vencido', ...((0, runtime_1.fetchMiddlewares)(notificaciones_controller_1.NotificacionesController)), ...((0, runtime_1.fetchMiddlewares)(notificaciones_controller_1.NotificacionesController.prototype.enviarNotificacionProductoVencido)), async function NotificacionesController_enviarNotificacionProductoVencido(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsNotificacionesController_enviarNotificacionProductoVencido, request, response });
            const controller = new notificaciones_controller_1.NotificacionesController();
            await templateService.apiHandler({
                methodName: 'enviarNotificacionProductoVencido',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsNotificacionesController_enviarNotificacionComentarioProducto = {
        body: { "in": "body", "name": "body", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "idComentario": { "dataType": "double", "required": true } } },
    };
    app.post('/notificaciones/comentario-producto', ...((0, runtime_1.fetchMiddlewares)(notificaciones_controller_1.NotificacionesController)), ...((0, runtime_1.fetchMiddlewares)(notificaciones_controller_1.NotificacionesController.prototype.enviarNotificacionComentarioProducto)), async function NotificacionesController_enviarNotificacionComentarioProducto(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsNotificacionesController_enviarNotificacionComentarioProducto, request, response });
            const controller = new notificaciones_controller_1.NotificacionesController();
            await templateService.apiHandler({
                methodName: 'enviarNotificacionComentarioProducto',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsNotificacionesController_enviarNotificacionReposicionRecomendada = {
        body: { "in": "body", "name": "body", "dataType": "nestedObjectLiteral", "nestedProperties": { "productos": { "dataType": "array", "array": { "dataType": "nestedObjectLiteral", "nestedProperties": { "id": { "dataType": "double", "required": true } } } } } },
    };
    app.post('/notificaciones/reposicion-recomendada', ...((0, runtime_1.fetchMiddlewares)(notificaciones_controller_1.NotificacionesController)), ...((0, runtime_1.fetchMiddlewares)(notificaciones_controller_1.NotificacionesController.prototype.enviarNotificacionReposicionRecomendada)), async function NotificacionesController_enviarNotificacionReposicionRecomendada(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsNotificacionesController_enviarNotificacionReposicionRecomendada, request, response });
            const controller = new notificaciones_controller_1.NotificacionesController();
            await templateService.apiHandler({
                methodName: 'enviarNotificacionReposicionRecomendada',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsNotificacionesController_enviarNotificacionActualizacionApp = {
        body: { "in": "body", "name": "body", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "mensaje": { "dataType": "string", "required": true }, "titulo": { "dataType": "string", "required": true } } },
    };
    app.post('/notificaciones/actualizacion-app', ...((0, runtime_1.fetchMiddlewares)(notificaciones_controller_1.NotificacionesController)), ...((0, runtime_1.fetchMiddlewares)(notificaciones_controller_1.NotificacionesController.prototype.enviarNotificacionActualizacionApp)), async function NotificacionesController_enviarNotificacionActualizacionApp(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsNotificacionesController_enviarNotificacionActualizacionApp, request, response });
            const controller = new notificaciones_controller_1.NotificacionesController();
            await templateService.apiHandler({
                methodName: 'enviarNotificacionActualizacionApp',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsNotificacionesController_obtenerNotificacionesPorUsuario = {
        idUsuario: { "in": "path", "name": "idUsuario", "required": true, "dataType": "double" },
    };
    app.get('/notificaciones/usuario/:idUsuario', ...((0, runtime_1.fetchMiddlewares)(notificaciones_controller_1.NotificacionesController)), ...((0, runtime_1.fetchMiddlewares)(notificaciones_controller_1.NotificacionesController.prototype.obtenerNotificacionesPorUsuario)), async function NotificacionesController_obtenerNotificacionesPorUsuario(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsNotificacionesController_obtenerNotificacionesPorUsuario, request, response });
            const controller = new notificaciones_controller_1.NotificacionesController();
            await templateService.apiHandler({
                methodName: 'obtenerNotificacionesPorUsuario',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsNotificacionesController_marcarComoLeida = {
        idNotificacion: { "in": "path", "name": "idNotificacion", "required": true, "dataType": "double" },
    };
    app.patch('/notificaciones/:idNotificacion', ...((0, runtime_1.fetchMiddlewares)(notificaciones_controller_1.NotificacionesController)), ...((0, runtime_1.fetchMiddlewares)(notificaciones_controller_1.NotificacionesController.prototype.marcarComoLeida)), async function NotificacionesController_marcarComoLeida(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsNotificacionesController_marcarComoLeida, request, response });
            const controller = new notificaciones_controller_1.NotificacionesController();
            await templateService.apiHandler({
                methodName: 'marcarComoLeida',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsNotificacionesController_actualizarPreferencias = {
        idUsuario: { "in": "path", "name": "idUsuario", "required": true, "dataType": "double" },
        body: { "in": "body", "name": "body", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "actualizacion": { "dataType": "boolean" }, "reposicion": { "dataType": "boolean" }, "comentarios": { "dataType": "boolean" }, "productoVencido": { "dataType": "boolean" }, "stockBajo": { "dataType": "boolean" } } },
    };
    app.patch('/notificaciones/preferencias/:idUsuario', ...((0, runtime_1.fetchMiddlewares)(notificaciones_controller_1.NotificacionesController)), ...((0, runtime_1.fetchMiddlewares)(notificaciones_controller_1.NotificacionesController.prototype.actualizarPreferencias)), async function NotificacionesController_actualizarPreferencias(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsNotificacionesController_actualizarPreferencias, request, response });
            const controller = new notificaciones_controller_1.NotificacionesController();
            await templateService.apiHandler({
                methodName: 'actualizarPreferencias',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsLogController_login = {
        body: { "in": "body", "name": "body", "required": true, "ref": "LoginRequest" },
    };
    app.post('/auth/login', ...((0, runtime_1.fetchMiddlewares)(log_controller_1.LogController)), ...((0, runtime_1.fetchMiddlewares)(log_controller_1.LogController.prototype.login)), async function LogController_login(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsLogController_login, request, response });
            const controller = new log_controller_1.LogController();
            await templateService.apiHandler({
                methodName: 'login',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsLogController_solicitarReset = {
        body: { "in": "body", "name": "body", "required": true, "ref": "SolicitudResetDTO" },
    };
    app.post('/auth/solicitar-reset', ...((0, runtime_1.fetchMiddlewares)(log_controller_1.LogController)), ...((0, runtime_1.fetchMiddlewares)(log_controller_1.LogController.prototype.solicitarReset)), async function LogController_solicitarReset(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsLogController_solicitarReset, request, response });
            const controller = new log_controller_1.LogController();
            await templateService.apiHandler({
                methodName: 'solicitarReset',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsLogController_confirmarReset = {
        body: { "in": "body", "name": "body", "required": true, "ref": "ConfirmacionResetDTO" },
    };
    app.post('/auth/confirmar-reset', ...((0, runtime_1.fetchMiddlewares)(log_controller_1.LogController)), ...((0, runtime_1.fetchMiddlewares)(log_controller_1.LogController.prototype.confirmarReset)), async function LogController_confirmarReset(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsLogController_confirmarReset, request, response });
            const controller = new log_controller_1.LogController();
            await templateService.apiHandler({
                methodName: 'confirmarReset',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsHistorialController_obtenerHistorialPorUsuario = {
        idUsuario: { "in": "path", "name": "idUsuario", "required": true, "dataType": "double" },
    };
    app.get('/historial/usuario/:idUsuario', ...((0, runtime_1.fetchMiddlewares)(historial_controller_1.HistorialController)), ...((0, runtime_1.fetchMiddlewares)(historial_controller_1.HistorialController.prototype.obtenerHistorialPorUsuario)), async function HistorialController_obtenerHistorialPorUsuario(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsHistorialController_obtenerHistorialPorUsuario, request, response });
            const controller = new historial_controller_1.HistorialController();
            await templateService.apiHandler({
                methodName: 'obtenerHistorialPorUsuario',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsEquipoController_crearEquipo = {
        data: { "in": "body", "name": "data", "required": true, "ref": "EquipoDTO" },
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
    };
    app.post('/equipo', authenticateMiddleware([{ "jwt": [] }]), ...((0, runtime_1.fetchMiddlewares)(equipo_controller_1.EquipoController)), ...((0, runtime_1.fetchMiddlewares)(equipo_controller_1.EquipoController.prototype.crearEquipo)), async function EquipoController_crearEquipo(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsEquipoController_crearEquipo, request, response });
            const controller = new equipo_controller_1.EquipoController();
            await templateService.apiHandler({
                methodName: 'crearEquipo',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsEquipoController_obtenerTodosLosEquipos = {
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
    };
    app.get('/equipo', authenticateMiddleware([{ "jwt": [] }]), ...((0, runtime_1.fetchMiddlewares)(equipo_controller_1.EquipoController)), ...((0, runtime_1.fetchMiddlewares)(equipo_controller_1.EquipoController.prototype.obtenerTodosLosEquipos)), async function EquipoController_obtenerTodosLosEquipos(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsEquipoController_obtenerTodosLosEquipos, request, response });
            const controller = new equipo_controller_1.EquipoController();
            await templateService.apiHandler({
                methodName: 'obtenerTodosLosEquipos',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsEquipoController_filtrarEquipos = {
        nombreCompleto: { "in": "query", "name": "nombreCompleto", "dataType": "string" },
        correo: { "in": "query", "name": "correo", "dataType": "string" },
        rolEquipo: { "in": "query", "name": "rolEquipo", "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["LECTOR"] }, { "dataType": "enum", "enums": ["COMENTARISTA"] }, { "dataType": "enum", "enums": ["EDITOR"] }] },
        estado: { "in": "query", "name": "estado", "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["activo"] }, { "dataType": "enum", "enums": ["inactivo"] }] },
        perfilCompleto: { "in": "query", "name": "perfilCompleto", "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["true"] }, { "dataType": "enum", "enums": ["false"] }] },
        req: { "in": "request", "name": "req", "dataType": "object" },
    };
    app.get('/equipo/filtrar', authenticateMiddleware([{ "jwt": [] }]), ...((0, runtime_1.fetchMiddlewares)(equipo_controller_1.EquipoController)), ...((0, runtime_1.fetchMiddlewares)(equipo_controller_1.EquipoController.prototype.filtrarEquipos)), async function EquipoController_filtrarEquipos(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsEquipoController_filtrarEquipos, request, response });
            const controller = new equipo_controller_1.EquipoController();
            await templateService.apiHandler({
                methodName: 'filtrarEquipos',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsEquipoController_obtenerEquipoPorId = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
    };
    app.get('/equipo/:id', authenticateMiddleware([{ "jwt": [] }]), ...((0, runtime_1.fetchMiddlewares)(equipo_controller_1.EquipoController)), ...((0, runtime_1.fetchMiddlewares)(equipo_controller_1.EquipoController.prototype.obtenerEquipoPorId)), async function EquipoController_obtenerEquipoPorId(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsEquipoController_obtenerEquipoPorId, request, response });
            const controller = new equipo_controller_1.EquipoController();
            await templateService.apiHandler({
                methodName: 'obtenerEquipoPorId',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsEquipoController_actualizarEquipo = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        data: { "in": "body", "name": "data", "required": true, "ref": "Partial_EquipoDTO_" },
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
    };
    app.put('/equipo/:id', authenticateMiddleware([{ "jwt": [] }]), ...((0, runtime_1.fetchMiddlewares)(equipo_controller_1.EquipoController)), ...((0, runtime_1.fetchMiddlewares)(equipo_controller_1.EquipoController.prototype.actualizarEquipo)), async function EquipoController_actualizarEquipo(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsEquipoController_actualizarEquipo, request, response });
            const controller = new equipo_controller_1.EquipoController();
            await templateService.apiHandler({
                methodName: 'actualizarEquipo',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsEquipoController_eliminarLogico = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
    };
    app.delete('/equipo/eliminar-logico/:id', authenticateMiddleware([{ "jwt": [] }]), ...((0, runtime_1.fetchMiddlewares)(equipo_controller_1.EquipoController)), ...((0, runtime_1.fetchMiddlewares)(equipo_controller_1.EquipoController.prototype.eliminarLogico)), async function EquipoController_eliminarLogico(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsEquipoController_eliminarLogico, request, response });
            const controller = new equipo_controller_1.EquipoController();
            await templateService.apiHandler({
                methodName: 'eliminarLogico',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsEquipoController_eliminarTodoElEquipo = {
        empresaId: { "in": "path", "name": "empresaId", "required": true, "dataType": "double" },
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
    };
    app.delete('/equipo/todos/:empresaId', authenticateMiddleware([{ "jwt": [] }]), ...((0, runtime_1.fetchMiddlewares)(equipo_controller_1.EquipoController)), ...((0, runtime_1.fetchMiddlewares)(equipo_controller_1.EquipoController.prototype.eliminarTodoElEquipo)), async function EquipoController_eliminarTodoElEquipo(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsEquipoController_eliminarTodoElEquipo, request, response });
            const controller = new equipo_controller_1.EquipoController();
            await templateService.apiHandler({
                methodName: 'eliminarTodoElEquipo',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsComentariosController_getComentariosPorProducto = {
        productoId: { "in": "path", "name": "productoId", "required": true, "dataType": "double" },
    };
    app.get('/comentarios/:productoId', ...((0, runtime_1.fetchMiddlewares)(comentarios_controller_1.ComentariosController)), ...((0, runtime_1.fetchMiddlewares)(comentarios_controller_1.ComentariosController.prototype.getComentariosPorProducto)), async function ComentariosController_getComentariosPorProducto(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsComentariosController_getComentariosPorProducto, request, response });
            const controller = new comentarios_controller_1.ComentariosController();
            await templateService.apiHandler({
                methodName: 'getComentariosPorProducto',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsComentariosController_crearComentario = {
        body: { "in": "body", "name": "body", "required": true, "ref": "CrearComentarioBody" },
    };
    app.post('/comentarios', ...((0, runtime_1.fetchMiddlewares)(comentarios_controller_1.ComentariosController)), ...((0, runtime_1.fetchMiddlewares)(comentarios_controller_1.ComentariosController.prototype.crearComentario)), async function ComentariosController_crearComentario(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsComentariosController_crearComentario, request, response });
            const controller = new comentarios_controller_1.ComentariosController();
            await templateService.apiHandler({
                methodName: 'crearComentario',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsComentariosController_actualizarComentario = {
        idComentario: { "in": "path", "name": "idComentario", "required": true, "dataType": "double" },
        body: { "in": "body", "name": "body", "required": true, "ref": "ActualizarComentarioBody" },
    };
    app.put('/comentarios/:idComentario', ...((0, runtime_1.fetchMiddlewares)(comentarios_controller_1.ComentariosController)), ...((0, runtime_1.fetchMiddlewares)(comentarios_controller_1.ComentariosController.prototype.actualizarComentario)), async function ComentariosController_actualizarComentario(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsComentariosController_actualizarComentario, request, response });
            const controller = new comentarios_controller_1.ComentariosController();
            await templateService.apiHandler({
                methodName: 'actualizarComentario',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsComentariosController_eliminarComentario = {
        idComentario: { "in": "path", "name": "idComentario", "required": true, "dataType": "double" },
    };
    app.delete('/comentarios/:idComentario', ...((0, runtime_1.fetchMiddlewares)(comentarios_controller_1.ComentariosController)), ...((0, runtime_1.fetchMiddlewares)(comentarios_controller_1.ComentariosController.prototype.eliminarComentario)), async function ComentariosController_eliminarComentario(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsComentariosController_eliminarComentario, request, response });
            const controller = new comentarios_controller_1.ComentariosController();
            await templateService.apiHandler({
                methodName: 'eliminarComentario',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    function authenticateMiddleware(security = []) {
        return async function runAuthenticationMiddleware(request, response, next) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            // keep track of failed auth attempts so we can hand back the most
            // recent one.  This behavior was previously existing so preserving it
            // here
            const failedAttempts = [];
            const pushAndRethrow = (error) => {
                failedAttempts.push(error);
                throw error;
            };
            const secMethodOrPromises = [];
            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    const secMethodAndPromises = [];
                    for (const name in secMethod) {
                        secMethodAndPromises.push(expressAuthenticationRecasted(request, name, secMethod[name], response)
                            .catch(pushAndRethrow));
                    }
                    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
                    secMethodOrPromises.push(Promise.all(secMethodAndPromises)
                        .then(users => { return users[0]; }));
                }
                else {
                    for (const name in secMethod) {
                        secMethodOrPromises.push(expressAuthenticationRecasted(request, name, secMethod[name], response)
                            .catch(pushAndRethrow));
                    }
                }
            }
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            try {
                request['user'] = await Promise.any(secMethodOrPromises);
                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }
                next();
            }
            catch (err) {
                // Show most recent error as response
                const error = failedAttempts.pop();
                error.status = error.status || 401;
                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }
                next(error);
            }
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        };
    }
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
