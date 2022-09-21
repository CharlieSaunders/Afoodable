export class RecipeItem {
  name: string;
  quantity: number;
  cost: number;

  constructor(_name: string, _quantity: number, _cost: number) {
    this.name = _name;
    this.quantity = _quantity;
    this.cost = _quantity * _cost;
  }
}
