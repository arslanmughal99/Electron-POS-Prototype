import { TestBed } from '@angular/core/testing';

import { StaticItemDbService } from './static-item-db.service';

describe('StaticItemDbService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StaticItemDbService = TestBed.get(StaticItemDbService);
    expect(service).toBeTruthy();
  });
});
