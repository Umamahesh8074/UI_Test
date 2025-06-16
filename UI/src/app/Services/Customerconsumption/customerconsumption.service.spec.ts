import { TestBed } from '@angular/core/testing';

import { CustomerconsumptionService } from './customerconsumption.service';

describe('CustomerconsumptionService', () => {
  let service: CustomerconsumptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerconsumptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
