import { TestBed } from '@angular/core/testing';

import { FacebookLeadService } from './facebook-leadservice.service';

describe('FacebookLeadserviceService', () => {
  let service: FacebookLeadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacebookLeadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
