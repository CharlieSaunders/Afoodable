import { Macros } from "../generics/macros.type";
import { Ingredient } from "../ingredients/ingredient.type";

export class Recipe {
  name: string;
  type: string;
  roundedRating: number;
  rating: number;
  ratings: number;
  imageUrl: string;
  ingredients: Array<RecipeItem>;
  description: string;
  totalCost: string;
  cost: number;
  selectedAmount: number;
  steps: Array<string>;
  serves: number;
  _id: string;
  macros: Macros;
  favourite: boolean;

  constructor(_name: string, _type: string, _rating: number, _ratings: number, _imageUrl: string,
    _ingredients: Array<RecipeItem>, _dbId: string, _steps: Array<string>, _description: string,
    _serves: number, _calories: number, _fat: number, _carbs: number, _protein: number, _fav: boolean) {
    this._id = _dbId;
    this.name = _name;
    this.type = _type;
    this.rating = _rating;
    this.ratings = _ratings;
    this.imageUrl = _imageUrl;
    this.ingredients = _ingredients;
    this.cost = this.TotalCost(_ingredients);
    this.totalCost = this.cost.toFixed(2);
    this.selectedAmount = 0;
    this.description = _description;
    this.steps = _steps;
    this.roundedRating = Math.floor(_rating);
    this.serves = _serves;
    this.favourite = _fav;
    this.macros = {
      calories: _calories.toFixed(2),
      fat: _fat.toFixed(2),
      carbohydrates: _carbs.toFixed(2),
      protein: _protein.toFixed(2),
    };
  }

  private TotalCost(items: Array<RecipeItem>): number {
    let runningTotal = 0;

    items.forEach((item) => {
      runningTotal += (item.cost * item.quantity);
    });
    return runningTotal;
  }
}

export class RecipeItem {
  name: string;
  quantity: number;
  cost: number;
  servingSize: number;
  servingMetric: string;
  _id: string;

  constructor(_name: string, _quantity: number, _cost: number, _servingSize: number, _servingMetric: string, id: string) {
    this.name = _name;
    this.quantity = _quantity;
    this.cost = _cost;
    this.servingSize = _servingSize;
    this.servingMetric = _servingMetric;
    this._id = id;
  }

  public getTotalRequired(): string {
    const amount = this.quantity * this.servingSize;
    return `${amount} ${this.servingMetric}`;
  }

  public getCost(): number {
    return this.cost * this.quantity;
  }
}

export class RecipeBuilder {
  public static fromForm(name: any, type: any, description: any): Recipe {
    return new Recipe(name, type, 0, 0, "no-image.jpeg", [], "id", [], description, 1, 0, 0, 0, 0, false);
  }
}

export class RecipeItemBuilder {
  public static fromIngredient(ingredient: Ingredient): RecipeItem {
    return new RecipeItem(ingredient.name, 1, ingredient.cost, ingredient.servingSize, ingredient.servingMetric, ingredient._id);
  }
}
