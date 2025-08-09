"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificarActualizacionApp = notificarActualizacionApp;
const prismaClient_1 = __importDefault(require("../../utils/prismaClient"));
const client_1 = require("@prisma/client");
const preferenciasNotificaciones_1 = require("../../utils/notificaciones/preferenciasNotificaciones");
/**
 * Envía una notificación de tipo ACTUALIZACION_APP a todos los usuarios registrados.
 * @param titulo Título de la notificación.
 * @param mensaje Mensaje de la notificación.
 */
async function notificarActualizacionApp(titulo, mensaje) {
    const usuarios = await prismaClient_1.default.users.findMany({
        where: {
            deletedAt: null, // si usas soft delete
        },
    });
    if (usuarios.length === 0) {
        console.warn('⚠️ No hay usuarios para notificar.');
        return;
    }
    const notificaciones = [];
    for (const usuario of usuarios) {
        if (await (0, preferenciasNotificaciones_1.puedeNotificar)(usuario.idUsuario, 'ACTUALIZACION_APP')) {
            notificaciones.push({
                idUsuario: usuario.idUsuario,
                tipo: client_1.TipoNotificacion.ACTUALIZACION_APP,
                titulo,
                mensaje,
                leida: false,
            });
        }
    }
    if (notificaciones.length > 0) {
        await prismaClient_1.default.notificaciones.createMany({
            data: notificaciones,
        });
    }
}
