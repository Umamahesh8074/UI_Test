import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DisplayBookingFormComponent } from './displayBookingForm.component';

describe('DisplayBookingFormComponent', () => {
  let component: DisplayBookingFormComponent;
  let fixture: ComponentFixture<DisplayBookingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisplayBookingFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DisplayBookingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
