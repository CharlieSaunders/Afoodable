import { Component, Input } from "@angular/core";

@Component({
  selector: "app-download-as",
  templateUrl: "./download-as.component.html",
  styleUrls: [],
})
export class DownloadAsComponent{
    @Input() object!: Array<any>;

  constructor() {}

    public downloadAsCsv(): void {
      let filename = "recipes.csv";
      let newRow = "\r\n";
      let result = "";
      result = Object.keys(this.object[0]).join(",");
      result += newRow;
      this.object.forEach((singleObject: any) => {
        result += Object.values(singleObject).join(",");
        result += newRow;
      })

      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(result));
      element.setAttribute('download', filename);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
  }

}
