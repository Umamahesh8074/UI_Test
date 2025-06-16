import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleHeadDashboardV1Component } from './sale-head-dashboard-v1.component';

describe('SaleHeadDashboardV1Component', () => {
  let component: SaleHeadDashboardV1Component;
  let fixture: ComponentFixture<SaleHeadDashboardV1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleHeadDashboardV1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleHeadDashboardV1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
