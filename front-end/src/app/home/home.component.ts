import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { GroupService } from '../group.service';

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

  constructor(private router: Router, private _groupService:GroupService) { }

  ngOnInit() {
    if(sessionStorage.getItem("username") === null){
      // User has not logged in, reroute to login
      this.router.navigate(['/login']);
    } else {
      this.username = JSON.parse(sessionStorage.getItem("username"));
      let user = JSON.parse(sessionStorage.getItem('user'));
      this.user = user;
      console.log(this.user);
      this.groups = user.groups;


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
    let data = {'name': this.newGroupName};
    this._groupService.createGroup(data).subscribe(
      data => { 
        console.log(data);
        this.getGroups();
      },
      error => {
        console.error(error);
      }
    )
  }

  deleteGroup(groupName){
    this._groupService.deleteGroup(groupName, this.user.username).subscribe(
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
        console.log('getGroups()');
        console.log(d);
        this.groups = d['value'];
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
    this.channels = ["channel1", "channel2", "channel3"];

    let data = {group_name: name, username: this.username};

    this._groupService.get_channels(data).subscribe(
      d=>{
        console.log('getGroups()');
        console.log(d);
        this.channels = d['value'];
      }, 
      error => {
        console.error(error);
      }
    )


    // for(let i = 0; i < this.groups.length; i++){
    //   if(this.groups[i].name == name){
    //     this.selectedGroup = this.groups[i];
    //   }
    // }
    // this.channels = this.selectedGroup.channels;
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
  
  getChannels(groupName){
    let channels = [];
    return channels;
  }
}
