import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTeamLeavesComponent } from './add-team-leaves.component';

describe('AddTeamLeavesComponent', () => {
  let component: AddTeamLeavesComponent;
  let fixture: ComponentFixture<AddTeamLeavesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTeamLeavesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTeamLeavesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
