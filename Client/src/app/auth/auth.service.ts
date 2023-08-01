import { Injectable } from '@angular/core';
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
    let googleDataFromStorage = localStorage.getItem("gData");

    if(googleDataFromStorage === null){
      console.log("No GData User")
      return false;
    }

    let parsedUser = JSON.parse(googleDataFromStorage);
    let user = await this.userService.getUserByDetail(parsedUser.id);
    let newUser = new User(user.firstName, user.secondName, user._id, user.emailAddress, user.authenticated);
    if(newUser.authenticated){
      this.authenticated = true;
      localStorage.setItem("afData", JSON.stringify(newUser));
    }

    return Promise.resolve(this.authenticated);
  }
}