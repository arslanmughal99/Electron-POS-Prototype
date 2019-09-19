import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrinterConfigComponent } from './printer-config.component';

describe('PrinterConfigComponent', () => {
  let component: PrinterConfigComponent;
  let fixture: ComponentFixture<PrinterConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrinterConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrinterConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
