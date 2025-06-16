import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayTeamMatesComponent } from './display-team-mates.component';

describe('DisplayTeamMatesComponent', () => {
  let component: DisplayTeamMatesComponent;
  let fixture: ComponentFixture<DisplayTeamMatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayTeamMatesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayTeamMatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
