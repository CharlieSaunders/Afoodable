import { Component, Input } from "@angular/core";

@Component({
  selector: "app-download-as",
  templateUrl: "./download-as.component.html",
  styleUrls: [],
})
export class DownloadAsComponent{
    @Input() object!: Array<any>;
    private allowDownload = false;

  constructor() {}

    public downloadAsCsv(): void {
      let filename = "recipes.csv";
      let newRow = "\r\n";
      let result = "";
      let objectValues = Object.getOwnPropertyNames(this.object[0]);
      objectValues.forEach((value: any) => {
        console.log(`property: ${value}`);
        console.log(Object.getOwnPropertyDescriptor(this.object[0], value))
      })
      result = Object.keys(this.object[0]).join(",");
      result += newRow;
      this.object.forEach((singleObject: any) => {
        result += Object.values(singleObject).join(",");
        result += newRow;
      })

      if(this.allowDownload){
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(result));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      }

  }

}
