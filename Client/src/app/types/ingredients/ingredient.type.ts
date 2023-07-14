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
  calories: number;
  fat: number;
  carbohydrates: number;
  protein: number;
  _id: string;
  constructor(_name: string, _cost: number, _servingSize: number, _servingMetric: string, _id: string,
    _calories: number, _fat: number, _carbs: number, _protein: number) {
    this.name = _name;
    this.cost = _cost;
    this.servingSize = _servingSize;
    this.servingMetric = _servingMetric;
    this._id = _id;
    this.calories = _calories;
    this.fat = _fat;
    this.carbohydrates = _carbs;
    this.protein = _protein;
  }

  getCost(): string {
    return `${this.cost.toFixed(2)}`;
  }
}

export class IngredientBuilder {
  public static fromForm(
    name: any, 
    cost: any, 
    servingSize: any, 
    servingMetric: any, 
    id: any, 
    calories: any, 
    fat: any, 
    carbohydrates: any, 
    protein: any): Ingredient {
    return new Ingredient(name, cost, servingSize, servingMetric, id, calories, fat, carbohydrates, protein);
  }

  public static fromArray(array: Array<string>): Ingredient {
    let name = array[0];
    let cost = Number(array[1]);
    let servingSize = Number(array[2]);
    let servingMetric = array[3];
    let id = array[4];
    let calories = Number(array[5]);
    let fat = Number(array[6]);
    let carbs = Number(array[7]);
    let protein = Number(array[8]);

    return new Ingredient(
      name, 
      cost, 
      servingSize, 
      servingMetric, 
      id, 
      calories, 
      fat, 
      carbs, 
      protein
      );
  }
}

