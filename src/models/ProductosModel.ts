import { z } from "zod";

export const estadoEnum = z.enum(["DISPONIBLE", "AGOTADO", "RESERVADO", "VENCIDO", "ELIMINADO"]);

export const productoSchema = z.object({
  codigoBarras: z.string().optional().nullable(),
  codigoQR: z.string().optional().nullable(),
  nombre: z.string().min(1).trim(),
  descripcion: z.string().min(1).trim(),
  categoria: z.string().optional(),
  cantidad: z.number().int().nonnegative(),
  precio: z.preprocess((val) => Number(val), z.number().nonnegative({
    message: "El precio debe ser un número válido",
  })),
  fechaAdquisicion: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "fechaAdquisicion debe ser una fecha válida (ISO string)",
  }),
  fechaVencimiento: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "fechaVencimiento debe ser una fecha válida (ISO string)",
  }),
  usuarioId: z.number().optional(),
  estado: estadoEnum,
  imagen: z.string().trim().url({ message: "imagen debe ser una URL válida" }),
});

export type ProductoInput = z.infer<typeof productoSchema>;