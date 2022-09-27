import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
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

  public newIngredient(ingredient:Ingredient): Observable<Ingredient>{
    return this.httpClient.post<Ingredient>(this.baseUrl, ingredient);
  }

  public updateIngredient(ingredient:Ingredient): Observable<Ingredient>{
    return this.httpClient.patch<Ingredient>(this.baseUrl, ingredient);
  }

  public deleteIngredient(id:string): Observable<Ingredient>{
    return this.http.delete<Ingredient>(`${this.baseUrl}/${id}`);
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
