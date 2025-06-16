import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpDashboardV1Component } from './cp-dashboard-v1.component';

describe('CpDashboardV1Component', () => {
  let component: CpDashboardV1Component;
  let fixture: ComponentFixture<CpDashboardV1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpDashboardV1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CpDashboardV1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
