import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddingPaymentComponent } from './adding-payment.component';

describe('AddingPaymentComponent', () => {
  let component: AddingPaymentComponent;
  let fixture: ComponentFixture<AddingPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddingPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddingPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
