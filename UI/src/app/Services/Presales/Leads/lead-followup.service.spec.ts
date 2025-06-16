import { TestBed } from '@angular/core/testing';

import { LeadFollowupService } from './lead-followup.service';

describe('LeadFollowupService', () => {
  let service: LeadFollowupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeadFollowupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
