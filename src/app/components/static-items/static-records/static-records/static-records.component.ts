import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { StaticItemBill } from '../../../../interfaces/staticItemsBill-interface';
import { StaticItemDatabaseHandlerService } from '../../../../services/staticDB/static-item-database-handler.service';
import { AppSettings } from '../../../../interfaces/appSettings-ineterface';
import { LocalStorageHandlerService } from '../../../../services/localstorage/local-storage-handler.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ViewDialogComponent } from '../view-dialog/view-dialog/view-dialog.component';
import { ipcRenderer } from 'electron';
import { PdfGeneratorService } from '../../../../services/pdfGenerator/pdf-generator.service';

@Component({
  selector: 'app-static-records',
  templateUrl: './static-records.component.html',
  styleUrls: ['./static-records.component.scss']
})
export class StaticRecordsComponent implements OnInit {

  displayedColumns: string[] = ['reciptID', 'name', 'date', 'counter', 'actions'];
  dataSource: MatTableDataSource<StaticItemBill>;
  appSettings: AppSettings;

  constructor(
    private _snakebar: MatSnackBar,
    private _localStorageHandler: LocalStorageHandlerService,
    private _dbHandlerBill: StaticItemDatabaseHandlerService,
    private _matDialog: MatDialog,
    private _pdf: PdfGeneratorService
    ) { }

    @ViewChild(MatPaginator, {static: true})
    paginator: MatPaginator;
    @ViewChild(MatSort, {static: true})
    sort: MatSort;

  ngOnInit() {
    this.appSettings = this._localStorageHandler.getFromLocalStorage('appSettings');
    this._dbHandlerBill.getAllBills()
    .then((itemsArray: StaticItemBill[]) => {
      this.dataSource = new MatTableDataSource(itemsArray);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
    .catch(_ => {
      // tslint:disable-next-line: max-line-length
      this._snakebar.open('Failed to load records  😔, Please Restart app', 'Dismiss', {duration: this.appSettings.notificationDuraton * 1000});
    });
  }


  onDeleteBill(_id: string) {
    this._dbHandlerBill.removeBill(_id)
    .then(_ => {
      this._snakebar.open('Successfully Deleted     👍', 'Dismiss', {duration: this.appSettings.notificationDuraton * 1000});
      this.ngOnInit();
    })
    .catch(_ => {
      // tslint:disable-next-line: max-line-length
      this._snakebar.open('Failed to delete record  😔, Please Restart app', 'Dismiss', {duration: this.appSettings.notificationDuraton * 1000});
    });
  }


  onViewBill(_id: string) {
    this._dbHandlerBill.getOneBill(_id)
    .then(bill => {
      this._matDialog.open(ViewDialogComponent, {data: bill, width: '45%'});
    })
    .catch(_ => {
      // tslint:disable-next-line: max-line-length
      this._snakebar.open('Failed to view record  😔, Please Restart app', 'Dismiss', {duration: this.appSettings.notificationDuraton * 1000});
    });
  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  generatePdf(billID: string) {
    try {
      this._pdf.generatePdf(billID);
      ipcRenderer.once('generate-pdf-status', (event, saveStatus) => {
        if (saveStatus) {
         this._snakebar.open('Successfully saved PDF     👍', 'Dismiss', {duration: this.appSettings.notificationDuraton * 1000});
        } else {
          // tslint:disable-next-line: max-line-length
          this._snakebar.open('Something went wrong during pdf handling 😔', 'Dismiss', {duration: this.appSettings.notificationDuraton * 1000});
        }
      });
    } catch (_) {
      // tslint:disable-next-line: max-line-length
      this._snakebar.open('OOPs, Some thing went wrong while Generating PDF 😔', 'Dismiss', {duration: this.appSettings.notificationDuraton * 1000});
    }

  }

}
