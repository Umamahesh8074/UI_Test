import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayPaymentDetailsComponent } from './display-payment-details.component';

describe('DisplayPaymentDetailsComponent', () => {
  let component: DisplayPaymentDetailsComponent;
  let fixture: ComponentFixture<DisplayPaymentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayPaymentDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayPaymentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
