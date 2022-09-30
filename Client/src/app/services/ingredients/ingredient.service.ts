import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiResponseMapper, CreateResponse, DeletedResponse, UpdateResponse } from 'src/app/types/generics/api-response.type';
import { Ingredient } from 'src/app/types/ingredients/ingredient.type';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {
  private httpClient!: HttpClient;
  private baseUrl: string = "http://localhost:54321/api/ingredients";
  
  constructor(private http: HttpClient) 
  { 
    this.httpClient = http;
  }

  public getIngredients(): Observable<Array<Ingredient>>{
    return this.httpClient.get<Array<Ingredient>>(this.baseUrl).pipe(
      map((result) => IngredientMapper.map(result))
    );
  }

  public newIngredient(ingredient:Ingredient): Observable<CreateResponse>{
    return this.httpClient.post<Ingredient>(this.baseUrl, ingredient).pipe(
      map((result) => ApiResponseMapper.mapCreate(result))
    );
  }

  public updateIngredient(ingredient:Ingredient): Observable<UpdateResponse>{
    return this.httpClient.patch<Ingredient>(this.baseUrl, ingredient).pipe(
      map((result) => ApiResponseMapper.mapUpdate(result))
    );
  }

  public deleteIngredient(id:string): Observable<DeletedResponse>{
    return this.http.delete<Ingredient>(`${this.baseUrl}/${id}`).pipe(
      map((result) => ApiResponseMapper.mapDelete(result))
    );
  }
}

class IngredientMapper {
  public static map(result: any): Array<Ingredient> {
    let ingredients = new Array<Ingredient>;
    result.forEach((ingredient:any) => {
      ingredients.push(new Ingredient(ingredient.name, ingredient.cost, ingredient.servingSize, ingredient.servingMetric, ingredient._id));
    });
    return ingredients;
  }

  public static mapSingle(result: any): Ingredient {
    return this.map(result)[0];
  }
}
