import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Recipe, RecipeItem } from 'src/app/types/recipes/recipe.type';
import { map, Observable } from 'rxjs';
import { UpdateRecipeDto } from '../../types/recipes/update-recipe-dto.type';

@Injectable()
export class RecipeService {
  private httpClient!: HttpClient;
  private baseUrl: string = "http://localhost:54321/api/recipes";

  constructor(private http: HttpClient) { 
    this.httpClient = http;
  }

  public getRecipes(): Observable<Array<Recipe>>{
    return this.httpClient.get(this.baseUrl).pipe(
        map((result) => RecipeMapper.map(result))
    );
  }

  public getRecipe(id: string): Observable<Recipe>{
    return this.httpClient.get<Recipe>(`${this.baseUrl}/${id}`).pipe(
      map((result) => RecipeMapper.mapSingle(result))
    );
  }

  public updateRecipe(request: UpdateRecipeDto): Observable<Recipe>{
    return this.httpClient.patch<Recipe>(`${this.baseUrl}`, request, {});
  }

  public createNewRecipe(request: Recipe): Observable<Recipe>{
    return this.httpClient.post<Recipe>(this.baseUrl, request);
  }

  public deleteRecipe(id:string): Observable<Recipe>{
    return this.httpClient.delete<Recipe>(`${this.baseUrl}/${id}`);
  }

  public addRating(id:string, rating:number, ratings:number): Observable<Recipe>{
    return this.httpClient.post<Recipe>(`${this.baseUrl}/rating/${id}`, {rating, ratings});
  }

  public updateImage(image:File, recipe:Recipe){
    let formData = new FormData();
    formData.append('recipeImage', image, recipe._id);
    return this.httpClient.post<Recipe>(`${this.baseUrl}/image/${recipe._id}`, formData);
  }
}

class RecipeMapper {
  public static map(result: any): Array<Recipe>{
    let recipesFromApi: Array<Recipe> = [];
    result.forEach((recipe: any) => {
      let recipeItems: Array<RecipeItem> = [];
      recipe.ingredients.forEach((ingredient: any) => {
        let ingredientObject = JSON.parse(ingredient.toString());
        recipeItems.push(new RecipeItem(ingredientObject.name, ingredientObject.quantity, ingredientObject.cost, ingredientObject.servingSize, ingredientObject.servingMetric));
      })
      recipesFromApi.push(new Recipe(recipe.name, recipe.type, recipe.rating, recipe.ratings, recipe.imageUrl, recipeItems, recipe._id, recipe.steps, recipe.description))
    })
    return recipesFromApi;
  }

  public static mapSingle(result: any): Recipe {
    let context = result[0];
    let recipeItems: Array<RecipeItem> = [];
    context.ingredients.forEach((ingredient: any) => {
      let ingredientObject = JSON.parse(ingredient.toString());
      recipeItems.push(new RecipeItem(ingredientObject.name, ingredientObject.quantity, ingredientObject.cost, ingredientObject.servingSize, ingredientObject.servingMetric));
    })
    return new Recipe(context.name, context.type, context.rating, context.ratings, context.imageUrl, recipeItems, context._id, context.steps, context.description);
  }
}