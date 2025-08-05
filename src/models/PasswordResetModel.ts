import { z } from "zod";

export const solicitudResetSchema = z.object({
  correo: z.string().email({ message: "Correo electrónico no válido" }),
});

export const confirmacionResetSchema = z.object({
  token: z.string().min(6, "Token inválido"),
  nuevaContrasena: z
    .string()
    .min(8, "Debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "Debe tener al menos una mayúscula")
    .regex(/[a-z]/, "Debe tener al menos una minúscula")
    .regex(/[0-9]/, "Debe tener al menos un número")
    .regex(/[^A-Za-z0-9]/, "Debe tener al menos un carácter especial"),
});