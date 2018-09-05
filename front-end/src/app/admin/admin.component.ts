import { Component, OnInit, ModuleWithComponentFactories } from '@angular/core';
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
    // viewer_is_group_admin: number = 0;
    // viewer_is_super_admin: number = 0;
    viewer_is_group_admin = 0;
    viewer_is_super_admin = 0;
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

  create_channel(event)
  {
    event.preventDefault();
    console.log("GROUP NAME: " + this.group_name + " CHANNEL NAME: " + this.channel_name);
    this.http.post("http://localhost:3000/api/channels/create", {group_name:this.group_name, channel_name:this.channel_name}).subscribe(
      res=>{
        if(res['success'] != "true")
        {
          alert(res['error']);
        }
      }
    )
  }

  create_user(event)
  {
    event.preventDefault();

    if (!this.username || !this.email)
    {
      console.log("USER: " + this.username + " email: " + this.email);
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

    this.http.post("http://localhost:3000/api/groups/make_admin", {username:this.username, group_id:this.group_id}).subscribe(
      res=>{
        console.log(res);
        if (res['success'] != "true")
        {
            alert(res['error']);
        }
      }
    )



  }

  invite_user_to_channel(event)
  {
    event.preventDefault();

    if (!this.username || !this.channel_id)
    {
      alert("Please enter a valid username and channel id");
      return;
    }

    this.http.post("http://localhost:3000/api/channels/invite", {username:this.username, channel_id:this.channel_id}).subscribe(
      res=>{
        console.log("ADDED USER TO CHANNEL");
        console.log(res);
        if (res['success'] != "true")
        {
            alert(res['error']);
        }
      }
    )
  }

  get_super_admin_status(user)
  { 
    let x;
    console.log("http://localhost:3000/api/super_admins/is_super_admin/" + user);
    this.http.get("http://localhost:3000/api/super_admins/is_super_admin/" + user).subscribe(
      res=>{
        if (res['success'] == "true")
        {
          console.log("YO DUDE YOUR A SUPER ADMIN");
          x  = 1;
        }
        else
        {
          x = 0;
        }
      }
    )
    return x;
  }

  get_group_admin_status(user)
  {
    let x;
    this.http.get("http://localhost:3000/api/groups/is_admin/" + user).subscribe(
      res=>{
        if (res['value'] == "true")
        {
          x = 1;
        }
        else
        {
          x = 0;
        }
      }
    )

    return x;
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

  make_super_admin(id)
  {

  }

  delete_channel(id)
  {
    this.http.post("http://localhost:3000/api/channels/delete/", {channel_id:id}).subscribe(
      res=>{
        console.log(res);

      }
    )
  }

  ngOnInit() {
    this.viewer_username = localStorage.getItem("username");
    console.log(this.viewer_username);

    if (this.viewer_username == null)
    {
      alert("Not logged in");
      this.router.navigateByUrl('/home');
    }

    // WHY DOESNT THIS WORK??????????
    // this.viewer_is_super_admin = this.get_super_admin_status(this.viewer_username);
    // this.viewer_is_group_admin = this.get_group_admin_status(this.viewer_username);

    // just hardcoded to be superadmin at the moment but this should work
    this.viewer_is_super_admin = 1;

    // if not a group admin or a super admin redirect user
    if (!(this.viewer_is_group_admin || this.viewer_is_super_admin))
    {
      alert("Not a group or super admin")
      this.router.navigateByUrl('/home');
    }




    this.get_users();
    this.get_groups();
    this.get_channels();
    // this.get_super_admins();
  }
}
