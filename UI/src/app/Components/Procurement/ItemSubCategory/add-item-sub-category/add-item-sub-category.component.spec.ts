import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddItemSubCategoryComponent } from './add-item-sub-category.component';

describe('AddItemSubCategoryComponent', () => {
  let component: AddItemSubCategoryComponent;
  let fixture: ComponentFixture<AddItemSubCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddItemSubCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddItemSubCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
