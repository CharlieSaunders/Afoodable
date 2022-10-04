import { Component, OnInit } from "@angular/core";
import { Recipe, RecipeItem } from "../types/recipes/recipe.type";
import { UpdateRecipeDto } from "../types/recipes/update-recipe-dto.type";
import { RecipeService } from "../services/recipes/recipe.service";
import { ActivatedRoute } from "@angular/router";
import { Ingredient } from "../types/ingredients/ingredient.type";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
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
export class RecipePageComponent implements OnInit{
  private readonly subscriptions: Subscription = new Subscription();
  public recipe!: Recipe;
  public newStepString = "";

  public editMode = false;
  public hasBeenRated = false;
  public searchText!: string;
  public closeResult = "";

  public allIngredients!: Array<Ingredient>;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private ingredientService: IngredientService,
    private modalService: NgbModal,
    private toasterService: ToastrService
  ) {}

  public ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.subscriptions.add(
      this.recipeService
        .getRecipe(String(routeParams.get("id")))
        .subscribe((recipe: any) => {
          this.recipe = recipe;
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

  public edit(): void {
    this.editMode = true;
  }

  public save(): void {
    this.updateRecipe();

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

    this.editMode = false;
    this.ngOnInit();
  }

  public cancel(): void {
    this.editMode = false;
    this.ngOnInit();
  }

  public addIngredient(ingredient: Ingredient): void {
    this.recipe.ingredients.push(
      new RecipeItem(
        ingredient.name,
        1,
        ingredient.cost,
        ingredient.servingSize,
        ingredient.servingMetric
      )
    );
    this.modalService.dismissAll();
  }

  public updateIngredient(index: number, changeValue: number): void {
    const ingredient = this.recipe.ingredients[index];
    if (ingredient.quantity + changeValue === 0) {
      this.recipe.ingredients.splice(index, 1);
    }
 else {
      this.recipe.ingredients[index].quantity += changeValue;
    }
  }

  public addStep(): void {
    this.editMode = true;
    if (this.newStepString !== null && this.newStepString.length > 1) {
      this.recipe.steps.push(this.newStepString);
      this.newStepString = "";
    }
  }

  public updateRecipe(): void {
    const newName = document.getElementById("newRecipeName")?.innerText;
    if (newName != null) {
      this.recipe.name = newName;
    }

    const newDescription = document.getElementById("newDescription")?.innerText;
    if (newDescription != null) {
      this.recipe.description = newDescription;
    }

    const recipesServes = document.getElementById("recipeServes")?.innerText;
    if (recipesServes != null) {
      this.recipe.serves = parseInt(recipesServes);
    }
  }

  public open(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    }
 else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    }
 else {
      return `with: ${reason}`;
    }
  }

  public updateRecipeStep(index: number): void {
    const newStep = document.getElementById(`recipeStep${index}`)?.innerText;
    if (newStep != null && newStep.length > 1) {
      this.recipe.steps[index] = newStep;
    }

    this.toasterService.success("Added step");
  }

  public deleteRecipeStep(index: number): void {
    this.recipe.steps.splice(index, 1);
    this.toasterService.success("Deleted step");
  }

  public newRating(rating: number): void {
    this.hasBeenRated = true;
    let newRating = 0;
    const newRatings = this.recipe.ratings + 1;

    if (this.recipe.rating > 0 && this.recipe.ratings > 0) {
      const total = this.recipe.rating * this.recipe.ratings + rating;
      newRating = total / newRatings;
    }
 else {
      newRating = rating;
    }

    const updated = this.recipeService
      .addRating(this.recipe._id, newRating, newRatings)
      .subscribe((data: UpdateResponse) => {
        return data.acknowledged;
      });

    if (updated) {
      this.toasterService.success(`Successfully added rating`);
    }
 else {
      this.toasterService.warning(`Failed to add rating`);
    }

    this.editMode = false;
    this.ngOnInit();
  }

  public onFileChanged(event: any): void {
    const file = event.target.files[0];
    const updated = this.recipeService
      .updateImage(file, this.recipe)
      .subscribe((data: UpdateResponse) => {
        return data.acknowledged;
      });
    if (updated) {
      this.toasterService.success(`Successfully updated image`);
    }
 else {
      this.toasterService.warning(`Failed to update image`);
    }

    this.editMode = false;
    this.ngOnInit();
  }

  public drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.recipe.steps, event.previousIndex, event.currentIndex);
  }
}
