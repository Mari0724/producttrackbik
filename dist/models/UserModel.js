"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const zod_1 = require("zod");
exports.userSchema = zod_1.z.object({
    username: zod_1.z
        .string()
        .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
        .trim(),
    correo: zod_1.z
        .string()
        .email("Correo inválido")
        .trim(),
    password: zod_1.z
        .string()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
        .regex(/[a-z]/, "Debe contener al menos una letra minúscula")
        .regex(/[0-9]/, "Debe contener al menos un número")
        .regex(/[^A-Za-z0-9]/, "Debe contener al menos un carácter especial"),
    nombreCompleto: zod_1.z
        .string()
        .min(3, "El nombre completo es requerido")
        .trim(),
    telefono: zod_1.z
        .string()
        .regex(/^\+?[0-9\s\-().]{7,20}$/, "El número de teléfono no es válido"),
    direccion: zod_1.z
        .string()
        .min(5, "La dirección debe tener al menos 5 caracteres")
        .trim(),
    fotoPerfil: zod_1.z
        .string()
        .url("La foto de perfil debe ser una URL válida")
        .optional(),
    nombreEmpresa: zod_1.z
        .string()
        .min(3, "El nombre de la empresa es requerido")
        .trim()
        .optional(),
    nit: zod_1.z
        .string()
        .regex(/^\d{9,15}$/, "El NIT debe tener entre 9 y 15 dígitos")
        .optional(),
    estado: zod_1.z
        .enum(["activo", "inactivo"])
        .default("activo"),
    rol: zod_1.z
        .enum(["USUARIO", "EQUIPO", "ADMIN", "DESARROLLADOR"]),
    rolEquipo: zod_1.z
        .enum(["LECTOR", "COMENTARISTA", "EDITOR"])
        .optional(),
    tipoUsuario: zod_1.z
        .enum(["INDIVIDUAL", "EMPRESARIAL"])
        .optional(),
    empresaId: zod_1.z
        .number()
        .int("El ID de empresa debe ser un número entero")
        .positive("El ID de empresa debe ser positivo")
        .optional(),
    perfilCompleto: zod_1.z.boolean().optional(),
})
    .refine((data) => {
    if (data.rol === "USUARIO") {
        return !!data.tipoUsuario;
    }
    return true;
}, {
    message: "El tipo de usuario es obligatorio si el rol es USUARIO.",
    path: ["tipoUsuario"],
})
    // Validación: Si es EMPRESARIAL, debe tener nombreEmpresa y nit
    .refine((data) => {
    if (data.tipoUsuario === "EMPRESARIAL") {
        return !!data.nombreEmpresa && !!data.nit;
    }
    return true;
}, {
    message: "El nombre de la empresa y el NIT son obligatorios para los usuarios empresariales.",
    path: ["nombreEmpresa", "nit"],
})
    // Validación: Si el rol es EQUIPO, debe tener empresaId
    .refine((data) => {
    if (data.rol === "EQUIPO") {
        return typeof data.empresaId === "number";
    }
    return true;
}, {
    message: "El campo 'empresaId' es obligatorio para usuarios con rol EQUIPO.",
    path: ["empresaId"],
})
    .refine((data) => {
    if (data.tipoUsuario === "INDIVIDUAL") {
        return !data.nombreEmpresa && !data.nit;
    }
    return true;
}, {
    message: "Los usuarios individuales no deben tener nombre de empresa ni NIT.",
    path: ["nombreEmpresa", "nit"],
});
