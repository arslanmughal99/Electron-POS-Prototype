import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalStorageHandlerService } from '../../../../services/localstorage/local-storage-handler.service';
import { constants } from '../../../../constants/constants';
import { AppSettings } from '../../../../interfaces/appSettings-ineterface';
import { MatSnackBar, MatDialog } from '@angular/material';
import { remote } from 'electron';
import { BackupRestoreComponent } from '../backup-restore/backup-restore/backup-restore.component';


@Component({
  selector: 'app-application-settings',
  templateUrl: './application-settings.component.html',
  styleUrls: ['./application-settings.component.scss']
})
export class ApplicationSettingsComponent implements OnInit {
  appSettingsForm: FormGroup;
  appSettings: AppSettings;

  constructor(
    private _fb: FormBuilder,
    private localStorageService: LocalStorageHandlerService,
    private _dialog: MatDialog,
    private _snakeBar: MatSnackBar
    ) { }

  ngOnInit() {
    this.appSettings = this.localStorageService.getFromLocalStorage('appSettings');

    this.appSettingsForm = this._fb.group({
      companyName: [this.appSettings.companyName || constants.COMPANY_NAME],
      companyContact: [this.appSettings.companyContact || constants.COMPANY_CONTACT],
      companyAddress: [this.appSettings.companyAddress || constants.COMPANY_ADDRESS],
      resetFormOnSave: [this.appSettings.resetFormOnSave === false ? false : constants.RESET_FROM_ON_SAVE],
      ccustomReciptMessage: [this.appSettings.ccustomReciptMessage],
      staticItems: [this.verifyStaticItemStatus()],
      counterUser: [this.appSettings.counterUser || constants.COUNTER_USER],
      notificationDuraton: [this.appSettings.notificationDuraton || constants.NOTIFICATION_TIME],
      salesTaxPercent: [this.appSettings.salesTaxPercent || constants.SALES_TAX]
    });

    this.appSettingsForm.valueChanges.subscribe(data => this.changeAppSettings(data));
  }

  verifyStaticItemStatus() {
    if (this.appSettings.staticItems === false) {
      return false;
    } else if (this.appSettings.staticItems === true) {
      return true;
    } else if (this.appSettings.staticItems === null || this.appSettings.staticItems === undefined) {
      return constants.STATIC_ITEMS;
    }
  }

  changeAppSettings(data) {
    this.appSettings = data;
    this.localStorageService.setToLocalStorage('appSettings', data);
  }

  onChangeStatic(event) {
    // tslint:disable-next-line: max-line-length
    const snakebarRef = this._snakeBar.open('Changes will take effect after restart', 'Restart Now', {duration: 5000});
    snakebarRef.onAction().subscribe(_ => {
      remote.app.relaunch();
      remote.app.exit();
    });
  }

  onBackupRestore() {
    this._dialog.open(BackupRestoreComponent, {width: '500px'});
  }

}
