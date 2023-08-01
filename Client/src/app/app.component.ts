import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Environment } from "src/environments/environment";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit {


  constructor(private titleService: Title) {
    this.titleService.setTitle(`${Environment.name} ${Environment.version}`);
  }

  ngOnInit(): void{
  }

}
