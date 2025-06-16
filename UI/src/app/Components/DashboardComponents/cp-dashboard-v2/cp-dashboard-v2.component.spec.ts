import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpDashboardV2Component } from './cp-dashboard-v2.component';

describe('CpDashboardV2Component', () => {
  let component: CpDashboardV2Component;
  let fixture: ComponentFixture<CpDashboardV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpDashboardV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CpDashboardV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
