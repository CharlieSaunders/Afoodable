import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { ApplicationModule, ApplicationModulesMapper } from "../../types/generics/application-module.type";
import { Environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ModulesService {
  private httpClient!: HttpClient;
  private baseUrl: string = Environment.internalUrl;
  private httpHeaders: HttpHeaders = new HttpHeaders({
    'T2C-Forward-Host': 'localhost:9998',
    'T2C-Forward-Path': '/api/modules'
  });

  constructor(private http: HttpClient) {
    this.httpClient = http;
  }

  public getModules(): Observable<Array<ApplicationModule>> {
    return this.httpClient.get<Array<ApplicationModule>>(this.baseUrl, {headers: this.httpHeaders})
    .pipe(
      map(ApplicationModulesMapper.map)
    );
  }

  public toggle(id: string): Observable<ApplicationModule>{
    return this.http.post<ApplicationModule>(`${this.baseUrl}/${id}`, {}, {headers: this.httpHeaders})
    .pipe(
      map(ApplicationModulesMapper.mapSingle)
      )
  }
}