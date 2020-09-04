import { Component, OnInit, ViewChild } from "@angular/core";
import {
  MatTableDataSource,
  MatPaginator,
  MatSort,
  MatSnackBar,
  MatDialog,
} from "@angular/material";
import { StaticItemDbService } from "../../../../../services/staticItemDB/static-item-db.service";
import { AppSettings } from "../../../../../interfaces/appSettings-ineterface";
import { LocalStorageHandlerService } from "../../../../../services/localstorage/local-storage-handler.service";
import { ItemFormComponent } from "../item-form/item-form.component";

export interface StaticItemTemp {
  _id: string;
  itemName: string;
  itemUnit: string;
  itemCat: string;
  itemPrice: number;
  itemImage: string;
  itemDiscount: number;
}

@Component({
  selector: "app-available-items",
  templateUrl: "./available-items.component.html",
  styleUrls: ["./available-items.component.scss"],
})
export class AvailableItemsComponent implements OnInit {
  appSettings: AppSettings;
  displayedColumns: string[] = [
    "itemName",
    "itemPrice",
    "itemDiscount",
    "action",
  ];
  dataSource: MatTableDataSource<StaticItemTemp>;
  itemStatus: boolean;

  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;

  constructor(
    private _dbHandler: StaticItemDbService,
    private _snakeBar: MatSnackBar,
    private _localStorageHandler: LocalStorageHandlerService,
    private _dialog: MatDialog
  ) {}

  ngOnInit() {
    this.appSettings = this._localStorageHandler.getFromLocalStorage(
      "appSettings"
    );
    this._dbHandler
      .getItemsFromDB()
      .then((itemsArray: StaticItemTemp[]) => {
        if (itemsArray.length > 0) {
          this.itemStatus = true;
        } else {
          this.itemStatus = false;
        }
        this._initalizeData(itemsArray);
      })
      .catch((_) => {
        this._snakeBar.open("Fail to load items 😔", "Dismiss", {
          duration: this.appSettings.notificationDuraton * 1000,
        });
      });
  }

  private _initalizeData(data: StaticItemTemp[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onEditItem(_id: string) {
    this._dbHandler
      .getSingleItemsFromDB(_id)
      .then((item) => {
        const dialogRef = this._dialog.open(ItemFormComponent, {
          data: { type: "UPDATE_ITEM", itemData: item },
          width: "40%",
        });
        dialogRef.beforeClosed().subscribe((_) => {
          this.ngOnInit();
        });
      })
      .catch(() => {
        // tslint:disable-next-line: max-line-length
        this._snakeBar.open(
          "Unable edit item 😔, Please try restarting application",
          "Dismiss",
          { duration: this.appSettings.notificationDuraton * 1000 }
        );
      });
  }

  onDeleteItem(_id: string) {
    this._dbHandler
      .removeItem(_id)
      .then((_) => {
        this._snakeBar.open("Sucessfully deleted 😉", "Dismiss", {
          duration: this.appSettings.notificationDuraton * 1000,
        });
        this.ngOnInit();
      })
      .catch((_) => {
        // tslint:disable-next-line: max-line-length
        this._snakeBar.open(
          "Something went wrong 😔, Please try restarting application",
          "Dismiss",
          { duration: this.appSettings.notificationDuraton * 1000 }
        );
      });
  }

  onAddItem() {
    const dialogRef = this._dialog.open(ItemFormComponent, {
      width: "600px",
      data: { type: "NEW_ITEM", itemData: null },
    });
    dialogRef.beforeClosed().subscribe((_) => {
      this.ngOnInit();
    });
  }
}
