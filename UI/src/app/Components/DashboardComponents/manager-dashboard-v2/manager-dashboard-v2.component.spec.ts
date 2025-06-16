import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerDashboardV2Component } from './manager-dashboard-v2.component';

describe('ManagerDashboardV2Component', () => {
  let component: ManagerDashboardV2Component;
  let fixture: ComponentFixture<ManagerDashboardV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagerDashboardV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerDashboardV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
