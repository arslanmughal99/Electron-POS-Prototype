import { TestBed } from '@angular/core/testing';

import { StaticItemDatabaseHandlerService } from './static-item-database-handler.service';

describe('StaticItemDatabaseHandlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StaticItemDatabaseHandlerService = TestBed.get(StaticItemDatabaseHandlerService);
    expect(service).toBeTruthy();
  });
});
