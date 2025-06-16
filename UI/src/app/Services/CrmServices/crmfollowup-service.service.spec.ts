import { TestBed } from '@angular/core/testing';

import { CRMFollowupServiceService } from './crmfollowup-service.service';

describe('CRMFollowupServiceService', () => {
  let service: CRMFollowupServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CRMFollowupServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
