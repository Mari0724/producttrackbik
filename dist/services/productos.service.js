"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subirImagenCloudinary = exports.getAllProductos = void 0;
exports.getProductoById = getProductoById;
exports.getCategoriasUnicas = getCategoriasUnicas;
exports.getCantidadPorCategoria = getCantidadPorCategoria;
exports.getProductosPorCategoria = getProductosPorCategoria;
exports.obtenerNombresProductosUsuario = obtenerNombresProductosUsuario;
exports.getCantidadPorRangoPrecio = getCantidadPorRangoPrecio;
exports.createProducto = createProducto;
exports.updateProducto = updateProducto;
exports.obtenerProductoPorId = obtenerProductoPorId;
exports.deleteProducto = deleteProducto;
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
const cloudinary_1 = require("cloudinary");
// Obtener productos con filtros
const getAllProductos = async (filters) => {
    const where = {};
    // Filtrar por ID del producto
    if (filters.productoId) {
        where.id = Number(filters.productoId);
    }
    // Filtrar por nombre (búsqueda parcial)
    if (filters.nombre) {
        where.nombre = {
            contains: filters.nombre,
            mode: "insensitive",
        };
    }
    // Filtrar por categoría (búsqueda parcial)
    if (filters.categoria) {
        where.categoria = {
            contains: filters.categoria,
            mode: "insensitive",
        };
    }
    // Filtrar por estado
    if (filters.estado) {
        where.estado = filters.estado;
    }
    else {
        where.estado = { not: "ELIMINADO" };
    }
    // Filtrar por usuarioId
    if (filters.usuarioId) {
        where.usuarioId = Number(filters.usuarioId);
    }
    // Rango de fecha de adquisición
    if (filters.fechaAdquisicionDesde || filters.fechaAdquisicionHasta) {
        where.fechaAdquisicion = {
            ...(filters.fechaAdquisicionDesde && {
                gte: new Date(filters.fechaAdquisicionDesde),
            }),
            ...(filters.fechaAdquisicionHasta && {
                lte: new Date(filters.fechaAdquisicionHasta),
            }),
        };
    }
    // Rango de fecha de vencimiento
    if (filters.fechaVencimientoDesde || filters.fechaVencimientoHasta) {
        where.fechaVencimiento = {
            ...(filters.fechaVencimientoDesde && {
                gte: new Date(filters.fechaVencimientoDesde),
            }),
            ...(filters.fechaVencimientoHasta && {
                lte: new Date(filters.fechaVencimientoHasta),
            }),
        };
    }
    return await prismaClient_1.default.productos.findMany({
        where,
        orderBy: {
            fechaAdquisicion: "desc",
        },
        include: {
            usuario: {
                select: {
                    idUsuario: true,
                    tipoUsuario: true,
                    empresaId: true,
                },
            },
        },
    });
};
exports.getAllProductos = getAllProductos;
// Obtener producto por ID
async function getProductoById(id) {
    return await prismaClient_1.default.productos.findUnique({
        where: { id: id },
        include: {
            usuario: {
                select: {
                    tipoUsuario: true,
                },
            },
        },
    });
}
// Obtener categorías únicas
async function getCategoriasUnicas(tipoUsuario) {
    try {
        const categorias = await prismaClient_1.default.productos.findMany({
            select: {
                categoria: true,
            },
            distinct: ['categoria'],
            where: {
                categoria: { not: null },
                usuario: {
                    tipoUsuario: tipoUsuario.toUpperCase(),
                },
            },
        });
        return categorias
            .map((c) => c.categoria)
            .filter((c) => c !== null);
    }
    catch (error) {
        console.error("Error al obtener categorías:", error);
        throw error;
    }
}
// Aquí pones la nueva función 👇
async function getCantidadPorCategoria() {
    return await prismaClient_1.default.productos.groupBy({
        by: ['categoria'],
        _count: { id: true },
        where: {
            eliminadoEn: null, // opcional: solo productos no eliminados
        },
    });
}
// Obtener productos por categoría
async function getProductosPorCategoria(categoria) {
    try {
        return await prismaClient_1.default.productos.findMany({
            where: {
                categoria: {
                    equals: categoria,
                    mode: "insensitive",
                },
            },
            include: {
                usuario: {
                    select: {
                        tipoUsuario: true,
                    },
                },
            },
        });
    }
    catch (error) {
        console.error("Error al obtener productos por categoría:", error);
        throw error;
    }
}
// Devuelve los nombres de los productos del usuario
async function obtenerNombresProductosUsuario(idUsuario) {
    const productos = await prismaClient_1.default.productos.findMany({
        where: {
            usuario: {
                idUsuario: idUsuario,
            },
            eliminadoEn: null,
        },
        select: {
            nombre: true,
        },
    });
    return productos.map(p => p.nombre);
}
async function getCantidadPorRangoPrecio() {
    const resultados = await prismaClient_1.default.productos.findMany({
        select: { precio: true },
        where: { eliminadoEn: null },
    });
    const rangos = {
        "Menos de 50mil": 0,
        "50mil - 100mil": 0,
        "100mil - 200mil": 0,
        "Más de 200mil": 0,
    };
    for (const producto of resultados) {
        const precio = Number(producto.precio);
        if (precio < 50000) {
            rangos["Menos de 50mil"]++;
        }
        else if (precio <= 100000) {
            rangos["50mil - 100mil"]++;
        }
        else if (precio <= 200000) {
            rangos["100mil - 200mil"]++;
        }
        else {
            rangos["Más de 200mil"]++;
        }
    }
    return rangos;
}
// Función para subir imagen a Cloudinary
const subirImagenCloudinary = async (imagenBase64) => {
    try {
        const uploadResult = await cloudinary_1.v2.uploader.upload(imagenBase64, {
            folder: "productos",
            public_id: `${Date.now()}`,
            resource_type: "image",
        });
        return uploadResult.secure_url;
    }
    catch (error) {
        console.error("Error al subir imagen a Cloudinary:", error);
        throw new Error("No se pudo subir la imagen.");
    }
};
exports.subirImagenCloudinary = subirImagenCloudinary;
// Crear producto con conversiones de tipo
async function createProducto(data) {
    try {
        const nuevoProducto = await prismaClient_1.default.productos.create({
            data: {
                codigoBarras: data.codigoBarras ?? null,
                codigoQR: data.codigoQR ?? null,
                nombre: data.nombre,
                descripcion: data.descripcion,
                cantidad: data.cantidad,
                precio: data.precio,
                fechaAdquisicion: new Date(data.fechaAdquisicion),
                fechaVencimiento: new Date(data.fechaVencimiento),
                usuarioId: data.usuarioId,
                estado: data.estado,
                imagen: data.imagen,
                categoria: data.categoria,
            },
        });
        // Obtener el tipo de usuario para determinar la cantidad mínima
        const usuario = await prismaClient_1.default.users.findUnique({
            where: { idUsuario: data.usuarioId },
            select: { tipoUsuario: true },
        });
        const tipo = usuario?.tipoUsuario?.toLowerCase() || 'empresarial';
        const cantidadMinima = tipo === 'individual' ? 2 : 30;
        // Crear recordatorio con cantidad mínima según tipo de usuario
        await prismaClient_1.default.recorStock.create({
            data: {
                productoId: nuevoProducto.id,
                cantidadMinima,
                estado: "PENDIENTE",
                fechaRecordatorio: new Date(),
            },
        });
        return nuevoProducto;
    }
    catch (error) {
        console.error("Error al crear el producto:", error);
        throw error;
    }
}
// Actualizar producto
async function updateProducto(id, data) {
    const producto = await prismaClient_1.default.productos.findUnique({
        where: { id: id },
    });
    if (!producto)
        throw new Error("Producto no encontrado");
    let imagenUrl = producto.imagen;
    if (data.imagen && data.imagen !== producto.imagen) {
        const yaEsUrlDeCloudinary = data.imagen.startsWith("http") && data.imagen.includes("res.cloudinary.com");
        if (!yaEsUrlDeCloudinary) {
            if (producto.imagen) {
                const oldUrl = producto.imagen;
                const parts = oldUrl.split('/upload/');
                if (parts.length > 1) {
                    const pathWithExt = parts[1];
                    const publicId = pathWithExt.replace(/\.[^/.]+$/, "");
                    try {
                        await cloudinary_1.v2.uploader.destroy(publicId);
                    }
                    catch (error) {
                        console.error("Error eliminando imagen antigua:", error);
                    }
                }
            }
        }
        imagenUrl = await (0, exports.subirImagenCloudinary)(data.imagen);
    }
    return await prismaClient_1.default.productos.update({
        where: { id: id },
        data: {
            ...(data.precio !== undefined && { precio: data.precio }),
            ...(data.fechaAdquisicion && { fechaAdquisicion: new Date(data.fechaAdquisicion) }),
            ...(data.fechaVencimiento && { fechaVencimiento: new Date(data.fechaVencimiento) }),
            ...(data.nombre && { nombre: data.nombre }),
            ...(data.descripcion && { descripcion: data.descripcion }),
            ...(data.cantidad && { cantidad: data.cantidad }),
            ...(data.usuarioId && { usuarioId: data.usuarioId }),
            ...(data.estado && { estado: data.estado }),
            ...(data.codigoBarras !== undefined && { codigoBarras: data.codigoBarras }),
            ...(data.codigoQR !== undefined && { codigoQR: data.codigoQR }),
            ...(data.imagen && { imagen: imagenUrl }),
            ...(data.categoria && { categoria: data.categoria }),
            updatedAt: new Date(),
        },
    });
}
// Obtener producto por ID (para validar dueño)
async function obtenerProductoPorId(id) {
    return await prismaClient_1.default.productos.findUnique({
        where: { id },
        include: {
            usuario: true,
        },
    });
}
// Eliminar
async function deleteProducto(id) {
    const producto = await prismaClient_1.default.productos.findUnique({ where: { id } });
    if (!producto)
        throw new Error("Producto no encontrado");
    if (producto.imagen) {
        const parts = producto.imagen.split('/upload/');
        if (parts.length > 1) {
            const pathWithExt = parts[1];
            const publicId = pathWithExt.replace(/\.[^/.]+$/, "");
            try {
                await cloudinary_1.v2.uploader.destroy(publicId);
            }
            catch (error) {
                console.error("⚠️ Error eliminando imagen:", error);
            }
        }
    }
    await prismaClient_1.default.productos.update({
        where: { id },
        data: {
            estado: "ELIMINADO",
            eliminadoEn: new Date()
        }
    });
}
