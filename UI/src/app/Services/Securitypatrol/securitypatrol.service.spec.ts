import { TestBed } from '@angular/core/testing';

import { SecuritypatrolService } from './securitypatrol.service';

describe('SecuritypatrolService', () => {
  let service: SecuritypatrolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SecuritypatrolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
