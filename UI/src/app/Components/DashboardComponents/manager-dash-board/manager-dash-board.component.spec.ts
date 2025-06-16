import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerDashBoardComponent } from './manager-dash-board.component';

describe('ManagerDashBoardComponent', () => {
  let component: ManagerDashBoardComponent;
  let fixture: ComponentFixture<ManagerDashBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagerDashBoardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerDashBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
