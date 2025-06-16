import { TestBed } from '@angular/core/testing';

import { LeadsCommonService } from './leads-common.service';

describe('LeadsCommonService', () => {
  let service: LeadsCommonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeadsCommonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
