import { Component } from '@angular/core';
import { Recipe, RecipeItem } from '../types/recipes/recipe.type';
import { UpdateRecipeDto } from '../types/recipes/update-recipe-dto.type';
import { RecipeService } from '../services/recipes/recipe.service';
import { ActivatedRoute } from '@angular/router';
import { Ingredient } from '../types/ingredients/ingredient.type';
import { ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop' 

@Component({
  selector: 'app-recipe-page',
  templateUrl: './recipe-page.component.html',
  styleUrls: ['./recipe-page.component.css'],
  providers: [RecipeService]
})
export class RecipePageComponent{
  public recipe!: Recipe;
  public editMode: boolean = false;
  public totalCost!: string;
  public searchText!: string;
  public newStepString: string = "";
  public allIngredients!: Array<Ingredient>;
  public closeResult = '';

  constructor(
    private route: ActivatedRoute, 
    private recipeService: RecipeService,
    private modalService: NgbModal) 
    { }

  public ngOnInit(): void {
    let routeParams = this.route.snapshot.paramMap;
    let x = this.recipeService.getRecipe(String(routeParams.get('id'))).subscribe((recipe:any) => {
      let context = recipe[0];
      console.log(context);
        let recipeItems: Array<RecipeItem> = [];
        context.ingredients.forEach((ingredient: any) => {
          let ingredientObject = JSON.parse(ingredient.toString());
          recipeItems.push(new RecipeItem(ingredientObject.name, ingredientObject.quantity, ingredientObject.cost, ingredientObject.servingSize, ingredientObject.servingMetric));
        })
        this.recipe = new Recipe(context.reference, context.name, context.type, context.rating, context.imageUrl, recipeItems, context._id, context.steps, context.description);
        this.totalCost = this.recipe.totalCost.toFixed(2);
    });

    this.allIngredients = [
      new Ingredient("Cheese"), new Ingredient("Tomato"), new Ingredient("Pear")
    ];
  }

  public edit(): void{
    console.log("Edit selected");
    this.editMode = true;
  }

  public save(): void{
    console.log("Save selected");
    this.updateRecipe();
    this.recipeService.updateRecipe(new UpdateRecipeDto(this.recipe)).subscribe((data:any)=>{
      console.log(data);
    });
    this.editMode = false;
  }

  public cancel(): void{
    console.log("Cancel selected")
    this.editMode = false;
    this.ngOnInit();
  }

  public addIngredient(ingredient: Ingredient): void{
    console.log(ingredient);
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

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.recipe.steps, event.previousIndex, event.currentIndex);
  }
}
