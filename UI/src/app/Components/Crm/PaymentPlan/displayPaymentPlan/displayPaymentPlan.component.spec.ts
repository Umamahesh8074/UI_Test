import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DisplayPaymentPlanComponent } from './displayPaymentPlan.component';

describe('DisplayPaymentPlanComponent', () => {
  let component: DisplayPaymentPlanComponent;
  let fixture: ComponentFixture<DisplayPaymentPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisplayPaymentPlanComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DisplayPaymentPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
