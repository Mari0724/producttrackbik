"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerHistorialInventario = obtenerHistorialInventario;
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
async function obtenerHistorialInventario(idUsuario) {
    const usuario = await prismaClient_1.default.users.findUnique({
        where: { idUsuario },
        select: {
            tipoUsuario: true,
            empresaId: true,
        },
    });
    if (!usuario)
        return [];
    let productosIds = [];
    if (usuario.tipoUsuario === "INDIVIDUAL") {
        const productos = await prismaClient_1.default.productos.findMany({
            where: { usuarioId: idUsuario },
            select: { id: true },
        });
        productosIds = productos.map((p) => p.id);
    }
    else if (usuario.tipoUsuario === "EMPRESARIAL") {
        // Validación de empresaId por si está nulo
        const empresaId = usuario.empresaId ?? idUsuario;
        const productos = await prismaClient_1.default.productos.findMany({
            where: {
                usuario: {
                    empresaId: empresaId,
                },
            },
            select: { id: true },
        });
        productosIds = productos.map((p) => p.id);
    }
    if (productosIds.length === 0)
        return [];
    const historial = await prismaClient_1.default.histInv.findMany({
        where: {
            productoId: { in: productosIds },
        },
        include: {
            producto: {
                select: {
                    nombre: true,
                },
            },
        },
        orderBy: {
            fechaCambio: "desc",
        },
    });
    return historial.map((h) => ({
        id: h.id,
        productoId: h.productoId,
        nombreProducto: h.producto.nombre,
        accion: h.accion,
        cantidad_anterior: h.cantidad_anterior,
        cantidad_nueva: h.cantidad_nueva,
        precio_anterior: Number(h.precio_anterior),
        precio_nuevo: Number(h.precio_nuevo),
        fechaCambio: h.fechaCambio,
    }));
}
