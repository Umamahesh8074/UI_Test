import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryTransferComponent } from './inventory-transfer.component';

describe('InventoryTransferComponent', () => {
  let component: InventoryTransferComponent;
  let fixture: ComponentFixture<InventoryTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryTransferComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
