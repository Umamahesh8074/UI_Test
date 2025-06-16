import { TestBed } from '@angular/core/testing';

import { SaleteamService } from './saleteam.service';

describe('SaleteamService', () => {
  let service: SaleteamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaleteamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
