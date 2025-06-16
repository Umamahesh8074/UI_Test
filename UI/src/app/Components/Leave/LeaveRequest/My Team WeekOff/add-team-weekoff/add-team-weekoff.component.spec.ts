import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTeamWeekoffComponent } from './add-team-weekoff.component';

describe('AddTeamWeekoffComponent', () => {
  let component: AddTeamWeekoffComponent;
  let fixture: ComponentFixture<AddTeamWeekoffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTeamWeekoffComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTeamWeekoffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
