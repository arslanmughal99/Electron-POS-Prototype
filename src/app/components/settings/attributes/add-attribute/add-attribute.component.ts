import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LocalStorageHandlerService } from '../../../../services/localstorage/local-storage-handler.service';


@Component({
  selector: 'app-add-attribute',
  templateUrl: './add-attribute.component.html',
  styleUrls: ['./add-attribute.component.scss']
})
export class AddAttributeComponent implements OnInit {
  type: string;
  typePlaceHolder: string;
  constructor(
    public dialogRef: MatDialogRef<number>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private _localStorage: LocalStorageHandlerService
  ) { }

  ngOnInit() {
    this.type = this.dialogData.type;
    this.typePlaceHolder = this.type + ' ' + 'name';
  }

  setAttribute(value: string) {
    if (value) {
      console.log(value);
      const attr: string[] = this._localStorage.getFromLocalStorage(this.type) as string[];
      attr.push(value);
      this._localStorage.setToLocalStorage(this.type, attr);
      this.dialogRef.close();
    }
  }

}
