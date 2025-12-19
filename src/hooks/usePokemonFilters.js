import { useMemo, useState } from "react";

const PRICE_CATEGORIES = [
  { min: 0, max: 30 },
  { min: 31, max: 70 },
  { min: 71, max: 151 },
];

export const usePokemonFilters = (pokemons) => {
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 151]);
  const [sortBy, setSortBy] = useState("id");

  const availableTypes = useMemo(() => {
    const types = new Set();
    pokemons.forEach((pokemon) => {
      pokemon.types?.forEach((type) => types.add(type));
    });
    return Array.from(types).sort();
  }, [pokemons]);

  const filteredPokemons = useMemo(() => {
    let filtered = [...pokemons];

    if (search.trim()) {
      const searchTerm = search.toLowerCase().trim();
      filtered = filtered.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchTerm)
      );
    }

    if (selectedTypes.length > 0) {
      filtered = filtered.filter((pokemon) =>
        selectedTypes.some((type) => pokemon.types.includes(type))
      );
    }

    filtered = filtered.filter(
      (pokemon) =>
        pokemon.price >= priceRange[0] && pokemon.price <= priceRange[1]
    );

    const isInPriceCategory = PRICE_CATEGORIES.some(
      (category) =>
        priceRange[0] === category.min && priceRange[1] === category.max
    );

    if (isInPriceCategory) {
      filtered.sort((a, b) => a.price - b.price);
    } else {
      switch (sortBy) {
        case "name":
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "name-desc":
          filtered.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case "price-asc":
          filtered.sort((a, b) => a.price - b.price);
          break;
        case "price-desc":
          filtered.sort((a, b) => b.price - a.price);
          break;
        case "stock":
          filtered.sort((a, b) => b.stock - a.stock);
          break;
        case "id":
        default:
          filtered.sort((a, b) => a.id - b.id);
          break;
      }
    }

    return filtered;
  }, [pokemons, search, selectedTypes, priceRange, sortBy]);

  return {
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
  };
};
