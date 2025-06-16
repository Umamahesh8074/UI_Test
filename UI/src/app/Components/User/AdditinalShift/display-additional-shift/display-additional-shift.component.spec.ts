import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayAdditionalShiftComponent } from './display-additional-shift.component';

describe('DisplayAdditionalShiftComponent', () => {
  let component: DisplayAdditionalShiftComponent;
  let fixture: ComponentFixture<DisplayAdditionalShiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayAdditionalShiftComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayAdditionalShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
