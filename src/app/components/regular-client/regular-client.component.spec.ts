import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegularClientComponent } from './regular-client.component';

describe('RegularClientComponent', () => {
  let component: RegularClientComponent;
  let fixture: ComponentFixture<RegularClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegularClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegularClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
