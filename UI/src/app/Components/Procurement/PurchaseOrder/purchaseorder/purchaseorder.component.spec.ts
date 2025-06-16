import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderComponent } from './purchaseorder.component';

describe('PurchaseorderComponent', () => {
  let component: PurchaseOrderComponent;
  let fixture: ComponentFixture<PurchaseOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PurchaseOrderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PurchaseOrderComponent);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
