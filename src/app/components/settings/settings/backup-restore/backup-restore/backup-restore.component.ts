import { Component, OnInit } from '@angular/core';
import { ipcRenderer } from 'electron';
import { MatSnackBar } from '@angular/material';
import { AppSettings } from '../../../../../interfaces/appSettings-ineterface';
import { LocalStorageHandlerService } from '../../../../../services/localstorage/local-storage-handler.service';

@Component({
  selector: 'app-backup-restore',
  templateUrl: './backup-restore.component.html',
  styleUrls: ['./backup-restore.component.scss']
})
export class BackupRestoreComponent implements OnInit {
  private _appSettings: AppSettings;
  constructor(
    private _snakebar: MatSnackBar,
    private _localStorageHandler: LocalStorageHandlerService
    ) {
   }

  ngOnInit() {
    this._appSettings = this._localStorageHandler.getFromLocalStorage('appSettings');
  }

  onCreateBackup() {
    ipcRenderer.send('create-db-backup');
    ipcRenderer.once('create-db-backup-status', (event, status) => {
      if (status) {
        this._snakebar.open('Backup created successfully      👍', 'Dismiss', {duration: this._appSettings.notificationDuraton * 1000});
      } else if (!status) {
        this._snakebar.open('Failed creating Backup     😔', 'Dismiss', {duration: this._appSettings.notificationDuraton * 1000});
      }
    });
  }

  onRestoreDB() {
    ipcRenderer.send('restore-db-backup');
    ipcRenderer.once('restore-db-backup-status', (event, status) => {
      if (status) {
        this._snakebar.open('Successfully restored backup      👍', 'Dismiss', {duration: this._appSettings.notificationDuraton * 1000});
      } else if (!status) {
        this._snakebar.open('Failed restoring backup     😔', 'Dismiss', {duration: this._appSettings.notificationDuraton * 1000});
      }
    });
  }

  onDeleteDB() {
    ipcRenderer.send('delete-db-renew');
    ipcRenderer.once('delete-db-renew-status', (event, status) => {
      if (status) {
        this._snakebar.open('Successfully deleted      👍', 'Dismiss', {duration: this._appSettings.notificationDuraton * 1000});
      } else if (!status) {
        this._snakebar.open('Failed to delete     😔', 'Dismiss', {duration: this._appSettings.notificationDuraton * 1000});
      }
    });
  }

}
