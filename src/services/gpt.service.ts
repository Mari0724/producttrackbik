import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

let openai: OpenAI | null = null;

if (apiKey?.startsWith("sk-")) {
  openai = new OpenAI({ apiKey });
} else {
  console.warn("⚠️ No se encontró la clave de OpenAI. Se usarán respuestas simuladas.");
}

export class GPTService {
  public async generarMensajeNutricional(nombreProducto: string, resultados: any[]): Promise<string> {
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
    } catch (error: any) {
      console.error("❌ Error generando mensaje nutricional:", error);
      throw new Error(`Error generando mensaje nutricional: ${error.message || error}`);
    }
  }
}

export const gptService = new GPTService();