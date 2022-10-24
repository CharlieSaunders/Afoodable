import { Component, OnInit } from '@angular/core';
import { ImageRecognitionService } from '../services/imageRecognition/image-recognition.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

  constructor(private imageRecognitionService: ImageRecognitionService) { }

  ngOnInit(): void {
  }

  public onFileChanged(event: any): void {
    const file = event.target.files[0];
    this.imageRecognitionService.getTextFromImage(file).subscribe((data:any)=>{
      console.log(data);
    });
  }
}
