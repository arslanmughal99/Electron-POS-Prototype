import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticItemsComponent } from './static-items.component';

describe('StaticItemsComponent', () => {
  let component: StaticItemsComponent;
  let fixture: ComponentFixture<StaticItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaticItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaticItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
