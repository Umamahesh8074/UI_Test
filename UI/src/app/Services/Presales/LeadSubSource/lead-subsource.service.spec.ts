import { TestBed } from '@angular/core/testing';

import { LeadSubsourceService } from './lead-subsource.service';

describe('LeadSubsourceService', () => {
  let service: LeadSubsourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeadSubsourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
