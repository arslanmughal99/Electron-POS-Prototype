import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material';
import { RecordsComponent } from '../records/records/records.component';

@Component({
  selector: 'app-regular-client',
  templateUrl: './regular-client.component.html',
  styleUrls: ['./regular-client.component.scss']
})
export class RegularClientComponent implements OnInit {

  @ViewChild(RecordsComponent, {static: true}) private recordComponent: RecordsComponent;

  constructor() { }

  ngOnInit() {
  }

  onTabUpdate(event: MatTabChangeEvent) {
    if (event.index === 1) {
      this.recordComponent.ngOnInit();
    }
  }

}
