import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerLeadPageComponent } from './customer-lead-page.component';

describe('CustomerLeadPageComponent', () => {
  let component: CustomerLeadPageComponent;
  let fixture: ComponentFixture<CustomerLeadPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerLeadPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerLeadPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
