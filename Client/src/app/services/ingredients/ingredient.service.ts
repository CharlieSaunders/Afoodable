import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { ApiResponseMapper, CreateResponse, DeleteResponse, UpdateResponse } from "src/app/types/generics/api-response.type";
import { Ingredient } from "src/app/types/ingredients/ingredient.type";

@Injectable({
  providedIn: "root",
})
export class IngredientService {
  private httpClient!: HttpClient;
  private baseUrl = "http://localhost:54321/api/ingredients";

  constructor(private http: HttpClient) {
    this.httpClient = http;
  }

  public getIngredients(): Observable<Array<Ingredient>> {
    return this.httpClient
      .get<Array<Ingredient>>(this.baseUrl)
      .pipe(
        map(IngredientMapper.map)
        );
  }

  public newIngredient(ingredient: Ingredient): Observable<CreateResponse> {
    return this.httpClient
      .post<Ingredient>(this.baseUrl, ingredient)
      .pipe(
        map(ApiResponseMapper.mapCreate)
        );
  }

  public updateIngredient(ingredient: Ingredient): Observable<UpdateResponse> {
    return this.httpClient
      .patch<Ingredient>(this.baseUrl, ingredient)
      .pipe(
        map(ApiResponseMapper.mapUpdate)
        );
  }

  public deleteIngredient(id: string): Observable<DeleteResponse> {
    return this.http
      .delete<Ingredient>(`${this.baseUrl}/${id}`)
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
          ingredient._id
        )
      );
    });
    return ingredients;
  }

  public static mapSingle(result: any): Ingredient {
    return this.map(result)[0];
  }
}
