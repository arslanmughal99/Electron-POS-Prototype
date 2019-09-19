import { Injectable } from '@angular/core';
import { remote } from 'electron';
import * as path from 'path';
import * as Store from 'electron-store';
import { schema } from '../../interfaces/appConfigSchema';



@Injectable({
  providedIn: 'root'
})
export class LocalStorageHandlerService {

  store = new Store({schema: schema, cwd: path.join(remote.app.getPath('appData'), '.cusResSetApp')});
  constructor() {
  }


  public setToLocalStorage(key: string, value) {
    this.store.set(key, value);
    // const data = JSON.stringify(value);  // Lagacy Code
    // localStorage.setItem(key, data);
  }

  public getFromLocalStorage(key: string) {
    return this.store.get(key);
    // return JSON.parse(localStorage.getItem(key));  // Lagacy Code
  }

  public removeFromStorage(key: string) {
    this.store.delete(key);
    // localStorage.removeItem(key);  // Lagacy Code
  }

  public get reciptId() {
    return this.store.get('lastReciptId') as string;
  }

  public setNewreciptId(id: string) {
    this.store.set('lastReciptId', id);
  }

}
