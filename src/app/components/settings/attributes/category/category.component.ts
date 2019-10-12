import { Component, OnInit, ViewChild } from '@angular/core';
import { LocalStorageHandlerService } from '../../../../services/localstorage/local-storage-handler.service';
import { Category } from '../../../../interfaces/category-interface';
import { MatTableDataSource } from '@angular/material';
import * as _ from 'lodash';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  displayedColumns = ['name', 'action'];
  dataSource: MatTableDataSource<Category>;


  constructor(private localStorageService: LocalStorageHandlerService) { }

  @ViewChild(MatPaginator, {static: false})
  paginator: MatPaginator;
  @ViewChild(MatSort, {static: false})
  sort: MatSort;

  get getAllCategories(): string[] {
    return this.localStorageService.getFromLocalStorage('categories') as string[];
  }


  ngOnInit() {
    this._initializeDataSource()
    .then((dataSrc: Category[]) => {
      this.dataSource =  new MatTableDataSource(dataSrc);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }


  convertToObjet(categoryList) {
    const convertedList = [];
    if (categoryList) {
      categoryList.forEach((cat) => {
        convertedList.push({name: cat});
      });
      return convertedList;
    } else {
      return [];
    }
  }

  onDeleteCategory(categoryName: string) {
    const catList: string[] = this.getAllCategories;
    const newCat: string [] = _.filter(catList, (cat) => {
      return cat !== categoryName;
    });
    this.localStorageService.setToLocalStorage('categories', newCat);
    this.ngOnInit();
  }

  private _initializeDataSource() {
    const data = new Promise((resolv, reject) => {
      const categories: any[] = this.convertToObjet(this.localStorageService.getFromLocalStorage('categories'));
      if (categories) {
        resolv(categories);
      } else {
        reject();
      }
    });
    return data;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
