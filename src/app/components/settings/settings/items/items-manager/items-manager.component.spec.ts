import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsManagerComponent } from './items-manager.component';

describe('ItemsManagerComponent', () => {
  let component: ItemsManagerComponent;
  let fixture: ComponentFixture<ItemsManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemsManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
