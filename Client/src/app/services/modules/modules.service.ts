import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { ApplicationModule, ApplicationModulesMapper } from "../../types/generics/application-module.type";
import { Environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ModulesService {
  private httpClient!: HttpClient;
  private baseUrl = `${Environment.url}/api/modules`;

  constructor(private http: HttpClient) {
    this.httpClient = http;
  }

  public getModules(): Observable<Array<ApplicationModule>> {
    return this.httpClient.get<Array<ApplicationModule>>(this.baseUrl)
    .pipe(
      map(ApplicationModulesMapper.map)
    );
  }

  public toggle(id: string): Observable<ApplicationModule>{
    return this.http.post<ApplicationModule>(`${this.baseUrl}/${id}`, {})
    .pipe(
      map(ApplicationModulesMapper.mapSingle)
      )
  }
}