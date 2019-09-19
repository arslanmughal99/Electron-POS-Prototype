import { Component, OnInit } from '@angular/core';
import * as imageDataUri from 'image-data-uri';
import { LocalStorageHandlerService } from '../../../../services/localstorage/local-storage-handler.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-printer-config',
  templateUrl: './printer-config.component.html',
  styleUrls: ['./printer-config.component.scss']
})
export class PrinterConfigComponent implements OnInit {
  imageValid = true;
  imageDataUrl = this.localstorageService.getFromLocalStorage('companyLogo') || './assets/placeholder.png';
  printerForm: FormGroup;


  constructor(private localstorageService: LocalStorageHandlerService, private _fb: FormBuilder) { }

  ngOnInit() {
    this.printerForm = this._fb.group({
      printIter: [this.localstorageService.getFromLocalStorage('printIter') || 1],
      printLogo: [this.localstorageService.getFromLocalStorage('printLogo') || false],
    });
  }

  onFileSelected(event) {
    const imageFile = event.target.files[0];

    if (imageFile.type === 'image/png') {
      imageDataUri.encodeFromFile(imageFile.path).then((res) => {
        this.imageDataUrl = res;
        this.localstorageService.setToLocalStorage('companyLogo', res);
      });
      this.imageValid = true;
    } else {
      this.imageValid = false;
    }
  }
 
  removeLogo() {
    this.localstorageService.setToLocalStorage('companyLogo', '');
    this.imageDataUrl = './assets/placeholder.png';
  }

  printLogo(event) {
    this.localstorageService.setToLocalStorage('printLogo', event.checked);
  }

  setPrintIter(printIter) {
    this.localstorageService.setToLocalStorage('printIter', parseInt(printIter.value, null));
  }

}
