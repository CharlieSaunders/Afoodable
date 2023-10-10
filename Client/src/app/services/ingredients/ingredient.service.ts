import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { ApiResponseMapper, CreateResponse, DeleteResponse, UpdateResponse } from "src/app/types/generics/api-response.type";
import { Ingredient, IngredientDictionary } from "src/app/types/ingredients/ingredient.type";
import { Environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class IngredientService {
  private httpClient!: HttpClient;
  private baseUrl = `${Environment.url}/api/InternalApi`;
  private httpHeaders!: HttpHeaders = new HttpHeaders();

  constructor(private http: HttpClient) {
    this.httpClient = http;
    this.httpHeaders.set('T2C-Forward-Host', 'localhost:9998');
    this.httpHeaders.set('T2C-Forward-Path', '/api/ingredients');
  }

  public getIngredients(): Observable<Array<Ingredient>> {
    return this.httpClient
      .get<Array<Ingredient>>(this.baseUrl, {headers: this.httpHeaders})
      .pipe(
        map(IngredientMapper.map)
        );
  }

  public getIngredientsDictionary(): Observable<IngredientDictionary> {
    return this.httpClient
      .get<IngredientDictionary>(this.baseUrl, {headers: this.httpHeaders})
      .pipe(
        map(IngredientMapper.mapDictionary)
        );
  }

  public newIngredient(ingredient: Ingredient): Observable<CreateResponse> {
    return this.httpClient
      .post<Ingredient>(this.baseUrl, ingredient, {headers: this.httpHeaders})
      .pipe(
        map(ApiResponseMapper.mapCreate)
        );
  }

  public updateIngredient(ingredient: Ingredient): Observable<UpdateResponse> {
    return this.httpClient
      .patch<Ingredient>(this.baseUrl, ingredient, {headers: this.httpHeaders})
      .pipe(
        map(ApiResponseMapper.mapUpdate)
        );
  }

  public deleteIngredient(id: string): Observable<DeleteResponse> {
    return this.http
      .delete<Ingredient>(`${this.baseUrl}/${id}`, {headers: this.httpHeaders})
      .pipe(
        map(ApiResponseMapper.mapDelete)
        );
  }
}

class IngredientMapper {
  public static map(result: any): Array<Ingredient> {
    const ingredients = new Array<Ingredient>();
    result.forEach((ingredient: any) => {
      ingredients.push(
        new Ingredient(
          ingredient.name,
          ingredient.cost,
          ingredient.servingSize,
          ingredient.servingMetric,
          ingredient._id,
          ingredient.calories,
          ingredient.fat,
          ingredient.carbohydrates,
          ingredient.protein
        )
      );
    });
    return ingredients;
  }

  public static mapDictionary(result: any): IngredientDictionary {
    const ingredientsDictionary = new IngredientDictionary();
    result.forEach((ingredient: any) => {
      ingredientsDictionary.Ingredients[ingredient._id] = new Ingredient(
          ingredient.name,
          ingredient.cost,
          ingredient.servingSize,
          ingredient.servingMetric,
          ingredient._id,
          ingredient.calories,
          ingredient.fat,
          ingredient.carbohydrates,
          ingredient.protein

        );
    });

    return ingredientsDictionary;
  }

  public static mapSingle(result: any): Ingredient {
    return this.map(result)[0];
  }
}
