export const JWT_SECRET = process.env.JWT_SECRET || "";
export const TOKEN_EXPIRES_IN = "1d";

if (!process.env.JWT_SECRET) {
  console.warn("Advertencia: JWT_SECRET no está definida");
}