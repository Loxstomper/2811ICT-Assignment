import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  username:string = "";

  constructor(private router:Router) { }

  ngOnInit() {
  }

  Login(event)
  {
    event.preventDefault();

    localStorage.setItem('username', this.username);
    this.router.navigateByUrl('chat');
  }

}
