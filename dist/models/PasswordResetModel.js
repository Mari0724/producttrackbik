"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmacionResetSchema = exports.solicitudResetSchema = void 0;
const zod_1 = require("zod");
exports.solicitudResetSchema = zod_1.z.object({
    correo: zod_1.z.string().email({ message: "Correo electrónico no válido" }),
});
exports.confirmacionResetSchema = zod_1.z.object({
    token: zod_1.z.string().min(6, "Token inválido"),
    nuevaContrasena: zod_1.z
        .string()
        .min(8, "Debe tener al menos 8 caracteres")
        .regex(/[A-Z]/, "Debe tener al menos una mayúscula")
        .regex(/[a-z]/, "Debe tener al menos una minúscula")
        .regex(/[0-9]/, "Debe tener al menos un número")
        .regex(/[^A-Za-z0-9]/, "Debe tener al menos un carácter especial"),
});
