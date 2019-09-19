import { Injectable } from '@angular/core';
import { LocalStorageHandlerService } from '../localstorage/local-storage-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ReciptIdService {

  constructor(private localStorageService: LocalStorageHandlerService) { }


  private nextCharacterCode(char) {
     if (char === '9') {
      return 'A'.charCodeAt(0);
    } else if (char === 'Z') {
      return '0'.charCodeAt(0);
    } else {
      return char.charCodeAt(0) + 1;
    }
  }

  private incrementLetter(id: string) {

    if (id.search(/[ \t\n]/g) !== -1) {
      throw new Error('Invalid characters detected.');
    }

    let carry = false;
    const nextId = id.split('').reverse().map((char, index) => {
      let charCode;
      if (index === 0) {
        charCode = this.nextCharacterCode(char);
        carry = char === '9';
      } else {
        charCode = (carry) ?
          this.nextCharacterCode(char) : char.charCodeAt(0);
        carry = carry && char === '9';
      }

      return String.fromCharCode(charCode);
    }).reverse().join('');

    return carry ? `A${nextId}` : nextId;
  }


  public get latestReciptId() {
    const lastReciptId: string = this.localStorageService.reciptId;
    if (lastReciptId === '') {
      this.localStorageService.setNewreciptId('A');
      return 'A';
    } else {
      const newReciptId: string = this.incrementLetter(lastReciptId);
      // seting new id to local storage
      this.localStorageService.setNewreciptId(newReciptId);
      return newReciptId;
    }
  }

}
