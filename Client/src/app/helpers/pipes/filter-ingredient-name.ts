import { Pipe, PipeTransform } from "@angular/core";
import { Ingredient } from "src/app/types/ingredients/ingredient.type";

@Pipe({ name: "filterIngredientNamePipe" })
export class FilterIngredientNamePipe implements PipeTransform {
  transform(
    ingredients: Array<Ingredient>,
    searchString: string
  ): Array<Ingredient> {
    if (ingredients) {
      return ingredients.filter((ingredient: Ingredient) =>
        ingredient.name.toLowerCase().includes(searchString.toLowerCase())
      );
    }
    return [];
  }
}
