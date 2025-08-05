"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmarNombreManual = exports.extraerTextoDesdeImagen = void 0;
const cloudinary_1 = require("../utils/cloudinary");
const ocr_1 = require("../utils/ocr");
const texto_1 = require("../utils/texto");
const openfoodfacts_service_1 = require("../services/openfoodfacts.service");
const gpt_service_1 = require("../services/gpt.service");
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
const preprocesarImagen_1 = require("../utils/preprocesarImagen");
/**
 * Extrae texto de una imagen y lo analiza con OCR y GPT.
 *
 * 👉 [Documentación general en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/ocr.controller)
 *
 * @param req Request de Express con imagen (file) y usuarioId en body.
 * @param res Response de Express con resultado del análisis.
 */
// Endpoint principal OCR con extracción y análisis
const extraerTextoDesdeImagen = async (req, res) => {
    try {
        const file = req.file;
        const { usuarioId, tipoAnalisis = 'ocr-gpt-only' } = req.body;
        if (!file) {
            res.status(400).json({ message: 'No se envió ninguna imagen' });
            return;
        }
        const preprocessedBuffer = await (0, preprocesarImagen_1.preprocesarImagen)(file.buffer);
        let textoExtraido;
        let imageUrl;
        if (tipoAnalisis === 'ocr-gpt-only') {
            const uploadResult = await (0, cloudinary_1.cloudinaryUploadBuffer)(preprocessedBuffer, 'producttrack/ocr');
            imageUrl = (0, cloudinary_1.obtenerUrlPreprocesada)(uploadResult.public_id);
            textoExtraido = await (0, ocr_1.createOcrClient)(imageUrl);
        }
        else {
            res.status(400).json({ message: 'Solo se permite OCR desde Cloudinary en esta versión' });
            return;
        }
        if (!textoExtraido.trim()) {
            res.status(400).json({ mensaje: 'No se pudo extraer texto de la imagen' });
            return;
        }
        // Limpiar texto OCR para asegurar consulta fiable
        const textoLimpio = (0, texto_1.limpiarTextoOCR)(textoExtraido);
        const textoCorregido = (0, texto_1.corregirErroresOCR)(textoLimpio);
        const candidatos = (0, texto_1.obtenerCandidatosProductos)(textoCorregido);
        let nombreProducto = '';
        let requiereConfirmacion = false;
        if (candidatos.length > 0) {
            nombreProducto = candidatos[0];
        }
        else {
            // Si no hay candidatos, intenta usar al menos el texto limpio completo que se intentara buscar
            nombreProducto = textoCorregido;
            requiereConfirmacion = true;
        }
        let openFoodFactsResultados = [];
        openFoodFactsResultados = await openfoodfacts_service_1.OpenFoodFactsService.buscarAlimentoPorNombre(nombreProducto);
        const mejorResultado = (0, texto_1.elegirMejorResultado)(openFoodFactsResultados, textoCorregido);
        const esAlimento = !!mejorResultado;
        const mensajeGPT = await gpt_service_1.gptService.generarMensajeNutricional(nombreProducto || 'Producto desconocido', mejorResultado ? [mejorResultado] : []);
        const nuevoRegistro = await prismaClient_1.default.nutriScan.create({
            data: {
                consulta: textoExtraido,
                usuarioId: Number(usuarioId),
                esAlimento,
                respuesta: {
                    openFoodFacts: mejorResultado || (openFoodFactsResultados.length > 0 ? openFoodFactsResultados[0] : {}),
                    mensajeGPT,
                },
                tipoAnalisis,
            },
        });
        res.status(201).json({
            mensaje: requiereConfirmacion
                ? 'No se reconoció un nombre claro de producto. Por favor confirma o escribe uno manualmente.'
                : 'Análisis completado',
            registro: nuevoRegistro,
            resultadoOpenFoodFacts: mejorResultado,
            mensajeGPT,
            requiereConfirmacion,
            sugerencia: nombreProducto || null,
        });
    }
    catch (error) {
        console.error('❌ Error en OCR:', error);
        res.status(500).json({ message: 'Error interno: ' + (error.message || JSON.stringify(error)) });
    }
};
exports.extraerTextoDesdeImagen = extraerTextoDesdeImagen;
/**
 * Confirma manualmente un nombre de producto y actualiza el análisis.
 *
 * 👉 [Documentación general en GitHub](https://mari0724.github.io/producttrack/docs/backend/controllers/ocr.controller)
 *
 * @param req Request de Express con registroId y nombreProducto.
 * @param res Response de Express con actualización del análisis.
 */
// Nuevo endpoint: confirmar nombre manual y actualizar registro existente
const confirmarNombreManual = async (req, res) => {
    try {
        const { registroId, nombreProducto, tipoAnalisis = 'manual' } = req.body;
        if (!registroId) {
            res.status(400).json({ message: 'Falta el registroId.' });
            return;
        }
        if (!nombreProducto || !nombreProducto.trim()) {
            res.status(400).json({ message: 'Debes proporcionar un nombre de producto válido.' });
            return;
        }
        // Buscar alimento en OpenFoodFacts
        const openFoodFactsResultados = await openfoodfacts_service_1.OpenFoodFactsService.buscarAlimentoPorNombre(nombreProducto);
        const mejorResultado = (0, texto_1.elegirMejorResultado)(openFoodFactsResultados, nombreProducto);
        // Generar mensaje GPT
        const mensajeGPT = await gpt_service_1.gptService.generarMensajeNutricional(nombreProducto, mejorResultado ? [mejorResultado] : []);
        // Actualizar registro existente
        const registroActualizado = await prismaClient_1.default.nutriScan.update({
            where: { id: Number(registroId) },
            data: {
                consulta: nombreProducto,
                tipoAnalisis,
                respuesta: {
                    set: {
                        openFoodFacts: mejorResultado || (openFoodFactsResultados.length > 0 ? openFoodFactsResultados[0] : {}),
                        mensajeGPT,
                    },
                },
                actualizadoEn: new Date(),
            },
        });
        res.status(200).json({
            mensaje: 'Análisis manual completado',
            registro: registroActualizado,
            resultadoOpenFoodFacts: mejorResultado,
            mensajeGPT,
        });
    }
    catch (error) {
        console.error('❌ Error en confirmación manual:', error);
        res.status(500).json({ message: 'Error interno: ' + (error.message || JSON.stringify(error)) });
    }
};
exports.confirmarNombreManual = confirmarNombreManual;
