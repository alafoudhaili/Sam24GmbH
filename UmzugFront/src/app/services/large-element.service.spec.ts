import { TestBed } from '@angular/core/testing';

import { LargeElementService } from './large-element.service';

describe('LargeElementService', () => {
  let service: LargeElementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LargeElementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
