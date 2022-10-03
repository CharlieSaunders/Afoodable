import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RecipeService } from '../services/recipes/recipe.service';
import { Recipe, RecipeBuilder } from '../types/recipes/recipe.type';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CreateResponse, DeleteResponse } from '../types/generics/api-response.type';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
  providers: [RecipeService]
})
export class RecipesComponent  {
  private readonly subscription: Subscription = new Subscription;
  public router!: Router;
  public recipes!: Array<Recipe>;
  public searchText: string = "";
  public closeResult = '';

  public newRecipeForm = new FormGroup({
    name: new FormControl(''),
    type:  new FormControl(''),
    description: new FormControl('')
  });

  constructor(
    private recipeService: RecipeService,
    private modalService: NgbModal,
    private toasterService: ToastrService,
    _router: Router
  ) 
  { 
    this.router = _router;
  }

  ngOnInit(): void {
    this.subscription.add(
      this.recipeService.getRecipes().subscribe((data:Array<Recipe>) => {
        this.recipes = data;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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

  public navigateToRecipe(dbReference: string) : void {
    this.router.navigate([`/recipe/${dbReference}`]);
  }

  public async addNewRecipe(): Promise<void>{
    let exists = false;
    this.recipes.forEach((recipe:Recipe) => {
      let name = recipe.name;
      if(name.toLowerCase() == this.newRecipeForm.value.name?.toLowerCase()){
        exists = true;
        this.toasterService.warning(`${name} - Already exists`);
      }
    });

    if(!exists){
      let newRecipe = RecipeBuilder.fromForm(
        this.newRecipeForm.value.name,
        this.newRecipeForm.value.type,
        this.newRecipeForm.value.description
      );

      let created = this.recipeService.createNewRecipe(newRecipe).subscribe((data:CreateResponse)=>{return data.acknowledged});

      if(created)
        this.toasterService.success(`Successfully created ${newRecipe.name}`);
      else
        this.toasterService.warning(`Failed to create ${newRecipe.name}`);
    }

    this.modalService.dismissAll();
    this.ngOnInit();
  }

  public deleteRecipe(id:string): void{
    let deleted = this.recipeService.deleteRecipe(id).subscribe((data:DeleteResponse)=> {return data.acknowledged});
    if(deleted)
      this.toasterService.success(`Successfully deleted recipe`);
    else
      this.toasterService.success(`Failed to delete recipe`);

    this.modalService.dismissAll();
    this.ngOnInit();
  }

}
