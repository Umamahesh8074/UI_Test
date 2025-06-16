import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingLeadComponent } from './booking-lead.component';

describe('BookingLeadComponent', () => {
  let component: BookingLeadComponent;
  let fixture: ComponentFixture<BookingLeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingLeadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
