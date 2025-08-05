import '../config/env'
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storageProductos = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: 'producttrack/productos',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  }),
});

const storagePerfiles = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: 'producttrack/perfiles',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  }),
});

// Exportas los middlewares según la necesidad
export const uploadPerfiles = multer({ storage: storagePerfiles });
export const uploadProductos = multer({ storage: storageProductos });