
export class Recipe {
  reference: string;
  name: string;
  type: string;
  rating: number;
  imageUrl: string;
  ingredients: Array<RecipeItem>;
  description: string;
  totalCost: number;
  selectedAmount: number;
  _id: string;

  constructor( _reference: string, _name: string, _type: string, _rating: number, _imageUrl: string, _ingredients: Array<RecipeItem>, _dbId: string, _description: string) {
    this.reference = _reference;
    this._id = _dbId;
    this.name = _name;
    this.type = _type;
    this.rating = _rating;
    this.imageUrl = _imageUrl;
    this.ingredients = _ingredients;
    this.totalCost = this.TotalCost(_ingredients);
    this.selectedAmount = 0;
    this.description = _description;
  }

  private TotalCost(items: Array<RecipeItem>) : number {
    var runningTotal = 0;

    items.forEach((item) => {
      runningTotal += item.cost
    })

    return runningTotal;
  }
}

export class RecipeItem {
  name: string;
  quantity: number;
  cost: number;
  servingSize: number;
  servingMetric: string;

  constructor(_name: string, _quantity: number, _cost: number, _servingSize: number, _servingMetric: string) {
    this.name = _name;
    this.quantity = _quantity;
    this.cost = _quantity * _cost;
    this.servingSize = _servingSize;
    this.servingMetric = _servingMetric;
  }
}
