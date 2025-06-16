import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberDashboardV2Component } from './member-dashboard-v2.component';

describe('MemberDashboardV2Component', () => {
  let component: MemberDashboardV2Component;
  let fixture: ComponentFixture<MemberDashboardV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberDashboardV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberDashboardV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
