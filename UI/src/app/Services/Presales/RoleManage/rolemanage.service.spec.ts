import { TestBed } from '@angular/core/testing';

import { RolemanageService } from './rolemanage.service';

describe('RolemanageService', () => {
  let service: RolemanageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RolemanageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
