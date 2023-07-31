import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { UsersService } from '../services/users/users.service';
import { User } from '../types/users/user.type';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public authenticated = false;

  constructor(private userService: UsersService) { }

  async isAuthenticated(): Promise<boolean> {
    this.authenticated = false;
    let idFromStorage = localStorage.getItem("id");

    if(idFromStorage == null){
      return false;
    }

    await this.userService.getUserByDetail(idFromStorage).subscribe((data: User) => {
      if(data.authenticated){
        localStorage.setItem("user", JSON.stringify(data))
      }
    });

    return this.authenticated;
  }
}