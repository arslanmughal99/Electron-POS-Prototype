import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-license-days',
  templateUrl: './license-days.component.html',
  styleUrls: ['./license-days.component.scss']
})
export class LicenseDaysComponent implements OnInit {
  daysRemain: number;
  constructor(
    public dialogRef: MatDialogRef<number>,
    @Inject(MAT_DIALOG_DATA) public data: number
  ) { }

  ngOnInit() {
    this.daysRemain = this.data;
  }

}
