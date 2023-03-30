import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { UrlHelper } from "src/app/helpers/UrlHelper";
import { AnyMapper } from "src/app/types/generics/any-type.type";
import { EmailConfiguration, EmailConfigurationMapper } from "src/app/types/generics/email-configuration.type";
import { Recipe } from "src/app/types/recipes/recipe.type";
import { ShoppingList } from "src/app/types/recipes/shopping-list.type";

@Injectable({
  providedIn: "root",
})
export class EmailService {
  private httpClient!: HttpClient;
  private baseUrl = `${UrlHelper.For()}/api/email`;

  constructor(private http: HttpClient) {
    this.httpClient = http;
  }

  public getConfig(): Observable<EmailConfiguration> {
    return this.httpClient.get(this.baseUrl)
    .pipe(
      map(EmailConfigurationMapper.Map)
    )
  }

  public send(shoppingList: ShoppingList, recipes: Array<Recipe>): Observable<any>{
    const request = {
      "ShoppingList": shoppingList,
      "Recipes": recipes
    };

    return this.httpClient.post(this.baseUrl, request)
    .pipe(
        map(AnyMapper.map)
    );
  }
}