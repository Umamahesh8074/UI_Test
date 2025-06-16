import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayTeamLeavesComponent } from './display-team-leaves.component';

describe('DisplayTeamLeavesComponent', () => {
  let component: DisplayTeamLeavesComponent;
  let fixture: ComponentFixture<DisplayTeamLeavesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayTeamLeavesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayTeamLeavesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
