import { Component, Input } from "@angular/core";
import { environment } from "src/environments/environment";


@Component({
  selector: "app-nav-menu",
  templateUrl: "./nav-menu.component.html",
  styleUrls: ["./nav-menu.component.css"],
})
export class NavMenuComponent {
  public isExpanded = false;
  public version = environment.version;
  public display = false;

  constructor(){
    this.display = localStorage.getItem("id") != null;
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
}
