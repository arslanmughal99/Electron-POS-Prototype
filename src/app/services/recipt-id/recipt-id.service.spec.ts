import { TestBed } from '@angular/core/testing';

import { ReciptIdService } from './recipt-id.service';

describe('ReciptIdService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReciptIdService = TestBed.get(ReciptIdService);
    expect(service).toBeTruthy();
  });
});
