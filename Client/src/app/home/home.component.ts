import { Component } from '@angular/core';
import { Recipe } from '../types/recipes/recipe.type';
import { ShoppingList, ShoppingListItem } from '../types/recipes/shopping-list.type';
import { Router } from '@angular/router';
import { RecipeService } from '../services/recipes/recipe.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [ RecipeService ]
})
export class HomeComponent {
  private readonly subscriptions: Subscription = new Subscription();
  public sidebarShow: boolean = false;
  public searchText: string = "";
  public router!: Router;

  public totalSelectedRecipes: number = 0;
  public recipes!: Array<Recipe>;
  public shoppingList: ShoppingList = new ShoppingList;

  constructor(_router: Router, private recipeService: RecipeService) {
    this.router = _router;
  }

  public ngOnInit(): void {
    this.subscriptions.add(
      this.recipeService.getRecipes().subscribe((data:Array<Recipe>) => {
        this.recipes = data;
      })
    );
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