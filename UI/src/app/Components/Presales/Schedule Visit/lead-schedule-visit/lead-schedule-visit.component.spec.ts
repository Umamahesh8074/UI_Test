import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadScheduleVisitComponent } from './lead-schedule-visit.component';

describe('LeadScheduleVisitComponent', () => {
  let component: LeadScheduleVisitComponent;
  let fixture: ComponentFixture<LeadScheduleVisitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadScheduleVisitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadScheduleVisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
