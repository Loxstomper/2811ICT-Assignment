import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  username:string = "";
  email: string = "";

  constructor(private router:Router, private http:HttpClient) { }

  ngOnInit() {
  }

  create_user()
  {
    this.http.post("http://localhost:3000/api/users/create", {username:this.username, super_admin:0, email:this.email}).subscribe(
      res=>{
        // user does not need to know if its a new account
      }
    )

  }

  Login(event)
  {
    event.preventDefault();

    localStorage.setItem('username', this.username);
    this.create_user();
    this.router.navigateByUrl('chat');
  }



}
