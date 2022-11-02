import { Component, OnInit } from '@angular/core';
import { ImageRecognitionService } from '../services/imageRecognition/image-recognition.service';
import * as Tesseract from 'tesseract.js';

class Status {
  DisplayProgress: boolean;
  Name: string;
  Progress: number;
  constructor(name: string, progress: number){
    this.DisplayProgress = false;

    if(name == "recognizing text")
      this.DisplayProgress = true;

    this.Name = name;
    this.Progress = progress;
  }

  getProgress(): string {
    let percentage = (this.Progress*100).toFixed(2);
    return `${percentage}%`
  }
}

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
  providers: [ImageRecognitionService]
})
export class InventoryComponent implements OnInit {
  private file: any;
  public statuses : Array<Status> = [];
  public analysing: boolean = false;
  public analysed: boolean = false;
  public analysedText!: Tesseract.RecognizeResult;

  constructor(private imageRecognitionService: ImageRecognitionService) { }

  ngOnInit(): void {
  }

  public onFileChanged(event: any): void {
    const file = event.target.files[0];
    this.file = event.target.files[0];
    this.imageRecognitionService.uploadReceipt(file).subscribe((data:any)=>{});
  }

  public async inspect(): Promise<void>{
    this.analysing = true;
    const worker = Tesseract.createWorker({
      logger: m => {
        this.updateStatuses(m.status, m.progress);
      }
    });
    
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    this.analysedText = await worker.recognize(`../assets/images/temp/${this.file.name}`);
    console.log(this.analysedText);
    this.analysed = true;
    await worker.terminate();


    this.imageRecognitionService.deleteReceipt().subscribe((data:any)=>{});
    console.log(this.statuses)
  }

  private updateStatuses(status: string, progress: number){
    var index = this.statuses.findIndex(x => x.Name == status);

    if(index == -1){
      this.statuses.push(new Status(status, progress));
    }else{
      this.statuses[index].Progress = progress;
    }
  }
}
