import { Component, Input } from "@angular/core";
import { environment } from "src/environments/environment";
import { SocialUser } from '@abacritt/angularx-social-login';


@Component({
  selector: "app-nav-menu",
  templateUrl: "./nav-menu.component.html",
  styleUrls: ["./nav-menu.component.css"],
})
export class NavMenuComponent {
  @Input() user!: SocialUser;
  public isExpanded = false;
  public version = environment.version;

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
}
