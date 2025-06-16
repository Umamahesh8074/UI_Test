import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DisplayBookingOverviewComponent } from './displayBookingOverview.component';

describe('DisplayBookingOverviewComponent', () => {
  let component: DisplayBookingOverviewComponent;
  let fixture: ComponentFixture<DisplayBookingOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisplayBookingOverviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DisplayBookingOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
