import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalCustomerDocumnetComponent } from './legal-customer-documnet.component';

describe('LegalCustomerDocumnetComponent', () => {
  let component: LegalCustomerDocumnetComponent;
  let fixture: ComponentFixture<LegalCustomerDocumnetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LegalCustomerDocumnetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LegalCustomerDocumnetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
