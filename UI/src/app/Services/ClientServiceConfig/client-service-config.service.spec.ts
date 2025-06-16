import { TestBed } from '@angular/core/testing';

import { ClientServiceConfigService } from './client-service-config.service';

describe('ClientServiceConfigService', () => {
  let service: ClientServiceConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientServiceConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
