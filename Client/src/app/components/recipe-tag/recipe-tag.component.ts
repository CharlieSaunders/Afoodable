import { Component, Input } from "@angular/core";
import { RecipeTag } from "../../types/recipes/recipe-tag.type";

@Component({
  selector: "app-recipe-tag",
  templateUrl: "./recipe-tag.component.html"
})
export class RecipeTagComponent{
@Input() recipeTag!: RecipeTag;
public selected: boolean = true;

  constructor() {}

  toggle(): void {
    this.selected = !this.selected;
  }
}
