import { Check, ChevronDown, Filter, RotateCcw, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { POKEMON_TYPES, TYPE_COLORS } from "../utils/constants";

const SORT_OPTIONS = [
  { value: "id", label: "Por defecto" },
  { value: "name", label: "Nombre A-Z" },
  { value: "price-asc", label: "Precio: Menor a Mayor" },
  { value: "price-desc", label: "Precio: Mayor a Menor" },
  { value: "stock", label: "Mayor Stock" },
];

const PRICE_CATEGORIES = [
  {
    id: "economico",
    name: "Pokébola",
    sprite: "poke",
    label: "Económico",
    description: "Pokémones comunes",
    min: 0,
    max: 30,
    color: "bg-red-100",
    borderColor: "border-red-300",
    textColor: "text-red-700",
    activeColor: "bg-red-500",
    spriteColor: "text-red-400",
  },
  {
    id: "exclusivo",
    name: "Superbola",
    sprite: "great",
    label: "Exclusivo",
    description: "Pokémones exclusivos",
    min: 31,
    max: 70,
    color: "bg-blue-100",
    borderColor: "border-blue-300",
    textColor: "text-blue-700",
    activeColor: "bg-blue-500",
    spriteColor: "text-blue-400",
  },
  {
    id: "legendario",
    name: "Ultrabola",
    sprite: "ultra",
    label: "Legendario",
    description: "Pokémones legendarios",
    min: 71,
    max: 151,
    color: "bg-yellow-100",
    borderColor: "border-yellow-300",
    textColor: "text-yellow-700",
    activeColor: "bg-yellow-500",
    spriteColor: "text-yellow-400",
  },
];

export const PokeballSprite = ({ type, className = "w-6 h-6" }) => {
  const getSpriteUrl = (spriteType) => {
    return `https://raw.githubusercontent.com/msikma/pokesprite/master/items/ball/${spriteType}.png`;
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src={getSpriteUrl(type)}
          alt={`${type} ball`}
          className="w-full h-full object-contain"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.parentElement.innerHTML = `
              <div class="w-full h-full rounded-full border-2 flex items-center justify-center text-xs font-bold">
                ${type.charAt(0).toUpperCase()}
              </div>
            `;
          }}
        />
      </div>
    </div>
  );
};

