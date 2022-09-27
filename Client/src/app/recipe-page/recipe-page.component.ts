import { Component } from '@angular/core';
import { Recipe, RecipeItem } from '../types/recipes/recipe.type';
import { UpdateRecipeDto } from '../types/recipes/update-recipe-dto.type';
import { RecipeService } from '../services/recipes/recipe.service';
import { ActivatedRoute } from '@angular/router';
import { Ingredient } from '../types/ingredients/ingredient.type';
import { ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop' 
import { IngredientService } from '../services/ingredients/ingredient.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-page',
  templateUrl: './recipe-page.component.html',
  styleUrls: ['./recipe-page.component.css'],
  providers: [RecipeService]
})
export class RecipePageComponent{
  private readonly subscriptions: Subscription = new Subscription();
  public recipe!: Recipe;
  public totalCost!: string;
  public newStepString: string = "";

  public editMode: boolean = false;
  public searchText!: string;
  public closeResult = '';

  public allIngredients!: Array<Ingredient>;


  constructor(
    private route: ActivatedRoute, 
    private recipeService: RecipeService,
    private ingredientService: IngredientService,
    private modalService: NgbModal) 
    { }

  public ngOnInit(): void {
    let routeParams = this.route.snapshot.paramMap;
    this.subscriptions.add(
      this.recipeService.getRecipe(String(routeParams.get('id'))).subscribe((recipe:any) => {
        this.recipe = recipe;
        this.totalCost = this.recipe.totalCost.toFixed(2);
      })
    );
    this.subscriptions.add(
      this.ingredientService.getIngredients().subscribe((data:Array<Ingredient>) => {
        this.allIngredients = data;
      })
    );
  }

  public edit(): void{
    console.log("Edit selected");
    this.editMode = true;
  }

  public save(): void{
    console.log("Save selected");
    this.updateRecipe();
    this.recipeService.updateRecipe(new UpdateRecipeDto(this.recipe)).subscribe((data:any)=>{});
    this.editMode = false;
  }

  public cancel(): void{
    console.log("Cancel selected")
    this.editMode = false;
    this.ngOnInit();
  }

  public addIngredient(ingredient: Ingredient): void{
    this.recipe.ingredients.push(new RecipeItem(ingredient.name, 1, ingredient.cost, ingredient.servingSize, ingredient.servingMetric));
    this.modalService.dismissAll();
  }

  public updateIngredient(index: number, changeValue: number): void{
    let ingredient = this.recipe.ingredients[index];
    if(ingredient.quantity + changeValue == 0)
      this.recipe.ingredients.splice(index, 1);
    else
      this.recipe.ingredients[index].quantity += changeValue;
  }

  public addStep(): void{
    this.editMode = true;
    if(this.newStepString != null && this.newStepString.length > 1){
      this.recipe.steps.push(this.newStepString);
      this.newStepString = "";
    }
  }

  public updateRecipe(): void{
    let newName = document.getElementById("newRecipeName")?.innerText;
    if(newName != null)
      this.recipe.name = newName;

    let newDescription = document.getElementById("newDescription")?.innerText;
    if(newDescription != null)
      this.recipe.description = newDescription;

    this.totalCost = this.recipe.getCost();
  }

  public open(content:any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  public updateRecipeStep(index:number): void{
    let newStep = document.getElementById(`recipeStep${index}`)?.innerText;
    console.log(newStep)
    if(newStep != null && newStep.length > 1)
      this.recipe.steps[index] = newStep;
  }

  public deleteRecipeStep(index:number): void{
    this.recipe.steps.splice(index, 1);
  }

  public drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.recipe.steps, event.previousIndex, event.currentIndex);
  }
}
