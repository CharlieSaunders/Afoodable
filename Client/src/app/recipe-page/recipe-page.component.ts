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
import { ToastrService } from 'ngx-toastr';

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
  public hasBeenRated: boolean = false;
  public searchText!: string;
  public closeResult = '';

  public allIngredients!: Array<Ingredient>;


  constructor(
    private route: ActivatedRoute, 
    private recipeService: RecipeService,
    private ingredientService: IngredientService,
    private modalService: NgbModal,
    private toasterService: ToastrService) 
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
    this.editMode = true;
  }

  public save(): void{
    this.updateRecipe();
    this.recipeService.updateRecipe(new UpdateRecipeDto(this.recipe)).subscribe((data:any)=>{});
    this.toasterService.success(`Successfully updated ${this.recipe.name}`);
    this.editMode = false;
  }

  public cancel(): void{
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

  public newRating(rating:number): void{
    this.hasBeenRated = true;
    let newRating = 0;
    let newRatings = this.recipe.ratings + 1;
    if(this.recipe.rating > 0 && this.recipe.ratings > 0){
      let total = this.recipe.rating * this.recipe.ratings + rating;
      newRating = total / newRatings;
    }else{
      newRating = rating;
    }
    this.recipeService.addRating(this.recipe._id, newRating, newRatings).subscribe((data:any)=>{});
    this.toasterService.success(`Successfully added rating`);
  }

  public onFileChanged(event: any): void{
    const file = event.target.files[0];
    this.recipeService.updateImage(file, this.recipe).subscribe((data:any)=>{});
    this.toasterService.success(`Successfully updated image`);
    this.editMode = false;
    this.ngOnInit();
  }

  public drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.recipe.steps, event.previousIndex, event.currentIndex);
  }
}
