"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificarProductoVencido = notificarProductoVencido;
const prismaClient_1 = __importDefault(require("../../utils/prismaClient"));
const client_1 = require("@prisma/client");
const preferenciasNotificaciones_1 = require("../../utils/notificaciones/preferenciasNotificaciones");
/**
 * Envía notificaciones de productos vencidos.
 * Si se proporcionan productos, solo evalúa esos.
 */
async function notificarProductoVencido(productosOpcionales) {
    const hoy = new Date();
    let productosConUsuario = [];
    if (productosOpcionales && productosOpcionales.length > 0) {
        productosConUsuario = await prismaClient_1.default.productos.findMany({
            where: {
                id: { in: productosOpcionales.map(p => p.id) },
                fechaVencimiento: { lt: hoy },
                eliminadoEn: null,
            },
            include: {
                usuario: true,
            },
        });
    }
    else {
        productosConUsuario = await prismaClient_1.default.productos.findMany({
            where: {
                fechaVencimiento: { lt: hoy },
                eliminadoEn: null,
            },
            include: {
                usuario: true,
            },
        });
    }
    for (const producto of productosConUsuario) {
        const usuario = producto.usuario;
        const titulo = `Producto vencido: ${producto.nombre}`;
        const mensaje = `El producto "${producto.nombre}" ha vencido el ${producto.fechaVencimiento?.toLocaleDateString()}.`;
        if (usuario.tipoUsuario === 'INDIVIDUAL') {
            if (await (0, preferenciasNotificaciones_1.puedeNotificar)(usuario.idUsuario, 'PRODUCTO_VENCIDO')) {
                await prismaClient_1.default.notificaciones.create({
                    data: {
                        idUsuario: usuario.idUsuario,
                        tipo: client_1.TipoNotificacion.PRODUCTO_VENCIDO,
                        titulo,
                        mensaje,
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
                if (await (0, preferenciasNotificaciones_1.puedeNotificar)(miembro.idUsuario, 'PRODUCTO_VENCIDO')) {
                    await prismaClient_1.default.notificaciones.create({
                        data: {
                            idUsuario: miembro.idUsuario,
                            tipo: client_1.TipoNotificacion.PRODUCTO_VENCIDO,
                            titulo,
                            mensaje,
                        },
                    });
                }
            }
        }
    }
}
