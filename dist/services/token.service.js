"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generarToken = generarToken;
exports.verificarToken = verificarToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Validación de la variable JWT
if (!process.env.JWT_SECRET) {
    console.warn("Advertencia: JWT_SECRET no está definida");
}
const SECRET_KEY = process.env.JWT_SECRET;
function generarToken(payload) {
    const tokenPayload = {
        id: payload.id,
        username: payload.username,
        rol: payload.rol,
        tipoUsuario: payload.tipoUsuario,
    };
    // Solo agregar rolEquipo si el rol es "EQUIPO"
    if (payload.rol === "EQUIPO" && payload.rolEquipo) {
        tokenPayload.rolEquipo = payload.rolEquipo;
    }
    return jsonwebtoken_1.default.sign(tokenPayload, SECRET_KEY, { expiresIn: "1d" });
}
function verificarToken(token) {
    return jsonwebtoken_1.default.verify(token, SECRET_KEY);
}
