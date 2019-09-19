import { Component, OnInit } from '@angular/core';
import { ipcRenderer } from 'electron';

@Component({
  selector: 'app-install-update',
  templateUrl: './install-update.component.html',
  styleUrls: ['./install-update.component.scss']
})
export class InstallUpdateComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onDoupdate() {
    ipcRenderer.send('yes-do-update');
  }

}
