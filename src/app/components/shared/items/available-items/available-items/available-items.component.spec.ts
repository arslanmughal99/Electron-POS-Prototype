import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableItemsComponent } from './available-items.component';

describe('AvailableItemsComponent', () => {
  let component: AvailableItemsComponent;
  let fixture: ComponentFixture<AvailableItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvailableItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
