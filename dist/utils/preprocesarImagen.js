"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.preprocesarImagen = void 0;
const sharp_1 = __importDefault(require("sharp"));
/**
 * Preprocesa una imagen recibida como Buffer:
 * - Escala de grises
 * - Normaliza contraste
 * - Umbral binario
 * Retorna un Buffer preprocesado
 */
const preprocesarImagen = async (inputBuffer) => {
    return await (0, sharp_1.default)(inputBuffer)
        .resize({ width: 1000, withoutEnlargement: true })
        .grayscale()
        .normalize()
        .threshold(150)
        .png()
        .toBuffer();
};
exports.preprocesarImagen = preprocesarImagen;
