import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayHolidayComponent } from './display-holiday.component';

describe('DisplayHolidayComponent', () => {
  let component: DisplayHolidayComponent;
  let fixture: ComponentFixture<DisplayHolidayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayHolidayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayHolidayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
