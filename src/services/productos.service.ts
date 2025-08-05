import prisma from '../utils/prismaClient';
import { ProductosDTO } from '../models/ProductosDTO';
import { EstadoProducto } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import { TipoUsuario } from '@prisma/client'; // 👈 Asegúrate de importar esto

// Obtener productos con filtros
export const getAllProductos = async (filters: any): Promise<any[]> => {
  const where: any = {};

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
    where.estado = filters.estado as EstadoProducto;
  } else {
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

  return await prisma.productos.findMany({
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

// Obtener producto por ID
export async function getProductoById(id: number) {
  return await prisma.productos.findUnique({
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
export async function getCategoriasUnicas(tipoUsuario: string): Promise<string[]> {
  try {
    const categorias = await prisma.productos.findMany({
      select: {
        categoria: true,
      },
      distinct: ['categoria'],
      where: {
        categoria: { not: null },
        usuario: {
          tipoUsuario: tipoUsuario.toUpperCase() as TipoUsuario,
        },
      },
    });

    return categorias
      .map((c) => c.categoria)
      .filter((c): c is string => c !== null);
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    throw error;
  }
}

// Aquí pones la nueva función 👇
export async function getCantidadPorCategoria() {
  return await prisma.productos.groupBy({
    by: ['categoria'],
    _count: { id: true },
    where: {
      eliminadoEn: null, // opcional: solo productos no eliminados
    },
  });
}

// Obtener productos por categoría
export async function getProductosPorCategoria(categoria: string) {
  try {
    return await prisma.productos.findMany({
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
  } catch (error) {
    console.error("Error al obtener productos por categoría:", error);
    throw error;
  }
}

// Devuelve los nombres de los productos del usuario
export async function obtenerNombresProductosUsuario(idUsuario: number): Promise<string[]> {
  const productos = await prisma.productos.findMany({
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

export async function getCantidadPorRangoPrecio() {
  const resultados = await prisma.productos.findMany({
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
    } else if (precio <= 100000) {
      rangos["50mil - 100mil"]++;
    } else if (precio <= 200000) {
      rangos["100mil - 200mil"]++;
    } else {
      rangos["Más de 200mil"]++;
    }
  }

  return rangos;
}

// Función para subir imagen a Cloudinary
export const subirImagenCloudinary = async (imagenBase64: string): Promise<string> => {
  try {
    const uploadResult = await cloudinary.uploader.upload(imagenBase64, {
      folder: "productos",
      public_id: `${Date.now()}`,
      resource_type: "image",
    });
    return uploadResult.secure_url;
  } catch (error) {
    console.error("Error al subir imagen a Cloudinary:", error);
    throw new Error("No se pudo subir la imagen.");
  }
};

// Crear producto con conversiones de tipo
export async function createProducto(data: ProductosDTO) {
  try {
    const nuevoProducto = await prisma.productos.create({
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
    const usuario = await prisma.users.findUnique({
      where: { idUsuario: data.usuarioId },
      select: { tipoUsuario: true },
    });

    const tipo = usuario?.tipoUsuario?.toLowerCase() || 'empresarial';
    const cantidadMinima = tipo === 'individual' ? 2 : 30;

    // Crear recordatorio con cantidad mínima según tipo de usuario
    await prisma.recorStock.create({
      data: {
        productoId: nuevoProducto.id,
        cantidadMinima,
        estado: "PENDIENTE",
        fechaRecordatorio: new Date(),
      },
    });

    return nuevoProducto;
  } catch (error) {
    console.error("Error al crear el producto:", error);
    throw error;
  }
}

// Actualizar producto
export async function updateProducto(id: number, data: Partial<ProductosDTO>) {
  const producto = await prisma.productos.findUnique({
    where: { id: id },
  });

  if (!producto) throw new Error("Producto no encontrado");

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
            await cloudinary.uploader.destroy(publicId);
          } catch (error) {
            console.error("Error eliminando imagen antigua:", error);
          }
        }
      }
    }
    imagenUrl = await subirImagenCloudinary(data.imagen);
  }

  return await prisma.productos.update({
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
export async function obtenerProductoPorId(id: number) {
  return await prisma.productos.findUnique({
    where: { id },
    include: {
      usuario: true,
    },
  });
}


// Eliminar
export async function deleteProducto(id: number) {
  const producto = await prisma.productos.findUnique({ where: { id } });

  if (!producto) throw new Error("Producto no encontrado");

  if (producto.imagen) {
    const parts = producto.imagen.split('/upload/');
    if (parts.length > 1) {
      const pathWithExt = parts[1];
      const publicId = pathWithExt.replace(/\.[^/.]+$/, "");
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.error("⚠️ Error eliminando imagen:", error);
      }
    }
  }

  await prisma.productos.update({
    where: { id },
    data: {
      estado: "ELIMINADO",
      eliminadoEn: new Date()
    }
  });
}