
export class Recipe {
  name: string;
  type: string;
  roundedRating: number;
  rating: number;
  ratings: number;
  imageUrl: string;
  ingredients: Array<RecipeItem>;
  description: string;
  totalCost: number;
  selectedAmount: number;
  steps: Array<string>;
  _id: string;

  constructor(_name: string, _type: string, _rating: number, _ratings: number, _imageUrl: string, _ingredients: Array<RecipeItem>, _dbId: string, _steps: Array<string>, _description: string) {
    this._id = _dbId;
    this.name = _name;
    this.type = _type;
    this.rating = _rating;
    this.ratings = _ratings;
    this.imageUrl = _imageUrl;
    this.ingredients = _ingredients;
    this.totalCost = this.TotalCost(_ingredients);
    this.selectedAmount = 0;
    this.description = _description;
    this.steps = _steps;
    this.roundedRating = Math.floor(_rating);
  }

  private TotalCost(items: Array<RecipeItem>) : number {
    var runningTotal = 0;

    items.forEach((item) => {
      runningTotal += item.cost
    })

    return runningTotal;
  }

  public getCost(): string {
    var total = 0;
    this.ingredients.forEach(ingredient => {
      total += ingredient.getCost();
    });
    return total.toFixed(2);
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
    this.cost = _cost;
    this.servingSize = _servingSize;
    this.servingMetric = _servingMetric;
  }

  public getTotalRequired(): string{
    let amount = this.quantity * this.servingSize;
    return `${amount} ${this.servingMetric}`;
  }

  public getCost(): number{
    return this.cost * this.quantity;
  }
}

export class RecipeBuilder{
  public static fromForm(name:any, type:any, description:any): Recipe{
    return new Recipe(
        name, type, 0, 0, "no-image.jpeg", [], "id", [], description
      );
  }
}
