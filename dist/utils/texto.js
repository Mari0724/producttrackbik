"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.elegirMejorResultado = exports.obtenerCandidatosProductos = exports.corregirErroresOCR = exports.limpiarTextoOCR = void 0;
// Limpia texto OCR de saltos de línea, caracteres basura, símbolos raros
const limpiarTextoOCR = (texto) => {
    return texto
        .toLowerCase() // pasa todo a minúsculas para normalizar
        .replace(/\n/g, ' ') // reemplaza saltos de línea por espacio
        .replace(/[^a-z0-9áéíóúüñ\s\-]/g, '') // elimina todo excepto letras, números, espacios y guiones
        .replace(/\s+/g, ' ') // colapsa múltiples espacios en uno solo
        .trim();
};
exports.limpiarTextoOCR = limpiarTextoOCR;
// Corrige errores comunes de OCR (ejemplo simple)
const corregirErroresOCR = (texto) => {
    return texto
        .replace(/\b1entejas\b/gi, 'lentejas')
        .replace(/\bgarbansos\b/gi, 'garbanzos')
        .replace(/\baros\b/gi, 'arroz');
};
exports.corregirErroresOCR = corregirErroresOCR;
// Busca coincidencias con alimentos comunes en español
const obtenerCandidatosProductos = (texto) => {
    const alimentosComunes = [
        'lentejas', 'arroz', 'avena', 'garbanzos', 'frijoles',
        'papa', 'fideos', 'espagueti', 'quinua', 'soya', 'trigo'
    ];
    const textoMinuscula = texto.toLowerCase();
    const coincidencias = alimentosComunes.filter(alimento => textoMinuscula.includes(alimento));
    return coincidencias;
};
exports.obtenerCandidatosProductos = obtenerCandidatosProductos;
// Elige mejor resultado de OpenFoodFacts en base a coincidencias con OCR limpio
const elegirMejorResultado = (resultados, textoOCR) => {
    if (!resultados.length)
        return null;
    const textoMinuscula = textoOCR.toLowerCase();
    // Filtra productos no relevantes (ej: si OCR no menciona 'pasta', descarta productos con 'pasta')
    const relevantes = resultados.filter((r) => {
        const nombreProducto = r.nombre.toLowerCase();
        if (!textoMinuscula.includes('pasta') && nombreProducto.includes('pasta')) {
            return false;
        }
        if (!textoMinuscula.includes('lenteja') && nombreProducto.includes('lenteja')) {
            return false;
        }
        return true;
    });
    // Coincidencias exactas
    const coincidencias = relevantes.filter((r) => textoMinuscula.includes(r.nombre.toLowerCase()));
    if (coincidencias.length > 0)
        return coincidencias[0];
    if (relevantes.length > 0)
        return relevantes[0];
    return resultados[0];
};
exports.elegirMejorResultado = elegirMejorResultado;
