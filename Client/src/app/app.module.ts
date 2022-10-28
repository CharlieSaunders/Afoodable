import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { ToastrModule } from "ngx-toastr";
import { AppComponent } from "./app.component";
import { NavMenuComponent } from "./nav-menu/nav-menu.component";
import { HomeComponent } from "./home/home.component";
import { MatButtonModule } from "@angular/material/button";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FilterRecipeNamePipe } from "./helpers/pipes/filter-recipe-name";
import { RecipePageComponent } from "./recipe-page/recipe-page.component";
import { RecipesComponent } from "./recipes/recipes.component";
import { IngredientsComponent } from "./ingredients/ingredients.component";
import { FilterIngredientNamePipe } from "./helpers/pipes/filter-ingredient-name";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { RecipeCardComponent } from "./components/recipe-card/recipe-card.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { InventoryComponent } from "./inventory/inventory.component"

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    RecipePageComponent,
    RecipesComponent,
    IngredientsComponent,
    RecipesComponent,
    FilterRecipeNamePipe,
    FilterIngredientNamePipe,
    RecipeCardComponent,
    SidebarComponent,
    InventoryComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: "ng-cli-universal" }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    RouterModule.forRoot([
      { path: "", component: HomeComponent, pathMatch: "full" },
      { path: "recipe/:id", component: RecipePageComponent },
      { path: "recipes", component: RecipesComponent },
      { path: "ingredients", component: IngredientsComponent },
      { path: "inventory", component: InventoryComponent },
    ]),
    NgbModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
