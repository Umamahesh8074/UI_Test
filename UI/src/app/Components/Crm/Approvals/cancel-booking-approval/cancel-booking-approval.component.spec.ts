import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelBookingApprovalComponent } from './cancel-booking-approval.component';

describe('CancelBookingApprovalComponent', () => {
  let component: CancelBookingApprovalComponent;
  let fixture: ComponentFixture<CancelBookingApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelBookingApprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelBookingApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
