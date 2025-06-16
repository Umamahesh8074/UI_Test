import { TestBed } from '@angular/core/testing';

import { CommonreferencetypeService } from './commonreferencetype.service';

describe('CommonreferencetypeService', () => {
  let service: CommonreferencetypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonreferencetypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
