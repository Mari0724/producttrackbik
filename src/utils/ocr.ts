import { createWorker, PSM } from 'tesseract.js';

export async function createOcrClient(imagePath: string): Promise<string> {
  const worker = await createWorker();

  try {
    await worker.load();
    await worker.reinitialize('eng+spa');

    await worker.setParameters({
      tessedit_pageseg_mode: PSM.SPARSE_TEXT
    });

    const { data } = await worker.recognize(imagePath);

    return data.text;
  } catch (error: any) {
    console.error('❌ Error en OCR worker:', error);
    throw new Error(`Error en OCR: ${error.message || error}`);
  } finally {
    await worker.terminate();
  }
}