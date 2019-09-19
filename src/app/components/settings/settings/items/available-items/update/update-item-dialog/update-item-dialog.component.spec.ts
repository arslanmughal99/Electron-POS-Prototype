import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateItemDialogComponent } from './update-item-dialog.component';

describe('UpdateItemDialogComponent', () => {
  let component: UpdateItemDialogComponent;
  let fixture: ComponentFixture<UpdateItemDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateItemDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
