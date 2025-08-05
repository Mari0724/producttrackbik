import express from 'express';
import { uploadMemory } from '../middleware/uploadMemory';
import { extraerTextoDesdeImagen, confirmarNombreManual } from '../controllers/ocr.controller';

const router = express.Router();

// 📌 OCR por imagen (con uploadMemory en memoria)
router.post('/nutriscan-ocr', uploadMemory.single('imagen'), extraerTextoDesdeImagen);

// 📌 Confirmar nombre manual
router.post('/confirmar-nombre', confirmarNombreManual);

export default router;