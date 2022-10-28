import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ImageRecognitionService {
  private httpClient!: HttpClient;
  private baseUrl = "http://localhost:54321/api/ai/imageRecognition";

  constructor(private http: HttpClient) {
    this.httpClient = http;
  }

  public getTextFromImage(image: File): Observable<any> {
    const formData = new FormData();
    formData.append("image", image);
    return this.httpClient
      .post<any>(`${this.baseUrl}`, formData)
      .pipe(map((result) => Mapper.map(result)));
  }
}

class Mapper {
  public static map(result: any): any {
    console.log(result);
  }
}