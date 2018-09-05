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
    viewer_is_group_admin: number = 0;
    viewer_is_super_admin: number = 0;
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

    if (!this.username || !this.email)
    {
      alert("Please enter a username and email address");
      return;
    }

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

  create_group(event)
  {
    event.preventDefault();
    if (!this.group_name)
    {
      alert("Please enter a group name");

    }

    this.http.post("http://localhost:3000/api/groups/create", {group_name:this.group_name}).subscribe(
      res=>{
        if (res['success'] != "true")
        {
            alert(res['error']);
        }
      }
    )
  }

  delete_group(id)
  {
    if (!id)
    {
      alert("Please enter a group id");

    }

    this.http.post("http://localhost:3000/api/groups/delete", {group_id:id}).subscribe(
      res=>{
        if (res['success'] != "true")
        {
            alert(res['error']);
        }
      }
    )
  }

  make_group_admin(event)
  {
    event.preventDefault();
  }

  invite_user_to_group(event)
  {
    event.preventDefault();

    this.http.post("http://localhost:3000/api/groups/invite", {username:1, channel_id:1}).subscribe(
      res=>{
        if (res['success'] != "true")
        {
            alert(res['error']);
        }
      }
    )
  }

  get_super_admin_status()
  {
    this.http.get("http://localhost:3000/api/super_admins/is_super_admin/" + this.username).subscribe(
      res=>{
        console.log("GET SUPER ADMIN STATUS" + res)
        console.log(res);
        if (res['value'] == "true")
        {
          return 1;
        }
        else
        {
          return 0;
        }
      }
    )
  }

  get_group_admin_status()
  {
    this.http.get("http://localhost:3000/api/groups/is_admin/" + this.username).subscribe(
      res=>{
        console.log("GET GROUP ADMIN STATUS");
        console.log(res);
        if (res['value'] == "true")
        {
          return 1;
        }
        else
        {
          return 0;
        }
      }
    )
  }

  delete_user(id)
  {
    console.log("DELETE ID: " + id);

    this.http.post("http://localhost:3000/api/users/delete/", {user_id:id}).subscribe(
      res=>{
        console.log(res);

      }
    )

  }

  // I MADE THIS.VIEWER.SUPER_USER 1
  ngOnInit() {
    this.viewer_username = localStorage.getItem("username");
    console.log(this.viewer_username);

    if (this.viewer_username == null)
    {
      alert("Not logged in");
      this.router.navigateByUrl('/home');
    }

    this.viewer_is_super_admin = 1;

    // check if the user is a superadmin
    if (this.get_super_admin_status())
    {
      this.viewer_is_super_admin = 1;
    }

    // check if the user is a superadmin
    if (this.get_group_admin_status())
    {
      this.viewer_is_group_admin = 1;
    }

    console.log("SUPERADMIN: " + this.viewer_is_super_admin + "GROUP ADMIN: " + this.viewer_is_group_admin);

    // if not a group admin or not a super admin redirect user
    // if (!this.viewer_is_group_admin || !this.viewer_is_super_admin)
    // {
    //   alert("Not a group or super admin")
    //   this.router.navigateByUrl('/home');
    // }




    this.get_users();
    this.get_groups();
    this.get_channels();
    // this.get_super_admins();
  }
}
