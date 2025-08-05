"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NutriScanService = void 0;
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
const NutriScanModel_1 = require("../models/NutriScanModel");
const openfoodfacts_service_1 = require("./openfoodfacts.service");
const gpt_service_1 = require("./gpt.service");
class NutriScanService {
    async create(data, usuarioId, isTest) {
        try {
            const parsed = NutriScanModel_1.NutriScanSchemaWithoutUserId.parse(data);
            const nombreProducto = parsed.consulta.trim();
            // Consultar OpenFoodFacts
            const resultadosOpenFood = await openfoodfacts_service_1.OpenFoodFactsService.buscarAlimentoPorNombre(nombreProducto);
            // Generar respuesta nutricional
            const respuestaGenerada = {
                mensaje: await gpt_service_1.gptService.generarMensajeNutricional(nombreProducto, resultadosOpenFood),
                generadoPor: isTest ? "simulado" : "gpt",
            };
            // Guardar en base de datos
            const nuevo = await prismaClient_1.default.nutriScan.create({
                data: {
                    usuarioId,
                    isTest,
                    esAlimento: parsed.esAlimento,
                    consulta: nombreProducto,
                    tipoAnalisis: "auto",
                    respuesta: respuestaGenerada,
                },
            });
            return nuevo;
        }
        catch (error) {
            console.error("❌ Error en NutriScanService:", error);
            throw new Error(`Error al crear el análisis: ${error.message}`);
        }
    }
    async findAll() {
        return prismaClient_1.default.nutriScan.findMany({
            orderBy: { fechaAnalisis: "desc" },
            include: {
                usuario: {
                    select: {
                        nombreCompleto: true,
                        tipoUsuario: true,
                    },
                },
            },
        });
    }
    async findTestsByUser(usuarioId) {
        return prismaClient_1.default.nutriScan.findMany({
            where: { isTest: true, usuarioId },
        });
    }
    async findByUserId(usuarioId) {
        return prismaClient_1.default.nutriScan.findMany({
            where: { usuarioId },
            orderBy: { fechaAnalisis: "desc" },
            include: {
                usuario: {
                    select: {
                        nombreCompleto: true,
                        tipoUsuario: true,
                    },
                },
            },
        });
    }
    // Actualizado con NutriScanUpdateSchema
    async update(id, data) {
        const parsed = NutriScanModel_1.NutriScanUpdateSchema.parse(data);
        return prismaClient_1.default.nutriScan.update({
            where: { id },
            data: parsed,
        });
    }
    async delete(id) {
        await prismaClient_1.default.nutriScan.delete({ where: { id } });
        return { message: `Registro con id ${id} eliminado.` };
    }
}
exports.NutriScanService = NutriScanService;