const Filters = ({
  onSearchChange,
  onTypeChange,
  onPriceRangeChange,
  onSortChange,
  availableTypes = [],
}) => {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 151]);
  const [selectedPriceCategory, setSelectedPriceCategory] = useState(null);
  const [sortBy, setSortBy] = useState("id");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isTypesDropdownOpen, setIsTypesDropdownOpen] = useState(false);
  const typesDropdownRef = useRef(null);

  useEffect(() => {
    if (isMobileFiltersOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "auto";
      document.body.style.position = "";
      document.body.style.width = "";
    }

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [isMobileFiltersOpen]);

  const openMobileFilters = () => {
    setIsMobileFiltersOpen(true);
    window.dispatchEvent(
      new CustomEvent("mobileFiltersVisibility", {
        detail: { open: true },
      })
    );
  };

  const closeMobileFilters = () => {
    setIsMobileFiltersOpen(false);
    window.dispatchEvent(
      new CustomEvent("mobileFiltersVisibility", {
        detail: { open: false },
      })
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        typesDropdownRef.current &&
        !typesDropdownRef.current.contains(event.target)
      ) {
        setIsTypesDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTypeToggle = (type) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];
    setSelectedTypes(newTypes);
    onTypeChange(newTypes);
  };

  const handlePriceCategorySelect = (category) => {
    if (selectedPriceCategory?.id === category.id) {
      setSelectedPriceCategory(null);
      setPriceRange([0, 151]);
      onPriceRangeChange([0, 151]);
    } else {
      setSelectedPriceCategory(category);
      setPriceRange([category.min, category.max]);
      onPriceRangeChange([category.min, category.max]);
    }
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setPriceRange([0, 151]);
    setSelectedPriceCategory(null);
    setSortBy("id");
    onTypeChange([]);
    onPriceRangeChange([0, 151]);
    onSortChange("id");
  };

  const formatPrice = (price) => {
    return price === 151 ? "151+" : price;
  };

  return (
    <div className="bg-white border-b  top-0 z-30 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 md:flex items-center gap-6 hidden">
            <div className="relative" ref={typesDropdownRef}>
              <button
                onClick={() => setIsTypesDropdownOpen(!isTypesDropdownOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                  selectedTypes.length > 0
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="text-sm font-medium">
                  {selectedTypes.length > 0
                    ? `Tipos (${selectedTypes.length})`
                    : "Todos los Tipos"}
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    isTypesDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isTypesDropdownOpen && (
                <div className="absolute top-full mt-2 w-72 bg-white border rounded-2xl shadow-xl z-20 p-4 animate-in fade-in zoom-in duration-200">
                  <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {(availableTypes.length > 0
                      ? availableTypes
                      : POKEMON_TYPES
                    ).map((type) => (
                      <button
                        key={type}
                        onClick={() => handleTypeToggle(type)}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs capitalize transition-colors ${
                          selectedTypes.includes(type)
                            ? `${
                                TYPE_COLORS[type] || "bg-gray-200 text-gray-900"
                              } font-semibold`
                            : "hover:bg-gray-100 text-gray-700"
                        }`}
                      >
                        {type}
                        {selectedTypes.includes(type) && <Check size={12} />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col min-w-[300px]">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-2">
                Rango de Precio
              </span>
              <div className="flex items-center gap-3">
                {PRICE_CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handlePriceCategorySelect(category)}
                    className={`flex-1 min-w-[90px] p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center ${
                      selectedPriceCategory?.id === category.id
                        ? `${category.borderColor} ${category.activeColor} text-white transform scale-105 shadow-lg`
                        : `${category.borderColor} ${category.color} ${category.textColor} hover:shadow-md`
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <PokeballSprite
                        type={category.sprite}
                        className="w-10 h-10"
                      />
                      <div className="font-bold text-xs">{category.label}</div>
                    </div>
                    <div className="text-[10px] opacity-80 text-center mb-2">
                      {category.description}
                    </div>
                    <div className="text-xs font-semibold">
                      ${formatPrice(category.min)}-{formatPrice(category.max)}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-gray-500 font-medium">
                Ordenar:
              </span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  onSortChange(e.target.value);
                }}
                className="text-sm font-medium bg-transparent border-none focus:ring-0 cursor-pointer text-gray-700 hover:text-blue-600 transition-colors"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={clearFilters}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              title="Limpiar filtros"
            >
              <RotateCcw size={18} />
            </button>
          </div>

          <button
            onClick={openMobileFilters}
            className="md:hidden flex items-center gap-2 bg-gray-900 text-white px-4 py-3 rounded-full w-full justify-center text-sm font-medium shadow-lg active:scale-95 transition-transform"
          >
            <Filter size={18} />
            Filtros
          </button>
        </div>
      </div>

      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={closeMobileFilters}
          ></div>
          <div className="absolute bottom-0 left-0 right-0 h-[90vh] bg-white rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300 overflow-hidden">
            <div className="h-full flex flex-col">
              <div className="p-6 pb-4 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Filtros</h2>
                  <button
                    onClick={closeMobileFilters}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
                <p className="text-gray-500 text-sm mt-1">
                  Personaliza tu búsqueda de Pokémon
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-lg font-bold text-gray-900">
                      Tipo de Pokémon
                    </label>
                    {selectedTypes.length > 0 && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {selectedTypes.length} seleccionado(s)
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {(availableTypes.length > 0
                      ? availableTypes
                      : POKEMON_TYPES
                    ).map((type) => (
                      <button
                        key={type}
                        onClick={() => handleTypeToggle(type)}
                        className={`px-4 py-3 rounded-xl border transition-all active:scale-95 ${
                          selectedTypes.includes(type)
                            ? `${
                                TYPE_COLORS[type] || "bg-blue-600 text-white"
                              } shadow-lg border-transparent`
                            : "border-gray-200 text-gray-700 hover:border-blue-300"
                        }`}
                      >
                        <span className="text-sm font-medium capitalize">
                          {type}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-lg font-bold text-gray-900">
                      Rango de Precio
                    </label>
                    {selectedPriceCategory && (
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${selectedPriceCategory.textColor} ${selectedPriceCategory.color}`}
                      >
                        {selectedPriceCategory.label}
                      </span>
                    )}
                  </div>
                  <div className="space-y-4">
                    {PRICE_CATEGORIES.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handlePriceCategorySelect(category)}
                        className={`w-full p-4 rounded-2xl border-2 transition-all active:scale-[0.98] ${
                          selectedPriceCategory?.id === category.id
                            ? `${category.borderColor} ${category.activeColor} text-white shadow-xl`
                            : `${category.borderColor} ${category.color} hover:shadow-lg`
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div
                              className={`p-2 rounded-full ${
                                selectedPriceCategory?.id === category.id
                                  ? "bg-white/20"
                                  : "bg-white"
                              }`}
                            >
                              <PokeballSprite
                                type={category.sprite}
                                className="w-8 h-8"
                              />
                            </div>
                            <div className="text-left">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-base">
                                  {category.label}
                                </span>
                                <span
                                  className={`text-xs px-2 py-1 rounded-full ${
                                    selectedPriceCategory?.id === category.id
                                      ? "bg-white/30"
                                      : category.textColor
                                  } ${
                                    selectedPriceCategory?.id === category.id
                                      ? ""
                                      : category.color
                                  }`}
                                >
                                  {category.name}
                                </span>
                              </div>
                              <p className="text-sm opacity-90 mt-1">
                                {category.description}
                              </p>
                            </div>
                          </div>
                          <div
                            className={`text-right font-bold ${
                              selectedPriceCategory?.id === category.id
                                ? "text-white"
                                : category.textColor
                            }`}
                          >
                            <div className="text-lg">
                              ${formatPrice(category.min)}-
                              {formatPrice(category.max)}
                            </div>
                            <div className="text-xs font-normal mt-1">
                              POKEDOLARES
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-bold text-gray-900 mb-4">
                    Ordenar por
                  </label>
                  <div className="space-y-2">
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          onSortChange(option.value);
                        }}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all active:scale-[0.98] ${
                          sortBy === option.value
                            ? "border-blue-500 bg-blue-50 text-blue-700 font-bold"
                            : "border-gray-200 text-gray-700 hover:border-blue-300"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-4 border-t bg-gray-50">
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      clearFilters();
                      closeMobileFilters();
                    }}
                    className="flex-1 py-4 bg-gray-200 text-gray-700 font-bold rounded-xl active:scale-95 transition-transform"
                  >
                    Limpiar Todo
                  </button>
                  <button
                    onClick={closeMobileFilters}
                    className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-transform"
                  >
                    Aplicar Filtros
                  </button>
                </div>
                <div className="text-center text-gray-500 text-xs mt-3 space-y-1">
                  {selectedTypes.length > 0 && (
                    <p>{selectedTypes.length} tipo(s) seleccionado(s)</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filters;
