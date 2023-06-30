import { RecipeItem } from "./recipe.type";

export class ShoppingList {
  items:  { [id: string]: ShoppingListItem ; };

  constructor() {
    this.items = {};
  }

  public add(newItem: ShoppingListItem): void {
    const exists = this.items[newItem._id] != undefined;
    if(exists){
      this.items[newItem._id].amount += newItem.amount;
    }
    else{
      this.items[newItem._id] = newItem;
    }
  }

  public remove(itemToRemove: ShoppingListItem): void {
    const exists = this.items[itemToRemove._id] != undefined;
    if(exists){
      const node = this.items[itemToRemove._id];
      node.amount -= itemToRemove.amount;
      if(node.amount === 0){
        delete this.items[itemToRemove._id];
      }
    }
  }

  public getTotalCost(): string {
    let runningTotal = 0;
    for(const key in this.items) {
      const node = this.items[key];
      runningTotal += node.amount * node.costPerItem;
    }
    return runningTotal.toFixed(2);
  }
}

export class ShoppingListItem {
  name: string;
  item: RecipeItem;
  amount: number;
  costPerItem: number;
  servingSize: number;
  servingMetric: string;
  _id: string;
  constructor(_recipeItem: RecipeItem) {
    this.name = _recipeItem.name;
    this.item = _recipeItem;
    this.amount = _recipeItem.quantity;
    this.costPerItem = _recipeItem.cost;
    this.servingSize = _recipeItem.servingSize;
    this.servingMetric = _recipeItem.servingMetric;
    this._id = _recipeItem._id;
  }

  public getShoppingListString(): string {
    const total = this.amount * this.servingSize;
    return `${this.name} - ${total}${this.servingMetric}`;
  }
}
