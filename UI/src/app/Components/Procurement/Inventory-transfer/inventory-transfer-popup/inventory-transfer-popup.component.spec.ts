import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryTransferPopupComponent } from './inventory-transfer-popup.component';

describe('InventoryTransferPopupComponent', () => {
  let component: InventoryTransferPopupComponent;
  let fixture: ComponentFixture<InventoryTransferPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryTransferPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryTransferPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
