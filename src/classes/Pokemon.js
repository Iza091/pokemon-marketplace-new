export class Pokemon {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.image =
      data.image ||
      data.sprites?.front_default ||
      data.sprites?.other?.dream_world?.front_default ||
      data.sprites?.other?.["official-artwork"]?.front_default ||
      "";
    this.types = data.types?.map((t) => t.type?.name || t) || [];
    this.price = data.price || Math.floor(Math.random() * 100) + 10;
    this.stock = data.stock || Math.floor(Math.random() * 50) + 1;
    this.height = data.height;
    this.weight = data.weight;
    this.heightDisplay = data.heightDisplay || "0 m (0'00\")";
    this.weightDisplay = data.weightDisplay || "0 kg (0 lbs)";
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
