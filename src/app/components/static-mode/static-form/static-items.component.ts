import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { StaticItem } from '../../../interfaces/staticItems-interface';
import { StaticItemDbService } from '../../../services/staticItemDB/static-item-db.service';
import { MatSnackBar } from '@angular/material';
import { LocalStorageHandlerService } from '../../../services/localstorage/local-storage-handler.service';
import { AppSettings } from '../../../interfaces/appSettings-ineterface';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { StaticItemDatabaseHandlerService } from '../../../services/staticDB/static-item-database-handler.service';
import { StaticItemBill } from '../../../interfaces/staticItemsBill-interface';
import { ReciptIdService } from '../../../services/recipt-id/recipt-id.service';


@Component({
  selector: 'app-static-items',
  templateUrl: './static-items.component.html',
  styleUrls: ['./static-items.component.scss']
})
export class StaticItemsComponent implements OnInit {
  cartItemsForm: FormGroup;
  allitems: StaticItem[];
  displayedItems: StaticItem[];
  appSettings: AppSettings;
  reciptPreviewData;
  @ViewChild('staticSelectedItem', { static: true }) private itemLoopScroll: ElementRef;

  constructor(
    private _fb: FormBuilder,
    private _snakeBar: MatSnackBar,
    private _reciptGenerator: ReciptIdService,
    private _dbHandler: StaticItemDbService,
    private _dbBillHandler: StaticItemDatabaseHandlerService,
    private _localStorageHandler: LocalStorageHandlerService
  ) {}

  ngOnInit() {
    // this.cartItemsForm.valueChanges.subscribe(_ => {
    // });
    this.appSettings = this._localStorageHandler.getFromLocalStorage('appSettings');

    this.cartItemsForm = this._fb.group({
      clientName: [null, [Validators.required, Validators.minLength(1)]],
      dateOfInvoice: [new Date(), [Validators.required]],
      itemsPurchased: this._fb.array([])
    });

    this._dbHandler.getItemsFromDB()
    .then((items: StaticItem[]) => {
      this.allitems = items;
      this.displayedItems = _.sortBy([... this.allitems], (itemSort) => {
        return itemSort.itemName;
      });
    })
    .catch(() => {
      // tslint:disable-next-line: max-line-length
      this._snakeBar.open('Fail to load items 😔, Try creating one from settings', 'Dismiss', { duration: this.appSettings.notificationDuraton * 1000 });
    });

    this.cartItemsForm.valueChanges.subscribe(_ => {
      this.onFormChange();
    });
    this.onFormChange();
  }

  get getItemsFormArray(): FormArray {
    return this.cartItemsForm.get('itemsPurchased') as FormArray;
  }

  scrollItemLoop() {
    if (this.itemLoopScroll) {
      this.itemLoopScroll.nativeElement.scrollTop =  this.itemLoopScroll.nativeElement.scrollHeight;
    }
  }

  onAddItem(_id: string) {
    const forCart = _.find(this.allitems, (eachItem) => {
      return eachItem._id === _id;
    });
    const formSchema = this._fb.group({
      _id: forCart._id,
      itemName: [{value: forCart.itemName, disabled: true}],
      itemPrice: [{value: forCart.itemPrice, disabled: true}],
      itemDiscount: [{value: forCart.itemDiscount, disabled: true}],
      itemQuantity: [1, [Validators.required, Validators.min(1)]],
      itemCategory: [forCart.itemCategory]
    });
    _.remove(this.displayedItems, (eachItem) => {
      return eachItem._id === _id;
    });
    this.getItemsFormArray.push(formSchema);

    // Scroll div on each new item added to form array
    setTimeout(() => {
      this.scrollItemLoop();
    }, 1);
  }


  onDeleteFromCart(i: number, _id: string) {
    this.getItemsFormArray.removeAt(i);
    const restoreItem = _.find(this.allitems, (resItem) => {
      return resItem._id === _id;
    });
    this.displayedItems.push(restoreItem);
    this.displayedItems = _.sortBy(this.displayedItems, (itemSort) => {
      return itemSort.itemName;
    });
  }

  onFormChange() {
    this.reciptPreviewData = this.cartItemsForm.getRawValue();
  }

  resetForm() {
    this.ngOnInit();
  }

  // ! Temperory fill
  trigeerTrailNotification () {
    // tslint:disable-next-line: max-line-length
    this._snakeBar.open('Only printing is disabled for free version to get printing functionality enabled 🔓 contact your application provider.  ', 'Dissmis', {duration: this.appSettings.notificationDuraton * 1000});
  }

  saveItem() {
    const { clientName, dateOfInvoice, itemsPurchased } = this.cartItemsForm.getRawValue();
    const bill: StaticItemBill = {
      counterUser: this.appSettings.counterUser,
      reciptID: this._reciptGenerator.latestReciptId,
      clientName: clientName,
      dateOfInvoice: new Date(dateOfInvoice).toDateString(),
      itemsPurchased: itemsPurchased,
      salesTaxPercent: this.appSettings.salesTaxPercent
    };
    this._dbBillHandler.insertBill(bill)
    .then(_ => {
      if (this.appSettings.resetFormOnSave) {
        this.resetForm();
      }
      this._snakeBar.open('Successfully Saved     👍', 'Dismiss', {duration: this.appSettings.notificationDuraton * 1000});
    })
    .catch(_ => {
      this._snakeBar.open('Failed to Save     😔', 'Dismiss', {duration: this.appSettings.notificationDuraton * 1000});
    });
  }

}
