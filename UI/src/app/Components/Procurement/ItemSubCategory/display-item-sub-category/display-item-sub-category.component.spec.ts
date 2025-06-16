import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayItemSubCategoryComponent } from './display-item-sub-category.component';

describe('DisplayItemSubCategoryComponent', () => {
  let component: DisplayItemSubCategoryComponent;
  let fixture: ComponentFixture<DisplayItemSubCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayItemSubCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayItemSubCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
