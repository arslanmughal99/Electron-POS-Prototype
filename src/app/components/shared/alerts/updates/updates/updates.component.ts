import { Component, OnInit } from '@angular/core';
import { ipcRenderer } from 'electron';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-updates',
  templateUrl: './updates.component.html',
  styleUrls: ['./updates.component.scss']
})
export class UpdatesComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<UpdatesComponent>
  ) { }

  ngOnInit() {
  }

  closeDailog() {
    this.dialogRef.close();
  }

  onUpdateYes() {
    ipcRenderer.send('yes-update-app', true);
    this.closeDailog();
  }
}
