"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autenticarToken = autenticarToken;
const token_service_1 = require("../services/token.service");
// Middleware de autenticación
function autenticarToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1]; // Formato: Bearer <token>
    if (!token) {
        return res.status(401).json({ mensaje: "Token no proporcionado" });
    }
    try {
        const payload = (0, token_service_1.verificarToken)(token);
        req.user = payload;
        next();
    }
    catch (error) {
        return res.status(403).json({ mensaje: "Token inválido o expirado" });
    }
}
