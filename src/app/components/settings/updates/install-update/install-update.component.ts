import { Component, OnInit } from '@angular/core';
import { ipcRenderer } from 'electron';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-install-update',
  templateUrl: './install-update.component.html',
  styleUrls: ['./install-update.component.scss']
})
export class InstallUpdateComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<undefined>
  ) { }

  ngOnInit() {
  }

  onDoupdate() {
    ipcRenderer.send('yes-do-update');
    this.dialogRef.close();
  }

}
