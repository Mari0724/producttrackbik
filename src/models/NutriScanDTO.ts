export interface NutriScanDTO {
  usuarioId: number;
  esAlimento: boolean;
  consulta: string;
  respuesta: any;
  tipoAnalisis: "ocr-gpt-only" | "ocr-openfoodfacts-gpt";
}