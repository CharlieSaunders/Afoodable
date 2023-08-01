import { Component, OnInit } from "@angular/core";
import { Recipe } from "../types/recipes/recipe.type";
import { ShoppingList, ShoppingListItem } from "../types/recipes/shopping-list.type";
import { Router } from "@angular/router";
import { RecipeService } from "../services/recipes/recipe.service";
import { Subscription } from "rxjs";
import { RecipeTagService } from "../services/recipes/recipe-tag.service";
import { RecipeTag } from "../types/recipes/recipe-tag.type";

@Component({
  selector: "app-recipe-search",
  templateUrl: "./recipe-search.component.html",
  styleUrls: ["./recipe-search.component.css"],
  providers: [RecipeService, RecipeTagService],
})
export class RecipeSearchComponent implements OnInit {
  private readonly subscriptions: Subscription = new Subscription();
  public sidebarShow = false;
  public searchText = "";
  public router!: Router;

  public totalSelectedRecipes = 0;
  public recipes!: Array<Recipe>;
  public shoppingList: ShoppingList = new ShoppingList();
  public recipeTags!: Array<RecipeTag>;

  constructor(_router: Router,
    private recipeService: RecipeService,
    private recipeTagService: RecipeTagService) {
    this.router = _router;
  }

  public ngOnInit(): void {
    this.subscriptions.add(
      this.recipeService.getRecipes().subscribe((data: Array<Recipe>) => {
        this.recipes = data;
      })
    );

    this.subscriptions.add(
      this.recipeTagService.getAll().subscribe((data: Array<RecipeTag>) => {
        this.recipeTags = data;
      })
    );
  }

  public toggleSidebar = (): void => {
    this.sidebarShow = !this.sidebarShow;
  };

  public navigateToRecipe = (dbReference: string): void => {
    this.router.navigate([`/app/recipe/${dbReference}`]);
  };

  public selectRecipe = (recipe: Recipe): void => {
    this.recipes.forEach((selectedRecipe) => {
      if (selectedRecipe.name === recipe.name) {
        selectedRecipe.selectedAmount += 1;
        this.totalSelectedRecipes += 1;
        this.updateShoppingList(selectedRecipe);
      }
    });
  };

  public unselectRecipe = (recipe: Recipe): void => {
    this.recipes.forEach((selectedRecipe) => {
      if (selectedRecipe.name === recipe.name) {
        selectedRecipe.selectedAmount -= 1;
        this.totalSelectedRecipes -= 1;
        this.removeFromShoppingList(selectedRecipe);
      }
    });
  };

  public updateShoppingList = (selectedRecipe: Recipe): void => {
    selectedRecipe.ingredients.forEach((ingredient) => {
      this.shoppingList.add(new ShoppingListItem(ingredient));
    });
  };

  public removeFromShoppingList = (selectedRecipe: Recipe): void => {
    selectedRecipe.ingredients.forEach((ingredient) => {
      this.shoppingList.remove(new ShoppingListItem(ingredient));
    });
  };
}
