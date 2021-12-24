import { TestBed } from '@angular/core/testing';

import { GlobalListEventService } from './global-list-event.service';

describe('GlobalListEventService', () => {
  let service: GlobalListEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalListEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
