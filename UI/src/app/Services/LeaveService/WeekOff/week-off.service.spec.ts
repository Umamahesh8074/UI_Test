import { TestBed } from '@angular/core/testing';

import { WeekOffService } from './week-off.service';

describe('WeekOffService', () => {
  let service: WeekOffService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeekOffService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
