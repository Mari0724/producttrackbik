import { z } from "zod";

export const equipoSchema = z.object({
  username: z.string().min(3),
  correo: z.string().email(),
  password: z.string().min(6),
  nombreCompleto: z.string().min(3),
  telefono: z.string().min(7).max(15),
  direccion: z.string().min(5),
  fotoPerfil: z.string().url("La foto de perfil debe ser una URL válida").optional(),
  rolEquipo: z.enum(["LECTOR", "COMENTARISTA", "EDITOR"]),
  estado: z .enum(["activo", "inactivo"]) .default("activo"),
  empresaId: z.number().optional(),
  perfilCompleto: z.boolean().optional(),
});

export type EquipoModel = z.infer<typeof equipoSchema>;