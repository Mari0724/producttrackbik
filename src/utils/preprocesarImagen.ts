import sharp from 'sharp';

/**
 * Preprocesa una imagen recibida como Buffer:
 * - Escala de grises
 * - Normaliza contraste
 * - Umbral binario
 * Retorna un Buffer preprocesado
 */
export const preprocesarImagen = async (inputBuffer: Buffer): Promise<Buffer> => {
  return await sharp(inputBuffer)
    .resize({ width: 1000, withoutEnlargement: true })
    .grayscale()
    .normalize()
    .threshold(150)
    .png()
    .toBuffer();
};