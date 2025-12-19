# Instalación y preparación

Clona el repositorio en vs code, una vez abierto procedemos a instalar sus dependencias

```$bash
pnpm install
```

Una vez se instalen todas las dependencias, ejecutamos en local

```
pnpm dev
```

# Arquitectura del Pokemon Marketplace

Este es un marketplace de Pokémon construido con React que permite a los usuarios:

- Explorar y filtrar Pokémon
- Agregar productos al carrito
- Realizar compras
- Gestionar el carrito de compras

---

## Estructura de la Aplicación

### 📁 Carpetas Principales

#### **`classes/`** - Modelos de Datos

Define la estructura de los objetos principales:

- **`Pokemon.js`**: Clase que representa un Pokémon con sus atributos (nombre, precio, tipo, imagen, etc.)
- **`Cart.js`**: Gestiona la lógica del carrito de compras (agregar, eliminar, calcular totales)
- **`CartItem.js`**: Representa un artículo individual en el carrito

#### **`components/`** - Componentes de React

Bloques reutilizables de la interfaz:

- **`Header.jsx`**: Encabezado de la aplicación (navegación, logo)
- **`PokemonCard.jsx`**: Tarjeta individual que muestra un Pokémon
- **`Filters.jsx`**: Panel de filtros (búsqueda, tipo, precio, etc.)
- **`CartSidebar.jsx`**: Barra lateral que muestra el carrito
- **`ErrorScreen.jsx`**: Pantalla de error cúando no hay conexión
- **`LoadingScreen.jsx`**: Pantalla de carga
- **`ScrollToTop.jsx`**: "Flecita" que regresa hacía arriba para no tener que scrollear tanto

#### **`contexts/`** - Gestión Global de Estado

- **`CartContext.jsx`**: Context de React que comparte el carrito en toda la aplicación (evita pasar props por muchos niveles)

#### **`hooks/`** - Lógica Reutilizable

- **`usePokemonFilters.js`**: Hook personalizado que maneja toda la lógica de filtrado de Pokémon

#### **`services/`** - Comunicación con Datos

- **`pokemonService.js`**: Obtiene datos de Pokémon (desde API o JSON local)

#### **`utils/`** - Utilidades

- **`constants.js`**: Contiene valores constantes (precios, tipos válidos, URLs, etc.)

#### **`assets/`** - Recursos Estáticos

Imágenes, iconos y otros archivos multimedia

#### **Archivos Raíz**

- **`main.jsx`**: Punto de entrada de la aplicación
- **`App.jsx`**: Componente principal que orquesta todo
- **`App.css` / `index.css`**: Estilos globales

---
