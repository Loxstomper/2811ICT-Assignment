import { Component, OnInit } from '@angular/core';
import { SocketService } from '../socket.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit {

    public username = "";
    messages=[];
    message;
    connection;

  constructor(private router: Router, private sockServ: SocketService, private http:HttpClient) { }

  name: string = "";

  get_groups_and_channels()
  {
    this.http.post("http://localhost:3000/api/groups_and_channels_from_username/", {username:name}).subscribe(
      res => {
        console.log(res);
      }
    ) 
  }

  ngOnInit() {
      if (!localStorage.getItem('username'))
      {
        console.log("not a valid login");
        this.router.navigateByUrl("/home");

      }
      else
      {
        this.name = localStorage.getItem('username');
        console.log("USERNAME: " + this.username);
        this.get_groups_and_channels();
      }

    this.connection = this.sockServ.getMessages().subscribe(message=>{
        this.messages.push(message);
        this.message = '';
    });


  }

  sendMessage(message){

    console.log("THIS.MESSAGE: " + this.message);
    this.sockServ.sendMessage('[' + this.username + ']' + '\n' + this.message);
  }

  ngOnDestroy() {
      if(this.connection) {
          this.connection.unsubscribe();
      }

  }

}
