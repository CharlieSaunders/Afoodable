import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Recipe, RecipeItem } from "src/app/types/recipes/recipe.type";
import { Observable, map } from "rxjs";
import { UpdateRecipeDto } from "../../types/recipes/update-recipe-dto.type";
import { ApiResponseMapper, CreateResponse, DeleteResponse, UpdateResponse } from "src/app/types/generics/api-response.type";

@Injectable()
export class RecipeService {
  private httpClient!: HttpClient;
  private baseUrl = "http://localhost:54321/api/recipes";

  constructor(private http: HttpClient) {
    this.httpClient = http;
  }

  public getRecipes(): Observable<Array<Recipe>> {
    return this.httpClient
      .get(this.baseUrl)
      .pipe(
        map(RecipeMapper.map)
        );
  }

  public getRecipe(id: string): Observable<Recipe> {
    return this.httpClient
      .get<Recipe>(`${this.baseUrl}/${id}`)
      .pipe(
        map(RecipeMapper.mapSingle)
        );
  }

  public updateRecipe(request: UpdateRecipeDto): Observable<UpdateResponse> {
    return this.httpClient
      .patch<UpdateResponse>(`${this.baseUrl}`, request, {})
      .pipe(
        map(ApiResponseMapper.mapUpdate)
        );
  }

  public createNewRecipe(request: Recipe): Observable<CreateResponse> {
    return this.httpClient
      .post<CreateResponse>(this.baseUrl, request)
      .pipe(
        map(ApiResponseMapper.mapCreate)
        );
  }

  public deleteRecipe(id: string): Observable<DeleteResponse> {
    return this.httpClient
      .delete<Recipe>(`${this.baseUrl}/${id}`)
      .pipe(
        map(ApiResponseMapper.mapDelete)
        );
  }

  public addRating(id: string, rating: number, ratings: number): Observable<UpdateResponse> {
    return this.httpClient.post<UpdateResponse>(
      `${this.baseUrl}/rating/${id}`,
      { rating, ratings }
    );
  }

  public updateImage(image: File, recipe: Recipe): Observable<UpdateResponse> {
    const formData = new FormData();
    formData.append("recipeImage", image, recipe._id);
    return this.httpClient
      .post<Recipe>(`${this.baseUrl}/image/${recipe._id}`, formData)
      .pipe(
        map(ApiResponseMapper.mapUpdate)
        );
  }
}

class RecipeMapper {
  public static map(result: any): Array<Recipe> {
    const recipesFromApi: Array<Recipe> = [];

    result.forEach((recipe: any) => {
      const recipeItems: Array<RecipeItem> = [];

      recipe.ingredients.forEach((ingredient: any) => {
        const ingredientObject = JSON.parse(ingredient.toString());
        recipeItems.push(
          new RecipeItem(
            ingredientObject.name,
            ingredientObject.quantity,
            ingredientObject.cost,
            ingredientObject.servingSize,
            ingredientObject.servingMetric
          )
        );
      });
      recipesFromApi.push(
        new Recipe(
          recipe.name,
          recipe.type,
          recipe.rating,
          recipe.ratings,
          recipe.imageUrl,
          recipeItems,
          recipe._id,
          recipe.steps,
          recipe.description,
          recipe.serves
        )
      );
    });

    return recipesFromApi;
  }

  public static mapSingle(result: any): Recipe {
    if (result.length != undefined) {
      result = result[0];
    }

    const recipeItems: Array<RecipeItem> = [];
    result.ingredients.forEach((ingredient: any) => {
      const ingredientObject = JSON.parse(ingredient.toString());
      recipeItems.push(
        new RecipeItem(
          ingredientObject.name,
          ingredientObject.quantity,
          ingredientObject.cost,
          ingredientObject.servingSize,
          ingredientObject.servingMetric
        )
      );
    });

    return new Recipe(
      result.name,
      result.type,
      result.rating,
      result.ratings,
      result.imageUrl,
      recipeItems,
      result._id,
      result.steps,
      result.description,
      result.serves
    );
  }
}
