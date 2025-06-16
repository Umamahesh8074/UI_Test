import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechAdminDashBoardComponent } from './tech-admin-dash-board.component';

describe('TechAdminDashBoardComponent', () => {
  let component: TechAdminDashBoardComponent;
  let fixture: ComponentFixture<TechAdminDashBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechAdminDashBoardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechAdminDashBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
