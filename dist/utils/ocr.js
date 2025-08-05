"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOcrClient = createOcrClient;
const tesseract_js_1 = require("tesseract.js");
async function createOcrClient(imagePath) {
    const worker = await (0, tesseract_js_1.createWorker)();
    try {
        await worker.load();
        await worker.reinitialize('eng+spa');
        await worker.setParameters({
            tessedit_pageseg_mode: tesseract_js_1.PSM.SPARSE_TEXT
        });
        const { data } = await worker.recognize(imagePath);
        return data.text;
    }
    catch (error) {
        console.error('❌ Error en OCR worker:', error);
        throw new Error(`Error en OCR: ${error.message || error}`);
    }
    finally {
        await worker.terminate();
    }
}
