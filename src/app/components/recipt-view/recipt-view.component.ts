import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { LocalStorageHandlerService } from '../../services/localstorage/local-storage-handler.service';
import { AppSettings } from '../../interfaces/appSettings-ineterface';

@Component({
  selector: 'app-recipt-view',
  templateUrl: './recipt-view.component.html',
  styleUrls: ['./recipt-view.component.scss']
})
export class ReciptViewComponent implements OnInit, OnChanges {
  @Input() previewData: any;
  itemsTotal;
  appSettings: AppSettings;

  constructor(
    private _lcoalStorageHandler: LocalStorageHandlerService
  ) { }

  ngOnInit() {
    this.appSettings = this._lcoalStorageHandler.getFromLocalStorage('appSettings');
  }

  ngOnChanges() {
    // tslint:disable-next-line: max-line-length
    this.previewData.itemsPurchased ? this.itemsTotal = this.calculateTotalPrice() : this.itemsTotal = {totalPrice: 0, totalItems: 0, salesTax: 0, netTotal: 0};
  }

  calculateTotalPrice() {
    const items = this.previewData.itemsPurchased;
    let totalItemsNumber = 0;
    let salesTax = 0;
    let totalPrice = 0;
    let netTotal = totalPrice;
    items.forEach((item) => {
      totalItemsNumber ++;
      totalPrice += item.pricePerUnit * item.itemQuantity;
    });
    if (totalPrice > 0) {
      salesTax = Math.floor((totalPrice / 100) * this.appSettings.salesTaxPercent);
      netTotal = totalPrice + salesTax;
    }
    return {totalPrice: totalPrice, totalItems: totalItemsNumber, salesTax: salesTax, netTotal: netTotal};
  }

}
