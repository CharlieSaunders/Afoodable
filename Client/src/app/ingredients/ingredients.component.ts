import { CreateResponse, DeleteResponse, UpdateResponse } from "../types/generics/api-response.type";
import { IngredientDictionary, Ingredient, IngredientBuilder } from "../types/ingredients/ingredient.type";
import { AfterViewInit, Component, ViewChild} from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormControl, FormGroup } from "@angular/forms";
import { Subscription } from "rxjs";
import { IngredientService } from "../services/ingredients/ingredient.service";
import { ToastrService } from "ngx-toastr";
import { PageHelpers } from "../helpers/page-helpers";
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table';
import { MatSort } from "@angular/material/sort";
import { FormHelpers } from "../helpers/form-helpers";

@Component({
  selector: "app-ingredients",
  templateUrl: "./ingredients.component.html",
  styleUrls: ["./ingredients.component.css"],
  providers: [IngredientService],
})
export class IngredientsComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator! : MatPaginator;
  @ViewChild(MatSort) sort! : MatSort;
  private readonly subscription: Subscription = new Subscription();

  public displayedColumns: string[] = ['name', 'cost', 'servingSize', 'servingMetric', 'actions'];
  public ingredients!: IngredientDictionary;
  public dataSource!: MatTableDataSource<Ingredient>;
  public newIngredientForm = FormHelpers.NewIngredientForm();
  public updateIngredientForm = FormHelpers.UpdateIngredientForm();
  public searchText = "";
  public closeResult = "";

  constructor(
    private ingredientService: IngredientService,
    private modalService: NgbModal,
    private toasterService: ToastrService
  ) {}

  ngAfterViewInit(): void {
    this.subscription.add(
      this.ingredientService
        .getIngredientsDictionary()
        .subscribe((result: IngredientDictionary) => {
          this.ingredients = result;
          this.dataSource = new MatTableDataSource<Ingredient>(this.ingredients.GetAsArray());
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        })
    );

    this.modalService.dismissAll();
    this.newIngredientForm.reset();
  }

  public open(content: any, ingredient: any = null) {
    if (ingredient !== null) {
      this.updateIngredientForm.setValue({
        name: ingredient.name,
        cost: ingredient.cost,
        servingSize: ingredient.servingSize,
        servingMetric: ingredient.servingMetric,
        _id: ingredient._id,
      });
    }

    this.modalService.open(content, { ariaLabelledBy: "modal-basic-title" }).result;
  }

  public updateExistingIngredient(): void {
    const ingredient = IngredientBuilder.fromForm(
      this.updateIngredientForm.value.name,
      this.updateIngredientForm.value.cost,
      this.updateIngredientForm.value.servingSize,
      this.updateIngredientForm.value.servingMetric,
      this.updateIngredientForm.value._id
    );

    const updated = this.ingredientService
      .updateIngredient(ingredient)
      .subscribe((data: UpdateResponse) => {
        return data.acknowledged;
      });

    if (updated) {
      PageHelpers.RefreshPage();
    }
    else {
      this.toasterService.success(`Failed to update ${ingredient.name}`);
    }

    this.ngAfterViewInit();
  }

  public addNewIngredient(): void {
    let exists = false;
    let ingredientArray = this.ingredients.GetAsArray()
    ingredientArray.forEach((ingredient: Ingredient) => {
      const name = ingredient.name;
      if (name.toLowerCase() === this.newIngredientForm.value.name?.toLowerCase()) {
        exists = true;
        this.toasterService.warning(`${name} - Already exists`);
      }
    });

    if (!exists) {
      const newIngredient = IngredientBuilder.fromForm(
        this.newIngredientForm.value.name,
        this.newIngredientForm.value.cost,
        this.newIngredientForm.value.servingSize,
        this.newIngredientForm.value.servingMetric,
        this.newIngredientForm.value._id
      );

      const created = this.ingredientService
        .newIngredient(newIngredient)
        .subscribe((data: CreateResponse) => {
          return data.acknowledged;
        });

      if (created) {
        PageHelpers.RefreshPage();
      }
      else {
        this.toasterService.success(`Failed to create ${newIngredient.name}`);
      }
    }

    this.ngAfterViewInit();
  }

  public deleteIngredient(id: string) {
    const deleted = this.ingredientService
      .deleteIngredient(id)
      .subscribe((data: DeleteResponse) => {
        return data.acknowledged;
      });

    if (deleted) {
      PageHelpers.RefreshPage();
    }
    else {
      this.toasterService.success(`Failed to delete ingredient`);
    }
    this.ngAfterViewInit();
  }
}
