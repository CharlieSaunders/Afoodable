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
    const googleDataFromStorage = localStorage.getItem("gData");

    if(googleDataFromStorage === null){
      console.log("No Google User Data")
      return false;
    }

    const parsedUser = JSON.parse(googleDataFromStorage);
    const apiResponse = await this.userService.CreateSession(parsedUser.id);
    const node = apiResponse.results;
    const newUser = new User(node.firstName, node.secondName, node.id, node.emailAddress, node.authenticated, node.authenticationToken, node.reference);

    if(newUser.authenticated){
      this.authenticated = true;
      localStorage.setItem("afData", JSON.stringify(newUser));
    }

    return Promise.resolve(this.authenticated);
  }
}