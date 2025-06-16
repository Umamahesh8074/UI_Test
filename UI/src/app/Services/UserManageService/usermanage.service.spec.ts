import { TestBed } from '@angular/core/testing';

import { UsermanageService } from './usermanage.service';

describe('UsermanageService', () => {
  let service: UsermanageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsermanageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
