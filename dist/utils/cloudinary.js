"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerUrlPreprocesada = exports.cloudinaryUploadBuffer = void 0;
const cloudinary_1 = require("../config/cloudinary");
const streamifier_1 = __importDefault(require("streamifier"));
const cloudinaryUploadBuffer = (buffer, folder = 'nutriscan-ocr') => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.cloudinary.uploader.upload_stream({ folder }, (error, result) => {
            if (error)
                reject(error);
            else
                resolve(result);
        });
        streamifier_1.default.createReadStream(buffer).pipe(uploadStream);
    });
};
exports.cloudinaryUploadBuffer = cloudinaryUploadBuffer;
const obtenerUrlPreprocesada = (publicId) => {
    return cloudinary_1.cloudinary.url(publicId, { secure: true });
};
exports.obtenerUrlPreprocesada = obtenerUrlPreprocesada;
