import { Injectable } from '@angular/core';
import { ipcRenderer } from 'electron';
import * as _ from 'lodash';
import { DashboardData } from '../../interfaces/dashboardData-interface';
import { StaticItemBill } from '../../interfaces/staticItemsBill-interface';
import { LocalStorageHandlerService } from '../localstorage/local-storage-handler.service';
import { AppSettings } from '../../interfaces/appSettings-ineterface';
import { CalcuatedEarnigns } from '../../interfaces/calculate-earnings-interface';

// tslint:disable: no-console
// tslint:disable: max-line-length
export interface DateItem {
  date: Date;
  items: any[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private appSettings: AppSettings;
  constructor(private _lcoalStorageHandler: LocalStorageHandlerService) {
    this.appSettings = this._lcoalStorageHandler.getFromLocalStorage('appSettings');
  }

  public get getAllRecords() {
    const status = new Promise((resolv, reject) => {
      ipcRenderer.send('get-all-bills');
      ipcRenderer.once('get-all-bills-status', (event, allBills) => {
        if (!allBills) {
          reject();
        } else {
          resolv(allBills);
        }
      });
    });
    return status;
  } // getAllRecords()

  // Count total bills
  private _countLenght(arrayOfBills: any[]): number {
    return arrayOfBills.length;
  }

  // Count most popular/selled category
  public _mostSelledCategories(billsArray: any[]) {
    const allBillsItems: DateItem[] = [] as DateItem[];
    billsArray.forEach(bill => {
      allBillsItems.push({date: bill.dateOfInvoice, items: bill.itemsPurchased});
    });
    const rawCount = _.groupBy(allBillsItems, (bill) => new Date(bill.date).toDateString());
    const result: any[] = [];
    _.forEach(rawCount, (val, key) => { // Group Items with date
      const categoriesOnDate: string[] = [];   // collect all categries selled on respective date
      _.forEach(val, (itemsObject) => { // Iterating each data
        _.forEach(itemsObject.items, (item) => {  // iterating each item
          categoriesOnDate.push(item.itemCategory as string);
        });
      });
      result.push({date: key, categories: categoriesOnDate});
    });

    const finalRes = [];
    _.forEach(result, (resItem) => {
        resItem.categories = _.countBy(resItem.categories);
        finalRes.push(resItem);
    });
    return finalRes;
  }

  public getReport(billsArray: any[]) {
    const report = new Promise((resolv, reject) => {
      const rpt: DashboardData = {
        totalBillsCount: this._countLenght(billsArray),
        mostSelledCategory: this._mostSelledCategories(billsArray)
      };
      resolv(rpt);
    });
    return report;
  }


  public calculateBillsCountLastDays(billsArray: any[]) {
    const counted = _.countBy(billsArray , peritem => new Date(peritem.dateOfInvoice).toDateString());
    const sorted = _.take(_.orderBy(_.toPairs(counted), (each => new Date(each[0])), 'desc'), 5);
    return sorted;
  } // end of calculateBillsCountLastDays()


  public calculateEarnnings(billArray: StaticItemBill[]) {
    const availableDates = _.orderBy(_.take(_.keys(_.countBy(billArray, each => new Date(each.dateOfInvoice).toDateString())), 7), date => new Date(date), 'desc');
    const finalRes: CalcuatedEarnigns[] = [];
    const calculated = [];
    availableDates.forEach(eachDate => {
      const tempDateBills = _.filter(billArray, eachBill => new Date(eachBill.dateOfInvoice).toDateString() === eachDate);
      calculated.push({date: eachDate, items: tempDateBills});
    });

    calculated.forEach(eachDateItem => {
      let total = 0;
      let salesTax = 0;
      _.forEach(eachDateItem.items, itemObject => {
        _.forEach(itemObject.itemsPurchased, purchasedItems => {
          total += (purchasedItems.itemPrice - purchasedItems.itemDiscount) * purchasedItems.itemQuantity;
        });
      });
      salesTax = Math.floor((total / 100) * this.appSettings.salesTaxPercent);
      finalRes.push({date: eachDateItem.date, total: total, salesTax: salesTax});
    });
    return finalRes;
  } // end of calculateEarning()

} // end of class
