import { z } from "zod";

export const NutriScanSchema = z.object({
  usuarioId: z.number().int().positive(),
  esAlimento: z.boolean(),
  consulta: z.string().min(1, "La consulta no puede estar vacía"),
  respuesta: z.object({
    mensaje: z.string(),
    generadoPor: z.string(),
  }),
  tipoAnalisis: z.enum(["ocr-gpt-only", "ocr-openfoodfacts-gpt"]),
});

export const NutriScanSchemaWithoutUserId = NutriScanSchema.omit({ usuarioId: true });

export const NutriScanUpdateSchema = z.object({
  consulta: z.string().min(1).optional(),
  esAlimento: z.boolean().optional(),
  tipoAnalisis: z.enum(["ocr-gpt-only", "ocr-openfoodfacts-gpt"]).optional(),
   isTest: z.boolean().optional(),
  respuesta: z
    .object({
      mensaje: z.string(),
      generadoPor: z.string(),
    })
    .optional(),
});

// Tipos generados a partir de los esquemas
export type NutriScanDTO = z.infer<typeof NutriScanSchema>;
export type NutriScanDTOInput = z.infer<typeof NutriScanSchemaWithoutUserId>;
export type NutriScanDTOUpdate = z.infer<typeof NutriScanUpdateSchema>;