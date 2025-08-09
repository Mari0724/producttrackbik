"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productoSchema = exports.estadoEnum = void 0;
const zod_1 = require("zod");
exports.estadoEnum = zod_1.z.enum(["DISPONIBLE", "AGOTADO", "RESERVADO", "VENCIDO", "ELIMINADO"]);
exports.productoSchema = zod_1.z.object({
    codigoBarras: zod_1.z.string().optional().nullable(),
    codigoQR: zod_1.z.string().optional().nullable(),
    nombre: zod_1.z.string().min(1).trim(),
    descripcion: zod_1.z.string().min(1).trim(),
    categoria: zod_1.z.string().optional(),
    cantidad: zod_1.z.number().int().nonnegative(),
    precio: zod_1.z.preprocess((val) => Number(val), zod_1.z.number().nonnegative({
        message: "El precio debe ser un número válido",
    })),
    fechaAdquisicion: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "fechaAdquisicion debe ser una fecha válida (ISO string)",
    }),
    fechaVencimiento: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "fechaVencimiento debe ser una fecha válida (ISO string)",
    }),
    usuarioId: zod_1.z.number().optional(),
    estado: exports.estadoEnum,
    imagen: zod_1.z.string().trim().url({ message: "imagen debe ser una URL válida" }),
});
