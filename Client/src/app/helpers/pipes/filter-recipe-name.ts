import { Pipe, PipeTransform } from "@angular/core";
import { Recipe } from "src/app/types/recipes/recipe.type";

@Pipe({ name: "filterRecipePipe" })
export class FilterRecipePipe implements PipeTransform {
  transform(recipes: Array<Recipe>, searchString: string): Array<Recipe> {
    let isTag = searchString[0] == ":";

    if(isTag && searchString.toLowerCase() == ":fav"){
      return recipes.filter((recipe: Recipe) => recipe.favourite);
    }

    if (recipes) {
      return recipes.filter((recipe: Recipe) =>
        recipe.name.toLowerCase().includes(searchString.toLowerCase())
      );
    }
    return [];
  }
}
