export default function LoadingScreen({ count = 0 }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="text-center">
        {/* Pokébola animada */}
        <div className="relative animate-bounce mb-8">
          <div className="w-24 h-24 mx-auto">
            <div className="relative w-full h-full">
              <div className="absolute top-0 left-0 w-full h-1/2 bg-red-500 rounded-t-full border-4 border-black"></div>
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-white rounded-b-full border-4 border-black border-t-0"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full border-4 border-black z-10"></div>
              <div className="absolute top-1/2 left-0 w-full h-1 bg-black"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-red-500 rounded-full border-2 border-black z-20"></div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800">
          ¡Cargando tu Poketienda
        </h2>
        <p className="mt-2 text-gray-600">
          Cargando los pokemónes, por favor espera...
        </p>

        {/* Progress bar */}
        <div className="mt-6 w-64 mx-auto bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(count / 151) * 100}%` }}
          ></div>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          {count > 0 ? `${count}/151 Pokémon cargados` : "Iniciando..."}
        </div>
      </div>
    </div>
  );
}
