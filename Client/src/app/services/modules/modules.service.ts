import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { ApplicationModule, ApplicationModulesMapper } from "../../types/generics/application-module.type";
import { UrlHelper } from "src/app/helpers/UrlHelper";

@Injectable({
  providedIn: "root",
})
export class ModulesService {
  private httpClient!: HttpClient;
  private baseUrl = `${UrlHelper.For()}/api/modules`;

  constructor(private http: HttpClient) {
    this.httpClient = http;
  }

  public getModules(): Observable<Array<ApplicationModule>> {
    return this.httpClient.get(this.baseUrl)
    .pipe(
      map(ApplicationModulesMapper.map)
    );
  }
}