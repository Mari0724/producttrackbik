import prisma from '../utils/prismaClient'; // cliente separado
import { v2 as cloudinary } from 'cloudinary';
import { UserDTO } from "../models/UserDTO";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

// Obtener 
export async function getAllUsers(filters: Partial<UserDTO>) {
  return await prisma.users.findMany({
    where: {
      ...(filters.username && { username: { contains: filters.username, mode: 'insensitive' } }),
      ...(filters.correo && { correo: { contains: filters.correo, mode: 'insensitive' } }),
      ...(filters.nombreCompleto && { nombreCompleto: { contains: filters.nombreCompleto, mode: 'insensitive' } }),
      ...(filters.telefono && { telefono: { contains: filters.telefono } }),
      ...(filters.nit && { nit: { contains: filters.nit } }),
      ...(filters.estado && { estado: filters.estado }),
      ...(filters.rol && { rol: filters.rol }),
      ...(filters.tipoUsuario && { tipoUsuario: filters.tipoUsuario }),
      ...(filters.rolEquipo && { rolEquipo: filters.rolEquipo }),
    },
  });
}

// Obtener un usuario por ID
export async function getUserById(id: number) {
  return await prisma.users.findUnique({
    where: { idUsuario: id },
  });
}

// Crear usuario
export async function createUser(data: UserDTO) {
  if (data.rol === "USUARIO" && !data.tipoUsuario) {
    throw new Error("El tipoUsuario es obligatorio para rol USUARIO");
  }

  if (data.rol === "EQUIPO") {
    if (!data.empresaId) {
      throw new Error("empresaId es obligatorio para rol EQUIPO");
    }

    const empresa = await prisma.users.findUnique({
      where: { idUsuario: data.empresaId },
    });

    if (!empresa || empresa.tipoUsuario !== "EMPRESARIAL") {
      throw new Error("La empresa especificada no existe o no es de tipo EMPRESARIAL");
    }
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  // Construir los datos del nuevo usuario manualmente
  const userData: any = {
    username: data.username,
    password: hashedPassword,
    correo: data.correo,
    nombreCompleto: data.nombreCompleto,
    estado: "activo",
    rol: data.rol,
  };

  if (data.telefono) userData.telefono = data.telefono;
  if (data.direccion) userData.direccion = data.direccion;
  if (data.nit) userData.nit = data.nit;
  if (data.tipoUsuario) userData.tipoUsuario = data.tipoUsuario;
  if (data.rolEquipo) userData.rolEquipo = data.rolEquipo;
  if (data.empresaId) userData.empresaId = data.empresaId;
  if (data.fotoPerfil) userData.fotoPerfil = data.fotoPerfil;
  if (data.nombreEmpresa) userData.nombreEmpresa = data.nombreEmpresa;
  if (typeof data.perfilCompleto === 'boolean') { userData.perfilCompleto = data.perfilCompleto; }

  const newUser = await prisma.users.create({ data: userData });

  const token = jwt.sign(
    {
      id: newUser.idUsuario,
      username: newUser.username,
      correo: newUser.correo,
      rol: newUser.rol,
      tipoUsuario: newUser.tipoUsuario,
      rolEquipo: newUser.rolEquipo,
      perfilCompleto: newUser.perfilCompleto,
      empresaId: newUser.empresaId
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  return { user: newUser, token };
}

// Obtener una empresa por ID
export async function getEmpresaById(id: number) {
  const empresa = await prisma.users.findUnique({
    where: { idUsuario: id },
  });

  if (!empresa) {
    throw new Error("Empresa no encontrada");
  }

  if (empresa.tipoUsuario !== "EMPRESARIAL") {
    throw new Error("El usuario no es de tipo EMPRESARIAL");
  }

  return empresa;
}

// Actualizar usuario
export async function updateUser(id: number, data: Partial<UserDTO>) {
  const user = await prisma.users.findUnique({
    where: { idUsuario: id },
  });

  if (!user) throw new Error("Usuario no encontrado");

  // No permitir cambiar el rol
  if (data.rol && data.rol !== user.rol) {
    throw new Error("No está permitido cambiar el rol del usuario.");
  }

  // Encriptar la nueva contraseña si viene en la solicitud
  if (data.password) {
    const saltRounds = 10;
    data.password = await bcrypt.hash(data.password, saltRounds);
  }

  // Si hay una nueva fotoPerfil y la antigua existe, eliminarla de Cloudinary
  if (data.fotoPerfil && user.fotoPerfil) {
    const oldUrl = user.fotoPerfil;
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

  // Finalmente actualizamos el usuario
  return await prisma.users.update({
    where: { idUsuario: id },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  });
}

// Cambiar contraseña de un usuario
export async function changeUserPassword(id: number, currentPassword: string, newPassword: string) {
  const user = await prisma.users.findUnique({
    where: { idUsuario: id },
  });

  if (!user) {
    throw new Error("Usuario no encontrado");
  }
  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    throw new Error("La contraseña actual es incorrecta");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.users.update({
    where: { idUsuario: id },
    data: {
      password: hashedPassword,
      updatedAt: new Date(),
    },
  });

  return { message: "Contraseña actualizada correctamente" };
}

// Reactivar usuario
export async function reactivarUsuario(id: number) {
  const user = await prisma.users.findUnique({
    where: { idUsuario: id },
  });

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  // Solo reactiva si está inactivo o eliminado
  if (user.estado === "activo") {
    throw new Error("El usuario ya está activo");
  }

  return await prisma.users.update({
    where: { idUsuario: id },
    data: {
      estado: "activo",
      deletedAt: null,
      updatedAt: new Date(),
    },
  });
}

// Eliminar usuario
export async function deleteUser(id: number) {
  const user = await prisma.users.findUnique({
    where: { idUsuario: id },
  });

  if (!user) throw new Error("Usuario no encontrado");

  // Si el usuario es una empresa, inactivar a su equipo
  if (user.rol === "USUARIO" && user.tipoUsuario === "EMPRESARIAL") {
    await prisma.users.updateMany({
      where: {
        empresaId: user.idUsuario,
        rol: "EQUIPO",
        estado: "activo",
      },
      data: {
        estado: "inactivo",
        updatedAt: new Date(),
      },
    });
  }

  return await prisma.users.update({
    where: { idUsuario: id },
    data: {
      deletedAt: new Date(),
      estado: "inactivo",
      updatedAt: new Date(),
    },
  });
}