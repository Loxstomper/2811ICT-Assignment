import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

    viewer_username: string = "";
    viewer_is_group_admin: number;
    viewer_is_super_admin: number;
    email: string = "";
    super_admin: number = 0;
    username: string = "";
    group_name:string = "";
    group_id: number;
    channel_name: string = "";
    channel_id: number;
    

    users;
    groups;
    channels;
    super_admins;

  // constructor(private router: Router, private http: HttpClient) { }
  constructor(private router: Router, private http:HttpClient) {}


  get_users() {
    this.http.get('http://localhost:3000/api/users').subscribe(data => {
      this.users = data['value'];
      console.log("USERS: " + this.users);
    })
  }

  get_groups() {
    this.http.get('http://localhost:3000/api/groups').subscribe(data => {
      this.groups = data['value'];
      console.log("GROUPS: " + this.groups);
    })
  }

  get_channels() {
    this.http.get('http://localhost:3000/api/channels').subscribe(data => {
      this.channels = data['value'];
      console.log("CHANNELS: " + this.channels);
    })
  }

  get_super_admins() {
    this.http.get('http://localhost:3000/api/super_admins').subscribe(data => {
      this.super_admins = data['value'];
      console.log("SUPER ADMINS: " + this.super_admins);
    })
  }

  create_user(event)
  {
    event.preventDefault();

    this.http.post("http://localhost:3000/api/users/create", {username:this.username, super_admin:this.super_admin, email:this.email}).subscribe(
      res=>{
        if (res['success'] != "true")
        {
            alert(res['error']);
        }
      }
    )

    console.log(this.username, this.email, this.super_admin);
  }

  ngOnInit() {
    this.viewer_username = localStorage.getItem("username");
    console.log(this.viewer_username);

    if (this.viewer_username == null)
    {
      alert("Not logged in");
      this.router.navigateByUrl('/home');
    }


    this.get_users();
    this.get_groups();
    this.get_channels();
    this.get_super_admins();

    console.log(this.users);
  }
}
