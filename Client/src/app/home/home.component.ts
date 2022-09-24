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
  //public subscriptions: Array<Subscriptions> = [];

  constructor(_router: Router, private recipeService: RecipeService) {
    this.router = _router;
  }

  public ngOnInit(): void {
    this.recipeService.getRecipes().subscribe(  
      (response) => { 
        console.log(response); 
      },
      (error) => { console.log(error); 
    });
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