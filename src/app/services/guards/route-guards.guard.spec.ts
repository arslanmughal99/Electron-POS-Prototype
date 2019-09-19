import { TestBed, async, inject } from '@angular/core/testing';

import { RouteGuardsGuard } from './route-guards.guard';

describe('RouteGuardsGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RouteGuardsGuard]
    });
  });

  it('should ...', inject([RouteGuardsGuard], (guard: RouteGuardsGuard) => {
    expect(guard).toBeTruthy();
  }));
});
