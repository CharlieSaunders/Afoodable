import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class RecipeService {
  private httpClient!: HttpClient;
  private baseUrl: string = "http://localhost:5432/api/recipes";

  constructor(private http: HttpClient) 
  { 
    this.httpClient = http;
  }

  public getRecipes() {
    return this.httpClient.get(this.baseUrl);
  }
}
