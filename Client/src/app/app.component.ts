import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit {

  constructor(
    private titleService: Title,
    ) {
    this.titleService.setTitle(`${environment.name} ${environment.version}`);
  }

  ngOnInit(): void{
  }

}
