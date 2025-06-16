import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerunitsdisplayComponent } from './customerunitsdisplay.component';

describe('CustomerunitsdisplayComponent', () => {
  let component: CustomerunitsdisplayComponent;
  let fixture: ComponentFixture<CustomerunitsdisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerunitsdisplayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerunitsdisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
