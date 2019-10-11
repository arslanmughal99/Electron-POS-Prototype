import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { DbHandlerService } from '../../../../services/database/db-handler.service';
import { DatabaseReturn } from '../../../../interfaces/database-return-interface';
import { MatSnackBar, MatDialog } from '@angular/material';
import { LocalStorageHandlerService } from '../../../../services/localstorage/local-storage-handler.service';
import { ViewRecordComponent } from '../view/view-record/view-record.component';
import { UpdateRecordComponent } from '../view/update/update-record/update-record.component';
import { AppSettings } from '../../../../interfaces/appSettings-ineterface';
import { PdfGeneratorService } from '../../../../services/pdfGenerator/pdf-generator.service';
import { ipcRenderer } from 'electron';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.scss']
})
export class RecordsComponent implements OnInit {
  displayedColumns: string[] = ['reciptID', 'name', 'date', 'counter', 'action'];
  dataSource: MatTableDataSource<DatabaseReturn>;
  _appSettings: AppSettings;
  // loadingStatus = true;

  @ViewChild(MatPaginator, {static: true})
  paginator: MatPaginator;
  @ViewChild(MatSort, {static: true})
  sort: MatSort;

  constructor(
    private _localStorageHandeler: LocalStorageHandlerService,
    private _dbHandelr: DbHandlerService,
    private _pdf: PdfGeneratorService,
    private _snakebar: MatSnackBar,
    private _dialog: MatDialog,
    ) {}

  ngOnInit() {
    this._appSettings = this._localStorageHandeler.getFromLocalStorage('appSettings');

    this._dbHandelr.getAllRecords
    .then((records: DatabaseReturn[]) => {
      this._initalizeData(records);
    })
    .catch(_ => {
      this._initalizeData([], true);
    });
  }


  private _initalizeData(data: DatabaseReturn[], errStatus?: boolean) {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      if (errStatus) {
        this._snakebar.open('Failed to load records 😭', 'Dismiss', {duration: this._appSettings.notificationDuraton * 1000});
      }
      // else {
      //   this._snakebar.open('Sucessfully loaded all Records 😉', 'Dismiss', {duration: this._appSettings.notificationDuraton * 1000});
      // }
      // this.loadingStatus = false;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  viewRecord(_id: string) {
    new Promise((resolv, reject) => {
        const record = this._dbHandelr.getSingleRecord(_id);
        resolv(record);
      }).then((record) => {
        this._dialog.open(ViewRecordComponent, {data: record, width: '40%'});
      });
    }

  deleteRecord(_id: string) {
    this._dbHandelr.removeRecord(_id)
    .then(_ => {
      this._snakebar.open('Sucessfully deleted 😉', 'Dismiss', {duration: this._appSettings.notificationDuraton * 1000});
      this.ngOnInit();
    })
    .catch(_ => {
      this._snakebar.open('Fail to delete record 😢', 'Dismiss', {duration: this._appSettings.notificationDuraton * 1000});
    });
  }

  updateRecord(_id: string) {
    let ref;
    new Promise((resolv, reject) => {
      const record = this._dbHandelr.getSingleRecord(_id);
      resolv(record);
    }).then((recData) => {
      const dialogRef = this._dialog.open(UpdateRecordComponent, {data: recData, width: '40%'});
      dialogRef.afterClosed().subscribe(_ => {
        this.ngOnInit();
        ref = dialogRef;
      });
    });
    ref.unsubscribe(_ => {
      console.log('UNSUBCRIBE SUCCESSFULLY : ');
    });
  }

  async generatePdf(billID: string) {
    try {
      this._pdf.generatePdf(billID);
      ipcRenderer.once('generate-pdf-status', (event, saveStatus) => {
        if (saveStatus) {
         this._snakebar.open('Successfully saved PDF     👍', 'Dismiss', {duration: this._appSettings.notificationDuraton * 1000});
        } else {
          // tslint:disable-next-line: max-line-length
          this._snakebar.open('Something went wrong during pdf handling 😔', 'Dismiss', {duration: this._appSettings.notificationDuraton * 1000});
        }
      });
    } catch (_) {
      // tslint:disable-next-line: max-line-length
      this._snakebar.open('OOPs, Some thing went wrong while Generating PDF 😔', 'Dismiss', {duration: this._appSettings.notificationDuraton * 1000});
    }

  }

}
