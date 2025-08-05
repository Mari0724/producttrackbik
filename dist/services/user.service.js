"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
exports.createUser = createUser;
exports.getEmpresaById = getEmpresaById;
exports.updateUser = updateUser;
exports.changeUserPassword = changeUserPassword;
exports.reactivarUsuario = reactivarUsuario;
exports.deleteUser = deleteUser;
const prismaClient_1 = __importDefault(require("../utils/prismaClient")); // cliente separado
const cloudinary_1 = require("cloudinary");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
// Obtener 
async function getAllUsers(filters) {
    return await prismaClient_1.default.users.findMany({
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
async function getUserById(id) {
    return await prismaClient_1.default.users.findUnique({
        where: { idUsuario: id },
    });
}
// Crear usuario
async function createUser(data) {
    if (data.rol === "USUARIO" && !data.tipoUsuario) {
        throw new Error("El tipoUsuario es obligatorio para rol USUARIO");
    }
    if (data.rol === "EQUIPO") {
        if (!data.empresaId) {
            throw new Error("empresaId es obligatorio para rol EQUIPO");
        }
        const empresa = await prismaClient_1.default.users.findUnique({
            where: { idUsuario: data.empresaId },
        });
        if (!empresa || empresa.tipoUsuario !== "EMPRESARIAL") {
            throw new Error("La empresa especificada no existe o no es de tipo EMPRESARIAL");
        }
    }
    const hashedPassword = await bcryptjs_1.default.hash(data.password, 10);
    // Construir los datos del nuevo usuario manualmente
    const userData = {
        username: data.username,
        password: hashedPassword,
        correo: data.correo,
        nombreCompleto: data.nombreCompleto,
        estado: "activo",
        rol: data.rol,
    };
    if (data.telefono)
        userData.telefono = data.telefono;
    if (data.direccion)
        userData.direccion = data.direccion;
    if (data.nit)
        userData.nit = data.nit;
    if (data.tipoUsuario)
        userData.tipoUsuario = data.tipoUsuario;
    if (data.rolEquipo)
        userData.rolEquipo = data.rolEquipo;
    if (data.empresaId)
        userData.empresaId = data.empresaId;
    if (data.fotoPerfil)
        userData.fotoPerfil = data.fotoPerfil;
    if (data.nombreEmpresa)
        userData.nombreEmpresa = data.nombreEmpresa;
    if (typeof data.perfilCompleto === 'boolean') {
        userData.perfilCompleto = data.perfilCompleto;
    }
    const newUser = await prismaClient_1.default.users.create({ data: userData });
    const token = jsonwebtoken_1.default.sign({
        id: newUser.idUsuario,
        username: newUser.username,
        correo: newUser.correo,
        rol: newUser.rol,
        tipoUsuario: newUser.tipoUsuario,
        rolEquipo: newUser.rolEquipo,
        perfilCompleto: newUser.perfilCompleto,
        empresaId: newUser.empresaId
    }, JWT_SECRET, { expiresIn: '24h' });
    return { user: newUser, token };
}
// Obtener una empresa por ID
async function getEmpresaById(id) {
    const empresa = await prismaClient_1.default.users.findUnique({
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
async function updateUser(id, data) {
    const user = await prismaClient_1.default.users.findUnique({
        where: { idUsuario: id },
    });
    if (!user)
        throw new Error("Usuario no encontrado");
    // No permitir cambiar el rol
    if (data.rol && data.rol !== user.rol) {
        throw new Error("No está permitido cambiar el rol del usuario.");
    }
    // Encriptar la nueva contraseña si viene en la solicitud
    if (data.password) {
        const saltRounds = 10;
        data.password = await bcryptjs_1.default.hash(data.password, saltRounds);
    }
    // Si hay una nueva fotoPerfil y la antigua existe, eliminarla de Cloudinary
    if (data.fotoPerfil && user.fotoPerfil) {
        const oldUrl = user.fotoPerfil;
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
    // Finalmente actualizamos el usuario
    return await prismaClient_1.default.users.update({
        where: { idUsuario: id },
        data: {
            ...data,
            updatedAt: new Date(),
        },
    });
}
// Cambiar contraseña de un usuario
async function changeUserPassword(id, currentPassword, newPassword) {
    const user = await prismaClient_1.default.users.findUnique({
        where: { idUsuario: id },
    });
    if (!user) {
        throw new Error("Usuario no encontrado");
    }
    const isPasswordValid = await bcryptjs_1.default.compare(currentPassword, user.password);
    if (!isPasswordValid) {
        throw new Error("La contraseña actual es incorrecta");
    }
    const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
    await prismaClient_1.default.users.update({
        where: { idUsuario: id },
        data: {
            password: hashedPassword,
            updatedAt: new Date(),
        },
    });
    return { message: "Contraseña actualizada correctamente" };
}
// Reactivar usuario
async function reactivarUsuario(id) {
    const user = await prismaClient_1.default.users.findUnique({
        where: { idUsuario: id },
    });
    if (!user) {
        throw new Error("Usuario no encontrado");
    }
    // Solo reactiva si está inactivo o eliminado
    if (user.estado === "activo") {
        throw new Error("El usuario ya está activo");
    }
    return await prismaClient_1.default.users.update({
        where: { idUsuario: id },
        data: {
            estado: "activo",
            deletedAt: null,
            updatedAt: new Date(),
        },
    });
}
// Eliminar usuario
async function deleteUser(id) {
    const user = await prismaClient_1.default.users.findUnique({
        where: { idUsuario: id },
    });
    if (!user)
        throw new Error("Usuario no encontrado");
    // Si el usuario es una empresa, inactivar a su equipo
    if (user.rol === "USUARIO" && user.tipoUsuario === "EMPRESARIAL") {
        await prismaClient_1.default.users.updateMany({
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
    return await prismaClient_1.default.users.update({
        where: { idUsuario: id },
        data: {
            deletedAt: new Date(),
            estado: "inactivo",
            updatedAt: new Date(),
        },
    });
}
