import { useEffect, useState } from "react";
import { useCart } from "../contexts/CartContext";
import { TYPE_COLORS } from "../utils/constants";

const PokemonCard = ({ pokemon }) => {
  const { addToCart, items } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState(null);
  const [inCartQuantity, setInCartQuantity] = useState(0);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const cartItem = items.find((item) => item.id === pokemon.id);
    setInCartQuantity(cartItem ? cartItem.quantity : 0);
  }, [items, pokemon.id]);

  const handleAddToCart = async () => {
    if (pokemon.stock <= 0) {
      setError("Este Pokémon está agotado");
      return;
    }

    if (inCartQuantity >= pokemon.stock) {
      setError("No hay suficiente stock disponible");
      return;
    }

    setIsAdding(true);
    setError(null);

    try {
      const result = await addToCart(pokemon, 1);

      if (!result.success) {
        setError(result.message);
      }

      setTimeout(() => setIsAdding(false), 500);
    } catch (err) {
      setError("Error al añadir al carrito");
      setIsAdding(false);
    }
  };

  const mainType = pokemon.types[0] || "normal";
  const typeClassBase = `pokemon-${mainType}`;

  return (
    <div
      className={`group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border ${
        pokemon.stock === 0 ? "opacity-75" : ""
      }`}
    >
      <div className={`absolute inset-0 bg-${typeClassBase}/10`}></div>

      <div
        className={`absolute top-0 right-0 bg-${typeClassBase} text-white text-xs px-3 py-1 rounded-bl-lg`}
      >
        #{pokemon.id.toString().padStart(3, "0")}
      </div>

      <div className="relative h-48 bg-gradient-to-b from-white to-gray-100 flex items-center justify-center p-4">
        {imageError ? (
          <div className="text-gray-400">
            <div className="text-6xl">❓</div>
            <p className="text-sm mt-2">Imagen no disponible</p>
          </div>
        ) : (
          <img
            src={
              pokemon.image ||
              `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`
            }
            alt={pokemon.name}
            className="h-40 w-40 object-contain transition-transform duration-300 group-hover:scale-110"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        )}

        {/* Badge de stock bajo */}
        {pokemon.stock > 0 && pokemon.stock <= 5 && (
          <div className="absolute bottom-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
            Últimas {pokemon.stock} unidades
          </div>
        )}

        {pokemon.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <div className="bg-white text-red-600 font-bold px-4 py-2 rounded-lg">
              AGOTADO
            </div>
          </div>
        )}
      </div>

      <div className="bg-white p-4 relative">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-bold text-gray-800 capitalize">
              {pokemon.name}
            </h3>
            <p className="text-sm text-gray-500">
              Altura: {pokemon.height} dm · Peso: {pokemon.weight} hg
            </p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-blue-600">
              ${pokemon.price}
            </div>
            <div className="text-xs text-gray-500">cada uno</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {pokemon.types.map((type, index) => (
            <span
              key={`${pokemon.id}-${type}-${index}`}
              className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                TYPE_COLORS[type] || TYPE_COLORS.normal
              }`}
            >
              {type}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center pt-3 border-t">
          <div className="text-sm">
            <div className="text-gray-600">
              Stock:{" "}
              <span
                className={`font-semibold ${
                  pokemon.stock === 0
                    ? "text-red-500"
                    : pokemon.stock <= 5
                    ? "text-yellow-500"
                    : "text-green-500"
                }`}
              >
                {pokemon.stock}
              </span>
            </div>
            {inCartQuantity > 0 && (
              <div className="text-blue-600 text-xs">
                {inCartQuantity} en tu Caja
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={
              pokemon.stock === 0 || isAdding || inCartQuantity >= pokemon.stock
            }
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
              pokemon.stock === 0 || inCartQuantity >= pokemon.stock
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : isAdding
                ? "bg-green-500 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {isAdding ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                Transifiriendo a caja de ALGUIEN
              </>
            ) : pokemon.stock === 0 ? (
              "Agotado"
            ) : inCartQuantity >= pokemon.stock ? (
              "Stock máximo"
            ) : (
              "Añadir al carrito"
            )}
          </button>
        </div>

        {error && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
            Atención entrenador: {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default PokemonCard;
