import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerLegalDocumentPageComponent } from './customer-legal-document-page.component';

describe('CustomerLegalDocumentPageComponent', () => {
  let component: CustomerLegalDocumentPageComponent;
  let fixture: ComponentFixture<CustomerLegalDocumentPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerLegalDocumentPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerLegalDocumentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
