import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { ApplicationModule, ApplicationModulesMapper } from "../../types/generics/application-module.type";
import { Environment } from "../../../environments/environment";
import { HeaderNames, HttpHeaderHelper } from "src/app/helpers/http-headers-helpers";

@Injectable({
  providedIn: "root",
})
export class ModulesService {
  private httpClient!: HttpClient;
  private baseUrl: string = Environment.internalUrl;
  private httpHeaders: HttpHeaders = HttpHeaderHelper.For('/api/modules', 'localhost:9998');

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
    this.httpHeaders.set(HeaderNames.ForwardPath, `/api/modules/${id}`);
    return this.http.post<ApplicationModule>(this.baseUrl, {}, {headers: this.httpHeaders})
    .pipe(
      map(ApplicationModulesMapper.mapSingle)
      )
  }
}