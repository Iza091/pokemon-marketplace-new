import { CartItem } from "./CartItem";

export class Cart {
  constructor() {
    this.items = new Map();
    this.loadFromStorage();
  }

  addItem(pokemon, quantity = 1) {
    if (pokemon.stock < quantity) {
      throw new Error("Not enough stock available");
    }

    const existingItem = this.items.get(pokemon.id);

    if (existingItem) {
      existingItem.increaseQuantity(quantity);
    } else {
      const newItem = new CartItem(pokemon, quantity);
      this.items.set(pokemon.id, newItem);
    }

    this.saveToStorage();
  }

  removeItem(pokemonId) {
    this.items.delete(pokemonId);
    this.saveToStorage();
  }

  updateQuantity(pokemonId, quantity) {
    const item = this.items.get(pokemonId);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(pokemonId);
      } else {
        item.quantity = quantity;
        this.saveToStorage();
      }
    }
  }

  calculateTotal() {
    let total = 0;
    for (const item of this.items.values()) {
      total += item.totalPrice;
    }
    return total;
  }

  getItemCount() {
    return Array.from(this.items.values()).reduce(
      (sum, item) => sum + item.quantity,
      0
    );
  }

  saveToStorage() {
    const serialized = JSON.stringify(Array.from(this.items.entries()));
    localStorage.setItem("pokemon_cart", serialized);
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem("pokemon_cart");
      if (stored) {
        const parsed = JSON.parse(stored);
        // Note: We'll need to reconstruct CartItem objects when loading
        // This is handled by the CartContext
      }
    } catch (error) {
      console.error("Error loading cart from storage:", error);
    }
  }

  clear() {
    this.items.clear();
    localStorage.removeItem("pokemon_cart");
  }
}
