import { RecipeItem } from "./recipe.type";

export class ShoppingList {
  items: Array<ShoppingListItem>;

  constructor() {
    this.items = [];
  }

  public add(newItem: ShoppingListItem): void {
    let added = false;
    this.items.forEach((item) => {
      if (newItem.name == item.name) {
        item.amount += newItem.amount;
        added = true;
      }
    });

    if (!added) {
      this.items.push(newItem);
    }
  }

  public remove(itemToRemove: ShoppingListItem): void {
    this.items.forEach((item) => {
      if (item.name == itemToRemove.name) {
        item.amount -= itemToRemove.amount;
      }
    });
  }

  public getTotalCost(): string {
    let runningTotal = 0;
    this.items.forEach((item) => {
      runningTotal += item.amount * item.costPerItem;
    });
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
  constructor(_recipeItem: RecipeItem) {
    this.name = _recipeItem.name;
    this.item = _recipeItem;
    this.amount = _recipeItem.quantity;
    this.costPerItem = _recipeItem.cost;
    this.servingSize = _recipeItem.servingSize;
    this.servingMetric = _recipeItem.servingMetric;
  }

  public getShoppingListString(): string {
    const total = this.amount * this.servingSize;
    return `${this.name} - ${total}${this.servingMetric}`;
  }
}
