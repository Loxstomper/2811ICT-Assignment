import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

    username: string;
    users: string[];

  constructor(private router: Router, private http: HttpClient) { }


  get_users() {
    // this.http.get('http://localhost:3000/api/users').subscribe(data => {
      // console.log(data);
    // })
    console.log("TEST");
  }

  ngOnInit() {
    // this.username = localStorage.getItem("username");
    // console.log(this.username);

    // if (this.username == null)
    // {
    //   alert("Not logged in");
    //   this.router.navigateByUrl('/home');
    // }


    this.get_users();
  }

}
