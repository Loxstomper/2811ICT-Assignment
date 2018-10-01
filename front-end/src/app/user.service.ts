// ============================================
// This service is responsible for CRUD actions 
// to the user APIs
// ============================================

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, of} from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private api:string = 'http://localhost:3000/api/';

  constructor(private http:HttpClient) {}

  login(data){
    let body = JSON.stringify(data);
    return this.http.post(this.api + 'login', body, httpOptions);
  }

  create(data){
    let body = JSON.stringify(data);
    return this.http.post(this.api + 'users/create', body, httpOptions);
  }

  delete(username){
    console.log("YO IM DELETING");
    return this.http.delete(this.api + 'users/delete/'+username);
  }

  get_users(){
    return this.http.get(this.api + "users", httpOptions);
  }
}
