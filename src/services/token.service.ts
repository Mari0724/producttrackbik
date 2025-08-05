import jwt from "jsonwebtoken";

// Validación de la variable JWT
if (!process.env.JWT_SECRET) {
  console.warn("Advertencia: JWT_SECRET no está definida");
}
const SECRET_KEY = process.env.JWT_SECRET;

// Tipo para el payload completo
interface TokenPayload {
  id: number;
  username: string;
  rol: string;
  tipoUsuario?: string;
  rolEquipo?: string;
}

export function generarToken(payload: TokenPayload): string {
  const tokenPayload: Partial<TokenPayload> = {
    id: payload.id,
    username: payload.username,
    rol: payload.rol,
    tipoUsuario: payload.tipoUsuario,
  };

  // Solo agregar rolEquipo si el rol es "EQUIPO"
  if (payload.rol === "EQUIPO" && payload.rolEquipo) {
    tokenPayload.rolEquipo = payload.rolEquipo;
  }

  return jwt.sign(tokenPayload, SECRET_KEY as string, { expiresIn: "1d" });
}

export function verificarToken(token: string): TokenPayload {
  return jwt.verify(token, SECRET_KEY as string) as TokenPayload;
}