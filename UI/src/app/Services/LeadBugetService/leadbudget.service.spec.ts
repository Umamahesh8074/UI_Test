import { TestBed } from '@angular/core/testing';

import { LeadbudgetService } from './leadbudget.service';

describe('LeadbudgetService', () => {
  let service: LeadbudgetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeadbudgetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
