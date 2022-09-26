import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Recipe } from 'src/app/types/recipes/recipe.type';
import { Observable } from 'rxjs';
import { UpdateRecipeDto } from '../../types/recipes/update-recipe-dto.type';

@Injectable()
export class RecipeService {
  private httpClient!: HttpClient;
  private baseUrl: string = "http://localhost:54321/api/recipes";

  constructor(private http: HttpClient) 
  { 
    this.httpClient = http;
  }

  public getRecipes(): Observable<Array<Recipe>>{
    return this.httpClient.get<Array<Recipe>>(this.baseUrl);
  }

  public getRecipe(id: string): Observable<Recipe>{
    return this.httpClient.get<Recipe>(`${this.baseUrl}/${id}`);
  }

  public updateRecipe(request: UpdateRecipeDto): Observable<Recipe>{
    return this.httpClient.post<any>(`${this.baseUrl}`, request, {});
  }
}