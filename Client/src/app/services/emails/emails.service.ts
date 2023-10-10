import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { AnyMapper } from "src/app/types/generics/any-type.type";
import { EmailConfiguration, EmailConfigurationMapper, UpdateEmailConfiguration } from "src/app/types/generics/email-configuration.type";
import { Recipe } from "src/app/types/recipes/recipe.type";
import { ShoppingList } from "src/app/types/recipes/shopping-list.type";
import { Environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class EmailService {
  private httpClient!: HttpClient;
  private baseUrl: string = Environment.url;
  private httpHeaders: object = {
    headers: {
      'T2C-Forward-Host': 'localhost:9998',
      'T2C-Forward-Path': '/api/email'
      }
    }

  constructor(
    private http: HttpClient) {
    this.httpClient = http;
  }

  public getConfig(): Observable<EmailConfiguration> {
    return this.httpClient.get(this.baseUrl, this.httpHeaders)
    .pipe(
      map(EmailConfigurationMapper.Map)
    );
  }

  public send(shoppingList: ShoppingList, recipes: Array<Recipe>): Observable<any>{
    const request = {
      ShoppingList: shoppingList,
      Recipes: recipes
    };

    return this.httpClient.post(this.baseUrl, this.httpHeaders, request)
    .pipe(
        map(AnyMapper.map)
    );
  }

  public update(request: UpdateEmailConfiguration): Observable<any>{
    return this.httpClient.patch(this.baseUrl, this.httpHeaders, request)
    .pipe(
      map(AnyMapper.map)
    );
  }
}