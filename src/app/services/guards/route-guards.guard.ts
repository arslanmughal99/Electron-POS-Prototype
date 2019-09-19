import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import * as Store from 'electron-store';
import { StatusSender } from '../../interfaces/sender-status-interface';
import { MatDialog } from '@angular/material';
import { UiSettingsComponent } from '../../components/ui-settings/ui-settings/ui-settings.component';
import { DataTimeComponent } from '../../components/datetime/data-time/data-time.component';



@Injectable({
  providedIn: 'root'
})
export class RouteGuardsGuard implements CanActivate {
  private store;
  private timeStatus: boolean;
  private state: StatusSender;
  constructor(private _dialog: MatDialog) {
    this.store = new Store();
    this.state = this.store.get('fixer') as StatusSender;
    this.timeStatus = Date.now() > this.store.get('afs') || false;
  }
  canActivate(): boolean {
    if (!this.timeStatus) {
      this._dialog.open(DataTimeComponent, {width: '400px', disableClose: true});
      return false;
    }

    if (this.state) {
      if (this.state.liceseStatus === 'ACTIVE') {
        return true;
      } else {
        this.openDialog();
        return false;
      }
    } else {
      console.log('not prepared');
      this.openDialog();
      return false;
    }
  }

  private openDialog() {
    this._dialog.open(UiSettingsComponent, {width: '700px', disableClose: true});
  }
}
