import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadFollowupCalendarComponent } from './lead-followup-calendar.component';

describe('LeadFollowupCalendarComponent', () => {
  let component: LeadFollowupCalendarComponent;
  let fixture: ComponentFixture<LeadFollowupCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadFollowupCalendarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadFollowupCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
