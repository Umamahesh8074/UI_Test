import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayCommonReferenceTypeComponent } from './display-common-reference-type.component';

describe('DisplayCommonReferenceTypeComponent', () => {
  let component: DisplayCommonReferenceTypeComponent;
  let fixture: ComponentFixture<DisplayCommonReferenceTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayCommonReferenceTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayCommonReferenceTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
