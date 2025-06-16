import { TestBed } from '@angular/core/testing';

import { StandInUserService } from './stand-in-user.service';

describe('StandInUserService', () => {
  let service: StandInUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StandInUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
