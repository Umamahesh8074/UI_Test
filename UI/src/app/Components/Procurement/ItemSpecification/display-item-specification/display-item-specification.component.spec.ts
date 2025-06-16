import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayItemSpecificationComponent } from './display-item-specification.component';

describe('DisplayItemSpecificationComponent', () => {
  let component: DisplayItemSpecificationComponent;
  let fixture: ComponentFixture<DisplayItemSpecificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayItemSpecificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayItemSpecificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
