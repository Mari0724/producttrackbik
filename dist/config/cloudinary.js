"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = exports.cloudinary = exports.subirImagenCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
Object.defineProperty(exports, "cloudinary", { enumerable: true, get: function () { return cloudinary_1.v2; } });
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
// ✅ Configurar Cloudinary
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// ✅ Función para subir imagen manualmente
const subirImagenCloudinary = async (filePath) => {
    try {
        const result = await cloudinary_1.v2.uploader.upload(filePath, {
            folder: 'productos',
        });
        return result.secure_url;
    }
    catch (error) {
        console.error('Error al subir imagen a Cloudinary:', error);
        throw new Error('No se pudo subir la imagen');
    }
};
exports.subirImagenCloudinary = subirImagenCloudinary;
// ✅ Storage para multer
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: async (req, file) => {
        return {
            folder: 'productos',
            format: 'jpg',
            public_id: `${Date.now()}-${file.originalname}`,
        };
    },
});
exports.storage = storage;
