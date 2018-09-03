import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  username: string;
  groups: string[];
  channels: string[];
  test;

  get_user()
  {
    // this.http.get("http://localhost:3000/users/" + this.username).subscribe(data => {
    //   this.test = data;
    // })
  }

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.username = localStorage.getItem("username");

    if (this.username == null)
    {
      this.router.navigateByUrl("/home");
    }
  }

}
