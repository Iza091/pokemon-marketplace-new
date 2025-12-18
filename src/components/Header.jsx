import { Search, User } from "lucide-react";
import { useState } from "react";
import { useCart } from "../contexts/CartContext";

const Header = ({ search = "", onSearchChange = () => {} }) => {
  const { itemCount } = useCart();
  const [searchQuery, setSearchQuery] = useState(search);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearchChange(searchQuery);
  };

  return (
    <header className="bg-gradient-to-r from-blue-500 to-red-600 text-white shadow-lg sticky top-0 z-[10]">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-10 h-10">
              <img
                src="./pokebola.svg"
                alt="Pokéball"
                className="w-full h-full object-contain animate-spin-slow"
              />
            </div>
            <div className="flex-1 md:flex-none">
              <h1 className="text-2xl font-bold tracking-tight">
                Pokémon Marketplace
              </h1>
              <p className="text-sm opacity-90 hidden md:block">
                Atrapa todos los Pokémon
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSearch}
            className="w-full md:flex-1 md:max-w-2xl"
          >
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  onSearchChange(e.target.value);
                }}
                placeholder="¿Quién es ese Pokémon?"
                className="w-full pl-12 pr-4 py-3 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-500"
              />
            </div>
          </form>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-normal">
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl hover:bg-white/30 transition-all active:scale-95"
              >
                <User size={20} />
                <div className="text-left">
                  <p className="text-xs opacity-90 md:hidden">Entrenador</p>
                  <p className="font-bold text-sm md:text-base md:hidden">
                    Ash Ketchum
                  </p>
                  <span className="hidden md:inline ml-2 text-sm md:text-base">
                    Ash Ketchum
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
