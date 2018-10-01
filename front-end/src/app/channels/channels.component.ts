import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
// import { EventEmitter } from 'events';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.css']
})
export class ChannelsComponent implements OnInit {
  @Input() channels;
  @Input() group;
  @Output() channelChanged: EventEmitter<string> = new EventEmitter();

  user_obj;

  constructor() { }

  ngOnInit() {
    this.user_obj = JSON.parse(sessionStorage.getItem("user_obj"));
  }

  changeChannel(name){
    // console.log("changeChannel("+name+")");
    this.channelChanged.emit(name);
  }

}
