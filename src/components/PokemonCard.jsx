import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useCart } from "../contexts/CartContext";
import { TYPE_COLORS } from "../utils/constants";
import { PokeballSprite } from "./Filters";

const PokemonCard = ({ pokemon, isLoading = false }) => {
  const { addToCart, items } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState(null);
  const [inCartQuantity, setInCartQuantity] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [selectedQty, setSelectedQty] = useState(1);
  const [inputValue, setInputValue] = useState("1");
  const [isInputFocused, setIsInputFocused] = useState(false);

  const getPriceCategory = () => {
    if (!pokemon || pokemon.price === undefined) {
      return { sprite: "poke", label: "Económico", color: "text-red-500" };
    }

    const price = pokemon.price;
    if (price >= 0 && price <= 30) {
      return { sprite: "poke", label: "Económico", color: "text-red-500" };
    } else if (price >= 31 && price <= 70) {
      return { sprite: "great", label: "Exclusivo", color: "text-blue-500" };
    } else {
      return { sprite: "ultra", label: "Legendario", color: "text-yellow-500" };
    }
  };

  const priceCategory = getPriceCategory();
  const availableStock = Math.max(0, pokemon?.stock - inCartQuantity) || 0;

  useEffect(() => {
    if (!pokemon || isLoading) return;

    const cartItem = items.find((item) => item.id === pokemon.id);
    const qtyInCart = cartItem ? cartItem.quantity : 0;
    setInCartQuantity(qtyInCart);

    setSelectedQty((prev) => {
      const newQty = Math.min(Math.max(1, prev), availableStock);
      if (!isInputFocused) {
        setInputValue(newQty.toString());
      }
      return newQty;
    });
  }, [items, pokemon, isLoading, availableStock, isInputFocused]);

  const handleInputChange = (e) => {
    const value = e.target.value;

    if (value === "") {
      setInputValue("");
      return;
    }

    const numValue = parseInt(value, 10);
    if (isNaN(numValue) || numValue < 1) {
      setInputValue("1");
      setSelectedQty(1);
      return;
    }

    setInputValue(value);
    const newQty = Math.min(numValue, availableStock);
    setSelectedQty(newQty);

    if (numValue > availableStock) {
      setTimeout(() => {
        setInputValue(newQty.toString());
      }, 10);
    }
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);

    if (inputValue === "" || parseInt(inputValue, 10) < 1) {
      const newQty = 1;
      setInputValue(newQty.toString());
      setSelectedQty(newQty);
    } else {
      const numValue = parseInt(inputValue, 10);
      const newQty = Math.min(Math.max(1, numValue), availableStock);
      setInputValue(newQty.toString());
      setSelectedQty(newQty);
    }
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      handleIncrement();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      handleDecrement();
    }
  };

  const handleIncrement = () => {
    if (availableStock > 0 && selectedQty < availableStock) {
      const newQty = selectedQty + 1;
      setSelectedQty(newQty);
      setInputValue(newQty.toString());
    }
  };

  const handleDecrement = () => {
    if (selectedQty > 1) {
      const newQty = selectedQty - 1;
      setSelectedQty(newQty);
      setInputValue(newQty.toString());
    }
  };

  const handleAddToCart = async () => {
    if (!pokemon || pokemon.stock <= 0) {
      setError("Este Pokémon está agotado");
      return;
    }

    if (selectedQty > availableStock) {
      setError("No hay suficiente stock disponible");
      return;
    }

    setIsAdding(true);
    setError(null);

    try {
      const result = await addToCart(pokemon, selectedQty);

      if (!result?.success) {
        setError(result?.message || "No se pudo añadir");
      }

      setTimeout(() => setIsAdding(false), 500);
    } catch (err) {
      setError("Error al añadir al carrito");
      setIsAdding(false);
    }
  };

  // Si está cargando, mostrar skeleton
  if (isLoading || !pokemon) {
    return (
      <div className="group relative overflow-hidden rounded-xl shadow-lg border border-gray-200 animate-pulse">
        <div className="relative h-48 bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center p-4">
          <Skeleton circle height={160} width={160} />
        </div>

        <div className="bg-white p-4 relative">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2 w-2/3">
              <Skeleton circle width={40} height={40} />
              <div className="flex-1">
                <Skeleton width="70%" height={24} className="mb-2" />
                <Skeleton width="50%" height={16} />
              </div>
            </div>
            <div className="text-right w-1/3">
              <Skeleton width="80%" height={28} className="mb-1" />
              <Skeleton width="60%" height={12} />
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <Skeleton width={60} height={24} borderRadius={999} />
            <Skeleton width={60} height={24} borderRadius={999} />
          </div>

          <div className="flex justify-between items-center pt-3 border-t">
            <div className="w-1/3">
              <Skeleton width="80%" height={20} />
            </div>

            <div className="flex items-center gap-3 w-2/3 justify-end">
              <div className="flex items-center">
                <Skeleton width={30} height={32} />
                <Skeleton width={40} height={32} />
                <Skeleton width={30} height={32} />
              </div>
              <Skeleton width={100} height={40} borderRadius={8} />
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        {!imageLoaded && !imageError && (
          <Skeleton
            circle
            height={160}
            width={160}
            baseColor="#e5e7eb"
            highlightColor="#f3f4f6"
          />
        )}

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
            className={`h-40 w-40 object-contain transition-transform duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
            loading="lazy"
          />
        )}

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
          <div className="flex items-center gap-2">
            <div className="relative group/pokeball">
              <PokeballSprite
                type={priceCategory.sprite}
                className="w-10 h-10"
              />

              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/pokeball:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                {priceCategory.label} (${pokemon.price})
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 capitalize">
                {pokemon.name}
              </h3>
              <p className="text-sm text-gray-500">
                Altura: {pokemon.height} dm · Peso: {pokemon.weight} hg
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className={`text-xl font-bold ${priceCategory.color}`}>
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
            {availableStock > 0 && (
              <div className="text-green-600 text-xs mt-1">
                Disponible: {availableStock}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center border rounded-md overflow-hidden">
              <button
                onClick={handleDecrement}
                disabled={
                  pokemon.stock === 0 ||
                  selectedQty <= 1 ||
                  inCartQuantity >= pokemon.stock
                }
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-colors"
                aria-label="Disminuir cantidad"
                type="button"
              >
                −
              </button>

              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max={availableStock}
                  value={inputValue}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  onFocus={handleInputFocus}
                  onKeyDown={handleInputKeyDown}
                  disabled={
                    pokemon.stock === 0 || inCartQuantity >= pokemon.stock
                  }
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="w-14 px-2 py-1 text-center border-0 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
                  aria-label="Cantidad a añadir"
                />
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  Escribe o usa flechas
                </div>
              </div>

              <button
                onClick={handleIncrement}
                disabled={
                  pokemon.stock === 0 ||
                  selectedQty >= availableStock ||
                  inCartQuantity >= pokemon.stock
                }
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-colors"
                aria-label="Aumentar cantidad"
                type="button"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={
                pokemon.stock === 0 ||
                isAdding ||
                inCartQuantity >= pokemon.stock ||
                selectedQty < 1 ||
                selectedQty > availableStock
              }
              aria-label={`Añadir ${selectedQty} ${pokemon.name} al carrito`}
              className={`w-full sm:w-auto text-center px-4 py-3 sm:py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                pokemon.stock === 0 || inCartQuantity >= pokemon.stock
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : isAdding
                  ? "bg-green-500 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
              type="button"
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
                <>
                  <span className="font-medium">Añadir</span>
                  {selectedQty > 1 && (
                    <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded">
                      x{selectedQty}
                    </span>
                  )}
                </>
              )}
            </button>
          </div>
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
