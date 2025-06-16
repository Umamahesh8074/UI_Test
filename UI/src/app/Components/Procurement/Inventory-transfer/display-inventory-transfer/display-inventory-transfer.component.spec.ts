import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayInventoryTransferComponent } from './display-inventory-transfer.component';

describe('DisplayInventoryTransferComponent', () => {
  let component: DisplayInventoryTransferComponent;
  let fixture: ComponentFixture<DisplayInventoryTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayInventoryTransferComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayInventoryTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
