import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { IngredientService } from '../services/ingredients/ingredient.service';
import { Ingredient, IngredientBuilder } from '../types/ingredients/ingredient.type';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.css'],
  providers: [IngredientService]
})
export class IngredientsComponent {
  private readonly subscription: Subscription = new Subscription;
  public ingredients!: Array<Ingredient>;
  public searchText: string = "";
  public closeResult = '';

  newIngredientForm = new FormGroup({
    name: new FormControl(''),
    cost:  new FormControl(''),
    servingSize: new FormControl(''),
    servingMetric: new FormControl(''),
    _id: new FormControl('')
  });

  updateIngredientForm = new FormGroup({
    name: new FormControl(''),
    cost:  new FormControl(0),
    servingSize: new FormControl(0),
    servingMetric: new FormControl(''),
    _id: new FormControl('')
  });

  constructor(
    private ingredientService: IngredientService,
    private modalService: NgbModal
    ) { }

  ngOnInit(): void {
    this.subscription.add(
      this.ingredientService.getIngredients().subscribe((result:Array<Ingredient>) => {
        this.ingredients = result;
      })
    )
  }

  public open(content:any, ingredient: Ingredient) {
    if(ingredient != null){
      this.updateIngredientForm.setValue({
        "name": ingredient.name,
        "cost": ingredient.cost,
        "servingSize": ingredient.servingSize,
        "servingMetric": ingredient.servingMetric,
        "_id": ingredient._id
      });
    }

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  public openEmpty(content:any) {
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

  public updateExistingIngredient(): void{
    let ingredient = IngredientBuilder.fromForm(
      this.updateIngredientForm.value.name,
      this.updateIngredientForm.value.cost,
      this.updateIngredientForm.value.servingSize,
      this.updateIngredientForm.value.servingMetric,
      this.updateIngredientForm.value._id
    );

    this.ingredientService.updateIngredient(ingredient).subscribe((data:any) => {})
    this.modalService.dismissAll();
    this.ngOnInit();
  }

  public addNewIngredient(): void{
    let newIngredient = IngredientBuilder.fromForm(
      this.newIngredientForm.value.name,
      this.newIngredientForm.value.cost,
      this.newIngredientForm.value.servingSize,
      this.newIngredientForm.value.servingMetric,
      this.newIngredientForm.value._id
    );

    this.ingredientService.newIngredient(newIngredient).subscribe((data:any) => {})
    this.newIngredientForm.reset();
    this.modalService.dismissAll();
    this.ngOnInit();
  }

  public deleteIngredient(id: string){
    this.ingredientService.deleteIngredient(id).subscribe((data:any) => {});
    this.ngOnInit();
  }

}
