import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { RecordsComponent } from '../../../records/records.component';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { LocalStorageHandlerService } from '../../../../../../services/localstorage/local-storage-handler.service';
import { GetFromDB } from '../../../../../../interfaces/getDocFromDB-interface';
import { DbHandlerService } from '../../../../../../services/database/db-handler.service';
import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-update-record',
  templateUrl: './update-record.component.html',
  styleUrls: ['./update-record.component.scss']
})
export class UpdateRecordComponent implements OnInit {
  updateForm: FormGroup;
  itemCategories: any[];
  unitsOfMeasures: any[];
  appSettings;

  constructor(
    private _fb: FormBuilder,
    private _dbHandler: DbHandlerService,
    private _snakebar: MatSnackBar,
    private _localStorageService: LocalStorageHandlerService,
    public dialogRef: MatDialogRef<RecordsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GetFromDB
  ) { }

  ngOnInit() {
    const {clientName, clientPhone, clientCNIC, dateOfInvoice, reciptId, counterUser } = this.data;
    this.updateForm = this._fb.group({
      clientName: [clientName, [Validators.required]],
      clientPhone: [clientPhone],
      clientCNIC: [clientCNIC],
      dateOfInvoice: [new Date(dateOfInvoice), [Validators.required]],
      itemsPurchased: this._fb.array([]),
      reciptId: [reciptId],
      counterUser: [counterUser]
    });
    this.appSettings = this._localStorageService.getFromLocalStorage('appSettings');
    this.itemCategories = this._localStorageService.getFromLocalStorage('categories') as string[];
    this.unitsOfMeasures = this._localStorageService.getFromLocalStorage('units') as string[];

    this._addAllItems(this.data.itemsPurchased);
  }

  public get getFromArray() {
    return this.updateForm.get('itemsPurchased') as FormArray;
  }

  deleteItemField(i: number) {
    this.getFromArray.removeAt(i);
  }

  // Push all items in form array on ngOninit()
  private _addAllItems(items: any[]) {
    items.forEach((item) => {
      this.getFromArray.push(this._fb.group(item, [Validators.required]));
    });
  }

  addSingleItem() {
    const item = this._fb.group({
      itemName: [null, [Validators.required]],
      itemCategory: [null, [Validators.required]],
      itemQuantity: [null, [Validators.required]],
      unitOfMeasure: [null, [Validators.required]],
      pricePerUnit: [null, [Validators.required]]
    });

    this.getFromArray.push(item);
  }

  updateRecord() {
    const {clientName: name, clientCNIC: CNIC, clientPhone: phone, dateOfInvoice: date , itemsPurchased: items} = this.updateForm.value;
    const record = {
      clientName: name,
      clientCNIC: CNIC,
      clientPhone: phone,
      dateOfInvoice: new Date(date).toDateString(),
      itemsPurchased: items,
      salesTaxPercent: this.data.salesTaxPercent,
      reciptId: this.data.reciptId,
      counterUser: this.data.counterUser
    };
    this._dbHandler.updateRecord(this.data._id, record)
    .then(_ => {
      this.dialogRef.close();
      this._snakebar.open('Record updated successfully 👍', 'Dismiss', {duration: this.appSettings.notificationDuraton * 1000});
    })
    .catch(_ => {
      this._snakebar.open('Fail updating Record 😔', 'Dismiss', {duration: this.appSettings.notificationDuraton * 1000});
    });
  }

  onCancle() {
    this.dialogRef.close();
  }

}
