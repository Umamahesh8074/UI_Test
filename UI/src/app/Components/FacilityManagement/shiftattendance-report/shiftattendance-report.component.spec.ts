import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftAttendanceReportComponent } from './shiftattendance-report.component';

describe('AttendanceReportComponent', () => {
  let component: ShiftAttendanceReportComponent;
  let fixture: ComponentFixture<ShiftAttendanceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShiftAttendanceReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftAttendanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
