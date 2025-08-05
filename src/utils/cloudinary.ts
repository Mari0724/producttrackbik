import { cloudinary } from '../config/cloudinary';
import streamifier from 'streamifier';

export const cloudinaryUploadBuffer = (buffer: Buffer, folder = 'nutriscan-ocr') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

export const obtenerUrlPreprocesada = (publicId: string) => {
  return cloudinary.url(publicId, { secure: true });
};