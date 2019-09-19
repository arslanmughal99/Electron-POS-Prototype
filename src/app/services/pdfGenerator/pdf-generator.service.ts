import { Injectable } from '@angular/core';
import { StaticItemBill } from '../../interfaces/staticItemsBill-interface';
import { StaticItemDatabaseHandlerService } from '../staticDB/static-item-database-handler.service';
import { ipcRenderer, remote } from 'electron';
import { RegularClientRecord } from '../../interfaces/record-interface';
import { LocalStorageHandlerService } from '../localstorage/local-storage-handler.service';
import { AppSettings } from '../../interfaces/appSettings-ineterface';
import { DbHandlerService } from '../database/db-handler.service';

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {
  appSettings: AppSettings;
  constructor(
    private dbHandler: StaticItemDatabaseHandlerService,
    private _localStorageHandler: LocalStorageHandlerService,
    private _regularDbHandler: DbHandlerService
    ) {
    this.appSettings = this._localStorageHandler.getFromLocalStorage('appSettings');
   }

  public async generatePdf(_id: string) {
    let bill;
    if (this.appSettings.staticItems) {
      bill = await this.dbHandler.getOneBill(_id) as StaticItemBill;
    } else {
      bill = await this._regularDbHandler.getSingleRecord(_id) as RegularClientRecord;
    }
    // tslint:disable-next-line: max-line-length
    remote.dialog.showSaveDialog(remote.getCurrentWindow(), {title: 'Save PDF', buttonLabel: 'Save Invoice', filters: [{name: 'pdf', extensions: ['pdf']}]})
    .then((status) => {
      if (!status.canceled && status.filePath) {
        // const configuredPath = status.filePath.split('.')[0];
        ipcRenderer.send('generate-pdf', {billObj: bill, path: status.filePath});
      }
    });
  }

}
