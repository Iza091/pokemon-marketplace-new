export default function ErrorScreen({ error, onRetry }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold mb-2 text-gray-800">
          Error de Conexión
        </h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <div className="space-y-3">
          <button
            onClick={onRetry}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
          >
            Reintentar
          </button>
          <button
            onClick={() => {
              // Opción offline básica
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
              // Necesitarías manejar esto en App.js o con contexto
              window.location.reload();
            }}
            className="w-full border border-gray-300 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium"
          >
            Usar Modo Demo
          </button>
        </div>
      </div>
    </div>
  );
}
