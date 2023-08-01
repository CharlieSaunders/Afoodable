import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";
import { ApiResponseMapper, CreateResponse, DeleteResponse } from "src/app/types/generics/api-response.type";
import { UrlHelper } from "src/app/helpers/UrlHelper";
import { CreateRecipeTag, RecipeTag } from "src/app/types/recipes/recipe-tag.type";
import { Environment } from "../../../environments/environment";

@Injectable()
export class RecipeTagService {
  private httpClient!: HttpClient;
  private baseUrl = `${Environment.url}/api/recipes/tags`;

  constructor(private http: HttpClient) {
    this.httpClient = http;
  }

  public getAll(): Observable<Array<RecipeTag>> {
    return this.httpClient
      .get(this.baseUrl)
      .pipe(
        map(RecipeTagMapper.map)
        );
  }

  public create(request: CreateRecipeTag): Observable<CreateResponse> {
    return this.httpClient
      .post<CreateResponse>(this.baseUrl, request)
      .pipe(
        map(ApiResponseMapper.mapCreate)
        );
  }

  public delete(id: string): Observable<DeleteResponse> {
    return this.httpClient
      .delete<RecipeTag>(`${this.baseUrl}/${id}`)
      .pipe(
        map(ApiResponseMapper.mapDelete)
        );
  }
}

class RecipeTagMapper {
  public static map(result: any): Array<RecipeTag> {
    const tags: Array<RecipeTag> = [];

    result.forEach((tag: any) => {
      tags.push(new RecipeTag(tag.name, tag._id));
    });

    return tags;
  }
}
