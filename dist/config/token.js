"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOKEN_EXPIRES_IN = exports.JWT_SECRET = void 0;
exports.JWT_SECRET = process.env.JWT_SECRET || "";
exports.TOKEN_EXPIRES_IN = "1d";
if (!process.env.JWT_SECRET) {
    console.warn("Advertencia: JWT_SECRET no está definida");
}
