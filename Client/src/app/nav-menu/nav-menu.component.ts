import { Component } from "@angular/core";
import { environment } from "src/environments/environment";
import { PageHelpers } from "../helpers/page-helpers";


@Component({
  selector: "app-nav-menu",
  templateUrl: "./nav-menu.component.html",
  styleUrls: ["./nav-menu.component.css"],
})
export class NavMenuComponent {
  public isExpanded = false;
  public version = environment.version;

  constructor(){
  }

  collapse(): void {
    this.isExpanded = false;
  }

  toggle(): void {
    this.isExpanded = !this.isExpanded;
  }

  logout(): void {
    localStorage.removeItem("id");
    PageHelpers.RefreshPage();
  }
}
