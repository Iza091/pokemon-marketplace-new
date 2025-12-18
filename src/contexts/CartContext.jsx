import { createContext, useContext, useEffect, useState } from "react";
import { Cart } from "../classes/Cart";
import { CartItem } from "../classes/CartItem";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart] = useState(() => new Cart());
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCart = () => {
      try {
        const stored = localStorage.getItem("pokemon_cart");
        if (stored) {
          const parsedItems = JSON.parse(stored);

          const restoredMap = new Map();
          for (const [id, raw] of parsedItems) {
            try {
              const qty = raw.quantity || 1;
              const pokemon = raw.pokemon || {};
              const item = new CartItem(pokemon, qty);
              restoredMap.set(id, item);
            } catch (err) {
              console.warn("Failed to reconstruct cart item:", err);
            }
          }

          cart.items = restoredMap;
          setItems(Array.from(cart.items.values()));
        }
      } catch (error) {
        console.error("Error loading cart:", error);
        localStorage.removeItem("pokemon_cart");
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, [cart]);

  const addToCart = (pokemon, quantity = 1) => {
    try {
      cart.addItem(pokemon, quantity);
      updateItemsState();
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const removeFromCart = (pokemonId) => {
    cart.removeItem(pokemonId);
    updateItemsState();
  };

  const updateItemQuantity = (pokemonId, quantity) => {
    cart.updateQuantity(pokemonId, quantity);
    updateItemsState();
  };

  const clearCart = () => {
    cart.clear();
    setItems([]);
  };

  const updateItemsState = () => {
    setItems(Array.from(cart.items.values()));
  };

  const value = {
    items,
    isLoading,
    addToCart,
    removeFromCart,
    updateItemQuantity,
    clearCart,
    total: cart.calculateTotal(),
    itemCount: cart.getItemCount(),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
