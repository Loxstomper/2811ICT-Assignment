import { Component, OnInit } from '@angular/core';
import { SocketService } from '../socket.service';
import { Router } from '@angular/router';

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

  constructor(private router: Router, private sockServ: SocketService) { }

  ngOnInit() {
      if (!localStorage.getItem('username'))
      {
        console.log("not a valid login");
        this.router.navigateByUrl("/home");

      }
      else
      {
        this.username = localStorage.getItem('username');
        console.log("USERNAME: " + this.username);
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
