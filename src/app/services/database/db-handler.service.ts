import { Injectable } from '@angular/core';
import { ipcRenderer } from 'electron';


@Injectable({
  providedIn: 'root'
})
export class DbHandlerService {

  constructor() { }

  public saveToDB(record) {
    const status =  new Promise((resolv, reject) => {
      ipcRenderer.send('save-doc-to-db', record);
      ipcRenderer.once('status-save-doc', (event, taskstatus) => {
        if (taskstatus) {
          resolv(taskstatus);
        } else if (!taskstatus) {
          reject();
        }
      });
    });
    return status;
  }

  public get getAllRecords() {
    const status = new Promise((resolv, reject) => {
      ipcRenderer.send('get-all-db-docs');
      ipcRenderer.once('status-get-docs', (event, allRecords) => {
        if (allRecords || allRecords == null) {
           resolv(allRecords);
        } else if (!allRecords) {
          reject();
        }
      });
    });
    return status;
  }


  public getSingleRecord(_id: string) {
    const status = new Promise((resolv, reject) => {
      ipcRenderer.send('get-single-doc', _id);
      ipcRenderer.once('status-get-single-doc', (_, record) => {
        if (record) {
          resolv(record);
        } else if (!record) {
          reject();
        }
      });
    });
    return status;
  }

  public removeRecord(_id: string) {
    const status = new Promise((resolv, reject) => {
      ipcRenderer.send('delete-doc-from-db', _id);
      ipcRenderer.once('status-delete-doc', (event, delStatus) => {
        if (delStatus) {
          resolv(delStatus);
        } else if (!delStatus) {
          reject();
        }
      });
    });
    return status;
  }

  public updateRecord(_id: string, newDoc) {
    const status = new Promise((resolv, reject) => {
      ipcRenderer.send('update-doc-to-db', {_id: _id, newDoc: newDoc});
      ipcRenderer.once('status-update-doc', (_, updateStatus) => {
        if (updateStatus) {
          resolv(updateStatus);
        } else if (!updateStatus) {
          reject();
        }
      });
    });
    return status;
  }


}
