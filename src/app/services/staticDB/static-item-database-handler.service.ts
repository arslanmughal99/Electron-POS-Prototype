import { Injectable } from '@angular/core';
import { ipcRenderer } from 'electron';

@Injectable({
  providedIn: 'root'
})
export class StaticItemDatabaseHandlerService {

  constructor() { }

  public getAllBills() {
    const status = new Promise((resolv, reject) => {
      ipcRenderer.send('getAll-staticitem-toDB');
      ipcRenderer.once('status-staticitem-getAll', (_, itemsArray) => {
        if (!itemsArray) {
          reject();
        } else if (itemsArray || itemsArray === []) {
          resolv(itemsArray);
        }
      });
    });
    return status;
  }

  public getOneBill(_id: string) {
    const status = new Promise((resolv, reject) => {
      ipcRenderer.send('getOne-staticitem-toDB', _id);
      ipcRenderer.once('status-staticitem-getOne', (_, itemsBill) => {
        if (!itemsBill) {
          reject();
        } else if (itemsBill || itemsBill === []) {
          resolv(itemsBill);
        }
      });
    });
    return status;
  }

  public insertBill(bill) {
    const status = new Promise((resolv, reject) => {
      ipcRenderer.send('add-staticitem-toDB', bill);
      ipcRenderer.once('status-staticitem-insert', (_, insertStatus) => {
        if (!insertStatus) {
          reject();
        } else if (insertStatus) {
          resolv();
        }
      });
    });
    return status;
  }

  public updateBill(updateObj) {
    const status = new Promise((resolv, reject) => {
      ipcRenderer.send('update-staticitem-toDB', updateObj);
      ipcRenderer.once('status-staticitem-update', (_, updateStatus) => {
        if (!updateStatus) {
          reject();
        } else if (updateStatus) {
          resolv();
        }
      });
    });
    return status;
  }

  public removeBill(_id: string) {
    const status = new Promise((resolv, reject) => {
      ipcRenderer.send('remove-staticitem-toDB', _id);
      ipcRenderer.once('status-staticitem-remove', (_, removeStatus) => {
        if (!removeStatus) {
          reject();
        } else if (removeStatus) {
          resolv();
        }
      });
    });
    return status;
  }

}
