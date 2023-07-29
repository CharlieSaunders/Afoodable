import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { UrlHelper } from "src/app/helpers/UrlHelper";
import { User } from "src/app/types/users/user.type";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  private httpClient!: HttpClient;
  private baseUrl = `${UrlHelper.For()}/api/users`;

  constructor(private http: HttpClient) {
    this.httpClient = http;
  }

  public getUserByDetail(id: string): Observable<User> {
    return this.httpClient.get<User>(`${this.baseUrl}/${id}`)
    .pipe(
      map(UserMapper.map)
    );
  }
}

export class UserMapper{
    public static map(result: any): User {
        return new User(result[0].firstName, result[0].secondName, result[0].id, result[0].emailAddress, result[0].authenticated);
    }
}