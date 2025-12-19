import { useEffect, useState } from "react";
import CartSidebar from "./components/CartSidebar";
import ErrorScreen from "./components/ErrorScreen";
import Filters from "./components/Filters";
import Header from "./components/Header";
import LoadingScreen from "./components/LoadingScreen";
import PokemonCard from "./components/PokemonCard";
import ScrollToTop from "./components/ScrollToTop";
import { CartProvider } from "./contexts/CartContext";
import { usePokemonFilters } from "./hooks/usePokemonFilters";
import { fetchPokemons } from "./services/pokemonService";

function App() {
  // Estados principales
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros
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
  } = usePokemonFilters(pokemons);

  useEffect(() => {
    const loadPokemons = async () => {
      try {
        setLoading(true);
        const data = await fetchPokemons(151);
        setPokemons(data);
      } catch (err) {
        setError(err.message || "Error al cargar los Pokémon");
      } finally {
        setLoading(false);
      }
    };

    loadPokemons();
  }, []);

  useEffect(() => {
    if (pokemons.length === 0) return;

    const interval = setInterval(() => {
      setPokemons((prev) =>
        prev.map((p) => {
          if (Math.random() < 0.3) {
            const change = Math.random() < 0.5 ? -1 : 1;
            const newStock = Math.max(
              0,
              p.stock + change * Math.floor(Math.random() * 3)
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
  }, [pokemons.length]);

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

  const clearAllFilters = () => {
    setSearch("");
    setSelectedTypes([]);
    setPriceRange([0, 150]);
    setSortBy("id");
  };

  if (loading && pokemons.length === 0) {
    return <LoadingScreen count={pokemons.length} />;
  }

  if (error && pokemons.length === 0) {
    return <ErrorScreen error={error} onRetry={reloadPokemons} />;
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
          />

          {selectedTypes.length > 0 ||
          priceRange[0] > 0 ||
          priceRange[1] < 150 ? (
            <div className="mb-4 flex flex-wrap gap-2">
              {selectedTypes.length > 0 && (
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
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
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center">
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
          ) : null}

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Pokémones Disponibles
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

          {filteredPokemons.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">
                No se encontraron Pokémon
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {search
                  ? `No hay Pokémon que coincidan con "${search}".`
                  : "Prueba ajustando los filtros."}
              </p>
              <button
                onClick={clearAllFilters}
                className="bg-gray-800 hover:bg-black text-white px-6 py-3 rounded-lg font-medium"
              >
                Limpiar Filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPokemons.map((pokemon) => (
                <PokemonCard
                  key={`${pokemon.id}-${pokemon.stock}`}
                  pokemon={pokemon}
                />
              ))}
            </div>
          )}
        </div>

        <CartSidebar />
        <ScrollToTop />
      </div>
    </CartProvider>
  );
}

export default App;
