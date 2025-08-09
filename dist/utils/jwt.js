"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressAuthentication = expressAuthentication;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const token_1 = require("../config/token");
async function expressAuthentication(request, securityName, scopes) {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("Token no proporcionado o formato incorrecto");
    }
    const token = authHeader.replace("Bearer ", "");
    try {
        const decoded = jsonwebtoken_1.default.verify(token, token_1.JWT_SECRET);
        return decoded; // Esto se guarda como request['user']
    }
    catch (error) {
        throw new Error("Token inválido o expirado");
    }
}
