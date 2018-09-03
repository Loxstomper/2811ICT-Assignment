import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient} from '@angular/common/http';

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
    this.http.get("http://localhost:3000/api/users/").subscribe(data => {
      console.log(data);
    });
  }

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.username = localStorage.getItem("username");

    if (this.username == null)
    {
      this.router.navigateByUrl("/home");
    }

    this.get_user();
  }

}
