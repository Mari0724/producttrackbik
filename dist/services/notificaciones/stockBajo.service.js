"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificarStockBajo = notificarStockBajo;
const prismaClient_1 = __importDefault(require("../../utils/prismaClient"));
const client_1 = require("@prisma/client");
const preferenciasNotificaciones_1 = require("../../utils/notificaciones/preferenciasNotificaciones");
/**
 * Envía notificaciones de stock bajo si el producto está en estado crítico.
 */
async function notificarStockBajo(productosOpcionales) {
    const productosVerificar = productosOpcionales?.length
        ? productosOpcionales
        : null;
    const recordatorios = productosVerificar
        ? await Promise.all(productosVerificar.map((producto) => prismaClient_1.default.recorStock.findFirst({
            where: {
                productoId: producto.id,
                estado: client_1.EstadoRecordatorio.PENDIENTE,
            },
            include: {
                producto: {
                    include: { usuario: true },
                },
            },
        })))
        : await prismaClient_1.default.recorStock.findMany({
            where: { estado: client_1.EstadoRecordatorio.PENDIENTE },
            include: {
                producto: {
                    include: { usuario: true },
                },
            },
        });
    for (const recordatorio of recordatorios) {
        if (!recordatorio || !recordatorio.producto)
            continue;
        const { producto } = recordatorio;
        const { usuario } = producto;
        const cantidadActual = producto.cantidad;
        const cantidadMinima = recordatorio.cantidadMinima;
        const umbralCritico = Math.min(8, Math.floor(cantidadMinima / 8));
        if (cantidadActual > umbralCritico)
            continue;
        const titulo = `Stock bajo: ${producto.nombre}`;
        const mensaje = `El producto "${producto.nombre}" tiene solo ${cantidadActual} unidades disponibles.`;
        if (usuario.tipoUsuario === 'INDIVIDUAL') {
            const permitido = await (0, preferenciasNotificaciones_1.puedeNotificar)(usuario.idUsuario, 'STOCK_BAJO');
            if (!permitido)
                continue;
            await prismaClient_1.default.notificaciones.create({
                data: {
                    idUsuario: usuario.idUsuario,
                    tipo: client_1.TipoNotificacion.STOCK_BAJO,
                    titulo,
                    mensaje,
                    fechaEnvio: new Date(),
                },
            });
        }
        else {
            const miembros = await prismaClient_1.default.users.findMany({
                where: { empresaId: usuario.empresaId },
            });
            for (const miembro of miembros) {
                const permitido = await (0, preferenciasNotificaciones_1.puedeNotificar)(miembro.idUsuario, 'STOCK_BAJO');
                if (!permitido)
                    continue;
                await prismaClient_1.default.notificaciones.create({
                    data: {
                        idUsuario: miembro.idUsuario,
                        tipo: client_1.TipoNotificacion.STOCK_BAJO,
                        titulo,
                        mensaje,
                        fechaEnvio: new Date(),
                    },
                });
            }
        }
        await prismaClient_1.default.recorStock.update({
            where: { idRecordatorio: recordatorio.idRecordatorio },
            data: { estado: client_1.EstadoRecordatorio.ENVIADO },
        });
    }
}
