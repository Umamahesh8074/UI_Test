import { TestBed } from '@angular/core/testing';

import { ChannelPartnerRegisterService } from './channel-partner-register.service';

describe('ChannelPartnerRegisterService', () => {
  let service: ChannelPartnerRegisterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChannelPartnerRegisterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
