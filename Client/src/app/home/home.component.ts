import { Component } from '@angular/core';
import { Recipe, RecipeItem } from '../types/recipes/recipe.type';
import { ShoppingList, ShoppingListItem } from '../types/recipes/shopping-list.type';
import { Router } from '@angular/router';
import { RecipeService } from '../services/recipes/recipe.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [ RecipeService ]
})
export class HomeComponent {
  public sidebarShow: boolean = false;
  public totalSelectedRecipes: number = 0;
  public searchText: string = "";
  public router!: Router;
  public recipes!: Array<Recipe>;
  public shoppingList: ShoppingList = new ShoppingList;

  constructor(_router: Router, private recipeService: RecipeService) {
    this.router = _router;
  }

  public ngOnInit(): void {
    let x = this.recipeService.getRecipes().subscribe((data:Array<Recipe>) => {
      let recipesFromApi: Array<Recipe> = [];
      data.forEach(recipe => {
        let recipeItems: Array<RecipeItem> = [];
        recipe.ingredients.forEach(ingredient => {
          let ingredientObject = JSON.parse(ingredient.toString());
          recipeItems.push(new RecipeItem(ingredientObject.name, ingredientObject.quantity, ingredientObject.cost, ingredientObject.servingSize, ingredientObject.servingMetric));
        })
        recipesFromApi.push(new Recipe(recipe.reference, recipe.name, recipe.type, recipe.rating, recipe.imageUrl, recipeItems, recipe._id, recipe.description))
      })
      this.recipes = recipesFromApi;
    })
  }

  public navigateToRecipe(dbReference: string) : void {
    this.router.navigate([`/recipe/${dbReference}`]);
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