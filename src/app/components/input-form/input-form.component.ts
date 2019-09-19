import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { LocalStorageHandlerService } from '../../services/localstorage/local-storage-handler.service';
import { RegularClientRecord } from '../../interfaces/record-interface';
import { ReciptIdService } from '../../services/recipt-id/recipt-id.service';
import { DbHandlerService } from '../../services/database/db-handler.service';
import { MatSnackBar } from '@angular/material';
import { AppSettings } from '../../interfaces/appSettings-ineterface';

// tslint:disable: max-line-length
@Component({
  selector: 'app-input-form',
  templateUrl: './input-form.component.html',
  styleUrls: ['./input-form.component.scss']
})
export class InputFormComponent implements OnInit {



  constructor(
    private _fb: FormBuilder,
    private lcoalStorageHandler: LocalStorageHandlerService,
    private reciptIDHandler: ReciptIdService,
    private _dbHandler: DbHandlerService,
    private _snakebar: MatSnackBar
    ) {}

  @Input() public formName: string;
  @Input() public formSubTitle: string;
  reciptPreviewData;
  categories = this.lcoalStorageHandler.getFromLocalStorage('categories');
  units = this.lcoalStorageHandler.getFromLocalStorage('units');
  private _appSettings: AppSettings;
  inputForm: FormGroup;

  ngOnInit() {
    // initializing parent form
    this._appSettings = this.lcoalStorageHandler.getFromLocalStorage('appSettings');
    this.inputForm = this._fb.group({
      clientName: ['', [Validators.required, Validators.minLength(1)]],
      clientPhone: [null, [Validators.min(11)]],
      clientCNIC: [null, [Validators.min(14)]],
      dateOfInvoice: [new Date(), [Validators.required]],
      itemsPurchased: this._fb.array([], [Validators.required, Validators.min(1)])
    });

      // update reciptPreview data on change
      this.inputForm.valueChanges.subscribe((newPreview) => {
        this.reciptPreviewData = newPreview;
      });
  }

  // Get array of Forms
  get getitemForm() {
    return this.inputForm.get('itemsPurchased') as FormArray;
  }

  // Add New Item Input Fiels to `newItemForm` Form Array
  addItem() {
    const newItemInput = this._fb.group(
      {
        itemName : [null, [Validators.required, Validators.minLength(1)]] ,
        itemCategory : [null, [Validators.required]] ,
        itemQuantity : [null, [Validators.required, Validators.min(1)]],
        unitOfMeasure : [null, [Validators.required]] ,
        pricePerUnit : [null, [Validators.required, Validators.min(1)]]
      },
    );
    this.getitemForm.push(newItemInput);
  }

  deleteItemField(i) {
    this.getitemForm.removeAt(i);
  }

  resetForm() {
    this.ngOnInit();
  }

  saveToDb() {
    const {clientName: name, clientCNIC: CNIC, clientPhone: phone, dateOfInvoice: date , itemsPurchased: items} = this.inputForm.value;
    const record: RegularClientRecord = {
      clientName: name,
      clientCNIC: CNIC,
      clientPhone: phone,
      dateOfInvoice: new Date(date).toDateString(),
      itemsPurchased: items,
      salesTaxPercent: this._appSettings.salesTaxPercent,
      reciptId: this.reciptIDHandler.latestReciptId,
      counterUser: this._appSettings.counterUser
    };

    this._dbHandler.saveToDB(record).then(_ => {
    // Sucess handler
      this._snakebar.open('Successfully Saved     👍', 'Dismiss', {duration: this._appSettings.notificationDuraton * 1000});
        if (this._appSettings.resetFormOnSave) {
            this.resetForm();
          }
      })
      // Fail handler
      .catch( _ => {
        this._snakebar.open('Failed to Save     😔', 'Dismiss', {duration: this._appSettings.notificationDuraton * 1000});
      });
  }

}
