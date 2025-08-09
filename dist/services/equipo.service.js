"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipoService = void 0;
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
const EquipoModel_1 = require("../models/EquipoModel");
const email_service_1 = require("../services/email.service");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class EquipoService {
    // Crear usuario tipo equipo
    async crearEquipo(data, empresaId) {
        const datosValidados = EquipoModel_1.equipoSchema.parse(data);
        const hashedPassword = await bcryptjs_1.default.hash(datosValidados.password, 10);
        const { empresaId: _omitEmpresaId, ...datosSinEmpresaId } = datosValidados;
        datosSinEmpresaId.perfilCompleto ??= false;
        // 🔍 Buscar nombre real de la empresa
        const empresa = await prismaClient_1.default.users.findUnique({
            where: { idUsuario: empresaId },
        });
        const nuevoEquipo = await prismaClient_1.default.users.create({
            data: {
                ...datosSinEmpresaId,
                password: hashedPassword,
                tipoUsuario: "EMPRESARIAL",
                rol: "EQUIPO",
                empresaId,
            },
        });
        // 💌 Enviar correo con nombre real de la empresa
        await (0, email_service_1.sendTeamWelcomeEmail)(nuevoEquipo.correo, datosValidados.password, empresa?.nombreEmpresa || 'Tu empresa');
        return nuevoEquipo;
    }
    // Obtener todos los usuarios equipo (sin filtros)
    async obtenerTodosLosEquipos(empresaId) {
        return await prismaClient_1.default.users.findMany({
            where: {
                rol: "EQUIPO",
                estado: "activo",
                deletedAt: null,
                ...(empresaId !== undefined ? { empresaId } : {}), // ✅ incluye solo si viene
            },
        });
    }
    // Filtro múltiple (por nombre, correo, rolEquipo, empresaId)
    async filtrarEquipos(filtros) {
        const { nombreCompleto, correo, rolEquipo, estado, perfilCompleto, empresaId } = filtros;
        return await prismaClient_1.default.users.findMany({
            where: {
                rol: "EQUIPO",
                nombreCompleto: nombreCompleto ? { contains: nombreCompleto, mode: "insensitive" } : undefined,
                correo: correo ? { contains: correo, mode: "insensitive" } : undefined,
                rolEquipo,
                estado,
                perfilCompleto,
                empresaId,
            },
        });
    }
    // Buscar un equipo por ID
    async obtenerEquipoPorId(id) {
        const equipo = await prismaClient_1.default.users.findUnique({
            where: { idUsuario: id },
        });
        if (!equipo || equipo.rol !== "EQUIPO") {
            throw new Error("Usuario no encontrado o no es del tipo EQUIPO");
        }
        return equipo;
    }
    // Actualizar usuario equipo
    async actualizarEquipo(id, datosActualizados, empresaId) {
        const condiciones = {
            idUsuario: id,
            rol: "EQUIPO",
        };
        if (empresaId !== undefined) {
            condiciones.empresaId = empresaId;
        }
        const equipo = await prismaClient_1.default.users.findFirst({ where: condiciones });
        if (!equipo)
            throw new Error("Equipo no encontrado o no pertenece a esta empresa");
        EquipoModel_1.equipoSchema.partial().parse(datosActualizados);
        return await prismaClient_1.default.users.update({
            where: { idUsuario: id },
            data: datosActualizados,
        });
    }
    // Eliminación lógica de un miembro del equipo (inactivo + deletedAt)
    async eliminarLogico(id, empresaId) {
        const condiciones = {
            idUsuario: id,
            rol: "EQUIPO",
        };
        if (empresaId !== undefined) {
            condiciones.empresaId = empresaId;
        }
        const equipo = await prismaClient_1.default.users.findFirst({
            where: condiciones,
        });
        if (!equipo)
            throw new Error("Equipo no encontrado o no pertenece a esta empresa");
        return await prismaClient_1.default.users.update({
            where: { idUsuario: id },
            data: {
                estado: "inactivo",
                deletedAt: new Date(),
            },
        });
    }
    // Eliminación lógica de todo el equipo de una empresa
    async eliminarTodoElEquipo(empresaId) {
        const resultado = await prismaClient_1.default.users.updateMany({
            where: {
                rol: "EQUIPO",
                empresaId,
                estado: "activo",
                deletedAt: null
            },
            data: {
                estado: "inactivo",
                deletedAt: new Date(),
            },
        });
        return {
            mensaje: `Se marcaron como inactivos ${resultado.count} usuarios del equipo de la empresa.`,
        };
    }
}
exports.EquipoService = EquipoService;
