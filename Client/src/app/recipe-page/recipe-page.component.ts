import { Component } from '@angular/core';
import { Recipe, RecipeItem } from '../types/recipes/recipe.type';
import { RecipeService } from '../services/recipes/recipe.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recipe-page',
  templateUrl: './recipe-page.component.html',
  styleUrls: ['./recipe-page.component.css'],
  providers: [RecipeService]
})
export class RecipePageComponent{
  public recipe!: Recipe;

  constructor(private route: ActivatedRoute, private recipeService: RecipeService) { }

  ngOnInit(): void {
    let routeParams = this.route.snapshot.paramMap;
    let x = this.recipeService.getRecipe(String(routeParams.get('id'))).subscribe((recipe:any) => {
      let context = recipe[0];
        let recipeItems: Array<RecipeItem> = [];
        context.ingredients.forEach((ingredient: any) => {
          let ingredientObject = JSON.parse(ingredient.toString());
          recipeItems.push(new RecipeItem(ingredientObject.name, ingredientObject.quantity, ingredientObject.cost, ingredientObject.servingSize, ingredientObject.servingMetric));
        })
        this.recipe = new Recipe(context.reference, context.name, context.type, context.rating, context.imageUrl, recipeItems, context._id, context.description);
    });
  }
}
