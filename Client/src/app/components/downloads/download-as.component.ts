import { Component, Input } from "@angular/core";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-download-as",
  templateUrl: "./download-as.component.html",
  styleUrls: [],
  providers: []
})
export class DownloadAsComponent{
    @Input() object!: Array<any>;
    private allowDownload = true;

  constructor(private toasterService: ToastrService) {

  }

  public downloadAsCsv(): void {
    if(!this.allowDownload){
      this.toasterService.warning("Download as CSV disabled");
      return;
    }

    if(this.object.length > 1){
      const newRow = "\r\n";
      let result = "";

      result = Object.keys(this.object[0]).join(",");
      result += newRow;

      const objectType = Object.getPrototypeOf(this.object[1]).constructor.name;

      this.object.forEach((singleObject: any) => {
        result += Object.values(singleObject).join(",");
        result += newRow;
      });

      if(this.allowDownload){
        const filename = `${objectType}.csv`
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(result));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      }
    }else{
      this.toasterService.warning(`Not enough records to download`);
    }
  }
}