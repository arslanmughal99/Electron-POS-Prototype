import { TestBed } from '@angular/core/testing';

import { FixerService } from './fixer.service';

describe('FixerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FixerService = TestBed.get(FixerService);
    expect(service).toBeTruthy();
  });
});
