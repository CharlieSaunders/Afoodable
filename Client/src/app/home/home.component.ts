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
      new Recipe(0, "feb819e1-f126-49ad-87c6-f38d8abca59f", "Sea Bass & Salad", "Dinner", 3, "sea-bass.jpg", [new RecipeItem("Sea Bass", 1, 2, 1, " ")]),
      new Recipe(1, "7cd663ed-e716-44a0-be11-f16ebc664327", "*Pepperoni Pizza", "Lunch", 3, "pepperoni-pizza.jpg", [new RecipeItem("Premade Pepperoni Pizza", 1, 1, 1, " ")]),
      new Recipe(2, "499d881c-a7cc-4532-aa0f-4165d1f5b37d", "Baked Potato", "Lunch", 4, "baked-potato-cheese-beans.jpg", [new RecipeItem("Potato", 1, 0.3, 1, " ")]),
      new Recipe(3, "6146378e-98f4-4741-897e-a11d9e81c71c", "Mushroom Risotto", "Dinner", 4, "risotto.jpg", [new RecipeItem("Arborio Rice", 1, 1, 65, "g")]),
      new Recipe(4, "d81533d6-77ff-4615-b2dd-3ab5c5be333a", "Poached Egg on Toast", "Breakfast", 4, "poached-eggs-on-toast.jpeg", [new RecipeItem("Egg", 2, 0.2, 1, " ")]),
      new Recipe(5, "bfa4b4f6-ee06-4da4-ac2b-9684746ebd68", "Steak & Mash", "Dinner", 5, "steak-and-mash.jpg", [new RecipeItem("Steak", 1, 4, 1, " ")]),
      new Recipe(6, "3cde0ecc-00d1-4876-b3a8-1b7d6bd6e9bb", "Spaghetti Carbonara", "Dinner", 4, "carbonara.jpg", [new RecipeItem("Pasta", 1, 0.2, 75, "g")]),
      new Recipe(7, "3d8d5956-25f5-4b4c-84a2-398a536a9bc5", "Camembert & Garlic Bread", "Dinner", 4, "camembert-garlic-bread.jpg", [new RecipeItem("Camembert", 1, 1, 1, " ")]),
      new Recipe(8, "2552dbba-5f8d-4c35-a36e-9ee8321cee42", "Overnight Weetabix", "Breakfast", 3, "overnight-weetabix.jpg", [new RecipeItem("Weetabix", 2, 0.2, 1, " ")]),
    ];
    this.recipes.forEach((recipe) => {
      console.log(JSON.stringify(recipe.ingredients));
    })
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