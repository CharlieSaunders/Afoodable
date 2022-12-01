import { AfterViewInit, Component, ViewChild} from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
import { IngredientService } from "../services/ingredients/ingredient.service";
import { Ingredient, IngredientBuilder } from "../types/ingredients/ingredient.type";
import { ToastrService } from "ngx-toastr";
import { CreateResponse, DeleteResponse, UpdateResponse } from "../types/generics/api-response.type";
import { PageHelpers } from "../helpers/page-helpers";
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table';
import { MatSort } from "@angular/material/sort";

@Component({
  selector: "app-ingredients",
  templateUrl: "./ingredients.component.html",
  styleUrls: ["./ingredients.component.css"],
  providers: [IngredientService],
})
export class IngredientsComponent implements AfterViewInit {
  private readonly subscription: Subscription = new Subscription();
  public ingredients!: Array<Ingredient>;
  public dataSource!: MatTableDataSource<Ingredient>;
  public searchText = "";
  public closeResult = "";

  @ViewChild(MatPaginator) paginator! : MatPaginator;
  @ViewChild(MatSort) sort! : MatSort;
  public displayedColumns: string[] = ['name', 'cost', 'servingSize', 'servingMetric', 'actions'];

  newIngredientForm = new FormGroup({
    name: new FormControl(""),
    cost: new FormControl(""),
    servingSize: new FormControl(""),
    servingMetric: new FormControl(""),
    _id: new FormControl(""),
  });

  updateIngredientForm = new FormGroup({
    name: new FormControl(""),
    cost: new FormControl(0),
    servingSize: new FormControl(0),
    servingMetric: new FormControl(""),
    _id: new FormControl(""),
  });

  constructor(
    private ingredientService: IngredientService,
    private modalService: NgbModal,
    private toasterService: ToastrService
  ) {}

  ngAfterViewInit(): void {
    this.subscription.add(
      this.ingredientService
        .getIngredients()
        .subscribe((result: Array<Ingredient>) => {
          this.ingredients = result;
          this.dataSource = new MatTableDataSource<Ingredient>(this.ingredients);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        })
    );
  }

  public open(content: any, ingredient: Ingredient) {
    if (ingredient !== null) {
      this.updateIngredientForm.setValue({
        name: ingredient.name,
        cost: ingredient.cost,
        servingSize: ingredient.servingSize,
        servingMetric: ingredient.servingMetric,
        _id: ingredient._id,
      });
    }

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

  public openEmpty(content: any) {
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

    this.modalService.dismissAll();
    this.ngAfterViewInit();
  }

  public addNewIngredient(): void {
    let exists = false;
    this.ingredients.forEach((ingredient: Ingredient) => {
      const name = ingredient.name;
      if (
        name.toLowerCase() === this.newIngredientForm.value.name?.toLowerCase()
      ) {
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

      this.newIngredientForm.reset();
    }

    this.modalService.dismissAll();
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
