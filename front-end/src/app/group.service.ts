// ============================================
// This service is responsible for CRUD actions 
// to the group APIs
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
export class GroupService {
  private api:string = 'http://localhost:3000/api/';

  constructor(private http:HttpClient) {}

  createGroup(data){
    let body = JSON.stringify(data);
    return this.http.post(this.api + 'groups/create', body, httpOptions);
  }

  deleteGroup(data){
    let body = JSON.stringify(data);
    return this.http.post(this.api + 'groups/delete/', body, httpOptions);
  }

  getGroups(data){
    let body = JSON.stringify(data);
    return this.http.post(this.api + 'groups', body, httpOptions);
  }

  get_channels(data) {
    let body = JSON.stringify({group_name:data.group_name, username:data.username});

    return this.http.post(this.api + 'groups/channels', body, httpOptions);
  }


}
