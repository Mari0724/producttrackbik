"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uploadMemory_1 = require("../middleware/uploadMemory");
const ocr_controller_1 = require("../controllers/ocr.controller");
const router = express_1.default.Router();
// 📌 OCR por imagen (con uploadMemory en memoria)
router.post('/nutriscan-ocr', uploadMemory_1.uploadMemory.single('imagen'), ocr_controller_1.extraerTextoDesdeImagen);
// 📌 Confirmar nombre manual
router.post('/confirmar-nombre', ocr_controller_1.confirmarNombreManual);
exports.default = router;
