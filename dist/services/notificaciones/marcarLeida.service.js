"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.marcarNotificacionComoLeida = marcarNotificacionComoLeida;
const prismaClient_1 = __importDefault(require("../../utils/prismaClient"));
async function marcarNotificacionComoLeida(idNotificacion) {
    await prismaClient_1.default.notificaciones.update({
        where: { idNotificacion },
        data: { leida: true }
    });
}
