import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseDaysComponent } from './license-days.component';

describe('LicenseDaysComponent', () => {
  let component: LicenseDaysComponent;
  let fixture: ComponentFixture<LicenseDaysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicenseDaysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenseDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
