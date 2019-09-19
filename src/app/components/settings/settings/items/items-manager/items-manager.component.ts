import { Component, OnInit, ViewChild } from '@angular/core';
import { LocalStorageHandlerService } from '../../../../../services/localstorage/local-storage-handler.service';
import * as imageDataUri from 'image-data-uri';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StaticItemDbService } from '../../../../../services/staticItemDB/static-item-db.service';
import { AppSettings } from '../../../../../interfaces/appSettings-ineterface';
import { MatSnackBar } from '@angular/material';
import { AvailableItemsComponent } from '../available-items/available-items/available-items.component';

@Component({
  selector: 'app-items-manager',
  templateUrl: './items-manager.component.html',
  styleUrls: ['./items-manager.component.scss']
})
export class ItemsManagerComponent implements OnInit {
  appSettings: AppSettings;
  itemForm: FormGroup;
  itemImage = './assets/placeholder.png';
  categories: string[];
  units: string[];


  @ViewChild(AvailableItemsComponent, {static: true}) itemsTable: AvailableItemsComponent;

  constructor(
    private _localStorageHandler: LocalStorageHandlerService,
    private _fb: FormBuilder,
    private _dbHandler: StaticItemDbService,
    private _snakbar: MatSnackBar
    ) { }

  ngOnInit() {
    this.categories = this._localStorageHandler.getFromLocalStorage('categories') as string[];
    this.units = this._localStorageHandler.getFromLocalStorage('units') as string[];
    this.appSettings = this._localStorageHandler.getFromLocalStorage('appSettings');

    this.itemForm = this._fb.group({
      itemName: [null, [Validators.required, Validators.minLength(2)]],
      itemUnit: [null, [Validators.required]],
      itemCategory: [null, [Validators.required]],
      itemPrice: [null, [Validators.required]],
      itemDiscount: [null, [Validators.required]]
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
      this.itemsTable.ngOnInit();
    }).catch(_ => {
      this._snakbar.open('Fail to add new item 😔', 'Dismiss', {duration: this.appSettings.notificationDuraton * 1000});
    });
  }

}
