"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.equipoSchema = void 0;
const zod_1 = require("zod");
exports.equipoSchema = zod_1.z.object({
    username: zod_1.z.string().min(3),
    correo: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    nombreCompleto: zod_1.z.string().min(3),
    telefono: zod_1.z.string().min(7).max(15),
    direccion: zod_1.z.string().min(5),
    fotoPerfil: zod_1.z.string().url("La foto de perfil debe ser una URL válida").optional(),
    rolEquipo: zod_1.z.enum(["LECTOR", "COMENTARISTA", "EDITOR"]),
    estado: zod_1.z.enum(["activo", "inactivo"]).default("activo"),
    empresaId: zod_1.z.number().optional(),
    perfilCompleto: zod_1.z.boolean().optional(),
});
