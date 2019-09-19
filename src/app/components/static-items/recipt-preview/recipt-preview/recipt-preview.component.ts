import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { LocalStorageHandlerService } from '../../../../services/localstorage/local-storage-handler.service';
import { AppSettings } from '../../../../interfaces/appSettings-ineterface';

@Component({
  selector: 'app-static-recipt-preview',
  templateUrl: './recipt-preview.component.html',
  styleUrls: ['./recipt-preview.component.scss']
})
export class ReciptPreviewComponent implements OnInit, OnChanges {
  appSettings: AppSettings;
  itemsTotal;
  @Input()
  previewData;


  constructor(
    private _lcoalStorageHandler: LocalStorageHandlerService
  ) { }

  ngOnInit() {
    this.appSettings = this._lcoalStorageHandler.getFromLocalStorage('appSettings');
  }

  ngOnChanges() {
    // tslint:disable-next-line: max-line-length
    // this.previewData.itemsPurchased ? this.itemsTotal = this.calculateTotalPrice() : this.itemsTotal = {totalPrice: 0, salesTax: 0, netTotal: 0};
    this.itemsTotal = this.calculateTotalPrice();
  }

  calculateTotalPrice() {
    const items = this.previewData.itemsPurchased;
    let salesTax = 0;
    let totalPrice = 0;
    let netTotal = totalPrice;
    items.forEach((item) => {
      totalPrice += (item.itemPrice - item.itemDiscount) * item.itemQuantity;
    });
    if (totalPrice > 0) {
      salesTax = Math.floor((totalPrice / 100) * this.appSettings.salesTaxPercent);
      netTotal = totalPrice + salesTax;
    }
    return {totalPrice: totalPrice, salesTax: salesTax, netTotal: netTotal};
  }



}
