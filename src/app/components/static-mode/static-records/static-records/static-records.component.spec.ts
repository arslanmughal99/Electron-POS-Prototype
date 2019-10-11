import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticRecordsComponent } from './static-records.component';

describe('StaticRecordsComponent', () => {
  let component: StaticRecordsComponent;
  let fixture: ComponentFixture<StaticRecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaticRecordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaticRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
