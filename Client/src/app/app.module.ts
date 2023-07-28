import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { ToastrModule } from "ngx-toastr";
import { AppComponent } from "./app.component";
import { NavMenuComponent } from "./nav-menu/nav-menu.component";
import { MatButtonModule } from "@angular/material/button";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FilterRecipePipe } from "./helpers/pipes/filter-recipe-name";
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
import { MatSortModule } from "@angular/material/sort";
import { ConfigurationComponent } from "./configuration/configuration.component";
import { MatTabsModule } from "@angular/material/tabs";
import { MonacoEditorModule } from "ngx-monaco-editor-v2";
import { RecipeTagComponent } from "./components/recipe-tag/recipe-tag.component";
import { MatCardModule } from "@angular/material/card";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MacrosComponent } from "./components/macros/macros.component";
import { AddIngredientToRecipeModalComponent } from "./components/modals/recipes/add-ingredient.component";
import { RecipeSearchComponent } from "./recipe-search/recipe-search.component"
import { DownloadAsComponent } from "./components/downloads/download-as.component";
import { UploadAsComponent } from "./components/uploads/upload-as.component";
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    RecipePageComponent,
    RecipesComponent,
    IngredientsComponent,
    RecipesComponent,
    FilterRecipePipe,
    FilterIngredientNamePipe,
    RecipeCardComponent,
    SidebarComponent,
    ConfigurationComponent,
    RecipeTagComponent,
    MacrosComponent,
    AddIngredientToRecipeModalComponent,
    RecipeSearchComponent,
    DownloadAsComponent,
    UploadAsComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: "ng-cli-universal" }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: "toast-bottom-right",
      preventDuplicates: true,
      progressBar: true,
    }),
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTabsModule,
    MatCardModule,
    MatExpansionModule,
    MatTooltipModule,
    RouterModule.forRoot([
      { path: "search", component: RecipeSearchComponent },
      { path: "recipe/:id", component: RecipePageComponent },
      { path: "recipes", component: RecipesComponent },
      { path: "ingredients", component: IngredientsComponent },
      { path: "configuration", component: ConfigurationComponent },
      { path: '**', component: RecipeSearchComponent }
    ]),
    NgbModule,
    DragDropModule,
    MonacoEditorModule.forRoot(),
    SocialLoginModule
  ],
  providers: [    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('668343721933-lvpjp15rmqnfchk0vaeosvc4ei6eg4ce.apps.googleusercontent.com'),
          },
        ],
      } as SocialAuthServiceConfig,
    }],
  bootstrap: [AppComponent],
})
export class AppModule {}
