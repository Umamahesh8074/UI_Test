import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DisplayBookingChargesComponent } from './displayBookingCharges.component';

describe('DisplayBookingFormComponent', () => {
  let component: DisplayBookingChargesComponent;
  let fixture: ComponentFixture<DisplayBookingChargesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisplayBookingChargesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DisplayBookingChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
