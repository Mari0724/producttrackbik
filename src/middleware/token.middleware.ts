import { Request, Response, NextFunction } from "express";
import { verificarToken } from "../services/token.service";

// Tipado limpio para el contenido del JWT
export interface JwtPayload {
  id: number;
  rol: string;
  tipoUsuario?: string;
  rolEquipo?: string | null;
  perfilCompleto?: boolean;
  empresaId?: number | null;
}

// Request extendido con el usuario autenticado
export interface AuthenticatedRequestTocken extends Request {
  user?: JwtPayload;
}

// Middleware de autenticación
export function autenticarToken(
  req: AuthenticatedRequestTocken,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1]; // Formato: Bearer <token>

  if (!token) {
    return res.status(401).json({ mensaje: "Token no proporcionado" });
  }

  try {
    const payload = verificarToken(token) as JwtPayload;
    req.user = payload;
    next();
  } catch (error) {
    return res.status(403).json({ mensaje: "Token inválido o expirado" });
  }
}