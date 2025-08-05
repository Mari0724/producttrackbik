"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.actualizarPreferencias = actualizarPreferencias;
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
async function actualizarPreferencias(idUsuario, data) {
    const existentes = await prismaClient_1.default.preferenciasNotificaciones.findUnique({
        where: { idUsuario }
    });
    if (existentes) {
        return prismaClient_1.default.preferenciasNotificaciones.update({
            where: { idUsuario },
            data
        });
    }
    else {
        return prismaClient_1.default.preferenciasNotificaciones.create({
            data: {
                idUsuario,
                stockBajo: data.stockBajo ?? true,
                productoVencido: data.productoVencido ?? true,
                comentarios: data.comentarios ?? true,
                reposicion: data.reposicion ?? true,
                actualizacion: data.actualizacion ?? true
            }
        });
    }
}
