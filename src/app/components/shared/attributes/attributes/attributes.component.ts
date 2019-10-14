import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddAttributeComponent } from '../add-attribute/add-attribute.component';
import { UnitsComponent } from '../units/units.component';
import { CategoryComponent } from '../category/category.component';

@Component({
  selector: 'app-attributes',
  templateUrl: './attributes.component.html',
  styleUrls: ['./attributes.component.scss']
})
export class AttributesComponent implements OnInit {

  constructor(
    private _dialog: MatDialog
  ) { }

  @ViewChild(CategoryComponent, {static: true}) attrPresentationCategories: CategoryComponent;
  @ViewChild(UnitsComponent, {static: true}) attrPresentationUnits: UnitsComponent;

  ngOnInit() {
  }

  addAttribute(attrType: string) {
    const dialogRef = this._dialog.open(AddAttributeComponent, {data: {type: attrType}, width: '300px'});

    dialogRef.beforeClosed().subscribe(_ => {
      if (attrType === 'categories') {
        this.attrPresentationCategories.ngOnInit();
      } else {
        this.attrPresentationUnits.ngOnInit();
      }
    });
  }

}

// TODO: Refactor categories and units componet as single component
