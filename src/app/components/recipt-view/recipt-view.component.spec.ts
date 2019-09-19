import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReciptViewComponent } from './recipt-view.component';

describe('ReciptViewComponent', () => {
  let component: ReciptViewComponent;
  let fixture: ComponentFixture<ReciptViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReciptViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReciptViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
