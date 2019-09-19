import { Injectable } from '@angular/core';
import { ipcRenderer } from 'electron';

@Injectable({
  providedIn: 'root'
})
export class StaticItemDbService {

  constructor() { }


  public addItemToDB(itemDoc) {
    const status = new Promise((resolv, reject) => {
      ipcRenderer.send('save-item-toDB', itemDoc);
      ipcRenderer.once('status-save-item', (event, insertStatus) => {
        if (insertStatus) {
          resolv(insertStatus);
        } else if (!insertStatus) {
          reject();
        }
      });
    });
    return status;
  }

  public getItemsFromDB() {
    const status = new Promise((resolv, reject) => {
      ipcRenderer.send('getall-item-fromDB');
      ipcRenderer.once('status-get-items', (event, itemsArray) => {
        if (!itemsArray) {
          reject();
        } else if (itemsArray) {
          resolv(itemsArray);
        }
      });
    });
    return status;
  }

  public getSingleItemsFromDB(_id: string) {
    const status = new Promise((resolv, reject) => {
      ipcRenderer.send('getone-item-fromDB', _id);
      ipcRenderer.once('status-getone-item', (event, item) => {
        if (item) {
          resolv(item);
        } else if (!item) {
          reject();
        }
      });
    });
    return status;
  }

  public updateItem(rules) {
    const status = new Promise((resolv, reject) => {
      ipcRenderer.send('update-item-toDB', rules);
      ipcRenderer.once('status-update-items', (event, item) => {
        if (item) {
          resolv(item);
        } else if (!item) {
          reject();
        }
      });
    });
    return status;
  }

  public removeItem(_id: string) {
    const status = new Promise((resolv, reject) => {
      ipcRenderer.send('remove-item-toDB', _id);
      ipcRenderer.once('status-remove-item', (event, item) => {
        if (item) {
          resolv(item);
        } else if (!item) {
          reject();
        }
      });
    });
    return status;
  }

}
