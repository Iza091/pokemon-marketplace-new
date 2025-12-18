export class CartItem {
  constructor(pokemon, quantity = 1) {
    this.id = pokemon.id;
    this.pokemon = pokemon;
    this.quantity = quantity;
    this.unitPrice = pokemon.price;
  }

  get totalPrice() {
    return this.unitPrice * this.quantity;
  }

  increaseQuantity(amount = 1) {
    this.quantity += amount;
  }

  decreaseQuantity(amount = 1) {
    this.quantity = Math.max(0, this.quantity - amount);
  }
}
