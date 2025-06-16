import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerLeadComponent } from './customer-lead.component';

describe('CustomerLeadComponent', () => {
  let component: CustomerLeadComponent;
  let fixture: ComponentFixture<CustomerLeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerLeadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
