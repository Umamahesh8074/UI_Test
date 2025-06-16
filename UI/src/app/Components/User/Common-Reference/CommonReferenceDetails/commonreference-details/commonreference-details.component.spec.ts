import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonreferenceDetailsComponent } from './commonreference-details.component';

describe('CommonreferenceDetailsComponent', () => {
  let component: CommonreferenceDetailsComponent;
  let fixture: ComponentFixture<CommonreferenceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonreferenceDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonreferenceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
