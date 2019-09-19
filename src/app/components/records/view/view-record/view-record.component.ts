import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { RecordsComponent } from '../../records/records.component';
import { RegularClientRecord, RegularClientItems } from '../../../../interfaces/record-interface';
import { MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-view-record',
  templateUrl: './view-record.component.html',
  styleUrls: ['./view-record.component.scss']
})
export class ViewRecordComponent implements OnInit {
  itemsTotal;
  displayedColumns: string[] = ['name', 'category', 'quantity', 'unit', 'price', 'itemTotal'];
  dataSource: MatTableDataSource<RegularClientItems>;

    @ViewChild(MatPaginator, {static: true})
    paginator: MatPaginator;

  constructor(
    public dialogRef: MatDialogRef<RecordsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RegularClientRecord
  ) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.data.itemsPurchased);
    this.dataSource.paginator = this.paginator;
    this.itemsTotal = this.calculateTotalPrice();
  }

  calculateTotalPrice() {
    const items: RegularClientItems[] = this.data.itemsPurchased;
    let salesTax = 0;
    let totalPrice = 0;
    let netTotal = totalPrice;
    items.forEach((item) => {
      totalPrice += item.pricePerUnit * item.itemQuantity;
    });
    if (totalPrice > 0) {
      salesTax = Math.floor((totalPrice / 100) * this.data.salesTaxPercent);
      netTotal = totalPrice + salesTax;
    }
    return {totalPrice: totalPrice, salesTax: salesTax, netTotal: netTotal};
  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // get getTotalCost() {
  //   let total = 0;
  //   this.dataSource.forEach((item: RegularClientItems) => {
  //     total += item.itemQuantity * item.pricePerUnit;
  //   });
  //   return total;
  // }

}
