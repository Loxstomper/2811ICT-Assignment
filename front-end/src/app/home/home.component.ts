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

  admin_check()
  {
    this.http.post("http://localhost:3000/api/groups/is_admin", {username:this.username}).subscribe(
      res=>{
        // user does not need to know if its a new account
        console.log(res);
      }
    )

  }

  Login(event)
  {
    event.preventDefault();

    // check if user exists
    this.http.get("http://localhost:3000/api/users/" + this.username).subscribe(
      res=>{
        if (res['success'] == "false")
        {
          alert("User does not exist");
          this.router.navigateByUrl('home');
          return;
        }
      }
    )

    localStorage.setItem('username', this.username);
    // this.admin_check();

    this.router.navigateByUrl('chat');
  }



}
