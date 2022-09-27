import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscribable, Subscription } from 'rxjs';
import { RecipeService } from '../services/recipes/recipe.service';
import { Recipe } from '../types/recipes/recipe.type';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
  providers: [RecipeService]
})
export class RecipesComponent  {
  private readonly subscription: Subscription = new Subscription;
  public router!: Router;
  public recipes!: Array<Recipe>;
  public searchText: string = "";

  constructor(
    private recipeService: RecipeService,
    _router: Router
  ) 
  { 
    this.router = _router;
  }

  ngOnInit(): void {
    this.subscription.add(
      this.recipeService.getRecipes().subscribe((data:Array<Recipe>) => {
        this.recipes = data;
      })
    )
  }

  public navigateToRecipe(dbReference: string) : void {
    this.router.navigate([`/recipe/${dbReference}`]);
  }

}
