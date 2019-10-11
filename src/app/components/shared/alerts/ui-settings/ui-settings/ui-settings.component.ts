import { Component, OnInit } from '@angular/core';
import * as Store from 'electron-store';
import * as path from 'path';
import * as fs from 'fs';
import { machineIdSync } from 'node-machine-id';
import { remote } from 'electron';
import * as copy from 'copy-text-to-clipboard';
import { StatusSender } from '../../../../../interfaces/sender-status-interface';
import { LocalStorageHandlerService } from '../../../../../services/localstorage/local-storage-handler.service';
import { MatSnackBar } from '@angular/material';
import { AppSettings } from '../../../../../interfaces/appSettings-ineterface';

@Component({
  selector: 'app-ui-settings',
  templateUrl: './ui-settings.component.html',
  styleUrls: ['./ui-settings.component.scss']
})
export class UiSettingsComponent implements OnInit {
  private appSettings: AppSettings;
  private store;
  renewed = false;
  message: string;
  vendorID: string;
  machineID: string;
  daysRemainning: number;
  private licenseInfo: StatusSender;
  constructor(private _localStorageHandler: LocalStorageHandlerService, private _snakeBar: MatSnackBar) {
  }


  ngOnInit() {
    this.store = new Store();
    this.licenseInfo = this.store.get('fixer');
    this.daysRemainning = this.licenseInfo.daysRemanning;
    this.message = this.messageForLicense();
    this.machineID = machineIdSync();
    this.vendorID = this._localStorageHandler.getFromLocalStorage('vendorID') as string;
    this.appSettings = this._localStorageHandler.getFromLocalStorage('appSettings');
  }

  messageForLicense() {
    const state: string = this.licenseInfo.liceseStatus;
    let message: string;
    switch (state) {
      case 'NOT_FOUND':
        message = 'No License Found 🔍 Please conatact your vendor for issuing license';
        break;
      case 'FAILED_READING_LICENSE':
        message = 'Unknown error occure while reading license 😔';
        break;
      case 'UNKNOWN_LICENSE_ERROR':
        message = 'Unknown License Error 📑 Please contact your vendor to solve the issue.';
        break;
      case 'CURRUPTED':
        message = 'Looks like your license file is currupted 📑 Contact your license vendor.';
        break;
      case 'EMPTY_LICENSE_FILE':
        message = 'Looks like your license file does not contain any signature 📑 Contact your license vendor.';
        break;
      case 'EXPIRED':
        message = 'Your license is expired 📑 Please contact your vendor to renew license.';
        break;
      case 'MACHINE_NOT_MATCHED':
        message = 'Looks like this license is of another machine 📑 Please contact your vendor to provide valid license for your machine.';
        break;
      case 'VENDOR_MISMATCH':
        message = 'Your license vendor does not match 📑 Please contact your orignal vendor to provide valid license for your machine.';
        break;
      case 'ACTIVE':
        message = 'Your License is uptodate ✌️👍';
        break;
    }
    return message;
  }

  copyToClipboard(text: string) {
    copy(text);
    this._snakeBar.open('Copied to clipboard     👍', 'Dismiss', {duration: this.appSettings.notificationDuraton * 1000});
  }

  onCopyLicense() {
    const licensePath = path.join(remote.app.getPath('appData') + path.sep + '.cusResSetApp' + path.sep + 'license.ralc');
    // tslint:disable-next-line: max-line-length
    remote.dialog.showOpenDialog({properties: ['openFile'], title: 'Select license file', buttonLabel: 'Select License', filters: [{name: 'License File', extensions: ['ralc']}]}, filePath => {
      if (filePath) {
        fs.copyFile(filePath[0], licensePath, (err) => {
          if (err) {
            // tslint:disable-next-line: max-line-length
            this._snakeBar.open('Something went wrong 😔 while renewing license', 'Dismiss', {duration: this.appSettings.notificationDuraton * 1000});
          } else {
            // tslint:disable-next-line: max-line-length
            this._snakeBar.open('License installed 👍 click restart to verify', 'Dismiss', {duration: this.appSettings.notificationDuraton * 1000});
            this.renewed = true;
          }
        });
      }
    });
  }

  onRestartApp() {
    remote.app.relaunch();
    remote.app.exit();
  }
}
