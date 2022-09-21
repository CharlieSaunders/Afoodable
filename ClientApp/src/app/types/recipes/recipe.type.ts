import { RecipeItem } from './recipe-item.type';

export class Recipe {
  name: string;
  type: string;
  rating: number;
  imageUrl: string;
  ingredients: Array<RecipeItem>;
  totalCost: number;

  constructor(_name: string, _type: string, _rating: number, _imageUrl: string, _ingredients: Array<RecipeItem>) {
    this.name = _name;
    this.type = _type;
    this.rating = _rating;
    this.imageUrl = _imageUrl;
    this.ingredients = _ingredients;
    this.totalCost = this.TotalCost(_ingredients);
  }

  private TotalCost(items: Array<RecipeItem>) : number {
    var runningTotal = 0;

    items.forEach((item) => {
      runningTotal += item.cost
    })

    return runningTotal;
  }
}
