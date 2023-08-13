import { Component, OnInit, OnDestroy } from "@angular/core";
import { Recipe, RecipeItem } from "../types/recipes/recipe.type";
import { UpdateRecipeDto } from "../types/recipes/update-recipe-dto.type";
import { RecipeService } from "../services/recipes/recipe.service";
import { ActivatedRoute } from "@angular/router";
import { Ingredient } from "../types/ingredients/ingredient.type";
import { IngredientService } from "../services/ingredients/ingredient.service";
import { Subscription } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { UpdateResponse } from "../types/generics/api-response.type";

@Component({
  selector: "app-recipe-page",
  templateUrl: "./recipe-page.component.html",
  styleUrls: ["./recipe-page.component.css"],
  providers: [RecipeService],
})

export class RecipePageComponent implements OnInit, OnDestroy{
  private readonly subscriptions: Subscription = new Subscription();
  public allIngredients!: Array<Ingredient>;
  public searchText!: string;
  public recipe!: Recipe;
  public unmutatedRecipe!: Recipe;
  public displayAddNewIngredientModal = false;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private ingredientService: IngredientService,
    private toasterService: ToastrService
  ) {}

  public ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.subscriptions.add(
      this.recipeService
        .getRecipe(String(routeParams.get("id")))
        .subscribe((recipe: any) => {
          this.recipe = recipe;
          this.unmutatedRecipe = recipe;
        })
    );
    this.subscriptions.add(
      this.ingredientService
        .getIngredients()
        .subscribe((data: Array<Ingredient>) => {
          this.allIngredients = data;
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

  public addIngredientToRecipe(item: RecipeItem): void {
    let added = false;
    this.recipe.ingredients.forEach(ingredient => {
      if(item._id === ingredient._id){
        ingredient.quantity++;
        added = true;
      }
    });

    if(!added){
      this.recipe.ingredients.push(item);
    }
  }

  public toggleAddNewIngredientModal(): void {
    this.displayAddNewIngredientModal = !this.displayAddNewIngredientModal;
  }

  public amendIngredientAtIndex(index: number, value: number): void{
    this.recipe.ingredients[index].quantity += value;
    if(this.recipe.ingredients[index].quantity === 0){
      this.recipe.ingredients.splice(index, 1);
    }
  }

  public toggleFavourite(): void {
    this.recipe.favourite = !this.recipe.favourite;
  }

  public saveRecipe(): void {
    const updated = this.recipeService
    .updateRecipe(new UpdateRecipeDto(this.recipe))
    .subscribe((data: any) => {
      return data.acknowledged;
    });

    if (updated) {
      this.toasterService.success(`Successfully updated ${this.recipe.name}`);
    }
    else {
      this.toasterService.warning(`Failed to update ${this.recipe.name}`);
    }
  }

  public updateStepText($event: any, index: number): void{
      const updatedText = $event.target.innerText;
      this.recipe.steps[index] = updatedText;
  }

  public onFileChanged(event: any): void {
    const file = event.target.files[0];
    const updated = this.recipeService.updateImage(file, this.recipe).subscribe((data: UpdateResponse) => {
      return data.acknowledged;
    });

    if (updated) {
      this.toasterService.success(`Successfully updated image`);
    }
    else {
      this.toasterService.warning(`Failed to update image`);
    }
  }

  public addEmptyRecipeStep(): void{
    this.recipe.steps.push("No step information given");
  }

  public removeStepAtIndex(index: number){
    this.recipe.steps.splice(index, 1);
  }
}
