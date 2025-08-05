"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prismaClient_1 = __importDefault(require("./utils/prismaClient"));
const UMBRAL_INDIVIDUAL = 2;
const UMBRAL_EMPRESARIAL = 30;
async function sincronizarRecordatorios() {
    const productos = await prismaClient_1.default.productos.findMany({
        where: { eliminadoEn: null },
        select: {
            id: true,
            usuario: {
                select: {
                    tipoUsuario: true,
                },
            },
        },
    });
    for (const producto of productos) {
        const tipo = producto.usuario?.tipoUsuario?.toLowerCase() || "empresarial";
        const cantidadMinimaDeseada = tipo === "individual" ? UMBRAL_INDIVIDUAL : UMBRAL_EMPRESARIAL;
        const existente = await prismaClient_1.default.recorStock.findFirst({
            where: { productoId: producto.id },
            select: { cantidadMinima: true, idRecordatorio: true }, // aseguramos traer la clave única correcta
        });
        if (existente) {
            const cantidadMinimaDeseada = tipo === "individual" ? UMBRAL_INDIVIDUAL : UMBRAL_EMPRESARIAL;
            if (existente.cantidadMinima !== cantidadMinimaDeseada) {
                await prismaClient_1.default.recorStock.update({
                    where: { idRecordatorio: existente.idRecordatorio }, // usamos la clave única correcta
                    data: { cantidadMinima: cantidadMinimaDeseada },
                });
            }
        }
    }
}
sincronizarRecordatorios()
    .catch((e) => {
    console.error("❌ Error en la sincronización:", e);
})
    .finally(async () => {
    await prismaClient_1.default.$disconnect();
});
