import { Component, Input } from "@angular/core";
import { Macros } from "src/app/types/generics/macros.type";

@Component({
  selector: "app-macros",
  templateUrl: "./macros.component.html",
  styleUrls: [],
})
export class MacrosComponent{
    @Input() macros!: Macros;
    @Input() displayMeasurement = false;

  constructor() {}

}
