import { TestBed } from '@angular/core/testing';

import { EoiService } from './eoi.service';

describe('EoiService', () => {
  let service: EoiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EoiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
