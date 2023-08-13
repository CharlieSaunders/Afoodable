import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom, map, Observable } from "rxjs";
import { User } from "src/app/types/users/user.type";
import { Environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  private baseUrl = `${Environment.url}/api/users`;

  constructor(private http: HttpClient) {
  }

  public async getUserByDetail(id: string): Promise<any> {
    const apiCall$ = this.http.get(`${this.baseUrl}/${id}`);
    return firstValueFrom(apiCall$);
  }
}

export class UserMapper{
    public static map(result: any): User {
        return new User(result[0].firstName, result[0].secondName, result[0].id, result[0].emailAddress, result[0].authenticated);
    }
}