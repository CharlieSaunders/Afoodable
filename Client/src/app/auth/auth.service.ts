import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() { }

  isAuthenticated(){
    let id = localStorage.getItem("id");
    if(id === null){
      return false;
    }

    return true;
  }
}