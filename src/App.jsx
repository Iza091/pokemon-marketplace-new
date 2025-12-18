import { useEffect, useState } from "react";
import CartSidebar from "./components/CartSidebar";
import Filters from "./components/Filters";
import Header from "./components/Header";
import PokemonCard from "./components/PokemonCard";
import { CartProvider } from "./contexts/CartContext";
import { usePokemonFilters } from "./hooks/usePokemonFilters";
import { fetchPokemons } from "./services/pokemonService";

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const {
    search,
    setSearch,
    selectedTypes,
    setSelectedTypes,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    filteredPokemons,
    availableTypes,
    loadingTypes,
  } = usePokemonFilters(pokemons);

  useEffect(() => {
    const loadInitialPokemons = async () => {
      try {
        setLoading(true);
        setError(null);

        const initialPokemons = await fetchPokemons(20);
        setPokemons(initialPokemons);
        setIsInitialLoad(false);

        setTimeout(async () => {
          try {
            const allPokemons = await fetchPokemons(151);
            setPokemons(allPokemons);
          } catch (bgError) {
            console.warn("Background load failed:", bgError);
          }
        }, 1000);
      } catch (err) {
        console.error("Error loading Pokémon:", err);
        setError(err.message || "Error al cargar los Pokémon");
      } finally {
        setLoading(false);
      }
    };

    loadInitialPokemons();
  }, []);

  useEffect(() => {
    if (!isInitialLoad && pokemons.length > 0) {
      const interval = setInterval(() => {
        setPokemons((prev) =>
          prev.map((p) => {
            if (Math.random() < 0.3) {
              const change = Math.random() < 0.5 ? -1 : 1;
              const newStock = Math.max(
                0,
                p.stock + change * Math.floor(Math.random() * 5)
              );

              if (newStock !== p.stock) {
                window.dispatchEvent(
                  new CustomEvent("stock-update", {
                    detail: { pokemonId: p.id, newStock },
                  })
                );
              }

              return { ...p, stock: newStock };
            }
            return p;
          })
        );
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [isInitialLoad, pokemons.length]);

  const handleSearch = async (searchTerm) => {
    if (searchTerm.trim() && searchTerm.length > 2) {
      try {
        console.log("Searching for:", searchTerm);
      } catch (err) {
        console.error("Search error:", err);
      }
    }
  };

  // Recargar Pokémon
  const reloadPokemons = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPokemons(151);
      setPokemons(data);
    } catch (err) {
      setError(err.message || "Error al recargar los Pokémon");
    } finally {
      setLoading(false);
    }
  };

  if (loading && isInitialLoad) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-blue-500 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-4xl">⚡</div>
            </div>
          </div>
          <h2 className="mt-6 text-2xl font-bold text-gray-800">
            Cargando Pokémon
          </h2>
          <p className="mt-2 text-gray-600">
            Preparando tu aventura Pokémon...
          </p>
          <div className="mt-4 text-sm text-gray-500">
            {pokemons.length > 0
              ? `${pokemons.length} cargados`
              : "Iniciando..."}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">¡No hay pokémones cerca!</div>
          <h2 className="text-xl font-bold mb-2 text-gray-800">
            Error de Conexión
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={reloadPokemons}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
            >
              Reintentar
            </button>
            <button
              onClick={() => {
                const samplePokemons = Array.from({ length: 20 }, (_, i) => ({
                  id: i + 1,
                  name: `pokemon-${i + 1}`,
                  image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                    i + 1
                  }.png`,
                  types: ["normal"],
                  price: 10 + i,
                  stock: 5 + i,
                }));
                setPokemons(samplePokemons);
                setError(null);
              }}
              className="w-full border border-gray-300 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium"
            >
              Usar Modo Offline
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <CartProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header search={search} onSearchChange={setSearch} />

        <div className="container mx-auto px-4 py-6">
          <Filters
            onSearchChange={setSearch}
            onTypeChange={setSelectedTypes}
            onPriceRangeChange={setPriceRange}
            onSortChange={setSortBy}
            availableTypes={availableTypes}
            loadingTypes={loadingTypes}
          />

          {isInitialLoad && pokemons.length < 151 && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-3"></div>
                <span className="text-sm text-blue-700">
                  Cargando más Pokémon... ({pokemons.length}/151)
                </span>
              </div>
              <div className="mt-2 w-full bg-blue-200 rounded-full h-1">
                <div
                  className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${(pokemons.length / 151) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Pokémon Disponibles
              </h2>
              <p className="text-gray-600 mt-1">
                Mostrando{" "}
                <span className="font-bold text-blue-600">
                  {filteredPokemons.length}
                </span>{" "}
                de <span className="font-bold">{pokemons.length}</span> Pokémon
                {search && (
                  <span className="ml-2">
                    para "<span className="italic">{search}</span>"
                  </span>
                )}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedTypes.length > 0 && (
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Tipos: {selectedTypes.join(", ")}
                  <button
                    onClick={() => setSelectedTypes([])}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ✕
                  </button>
                </div>
              )}
              {(priceRange[0] > 0 || priceRange[1] < 150) && (
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  Precio: ${priceRange[0]} - ${priceRange[1]}
                  <button
                    onClick={() => setPriceRange([0, 150])}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          {filteredPokemons.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">
                No se encontraron Pokémon
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {search
                  ? `No hay Pokémon que coincidan con "${search}". Intenta con otro nombre.`
                  : "No hay Pokémon que coincidan con los filtros aplicados. Prueba ajustando los criterios."}
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedTypes([]);
                  setPriceRange([0, 150]);
                  setSortBy("id");
                }}
                className="bg-gray-800 hover:bg-black text-white px-6 py-3 rounded-lg font-medium"
              >
                Limpiar Todos los Filtros
              </button>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-500">
                Ordenado por:{" "}
                {sortBy === "id"
                  ? "Número"
                  : sortBy === "name"
                  ? "Nombre (A-Z)"
                  : sortBy === "name-desc"
                  ? "Nombre (Z-A)"
                  : sortBy === "price-asc"
                  ? "Precio (Menor a Mayor)"
                  : sortBy === "price-desc"
                  ? "Precio (Mayor a Menor)"
                  : "Stock Disponible"}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPokemons.map((pokemon) => (
                  <PokemonCard
                    key={`${pokemon.id}-${pokemon.stock}`}
                    pokemon={pokemon}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <CartSidebar />
      </div>
    </CartProvider>
  );
}

export default App;
