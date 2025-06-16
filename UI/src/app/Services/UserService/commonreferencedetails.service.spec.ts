import { TestBed } from '@angular/core/testing';

import { CommonreferencedetailsService } from './commonreferencedetails.service';

describe('CommonreferencedetailsService', () => {
  let service: CommonreferencedetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonreferencedetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
