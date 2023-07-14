import { Component, Input } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Ingredient, IngredientBuilder } from "../../types/ingredients/ingredient.type";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource} from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { IngredientService } from "../../services/ingredients/ingredient.service"

@Component({
  selector: "app-upload-as",
  templateUrl: "./upload-as.component.html",
  styleUrls: ["./upload-as.component.css"],
  providers: [IngredientService]
})
export class UploadAsComponent{
    @Input() type!: string;
    public objectKeys!: Array<string>;
    public showModal = false;
    public status!: string;
    public headers!: Array<string>;
    public dataSource!: MatTableDataSource<Ingredient>;

  constructor(
    private toasterService: ToastrService,
    private ingredientService: IngredientService) {

  }

  public async onFileChanged($event: any): Promise<string> {
    this.showModal = true;
    let fileContent = await this.readFileContent($event.target.files[0]);

    if(fileContent.length === 0){
      return Promise.resolve("")
    }

    let rows = fileContent.split("\r\n");
    if(rows.length === 0){
      this.toasterService.warning("Not enough records to upload");
      return Promise.resolve("");
    }

    if(this.type === "Ingredient"){
      this.objectKeys = Object.keys(new Ingredient("", 0, 0, "", "", 0, 0, 0, 0));
    }
    let tableData = Array<Ingredient>();
    rows.forEach((row: any) => {
      let rowData = row.split(",");
      if(!this.headers){
        this.headers = rowData;
      }else{
        if(rowData.length >= this.objectKeys.length){
          tableData.push(IngredientBuilder.fromArray(rowData));
        }
      }
    })
    this.dataSource = new MatTableDataSource<Ingredient>(tableData);
    return Promise.resolve("")
  }

  public closeWithoutUpload(): void {
    this.showModal = false;
  }

  public closeWithUpload(): void {
    this.dataSource.data.forEach((ingredient: Ingredient) => {
      if(ingredient._id){
        this.ingredientService.updateIngredient(ingredient).subscribe((data: any) => { 
          this.toasterService.success(`Uploaded ${ingredient.name}`)
        });
      }else{
        this.ingredientService.newIngredient(ingredient).subscribe((data: any) => { 
          this.toasterService.success(`Uploaded ${ingredient.name}`)
        });
      }
    });
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