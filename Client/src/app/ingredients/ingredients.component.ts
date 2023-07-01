import { CreateResponse, DeleteResponse, UpdateResponse } from "../types/generics/api-response.type";
import { IngredientDictionary, Ingredient, IngredientBuilder } from "../types/ingredients/ingredient.type";
import { AfterViewInit, Component, ViewChild} from "@angular/core";
import { Subscription } from "rxjs";
import { IngredientService } from "../services/ingredients/ingredient.service";
import { ToastrService } from "ngx-toastr";
import { PageHelpers } from "../helpers/page-helpers";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource} from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { FormHelpers } from "../helpers/form-helpers";

@Component({
  selector: "app-ingredients",
  templateUrl: "./ingredients.component.html",
  styleUrls: ["./ingredients.component.css"],
  providers: [IngredientService],
})
export class IngredientsComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private readonly subscription: Subscription = new Subscription();

  public displayedColumns: string[] = ["name", "cost", "servingSize", "servingMetric", "actions"];
  public ingredients!: IngredientDictionary;
  public dataSource!: MatTableDataSource<Ingredient>;
  public newIngredientForm = FormHelpers.NewIngredientForm();
  public updateIngredientForm = FormHelpers.UpdateIngredientForm();
  public searchText = "";
  public displayNewIngredientModal = false;
  public displayUpdateIngredientModal = false;

  constructor(
    private ingredientService: IngredientService,
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

    this.newIngredientForm.reset();
  }

  public showNewIngredientModal(): void {
    this.displayNewIngredientModal = true;
  }

  public showUpdateIngredientModal(ingredient: Ingredient): void {
    this.displayUpdateIngredientModal = true;
    if (ingredient !== null) {
      this.updateIngredientForm.setValue({
        name: ingredient.name,
        cost: ingredient.cost,
        servingSize: ingredient.servingSize,
        servingMetric: ingredient.servingMetric,
        calories: ingredient.calories ?? 0,
        carbohydrates: ingredient.carbohydrates ?? 0,
        fat: ingredient.fat ?? 0,
        protein: ingredient.protein ?? 0,
        _id: ingredient._id,
      });
    }
  }

  public hideAllModals(): void {
    this.displayNewIngredientModal = false;
    this.displayUpdateIngredientModal = false;
  }

  public updateExistingIngredient(): void {
    const ingredient = IngredientBuilder.fromForm(
      this.updateIngredientForm.value.name,
      this.updateIngredientForm.value.cost,
      this.updateIngredientForm.value.servingSize,
      this.updateIngredientForm.value.servingMetric,
      this.updateIngredientForm.value._id,
      this.updateIngredientForm.value.calories,
      this.updateIngredientForm.value.fat,
      this.updateIngredientForm.value.carbohydrates,
      this.updateIngredientForm.value.protein
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
    const ingredientArray = this.ingredients.GetAsArray();
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
        this.newIngredientForm.value._id,
        this.newIngredientForm.value.calories,
        this.newIngredientForm.value.fat,
        this.newIngredientForm.value.carbohydrates,
        this.newIngredientForm.value.protein,
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

  public downloadAsCsv(): void {
    let filename = "recipes.csv"
    let text = "test,1";
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }
}
