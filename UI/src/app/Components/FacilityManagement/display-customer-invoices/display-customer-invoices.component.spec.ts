import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayCustomerInvoicesComponent } from './display-customer-invoices.component';

describe('DisplayCustomerInvoicesComponent', () => {
  let component: DisplayCustomerInvoicesComponent;
  let fixture: ComponentFixture<DisplayCustomerInvoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayCustomerInvoicesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayCustomerInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
