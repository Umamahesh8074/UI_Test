import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayScheduleVisitComponent } from './display-schedule-visit.component';

describe('DisplayScheduleVisitComponent', () => {
  let component: DisplayScheduleVisitComponent;
  let fixture: ComponentFixture<DisplayScheduleVisitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayScheduleVisitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayScheduleVisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
