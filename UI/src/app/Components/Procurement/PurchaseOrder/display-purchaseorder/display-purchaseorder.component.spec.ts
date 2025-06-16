import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplyPurchaseOrderComponent } from './display-purchaseorder.component';

describe('DisplyPurchaseorderComponent', () => {
  let component: DisplyPurchaseOrderComponent;
  let fixture: ComponentFixture<DisplyPurchaseOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisplyPurchaseOrderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DisplyPurchaseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
