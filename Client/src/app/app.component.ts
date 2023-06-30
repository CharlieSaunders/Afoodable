import { Component } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent {

  constructor(private titleService: Title) {
    this.titleService.setTitle(`Afoodable ${environment.version}`);
  }

}
