import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private api:string = 'http://localhost:3000/api/';

  constructor(private http:HttpClient) { }

  img_upload(fd) {
    console.log(fd);
    return this.http.post<any>(this.api + "images/upload", fd);
  }
}
