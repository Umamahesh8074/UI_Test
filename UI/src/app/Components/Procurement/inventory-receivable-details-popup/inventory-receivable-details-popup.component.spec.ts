import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryReceivableDetailsPopupComponent } from './inventory-receivable-details-popup.component';

describe('InventoryReceivableDetailsPopupComponent', () => {
  let component: InventoryReceivableDetailsPopupComponent;
  let fixture: ComponentFixture<InventoryReceivableDetailsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryReceivableDetailsPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryReceivableDetailsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
