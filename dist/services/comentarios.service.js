"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerComentariosPorProducto = obtenerComentariosPorProducto;
exports.crearComentario = crearComentario;
exports.actualizarComentario = actualizarComentario;
exports.eliminarComentario = eliminarComentario;
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
const comentarioProducto_service_1 = require("../services/notificaciones/comentarioProducto.service");
function mapComentarioToDTO(comentario) {
    return {
        idComentario: comentario.idComentario,
        idUsuario: comentario.idUsuario,
        idProducto: comentario.idProducto,
        comentario: comentario.comentario,
        fechaComentario: comentario.fechaComentario,
        estado: comentario.estado,
        createdAt: comentario.createdAt,
        updatedAt: comentario.updatedAt,
    };
}
async function obtenerComentariosPorProducto(productoId) {
    const comentarios = await prismaClient_1.default.comentarios.findMany({
        where: { idProducto: productoId },
        orderBy: { fechaComentario: 'desc' },
    });
    return comentarios.map(mapComentarioToDTO);
}
async function crearComentario(idUsuario, idProducto, comentario) {
    const nuevo = await prismaClient_1.default.comentarios.create({
        data: {
            idUsuario,
            idProducto,
            comentario,
            fechaComentario: new Date(),
            estado: 'pendiente',
        },
    });
    await (0, comentarioProducto_service_1.notificarComentarioProducto)(nuevo.idComentario);
    return mapComentarioToDTO(nuevo);
}
async function actualizarComentario(idComentario, nuevoTexto) {
    const actualizado = await prismaClient_1.default.comentarios.update({
        where: { idComentario },
        data: {
            comentario: nuevoTexto,
            updatedAt: new Date(),
        },
    });
    return mapComentarioToDTO(actualizado);
}
async function eliminarComentario(idComentario) {
    await prismaClient_1.default.comentarios.delete({
        where: { idComentario },
    });
    return { mensaje: 'Comentario eliminado' };
}
