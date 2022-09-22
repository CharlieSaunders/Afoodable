import { Component } from '@angular/core';
import { Recipe, RecipeItem } from '../types/recipes/recipe.type';
import { ShoppingList, ShoppingListItem } from '../types/recipes/shopping-list.type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  public sidebarShow: boolean = false;
  public totalSelectedRecipes: number = 0;
  public searchText: string = "";
  public router!: Router;

  public recipes!: Array<Recipe>;
  public shoppingList: ShoppingList = new ShoppingList;

  constructor(_router: Router) {
    this.router = _router;
  }

  public ngOnInit(): void {
    this.recipes = [
      new Recipe(0, "Sea Bass & Salad", "Dinner", 3, "sea-bass.jpg", [new RecipeItem("Sea Bass", 1, 2, 1, " ")]),
      new Recipe(1, "*Pepperoni Pizza", "Lunch", 3, "pepperoni-pizza.jpg", [new RecipeItem("Premade Pepperoni Pizza", 1, 1, 1, " ")]),
      new Recipe(2, "Baked Potato", "Lunch", 4, "baked-potato-cheese-beans.jpg", [new RecipeItem("Potato", 1, 0.3, 1, " ")]),
      new Recipe(3, "Mushroom Risotto", "Dinner", 4, "risotto.jpg", [new RecipeItem("Arborio Rice", 1, 1, 65, "g")]),
      new Recipe(4, "Poached Egg on Toast", "Breakfast", 4, "poached-eggs-on-toast.jpeg", [new RecipeItem("Egg", 2, 0.2, 1, " ")]),
      new Recipe(5, "Steak & Mash", "Dinner", 5, "steak-and-mash.jpg", [new RecipeItem("Steak", 1, 4, 1, " ")]),
      new Recipe(6, "Spaghetti Carbonara", "Dinner", 4, "carbonara.jpg", [new RecipeItem("Pasta", 1, 0.2, 75, "g")]),
      new Recipe(7, "Camembert & Garlic Bread", "Dinner", 4, "camembert-garlic-bread.jpg", [new RecipeItem("Camembert", 1, 1, 1, " ")]),
      new Recipe(8, "Overnight Weetabix", "Breakfast", 3, "overnight-weetabix.jpg", [new RecipeItem("Weetabix", 2, 0.2, 1, " ")]),
    ];
  }

  public navigateToRecipe(id: number) : void {
    this.router.navigate([`/recipe/${id}`]);
  }

  public selectRecipe(recipe:Recipe) : void {
    this.recipes.forEach((selectedRecipe) => {
      if(selectedRecipe.name == recipe.name)
      {
        selectedRecipe.selectedAmount += 1;
        this.totalSelectedRecipes += 1;
        this.updateShoppingList(selectedRecipe);
      } 
    });
  }

  public unselectRecipe(recipe:Recipe) : void {
    this.recipes.forEach((selectedRecipe) => {
      if(selectedRecipe.name == recipe.name)
      {
        selectedRecipe.selectedAmount -= 1;
        this.totalSelectedRecipes -= 1;
        this.removeFromShoppingList(selectedRecipe);
      } 
    });
  }

  private updateShoppingList(selectedRecipe:Recipe): void {
    selectedRecipe.ingredients.forEach(ingredient => {
      this.shoppingList.add(new ShoppingListItem(ingredient));
    });
  }

  private removeFromShoppingList(selectedRecipe: Recipe): void {
    selectedRecipe.ingredients.forEach(ingredient => {
      this.shoppingList.remove(new ShoppingListItem(ingredient));
    });
  }
}