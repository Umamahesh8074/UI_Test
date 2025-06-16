import { TestBed } from '@angular/core/testing';

import { QrtransactiondataService } from './qrtransactiondata.service';

describe('QrtransactiondataService', () => {
  let service: QrtransactiondataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QrtransactiondataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
