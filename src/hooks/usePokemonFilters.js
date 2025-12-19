import { useEffect, useMemo, useState } from "react";
import { fetchPokemonTypes } from "../services/pokemonService";

export const usePokemonFilters = (pokemons) => {
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 150]);
  const [sortBy, setSortBy] = useState("id");
  const [availableTypes, setAvailableTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);

  useEffect(() => {
    const loadTypes = async () => {
      try {
        setLoadingTypes(true);
        const types = await fetchPokemonTypes();
        setAvailableTypes(types);
      } catch (error) {
        console.error("Error loading types:", error);

        setAvailableTypes([
          "normal",
          "fire",
          "water",
          "grass",
          "electric",
          "ice",
          "fighting",
          "poison",
          "ground",
          "flying",
          "psychic",
          "bug",
          "rock",
          "ghost",
          "dark",
          "dragon",
          "steel",
          "fairy",
        ]);
      } finally {
        setLoadingTypes(false);
      }
    };

    loadTypes();
  }, []);

  const filteredPokemons = useMemo(() => {
    let filtered = [...pokemons];

    if (search.trim()) {
      const searchTerm = search.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm) ||
          p.id.toString().includes(searchTerm)
      );
    }

    if (selectedTypes.length > 0) {
      filtered = filtered.filter((p) =>
        selectedTypes.some((type) => p.types.includes(type))
      );
    }

    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    if (selectedTypes.length > 0) {
      const desired = selectedTypes.map((t) => t.toLowerCase());

      const scoreFor = (p) => {
        const types = (p.types || []).map((t) => t.toLowerCase());

        const matchCount = desired.filter((d) => types.includes(d)).length;

        const exactSet =
          matchCount === desired.length && types.length === desired.length;

        const primaryMatch = types[0] === desired[0] ? 1 : 0;

        const secondaryMatch = desired[1] && types[1] === desired[1] ? 1 : 0;

        let score = 0;
        if (exactSet) score += 1000;
        score += matchCount * 100;
        score += primaryMatch * 30;
        score += secondaryMatch * 15;
        return score;
      };

      filtered.sort((a, b) => {
        const sa = scoreFor(a);
        const sb = scoreFor(b);
        if (sa !== sb) return sb - sa;

        return a.id - b.id;
      });
    } else {
      filtered.sort((a, b) => {
        switch (sortBy) {
          case "price-asc":
            return a.price - b.price;
          case "price-desc":
            return b.price - a.price;
          case "name":
            return a.name.localeCompare(b.name);
          case "name-desc":
            return b.name.localeCompare(a.name);
          case "stock":
            return b.stock - a.stock;
          case "id-desc":
            return b.id - a.id;
          default:
            return a.id - b.id;
        }
      });
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
    loadingTypes,
  };
};
