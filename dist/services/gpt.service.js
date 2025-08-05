"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gptService = exports.GPTService = void 0;
const openai_1 = __importDefault(require("openai"));
const apiKey = process.env.OPENAI_API_KEY;
let openai = null;
if (apiKey?.startsWith("sk-")) {
    openai = new openai_1.default({ apiKey });
}
else {
    console.warn("⚠️ No se encontró la clave de OpenAI. Se usarán respuestas simuladas.");
}
class GPTService {
    async generarMensajeNutricional(nombreProducto, resultados) {
        try {
            if (resultados.length === 0) {
                return `No se encontró información nutricional para un producto llamado "${nombreProducto}".`;
            }
            const producto = resultados[0];
            if (!openai) {
                return `El producto "${producto.nombre}" contiene aproximadamente ${producto.nutriments.calorias ?? "una cantidad moderada de"} kcal por 100g, con azúcares de ${producto.nutriments.azucares ?? "cantidad no especificada"} g.`;
            }
            const prompt = `
Eres un nutricionista digital. Tienes la siguiente información nutricional para un producto llamado "${producto.nombre}":

- Calorías: ${producto.nutriments.calorias ?? "No disponible"} kcal
- Azúcares: ${producto.nutriments.azucares ?? "No disponible"} g
- Grasas: ${producto.nutriments.grasas ?? "No disponible"} g
- Grasas Saturadas: ${producto.nutriments.grasas_saturadas ?? "No disponible"} g
- Grasas Trans: ${producto.nutriments.grasas_trans ?? "No disponible"} g
- Sodio: ${producto.nutriments.sodio ?? "No disponible"} g
- Fibra: ${producto.nutriments.fibra ?? "No disponible"} g
- Proteínas: ${producto.nutriments.proteinas ?? "No disponible"} g
- Nutriscore: ${producto.nutriscore ?? "No disponible"}
- NOVA Group: ${producto.nova_group ?? "No disponible"}

Redacta un mensaje para el usuario resumiendo esta información.
      `;
            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.6,
            });
            const mensajeGenerado = completion.choices[0].message?.content;
            return mensajeGenerado ?? "No se pudo generar el mensaje.";
        }
        catch (error) {
            console.error("❌ Error generando mensaje nutricional:", error);
            throw new Error(`Error generando mensaje nutricional: ${error.message || error}`);
        }
    }
}
exports.GPTService = GPTService;
exports.gptService = new GPTService();
