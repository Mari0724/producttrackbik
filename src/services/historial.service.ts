import prisma from "../utils/prismaClient";
import { HistorialInventarioDTO } from "../types/historial";

export async function obtenerHistorialInventario(idUsuario: number): Promise<HistorialInventarioDTO[]> {
    const usuario = await prisma.users.findUnique({
        where: { idUsuario },
        select: {
            tipoUsuario: true,
            empresaId: true,
        },
    });

    if (!usuario) return [];

    let productosIds: number[] = [];

    if (usuario.tipoUsuario === "INDIVIDUAL") {
        const productos = await prisma.productos.findMany({
            where: { usuarioId: idUsuario },
            select: { id: true },
        });
        productosIds = productos.map((p) => p.id);
    } else if (usuario.tipoUsuario === "EMPRESARIAL") {
        // Validación de empresaId por si está nulo
        const empresaId = usuario.empresaId ?? idUsuario;

        const productos = await prisma.productos.findMany({
            where: {
                usuario: {
                    empresaId: empresaId,
                },
            },
            select: { id: true },
        });
        productosIds = productos.map((p) => p.id);
    }

    if (productosIds.length === 0) return [];

    const historial = await prisma.histInv.findMany({
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