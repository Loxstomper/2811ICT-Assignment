import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  username: string;
  groups: string[];
  channels: string[];

  get_user()
  {

  }

  constructor(private router: Router) { }

  ngOnInit() {
    this.username = localStorage.getItem("username");

    if (this.username == null)
    {
      this.router.navigateByUrl("/home");
    }
  }

}
