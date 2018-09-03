import { Component } from '@angular/core';
import { SocketService } from './socket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'front-end';

  constructor(private router: Router, socketService: SocketService) {}

  ngOnInit()
  {
    if (localStorage.getItem("username") != null)
    {
      this.router.navigateByUrl("/chat");
    }
    else
    {
      this.router.navigateByUrl("/home");
    }

  }

}
