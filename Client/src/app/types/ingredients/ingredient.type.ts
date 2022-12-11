export class IngredientDictionary{
  Ingredients: any;
  constructor(){
    this.Ingredients = {};
  }

  public Add(ingredient: Ingredient): void{
    this.Ingredients[ingredient._id] = ingredient;
  }

  public GetAsArray(): Array<Ingredient> {
    return Object.values(this.Ingredients);
  }
}

export class Ingredient {
  name: string;
  cost: number;
  servingSize: number;
  servingMetric: string;
  _id: string;
  constructor(_name: string, _cost: number, _servingSize: number, _servingMetric: string, _id: string) {
    this.name = _name;
    this.cost = _cost;
    this.servingSize = _servingSize;
    this.servingMetric = _servingMetric;
    this._id = _id;
  }

  getCost() : string {
    return `${this.cost.toFixed(2)}`;
  }
}

export class IngredientBuilder {
  public static fromForm(name: any, cost: any, servingSize: any, servingMetric: any, id: any): Ingredient {
    return new Ingredient(name, cost, servingSize, servingMetric, id);
  }
}
