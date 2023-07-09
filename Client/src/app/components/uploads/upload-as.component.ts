import { Component, Input } from "@angular/core";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-upload-as",
  templateUrl: "./upload-as.component.html",
  styleUrls: ["./upload-as.component.css"],
  providers: []
})
export class UploadAsComponent{
    @Input() type!: string;
    private allowUpload = true;
    public showModal = false;
    public status!: string;
    public headers!: Array<string>;
    public rows: Array<Array<any>> = Array<Array<any>>();

  constructor(private toasterService: ToastrService) {

  }

  public async onFileChanged($event: any): Promise<string> {
    this.showModal = true;
    this.status = "Reading File"
    let fileContent = await this.readFileContent($event.target.files[0]);
    if(fileContent.length === 0){
      return Promise.resolve("")
    }
    this.status = "Parsing File";
    let rows = fileContent.split("\r\n");
    if(rows.length === 0){
      this.toasterService.warning("Not enough records to upload");
      return Promise.resolve("");
    }

    let index = 0;
    rows.forEach((row: any) => {
      let rowData = row.split(",");
      if(!this.headers){
        this.headers = rowData;
      }else{
        this.rows.push([]);
        this.rows[index] = rowData;
        index++;
      }

    })

    return Promise.resolve("")
  }

  public closeWithoutUpload(): void {
    this.showModal = false;
  }

  public readFileContent(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (!file) {
        resolve("");
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = reader.result?.toString();
        resolve(text??"No text");
      };
      reader.readAsText(file);
    });
  }
}