import { Component, OnInit, Inject } from '@angular/core';
import { AppSettings } from '../../../../../interfaces/appSettings-ineterface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocalStorageHandlerService } from '../../../../../services/localstorage/local-storage-handler.service';
import { StaticItemDbService } from '../../../../../services/staticItemDB/static-item-db.service';
import * as imageDataUri from 'image-data-uri';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { StaticItem } from '../../../../../interfaces/staticItems-interface';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss']
})
export class ItemFormComponent implements OnInit {
  appSettings: AppSettings;
  itemForm: FormGroup;
  actionType: string;
  updateItemData: StaticItem;
  itemImage = './assets/placeholder.png';
  categories: string[];
  units: string[];


  constructor(
    public dialogRef: MatDialogRef<string>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private _localStorageHandler: LocalStorageHandlerService,
    private _fb: FormBuilder,
    private _dbHandler: StaticItemDbService,
    private _snakbar: MatSnackBar
  ) { }

  ngOnInit() {
    this.actionType = this.dialogData.type;
    this.updateItemData = this.dialogData.itemData;
    this.categories = this._localStorageHandler.getFromLocalStorage('categories') as string[];
    this.units = this._localStorageHandler.getFromLocalStorage('units') as string[];
    this.appSettings = this._localStorageHandler.getFromLocalStorage('appSettings');

    // tslint:disable-next-line: max-line-length tslint:disable-next-line: no-unused-expression
    this.actionType === 'UPDATE_ITEM' ? this.itemImage = this.updateItemData.itemImage || './assets/placeholder.png' : './assets/placeholder.png';

    this.itemForm = this._fb.group({
      itemName: [this.actionType === 'UPDATE_ITEM' ? this.updateItemData.itemName : null, [Validators.required, Validators.minLength(2)]],
      itemUnit: [this.actionType === 'UPDATE_ITEM' ? this.updateItemData.itemUnit : null, [Validators.required]],
      itemCategory: [this.actionType === 'UPDATE_ITEM' ? this.updateItemData.itemCategory : null, [Validators.required]],
      itemPrice: [this.actionType === 'UPDATE_ITEM' ? this.updateItemData.itemPrice : null, [Validators.required]],
      itemDiscount: [this.actionType === 'UPDATE_ITEM' ? this.updateItemData.itemDiscount : null, [Validators.required]]
    });
  }

  onImageSelected(event) {
    const imageFile = event.target.files[0];
    if (imageFile.type === 'image/jpeg') {
      imageDataUri.encodeFromFile(imageFile.path).then((res) => {
        this.itemImage = res;
      });
    } else {
      this._snakbar.open('Only ".jpg" images are allowed 🛑', 'Dismiss', {duration: this.appSettings.notificationDuraton * 1000});
    }
  }

  onResetImage() {
    // TODO: Replace image to datauri with builtin electron nativ image
    this.itemImage = './assets/placeholder.png';
  }

  onItemReset() {
    this.itemForm.reset();
    this.itemImage = './assets/placeholder.png';
  }

  onItemSave() {
    const newItem = {
    ...
    this.itemForm.value,
    itemImage: this.itemImage
    };

    this._dbHandler.addItemToDB(newItem)
    .then(_ => {
      this._snakbar.open('Successfully added new item 👍', 'Dismiss', {duration: this.appSettings.notificationDuraton * 1000});
      this.onItemReset();
      this.dialogRef.close();
    }).catch(_ => {
      this._snakbar.open('Fail to add new item 😔', 'Dismiss', {duration: this.appSettings.notificationDuraton * 1000});
    });
  }

  onUpdateItem() {
    const updatedItem = {
      ...
      this.itemForm.value,
      itemImage: this.itemImage
    };
    this._dbHandler.updateItem({_id: this.updateItemData._id, newDoc: updatedItem})
    .then(_ => {
      this._snakbar.open('Item updated successfully 👍', 'Dismiss', {duration: this.appSettings.notificationDuraton * 1000});
      this.dialogRef.close();
    })
    .catch(_ => {
      // tslint:disable-next-line: max-line-length
      this._snakbar.open('Fail updating Item 😔, Please try restarting app', 'Dismiss', {duration: this.appSettings.notificationDuraton * 1000});
    });
  }

  saveOrUpdate() {
    if (this.actionType === 'NEW_ITEM') {
      this.onItemSave();
    } else if (this.actionType === 'UPDATE_ITEM') {
      this.onUpdateItem();
    }
  }

}
