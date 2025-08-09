"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NutriScanUpdateSchema = exports.NutriScanSchemaWithoutUserId = exports.NutriScanSchema = void 0;
const zod_1 = require("zod");
exports.NutriScanSchema = zod_1.z.object({
    usuarioId: zod_1.z.number().int().positive(),
    esAlimento: zod_1.z.boolean(),
    consulta: zod_1.z.string().min(1, "La consulta no puede estar vacía"),
    respuesta: zod_1.z.object({
        mensaje: zod_1.z.string(),
        generadoPor: zod_1.z.string(),
    }),
    tipoAnalisis: zod_1.z.enum(["ocr-gpt-only", "ocr-openfoodfacts-gpt"]),
});
exports.NutriScanSchemaWithoutUserId = exports.NutriScanSchema.omit({ usuarioId: true });
exports.NutriScanUpdateSchema = zod_1.z.object({
    consulta: zod_1.z.string().min(1).optional(),
    esAlimento: zod_1.z.boolean().optional(),
    tipoAnalisis: zod_1.z.enum(["ocr-gpt-only", "ocr-openfoodfacts-gpt"]).optional(),
    isTest: zod_1.z.boolean().optional(),
    respuesta: zod_1.z
        .object({
        mensaje: zod_1.z.string(),
        generadoPor: zod_1.z.string(),
    })
        .optional(),
});
