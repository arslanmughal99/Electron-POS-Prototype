import { Component, OnInit, ViewChild } from '@angular/core';
import { LocalStorageHandlerService } from '../../../services/localstorage/local-storage-handler.service';
import { Category } from '../../../interfaces/category-interface';
import { MatTableDataSource } from '@angular/material';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import * as _ from 'lodash';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.scss']
})
export class UnitsComponent implements OnInit {
  displayedColumns = ['name', 'action'];
  dataSource: MatTableDataSource<Category>;


  constructor(private localStorageService: LocalStorageHandlerService) { }

  @ViewChild(MatPaginator, {static: true})
  paginator: MatPaginator;
  @ViewChild(MatSort, {static: true})
  sort: MatSort;

  get getAllUnits(): string[] {
    return this.localStorageService.getFromLocalStorage('units') as string[];
  }


  ngOnInit() {
    this._initializeDataSource()
    .then((dataSrc: Category[]) => {
      this.dataSource =  new MatTableDataSource(dataSrc);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }


  convertToObjet(unitsList: string []) {
    const convertedList = [];
    if (unitsList) {
      unitsList.forEach((unit) => {
        convertedList.push({name: unit});
      });
      return convertedList;
    } else {
      return [];
    }
  }

  onDeleteUnit(unitName: string) {
    const unitsList: string[] = this.getAllUnits;
    const newUnitsList = _.filter(unitsList, (unit) => {
      return unit !== unitName;
    });
    this.localStorageService.setToLocalStorage('units', newUnitsList);
    this.ngOnInit();
  }

  private _initializeDataSource() {
    const data = new Promise((resolv, reject) => {
      const categories: Category[] = this.convertToObjet(this.localStorageService.getFromLocalStorage('units') as string[]);
      if (categories) {
        resolv(categories);
      } else {
        reject();
      }
    });
    return data;
  }

  setUnit(unitName: string) {
    const units = this.localStorageService.getFromLocalStorage('units') as string[];
    units.push(unitName);
    this.localStorageService.setToLocalStorage('units', units);
    this.ngOnInit();
  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
