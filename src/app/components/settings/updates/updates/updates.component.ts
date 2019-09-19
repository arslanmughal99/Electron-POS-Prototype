import { Component, OnInit } from '@angular/core';
import { ipcRenderer } from 'electron';

@Component({
  selector: 'app-updates',
  templateUrl: './updates.component.html',
  styleUrls: ['./updates.component.scss']
})
export class UpdatesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onUpdateYes() {
    ipcRenderer.send('yes-update-app', true);
    console.log('Updating');
  }
}
