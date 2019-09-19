import { Injectable } from '@angular/core';

import { ipcRenderer } from 'electron';
import { StatusSender } from '../../interfaces/sender-status-interface';

@Injectable({
  providedIn: 'root'
})
export class FixerService {
  
  constructor() { }

  getStatus() { // get lisence info and status
      
  }

  setStatus(state: string) { // set status to seperate config file

  }

}
