import { TestBed } from '@angular/core/testing';

import { ShiftAttendanceService } from './shiftattendance-service.service';

describe('AttendanceServiceService', () => {
  let service: ShiftAttendanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShiftAttendanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
