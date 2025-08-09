"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificarComentarioProducto = notificarComentarioProducto;
const prismaClient_1 = __importDefault(require("../../utils/prismaClient"));
const client_1 = require("@prisma/client");
const preferenciasNotificaciones_1 = require("../../utils/notificaciones/preferenciasNotificaciones");
async function notificarComentarioProducto(idComentario) {
    const comentario = await prismaClient_1.default.comentarios.findUnique({
        where: { idComentario },
        include: {
            producto: {
                include: {
                    usuario: true,
                },
            },
        },
    });
    if (!comentario || !comentario.producto || !comentario.producto.usuario) {
        console.warn('❌ No se encontró el comentario, producto o su usuario.');
        return;
    }
    const usuarioProducto = comentario.producto.usuario;
    if (!usuarioProducto.empresaId) {
        console.warn('⚠️ El usuario dueño del producto no pertenece a una empresa.');
        return;
    }
    const miembros = await prismaClient_1.default.users.findMany({
        where: {
            empresaId: usuarioProducto.empresaId,
        },
    });
    if (miembros.length === 0) {
        console.warn('⚠️ No se encontraron miembros en la empresa.');
        return;
    }
    const titulo = `Nuevo comentario en producto: ${comentario.producto.nombre}`;
    const mensaje = `Se ha comentado el producto "${comentario.producto.nombre}": "${comentario.comentario}"`;
    const notificaciones = [];
    for (const miembro of miembros) {
        if (await (0, preferenciasNotificaciones_1.puedeNotificar)(miembro.idUsuario, 'COMENTARIO_EQUIPO')) {
            notificaciones.push({
                idUsuario: miembro.idUsuario,
                tipo: client_1.TipoNotificacion.COMENTARIO_EQUIPO,
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
