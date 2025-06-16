import { TestBed } from '@angular/core/testing';

import { clientinvoicereportService } from './clientinvoicereport.service';

describe('ClientinvoicereportService', () => {
  let service: clientinvoicereportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(clientinvoicereportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
