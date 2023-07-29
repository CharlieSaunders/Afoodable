import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { UsersService } from '../services/users/users.service';
import { User } from '../types/users/user.type';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private userService: UsersService) { }

  isAuthenticated(): boolean {
    let userFromStorage = localStorage.getItem("user");

    if(userFromStorage == null){
      console.log("User not found.")
      return false;
    }

    let user = JSON.parse(userFromStorage);
    this.userService.getUserByDetail(user.id).pipe(map(result => {
      console.log(result)
    }))

    return false;
  }
}