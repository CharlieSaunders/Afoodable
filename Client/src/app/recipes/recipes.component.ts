import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { RecipeService } from "../services/recipes/recipe.service";
import { Recipe, RecipeBuilder } from "../types/recipes/recipe.type";
import { FormControl, FormGroup } from "@angular/forms";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { CreateResponse, DeleteResponse } from "../types/generics/api-response.type";
import { PageHelpers } from "../helpers/page-helpers";
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table';
import { MatSort } from "@angular/material/sort";

@Component({
  selector: "app-recipes",
  templateUrl: "./recipes.component.html",
  styleUrls: ["./recipes.component.css"],
  providers: [RecipeService],
})
export class RecipesComponent implements AfterViewInit, OnDestroy{
  private readonly subscription: Subscription = new Subscription();
  public router!: Router;
  public recipes!: Array<Recipe>;
  public dataSource!: MatTableDataSource<Recipe>;
  public searchText = "";
  public closeResult = "";

  @ViewChild(MatPaginator) paginator! : MatPaginator;
  @ViewChild(MatSort) sort! : MatSort;
  public displayedColumns: string[] = ['name', 'type', 'totalCost', 'rating', 'actions'];

  public newRecipeForm = new FormGroup({
    name: new FormControl(""),
    type: new FormControl(""),
    description: new FormControl(""),
  });

  constructor(
    private recipeService: RecipeService,
    private modalService: NgbModal,
    private toasterService: ToastrService,
    _router: Router
  ) {
    this.router = _router;
  }

  ngAfterViewInit(): void {
    this.subscription.add(
      this.recipeService.getRecipes().subscribe((data: Array<Recipe>) => {
        this.recipes = data;
        this.dataSource = new MatTableDataSource<Recipe>(this.recipes);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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

  public navigateToRecipe(dbReference: string): void {
    this.router.navigate([`/recipe/${dbReference}`]);
  }

  public addNewRecipe(): void {
    let exists = false;
    this.recipes.forEach((recipe: Recipe) => {
      const name = recipe.name;
      if (name.toLowerCase() == this.newRecipeForm.value.name?.toLowerCase()) {
        exists = true;
        this.toasterService.warning(`${name} - Already exists`);
      }
    });

    if (!exists) {
      const newRecipe = RecipeBuilder.fromForm(
        this.newRecipeForm.value.name,
        this.newRecipeForm.value.type,
        this.newRecipeForm.value.description
      );

      const created = this.recipeService.createNewRecipe(newRecipe).subscribe((data: CreateResponse) => {
          newRecipe._id = data.insertedId;
          return data.acknowledged;
      });

      if (created) {
        PageHelpers.RefreshPage();
      }
      else {
        this.toasterService.warning(`Failed to create ${newRecipe.name}`);
      }
    }

    this.modalService.dismissAll();
  }

  public deleteRecipe(id: string): void {
    const deleted = this.recipeService
      .deleteRecipe(id)
      .subscribe((data: DeleteResponse) => {
        return data.acknowledged;
    });

    if (deleted) {
      PageHelpers.RefreshPage();
    }
    else {
      this.toasterService.success(`Failed to delete recipe`);
    }

    this.modalService.dismissAll();
  }
}
