import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayTeamWeekOffComponent } from './display-team-week-off.component';

describe('DisplayTeamWeekOffComponent', () => {
  let component: DisplayTeamWeekOffComponent;
  let fixture: ComponentFixture<DisplayTeamWeekOffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayTeamWeekOffComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayTeamWeekOffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
