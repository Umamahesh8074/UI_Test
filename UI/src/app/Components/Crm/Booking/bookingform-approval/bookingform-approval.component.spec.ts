import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingformApprovalComponent } from './bookingform-approval.component';

describe('BookingformApprovalComponent', () => {
  let component: BookingformApprovalComponent;
  let fixture: ComponentFixture<BookingformApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingformApprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingformApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
