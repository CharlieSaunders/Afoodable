import { Component } from "@angular/core";
import { Environment } from "src/environments/environment";
import { PageHelpers } from "../helpers/page-helpers";
import { User } from '../types/users/user.type';

@Component({
  selector: "app-nav-menu",
  templateUrl: "./nav-menu.component.html",
  styleUrls: ["./nav-menu.component.css"],
})
export class NavMenuComponent {
  public isExpanded = false;
  public user!: User;
  
  constructor(){
    let storageUser = localStorage.getItem("afData");
    if(storageUser != null){
      this.user = JSON.parse(storageUser);
    }
  }
  
  public version = Environment.version;

  collapse(): void {
    this.isExpanded = false;
  }

  toggle(): void {
    this.isExpanded = !this.isExpanded;
  }

  logout(): void {
    localStorage.clear();
    PageHelpers.RefreshPage();
  }
}
