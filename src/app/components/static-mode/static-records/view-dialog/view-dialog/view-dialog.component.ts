import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { StaticItemBill, StaticItemsForBill } from '../../../../../interfaces/staticItemsBill-interface';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator } from '@angular/material';
import { AppSettings } from '../../../../../interfaces/appSettings-ineterface';

@Component({
  selector: 'app-view-dialog',
  templateUrl: './view-dialog.component.html',
  styleUrls: ['./view-dialog.component.scss']
})
export class ViewDialogComponent implements OnInit {
  appSettings: AppSettings;
  itemsTotal;
  dialogData: StaticItemBill;
  dataSource: MatTableDataSource<StaticItemsForBill>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  displayedColumns: string[] = ['name', 'itemPrice', 'itemDiscount', 'itemQuantity', 'total'];

  constructor(
    public dialogRef: MatDialogRef<StaticItemBill>,
    @Inject(MAT_DIALOG_DATA) public data: StaticItemBill
  ) { }

  ngOnInit() {
    this.dialogData = this.data;
    this.itemsTotal = this.calculateTotalPrice();
    this.dataSource = new MatTableDataSource(this.dialogData.itemsPurchased);
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  calculateTotalPrice() {
    const items: StaticItemsForBill[] = this.dialogData.itemsPurchased;
    let salesTax = 0;
    let totalPrice = 0;
    let netTotal = totalPrice;
    items.forEach((item) => {
      totalPrice += (item.itemPrice - item.itemDiscount) * item.itemQuantity;
    });
    if (totalPrice > 0) {
      salesTax = Math.floor((totalPrice / 100) * this.dialogData.salesTaxPercent);
      netTotal = totalPrice + salesTax;
    }
    return {totalPrice: totalPrice, salesTax: salesTax, netTotal: netTotal};
  }

}
