import { TestBed } from '@angular/core/testing';

import { ScheduleVisitService } from './schedule-visit.service';

describe('ScheduleVisitService', () => {
  let service: ScheduleVisitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScheduleVisitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
