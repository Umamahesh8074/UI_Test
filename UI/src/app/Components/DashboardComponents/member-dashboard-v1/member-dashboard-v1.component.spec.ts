import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberDashboardV1Component } from './member-dashboard-v1.component';

describe('MemberDashboardV1Component', () => {
  let component: MemberDashboardV1Component;
  let fixture: ComponentFixture<MemberDashboardV1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberDashboardV1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberDashboardV1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
