import { TestBed } from '@angular/core/testing';

import { MessageLandingService } from './message-landing.service';

describe('MessageLandingService', () => {
  let service: MessageLandingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageLandingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
