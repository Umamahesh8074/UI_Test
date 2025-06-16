import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerApprovalPaymentComponent } from './customer-approval-payment.component';

describe('CustomerApprovalPaymentComponent', () => {
  let component: CustomerApprovalPaymentComponent;
  let fixture: ComponentFixture<CustomerApprovalPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerApprovalPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerApprovalPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
