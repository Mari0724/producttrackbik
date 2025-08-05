import { Request } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/token";

export async function expressAuthentication(
  request: Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Token no proporcionado o formato incorrecto");
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded; // Esto se guarda como request['user']
  } catch (error) {
    throw new Error("Token inválido o expirado");
  }
}