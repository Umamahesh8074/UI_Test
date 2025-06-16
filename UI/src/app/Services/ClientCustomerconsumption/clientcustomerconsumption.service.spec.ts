import { TestBed } from '@angular/core/testing';

import { ClientCustomerconsumptionService } from './clientcustomerconsumption.service';

describe('CustomerconsumptionService', () => {
  let service: ClientCustomerconsumptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientCustomerconsumptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
