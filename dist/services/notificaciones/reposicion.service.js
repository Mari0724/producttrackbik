"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificarReposicionRecomendada = notificarReposicionRecomendada;
const prismaClient_1 = __importDefault(require("../../utils/prismaClient"));
const client_1 = require("@prisma/client");
const preferenciasNotificaciones_1 = require("../../utils/notificaciones/preferenciasNotificaciones");
async function notificarReposicionRecomendada(productosOpcionales) {
    let recordatorios = [];
    if (productosOpcionales?.length) {
        recordatorios = await prismaClient_1.default.recorStock.findMany({
            where: {
                productoId: { in: productosOpcionales.map((p) => p.id) },
            },
            include: {
                producto: { include: { usuario: true } },
            },
        });
    }
    else {
        recordatorios = await prismaClient_1.default.recorStock.findMany({
            include: {
                producto: { include: { usuario: true } },
            },
        });
    }
    for (const recordatorio of recordatorios) {
        const { producto } = recordatorio;
        const { usuario } = producto;
        const cantidadActual = producto.cantidad;
        const cantidadMinima = recordatorio.cantidadMinima;
        const umbralCritico = Math.min(8, Math.floor(cantidadMinima / 8));
        if (cantidadActual <= umbralCritico)
            continue;
        if (cantidadActual >= cantidadMinima)
            continue;
        const titulo = `Reposición recomendada: ${producto.nombre}`;
        const mensaje = `El producto "${producto.nombre}" tiene ${cantidadActual} unidades, por debajo del mínimo recomendado (${cantidadMinima}).`;
        if (usuario.tipoUsuario === 'INDIVIDUAL') {
            if (await (0, preferenciasNotificaciones_1.puedeNotificar)(usuario.idUsuario, 'REPOSICION_RECOMENDADA')) {
                await prismaClient_1.default.notificaciones.create({
                    data: {
                        idUsuario: usuario.idUsuario,
                        tipo: client_1.TipoNotificacion.REPOSICION_RECOMENDADA,
                        titulo,
                        mensaje,
                        fechaEnvio: new Date(),
                    },
                });
            }
            continue;
        }
        if (usuario.tipoUsuario === 'EMPRESARIAL' && usuario.empresaId) {
            const miembros = await prismaClient_1.default.users.findMany({
                where: { empresaId: usuario.empresaId },
            });
            for (const miembro of miembros) {
                if (await (0, preferenciasNotificaciones_1.puedeNotificar)(miembro.idUsuario, 'REPOSICION_RECOMENDADA')) {
                    await prismaClient_1.default.notificaciones.create({
                        data: {
                            idUsuario: miembro.idUsuario,
                            tipo: client_1.TipoNotificacion.REPOSICION_RECOMENDADA,
                            titulo,
                            mensaje,
                            fechaEnvio: new Date(),
                        },
                    });
                }
            }
        }
    }
}
