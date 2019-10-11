import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReciptPreviewComponent } from './recipt-preview.component';

describe('ReciptPreviewComponent', () => {
  let component: ReciptPreviewComponent;
  let fixture: ComponentFixture<ReciptPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReciptPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReciptPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
