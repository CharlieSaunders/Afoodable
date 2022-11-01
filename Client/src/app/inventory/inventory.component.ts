import { Component, OnInit } from '@angular/core';
import { ImageRecognitionService } from '../services/imageRecognition/image-recognition.service';
import * as Tesseract from 'tesseract.js';

class Status {
  Name: string;
  Progress: number;
  constructor(name: string, progress: number){
    this.Name = name;
    this.Progress = progress;
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
  public statuses = new Map<string, Status>;
  public analysing: boolean = false;

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
    const worker = await Tesseract.createWorker({
      logger: m => {
        updateStatuses(m.status, m.progress);
        this.statuses.set(m.status, new Status(m.status, m.progress));
      }
    });
    
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    await worker.recognize(`../assets/images/temp/${this.file.name}`);
    await worker.terminate();

    this.imageRecognitionService.deleteReceipt().subscribe((data:any)=>{});
  }

  private updateStatuses(status: string, progress: number){
    if(this.statuses.has(status)){
      status.set(status, )
    }
  }
}
