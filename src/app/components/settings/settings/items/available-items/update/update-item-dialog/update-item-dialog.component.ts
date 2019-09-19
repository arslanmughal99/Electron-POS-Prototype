import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppSettings } from '../../../../../../../interfaces/appSettings-ineterface';
import { StaticItem } from '../../../../../../../interfaces/staticItems-interface';
import { LocalStorageHandlerService } from '../../../../../../../services/localstorage/local-storage-handler.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import * as imageURI from 'image-data-uri';
import { StaticItemDbService } from '../../../../../../../services/staticItemDB/static-item-db.service';

@Component({
  selector: 'app-update-item-dialog',
  templateUrl: './update-item-dialog.component.html',
  styleUrls: ['./update-item-dialog.component.scss']
})
export class UpdateItemDialogComponent implements OnInit {
  categories: string[];
  units: string[];
  appSettings: AppSettings;
  itemUpdateForm: FormGroup;
  itemRefID: string;
  itemData: StaticItem;
  itemImage: string;

  constructor(
    private _fb: FormBuilder,
    private _localStorageHandler: LocalStorageHandlerService,
    public dialogRef: MatDialogRef<any>,
    private _dbHandler: StaticItemDbService,
    private _snakeBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

  ngOnInit() {
    this.itemRefID = this.data._id;
    this.itemData = this.data.itemData;
    this.itemImage = this.itemData.itemImage;
    this.categories = this._localStorageHandler.getFromLocalStorage('categories') as string[];
    this.units = this._localStorageHandler.getFromLocalStorage('units') as string[];
    this.appSettings = this._localStorageHandler.getFromLocalStorage('appSettings');
    this.itemUpdateForm = this._fb.group({
      itemName: [this.itemData.itemName, [Validators.required, Validators.minLength(2)]],
      itemUnit: [this.itemData.itemUnit, [Validators.required]],
      itemCategory: [this.itemData.itemCategory, [Validators.required]],
      itemPrice: [this.itemData.itemPrice, [Validators.required]],
      itemDiscount: [this.itemData.itemDiscount, [Validators.required]]
    });
  }

  onImageSelected(event) {
    const imageFile = event.target.files[0];
    if (imageFile.type === 'image/jpeg') {
      imageURI.encodeFromFile(imageFile.path).then((res) => {
        this.itemImage = res;
      });
    }
  }

  onUpdateItem() {
    const updatedItem = {
      ...
      this.itemUpdateForm.value,
      itemImage: this.itemImage
    };
    this._dbHandler.updateItem({_id: this.itemRefID, newDoc: updatedItem})
    .then(_ => {
      this._snakeBar.open('Item updated successfully 👍', 'Dismiss', {duration: this.appSettings.notificationDuraton * 1000});
      this.dialogRef.close();
    })
    .catch(_ => {
      // tslint:disable-next-line: max-line-length
      this._snakeBar.open('Fail updating Item 😔, Please try restarting app', 'Dismiss', {duration: this.appSettings.notificationDuraton * 1000});
    });
  }

  onImageReset() {
    this.itemImage = './assets/placeholder.png';
  }

  onItemReset() {
    this.itemUpdateForm.reset();
  }
}
