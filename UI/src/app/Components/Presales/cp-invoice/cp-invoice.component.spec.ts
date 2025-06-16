import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpInvoiceComponent } from './cp-invoice.component';

describe('CpInvoiceComponent', () => {
  let component: CpInvoiceComponent;
  let fixture: ComponentFixture<CpInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CpInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
