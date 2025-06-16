import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayPaymentLedgerComponent } from './display-payment-ledger.component';

describe('DisplayPaymentLedgerComponent', () => {
  let component: DisplayPaymentLedgerComponent;
  let fixture: ComponentFixture<DisplayPaymentLedgerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisplayPaymentLedgerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DisplayPaymentLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
