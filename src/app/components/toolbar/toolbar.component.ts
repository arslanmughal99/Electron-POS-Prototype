import { Component, OnInit } from '@angular/core';
import { remote, ipcRenderer } from 'electron';
import * as Store from 'electron-store';
import { Router } from '@angular/router';
import { LocalStorageHandlerService } from '../../services/localstorage/local-storage-handler.service';
import { AppSettings } from '../../interfaces/appSettings-ineterface';
import { StatusSender } from '../../interfaces/sender-status-interface';
import { MatDialog } from '@angular/material';
import { LicenseDaysComponent } from '../licensedays/license-days/license-days.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  confStore;
  appSettings: AppSettings;
  staticItems: boolean;
  toolBarStatus = '';
  licenseStatus: StatusSender;
  constructor(
    private router: Router,
    private localStorageHandler: LocalStorageHandlerService,
    private _dialog: MatDialog
    ) {
    this.confStore = new Store();
    this.licenseStatus = this.confStore.get('fixer') as StatusSender;
    this.licenseRenewNotification();
  }

  ngOnInit() {
    this.appSettings = this.localStorageHandler.getFromLocalStorage('appSettings');
    this.staticItems = this.appSettings.staticItems;
    this._toolBarStateHandler();
  }

  private _toolBarStateHandler () {
    ipcRenderer.on('full-screen-status', (event, status) => {
      if (status) {
        this.toolBarStatus = 'hide-top-bar';
      } else {
        this.toolBarStatus = '';
      }
    });
  }

  onAppClose() {
    remote.app.quit();
  }

  onAppMin() {
    remote.BrowserWindow.getFocusedWindow().minimize();
  }

  onAppMinMax() {
    const { BrowserWindow } = remote;
    const winObject = BrowserWindow.getFocusedWindow();
    const winState = winObject.isMaximized();

    if (winState) {
      winObject.unmaximize();
    } else {
      winObject.maximize();
    }
  }

  onNavigateTo(url: string) {
    this.router.navigateByUrl(url, {replaceUrl: true});
  }

  private licenseRenewNotification() {
    if (this.licenseStatus.daysRemanning <= 3) {
      this._dialog.open(LicenseDaysComponent, {width: '400px', data: this.licenseStatus.daysRemanning, disableClose: true});
    }
  }
}
