import { TestBed } from '@angular/core/testing';

import { DuplicateleadhistoryService } from './duplicateleadhistory.service';

describe('DuplicateleadhistoryService', () => {
  let service: DuplicateleadhistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DuplicateleadhistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
