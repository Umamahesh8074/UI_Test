import { TestBed } from '@angular/core/testing';

import { LeadTransferServiceService } from './lead-transfer-service.service';

describe('LeadTransferServiceService', () => {
  let service: LeadTransferServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeadTransferServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
