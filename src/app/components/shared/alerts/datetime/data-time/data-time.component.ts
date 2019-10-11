import { Component, OnInit } from '@angular/core';
import { remote } from 'electron';

@Component({
  selector: 'app-data-time',
  templateUrl: './data-time.component.html',
  styleUrls: ['./data-time.component.scss']
})
export class DataTimeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onClose() {
    remote.app.exit();
  }

  onRestart() {
    remote.app.relaunch();
    remote.app.exit();
  }
}
