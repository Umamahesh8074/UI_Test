import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddItemUnitComponent } from './add-item-unit.component';

describe('AddItemUnitComponent', () => {
  let component: AddItemUnitComponent;
  let fixture: ComponentFixture<AddItemUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddItemUnitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddItemUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
