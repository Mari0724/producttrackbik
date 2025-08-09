"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarCredenciales = exports.LogService = void 0;
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
const token_1 = require("../config/token");
const crypto_1 = require("crypto");
const email_service_1 = require("./email.service");
class LogService {
    async login(correo, password) {
        const user = await prismaClient_1.default.users.findUnique({
            where: { correo },
        });
        if (!user)
            throw new Error("Usuario no encontrado");
        const passwordValido = await (0, bcryptjs_1.compare)(password, user.password);
        if (!passwordValido)
            throw new Error("Contraseña incorrecta");
        // Generar token
        const token = jsonwebtoken_1.default.sign({
            id: user.idUsuario,
            rol: user.rol,
            tipoUsuario: user.tipoUsuario,
            rolEquipo: user.rolEquipo,
            perfilCompleto: user.perfilCompleto,
            empresaId: user.tipoUsuario === "EMPRESARIAL" ? user.idUsuario : user.empresaId,
        }, token_1.JWT_SECRET, { expiresIn: token_1.TOKEN_EXPIRES_IN });
        // Verificar si necesita completar perfil
        let requiereCompletarPerfil = false;
        if (user.rol === "EQUIPO") {
            if (!user.telefono || !user.direccion) {
                requiereCompletarPerfil = true;
            }
        }
        const resolvedEmpresaId = user.tipoUsuario === "EMPRESARIAL" ? user.idUsuario : user.empresaId;
        // Solo retornar los datos relevantes del usuario
        return {
            user: {
                idUsuario: user.idUsuario,
                username: user.username,
                correo: user.correo,
                rol: user.rol,
                tipoUsuario: user.tipoUsuario,
                rolEquipo: user.rolEquipo,
                perfilCompleto: user.perfilCompleto,
                empresaId: resolvedEmpresaId,
            },
            token,
            requiereCompletarPerfil,
        };
    }
    async solicitarReset(correo) {
        const usuario = await prismaClient_1.default.users.findUnique({
            where: { correo },
        });
        if (!usuario) {
            throw new Error("No existe una cuenta con ese correo");
        }
        const token = (0, crypto_1.randomBytes)(3).toString("hex"); // 6 caracteres (corto para ingresar manual)
        const ahora = new Date();
        const expiracion = new Date(ahora.getTime() + 15 * 60 * 1000); // 15 minutos
        await prismaClient_1.default.passwordReset.create({
            data: {
                idUsuario: usuario.idUsuario,
                token,
                fechaSolicitud: ahora,
                fechaExpiracion: expiracion,
            },
        });
        await (0, email_service_1.sendPasswordResetEmail)(usuario.correo, token);
        return {
            mensaje: "Solicitud registrada. Revisa tu correo para continuar.",
        };
    }
    async confirmarReset(token, nuevaContrasena) {
        const intento = await prismaClient_1.default.passwordReset.findFirst({
            where: {
                token,
                usado: false,
                fechaExpiracion: { gt: new Date() },
            },
            orderBy: { fechaSolicitud: "desc" },
        });
        if (!intento) {
            throw new Error("Token inválido o expirado");
        }
        const nuevaClaveHasheada = await (0, bcryptjs_1.hash)(nuevaContrasena, 10);
        const resultado = await prismaClient_1.default.$transaction(async (tx) => {
            // Intentamos marcar como usado dentro de la transacción
            const actualizacion = await tx.passwordReset.updateMany({
                where: {
                    idSeguridad: intento.idSeguridad,
                    usado: false,
                },
                data: {
                    usado: true,
                },
            });
            if (actualizacion.count === 0) {
                throw new Error("Este token ya fue utilizado.");
            }
            await tx.users.update({
                where: { idUsuario: intento.idUsuario },
                data: { password: nuevaClaveHasheada },
            });
            return { mensaje: "Contraseña restablecida con éxito." };
        });
        return resultado;
    }
}
exports.LogService = LogService;
const validarCredenciales = async (email, password) => {
    const service = new LogService();
    return await service.login(email, password);
};
exports.validarCredenciales = validarCredenciales;
