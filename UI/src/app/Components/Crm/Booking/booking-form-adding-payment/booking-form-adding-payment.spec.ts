import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookingFormAddingPaymentComponent } from './booking-form-adding-payment';

describe('BookingFormAddingPaymentComponent', () => {
  let component: BookingFormAddingPaymentComponent;
  let fixture: ComponentFixture<BookingFormAddingPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookingFormAddingPaymentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingFormAddingPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
