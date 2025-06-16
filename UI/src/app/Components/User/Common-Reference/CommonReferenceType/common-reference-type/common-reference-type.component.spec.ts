import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonReferenceTypeComponent } from './common-reference-type.component';

describe('CommonReferenceTypeComponent', () => {
  let component: CommonReferenceTypeComponent;
  let fixture: ComponentFixture<CommonReferenceTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonReferenceTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonReferenceTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
