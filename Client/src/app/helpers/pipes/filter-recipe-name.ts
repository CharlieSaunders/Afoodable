import { Pipe, PipeTransform } from "@angular/core";
import { Recipe } from "src/app/types/recipes/recipe.type";

@Pipe({ name: "filterRecipeNamePipe" })
export class FilterRecipeNamePipe implements PipeTransform {
  transform(recipes: Array<Recipe>, searchString: string): Array<Recipe> {
    if (recipes) {
      return recipes.filter((recipe: Recipe) =>
        recipe.name.toLowerCase().includes(searchString.toLowerCase())
      );
    }
    return [];
  }
}
