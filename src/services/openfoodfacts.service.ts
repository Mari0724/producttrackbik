import axios from "axios";

export class OpenFoodFactsService {
  static async buscarAlimentoPorNombre(nombre: string) {
    try {
      const response = await axios.get<{ products: any[] }>(
        "https://world.openfoodfacts.org/cgi/search.pl",
        {
          params: {
            search_terms: nombre,
            search_simple: 1,
            action: "process",
            json: 1,
          },
        }
      );

      const productos = response.data.products;

      // Nos quedamos con los primeros 3 resultados y filtramos solo la info útil
      const resultadosFiltrados = productos.slice(0, 3).map((producto: any) => ({
        nombre: producto.product_name,
        nutriments: {
          calorias: producto.nutriments?.['energy-kcal_100g'] ?? null,
          azucares: producto.nutriments?.['sugars_100g'] ?? null,
          grasas: producto.nutriments?.['fat_100g'] ?? null,
          grasas_saturadas: producto.nutriments?.['saturated-fat_100g'] ?? null,
          grasas_trans: producto.nutriments?.['trans-fat_100g'] ?? null,
          sodio: producto.nutriments?.['sodium_100g'] ?? null,
          fibra: producto.nutriments?.['fiber_100g'] ?? null,
          proteinas: producto.nutriments?.['proteins_100g'] ?? null,
        },
        nutriscore: producto.nutriscore_grade ?? null,
        nova_group: producto.nova_group ?? null,
        imagen: producto.image_front_url ?? null,
        link: producto.url ?? null
      }));

      return resultadosFiltrados;
    } catch (error) {
      console.error("Error consultando OpenFoodFacts:", error);
      return [];
    }
  }
}