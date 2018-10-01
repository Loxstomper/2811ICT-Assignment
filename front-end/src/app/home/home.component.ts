import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { GroupService } from '../group.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public user;
  public selectedGroup;
  public selectedChannel;
  public groups = [];
  public channels = [];
  public opened_group;
  public newGroupName:String
  public username;
  public user_obj;

  editing_group = false;

  all_users = []
  user_to_delete;

  new_channel_name;

  new_user = {
      username: "", 
      image: "./images/users/default.png",
      email: "",
      password: "",
      superadmin: false,
      groups: [],
      group_admin: false,
      channels: [] 
      };

  constructor(private router: Router, private _groupService:GroupService, private _userService:UserService) { }

  ngOnInit() {
    if(sessionStorage.getItem("username") === null){
      // User has not logged in, reroute to login
      this.router.navigate(['/login']);
    } else {
      this.username = sessionStorage.getItem("username");

      // console.log("USERNAME: ", this.username);

      // this.user_obj = JSON.parse(sessionStorage.getItem("user_obj"));
      this.user_obj = sessionStorage.getItem("user_obj");
      this.user_obj = JSON.parse(this.user_obj);

      let test_obj = {first:"one", second:{value:"oh yeah"}};

      // sessionStorage.setItem("test_obj", JSON.stringify(test_obj));
      sessionStorage.setItem("test_obj", JSON.stringify(test_obj));

      let test_obj_read = JSON.parse(sessionStorage.getItem("test_obj"));

      this.get_all_users();

      // console.log("test_obj: ", test_obj_read);
      // console.log("second", test_obj_read.second);
      // console.log("value", test_obj_read.second.value);



      // let user = JSON.parse(sessionStorage.getItem('user'));
      // this.user = user;
      // console.log(this.user);
      // this.groups = user.groups;


      this.getGroups();

      if(this.groups.length > 0){
        this.openGroup(this.groups[0].name);
        if(this.groups[0].channels > 0){
          this.channelChangedHandler(this.groups[0].channels[0].name);
        }
      }
    }
  }

  createGroup(event){
    event.preventDefault();

    if (! this.newGroupName)
    {
      alert("Please enter a group name");
      return;
    }

    let data = {'name': this.newGroupName};
    this._groupService.createGroup(data).subscribe(
      data => { 
        console.log(data);

        if (data['ok'] === 'false')
        {
          alert(data['error']);
        }
        else 
        {
          this.getGroups();
        }
      },
      error => {
        console.error(error);
      }
    )
  }

  deleteGroup(groupName){
    let data = {name:groupName, user:this.username}
    this._groupService.deleteGroup(data).subscribe(
      data=>{
        this.getGroups();
      }, error =>{
        console.error(error)
      }
    )
  }

  getGroups(){
    let data = {'username': this.username}

    this._groupService.getGroups(data).subscribe(
      d=>{
        // console.log('getGroups()');
        console.log(d);
        this.groups = d['value'];
        console.log(this.groups);
      }, 
      error => {
        console.error(error);
      }
    )
  }

  create_channel(event) {
    event.preventDefault();

    if (!this.opened_group)
    {
      alert("Open a group first");
      return
    }

    if (!this.new_channel_name)
    {
      alert("Enter a channel name");
      return;
    }
    
    // really should add the creator the to channel but oh well
    console.log("creating channel: " + this.opened_group + "/" + this.new_channel_name);

    let data = {name:this.new_channel_name, group:this.opened_group, users:[]};

    this._groupService.create_channel(data).subscribe(
      d=>{
        // console.log('getGroups()');
        console.log(d);
      }, 
      error => {
        console.error(error);
      }
    )
  }


  logout(){
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  // Determine which group is currently selected and pass onto the child panel
  openGroup(name){
    this.opened_group = name;
    console.log(name);

    // do database call here, get the channels that the user has access too
    let users = [];
    for (let i = 0; i < 100; i ++)
    {
      users.push(i);
    }

    let data = {group_name: name, username: this.user_obj.username};

    this._groupService.get_channels(data).subscribe(
      d=> {
        console.log(d);
        this.channels = d['value'];
      },
      error => {
        console.error(error);
      }
    );


    // this._groupService.get_channels(data).subscribe(
    //   d=>{
    //     console.log('getGroups()');
    //     console.log(d);
    //     this.channels = d['value'];
    //   }, 
    //   error => {
    //     console.error(error);
    //   }
    // )


    // for(let i = 0; i < this.groups.length; i++){
    //   if(this.groups[i].name == name){
    //     this.selectedGroup = this.groups[i];
    //   }
    // }
    // this.channels = this.selectedGroup.channels;
  }

  edit_group(){
    // console.log("EDIT GROUP: ", group_name);
    console.log("EDIT GROUP");
    // this.editing_group = !this.editing_group;
    this.editing_group = true;
  }


  // Responsible for handling the event call by the child component
  channelChangedHandler(name){
    let found:boolean = false;
    for(let i = 0; i < this.channels.length; i++){
      if(this.channels[i].name == name){
        this.selectedChannel = this.channels[i];
        found = true;
      }
    }
    return found;
  }

  get_channel_users(name)
  {
    this._groupService.get_channel_users(name).subscribe(
      data => { 
        console.log(data);

        if (data['ok'] === 'false')
        {
          alert(data['error']);
        }
        else 
        {

        }
      },
      error => {
        console.error(error);
      }
    )
  }
  
  getChannels(groupName){
    let channels = [];
    return channels;
  }

  create_user(event) {

    console.log("New user: " + this.new_user);
    console.log("New user: " + this.new_user.username);
    console.log("super: " + this.new_user.superadmin);

    this._userService.create(this.new_user).subscribe(
      data => { 
        console.log(data);

        if (data['ok'] === 'false')
        {
          alert(data['error']);
        }
        else 
        {

        }
      },
      error => {
        console.error(error);
      }
    )

    this.get_all_users();
  }

  delete_user(event) {
    console.log(this.all_users);

    if (! this.user_to_delete)
    {
      alert("Please select a user to delete");
      return;
    }

    console.log(this.user_to_delete);

    this._userService.delete(this.user_to_delete).subscribe(
      data => {
        if (data['ok'] === 'true')
        {
          alert("user: " + this.user_to_delete + " has been deleted.");
        }
        else
        {
          alert("error: " + data['error']);
        }
        console.log(data);
      },
      error => {
        console.error(error);
      }
    );

    this.get_all_users();

  }

  get_all_users() {
    this._userService.get_users().subscribe(
      data => {
        let x = data['value'];

        this.all_users = [];
        for (let i = 0; i < x.length; i ++) {
         this.all_users.push(x[i]['username']);
        }


        console.log("USERS: ", this.all_users);
      },
      error => {
        console.error(error);
      }
    );
  }
}
