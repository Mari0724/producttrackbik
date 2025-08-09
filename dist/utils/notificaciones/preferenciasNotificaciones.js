"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.puedeNotificar = puedeNotificar;
const prismaClient_1 = __importDefault(require("../prismaClient"));
const TIPOS_VALIDOS = [
    'STOCK_BAJO',
    'PRODUCTO_VENCIDO',
    'COMENTARIO_EQUIPO',
    'REPOSICION_RECOMENDADA',
    'ACTUALIZACION_APP',
];
async function puedeNotificar(idUsuario, tipo) {
    const prefs = await prismaClient_1.default.preferenciasNotificaciones.findUnique({
        where: { idUsuario },
    });
    if (!prefs)
        return true;
    const tipoNormalizado = tipo.toUpperCase();
    if (!TIPOS_VALIDOS.includes(tipoNormalizado)) {
        return true;
    }
    const mapa = {
        STOCK_BAJO: prefs.stockBajo,
        PRODUCTO_VENCIDO: prefs.productoVencido,
        COMENTARIO_EQUIPO: prefs.comentarios,
        REPOSICION_RECOMENDADA: prefs.reposicion,
        ACTUALIZACION_APP: prefs.actualizacion,
    };
    return mapa[tipoNormalizado];
}
