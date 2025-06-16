import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleAgreementApprovalComponent } from './sale-agreement-approval.component';

describe('SaleAgreementApprovalComponent', () => {
  let component: SaleAgreementApprovalComponent;
  let fixture: ComponentFixture<SaleAgreementApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleAgreementApprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleAgreementApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
