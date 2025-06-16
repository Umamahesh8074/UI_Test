import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInventoryReceivablesComponent } from './edit-inventory-receivables.component';

describe('EditInventoryReceivablesComponent', () => {
  let component: EditInventoryReceivablesComponent;
  let fixture: ComponentFixture<EditInventoryReceivablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditInventoryReceivablesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditInventoryReceivablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
