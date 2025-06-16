import { TestBed } from '@angular/core/testing';

import { CommomreferencedetailsService } from './commomreferencedetails.service';

describe('CommomreferencedetailsService', () => {
  let service: CommomreferencedetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommomreferencedetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
