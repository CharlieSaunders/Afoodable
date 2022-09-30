import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Recipe, RecipeItem } from 'src/app/types/recipes/recipe.type';
import { map, Observable } from 'rxjs';
import { UpdateRecipeDto } from '../../types/recipes/update-recipe-dto.type';
import { ApiResponseMapper, CreateResponse, DeletedResponse, UpdateResponse } from 'src/app/types/generics/api-response.type';

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

  public updateRecipe(request: UpdateRecipeDto): Observable<UpdateResponse>{
    return this.httpClient.patch<UpdateResponse>(`${this.baseUrl}`, request, {}).pipe(
      map((result) => ApiResponseMapper.mapUpdate(result))
    );
  }

  public createNewRecipe(request: Recipe): Observable<CreateResponse>{
    return this.httpClient.post<CreateResponse>(this.baseUrl, request).pipe(
      map((result) => ApiResponseMapper.mapCreate(result))
    );
  }

  public deleteRecipe(id:string): Observable<DeletedResponse>{
    return this.httpClient.delete<Recipe>(`${this.baseUrl}/${id}`).pipe(
      map((result) => ApiResponseMapper.mapDelete(result))
    );
  }

  public addRating(id:string, rating:number, ratings:number): Observable<UpdateResponse>{
    return this.httpClient.post<UpdateResponse>(`${this.baseUrl}/rating/${id}`, {rating, ratings});
  }

  public updateImage(image:File, recipe:Recipe): Observable<UpdateResponse>{
    let formData = new FormData();
    formData.append('recipeImage', image, recipe._id);
    return this.httpClient.post<Recipe>(`${this.baseUrl}/image/${recipe._id}`, formData).pipe(
      map((result) => ApiResponseMapper.mapUpdate(result))
    );
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
      recipesFromApi.push(new Recipe(recipe.name, recipe.type, recipe.rating, recipe.ratings, recipe.imageUrl, recipeItems, recipe._id, recipe.steps, recipe.description, recipe.serves))
    })

    return recipesFromApi;
  }

  public static mapSingle(result: any): Recipe {
    if(result.length != undefined)
      result = result[0];

    let recipeItems: Array<RecipeItem> = [];
    result.ingredients.forEach((ingredient: any) => {
      let ingredientObject = JSON.parse(ingredient.toString());
      recipeItems.push(new RecipeItem(ingredientObject.name, ingredientObject.quantity, ingredientObject.cost, ingredientObject.servingSize, ingredientObject.servingMetric));
    })

    return new Recipe(result.name, result.type, result.rating, result.ratings, result.imageUrl, recipeItems, result._id, result.steps, result.description, result.serves);
  }
}