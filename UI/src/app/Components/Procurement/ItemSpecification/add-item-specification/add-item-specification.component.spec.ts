import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddItemSpecificationComponent } from './add-item-specification.component';

describe('AddItemSpecificationComponent', () => {
  let component: AddItemSpecificationComponent;
  let fixture: ComponentFixture<AddItemSpecificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddItemSpecificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddItemSpecificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
