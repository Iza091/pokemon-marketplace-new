import { Pokemon } from "../classes/Pokemon.js";

const API_URL = "https://pokeapi.co/api/v2";

export const fetchPokemons = async (limit = 151) => {
  try {
    const pokeRes = await fetch(`${API_URL}/pokemon?limit=${limit}`);
    const pokeData = await pokeRes.json();

    const localData = Array.from({ length: limit }, (_, i) => ({
      id: i + 1,
      price: 10 + Math.floor(Math.random() * 90),
      stock: 5 + Math.floor(Math.random() * 15),
    }));

    const detailedPokemons = await Promise.all(
      pokeData.results.map(async (pokemon, index) => {
        const id = index + 1;
        const detailsRes = await fetch(pokemon.url);
        const details = await detailsRes.json();

        const localInfo = localData.find((p) => Number(p.id) === id);

        return new Pokemon({
          id: id,
          name: details.name,
          image:
            details.sprites.versions?.["generation-v"]?.["black-white"]
              ?.animated?.front_default || details.sprites.front_default,
          types: details.types.map((t) => t.type.name),
          price: localInfo ? localInfo.price : 100,
          stock: localInfo ? localInfo.stock : 0,
          height: details.height,
          weight: details.weight,
        });
      })
    );

    return detailedPokemons;
  } catch (error) {
    console.error("Error en fetchPokemons:", error);
    throw error;
  }
};

export const updatePokemonStock = async (pokemonId, newStock) => {
  console.log(`Stock actualizado para Pokémon ${pokemonId}: ${newStock}`);
};

export const fetchPokemonTypes = async () => {
  try {
    const response = await fetch(`${API_URL}/type`);
    const data = await response.json();

    return data.results
      .map((t) => t.name)
      .filter((name) => name !== "unknown" && name !== "shadow");
  } catch (error) {
    console.error("Error en fetchPokemonTypes:", error);
    throw error;
  }
};

export const simulatePayment = (paymentData) => {
  return new Promise((resolve, reject) => {
    console.log("Procesando pago para:", paymentData.cardHolder);

    setTimeout(() => {
      const isSuccess = Math.random() > 0.2;

      if (isSuccess) {
        resolve({ success: true, message: "¡Compra realizada con éxito!" });
      } else {
        reject(new Error("La tarjeta fue rechazada. Intente con otra."));
      }
    }, 2000);
  });
};
