export class Pokemon {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    // Soporta tanto 'image' como 'sprites'
    this.image =
      data.image ||
      data.sprites?.other?.["official-artwork"]?.front_default ||
      data.sprites?.front_default ||
      "";
    this.types = data.types?.map((t) => t.type?.name || t) || [];
    this.price = data.price || Math.floor(Math.random() * 100) + 10;
    this.stock = data.stock || Math.floor(Math.random() * 50) + 1;
    this.height = data.height;
    this.weight = data.weight;
  }

  get formattedPrice() {
    return `$${this.price}`;
  }

  get formattedName() {
    return this.name.charAt(0).toUpperCase() + this.name.slice(1);
  }

  decreaseStock(amount = 1) {
    if (this.stock >= amount) {
      this.stock -= amount;
      return true;
    }
    return false;
  }

  increaseStock(amount = 1) {
    this.stock += amount;
  }
}
