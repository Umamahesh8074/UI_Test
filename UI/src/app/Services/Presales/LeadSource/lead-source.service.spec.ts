import { TestBed } from '@angular/core/testing';

import { LeadServiceService } from './lead-service.service';

describe('LeadServiceService', () => {
  let service: LeadServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeadServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
