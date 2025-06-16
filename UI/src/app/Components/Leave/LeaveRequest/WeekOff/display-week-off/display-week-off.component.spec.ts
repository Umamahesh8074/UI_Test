import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayWeekOffComponent } from './display-week-off.component';

describe('DisplayWeekOffComponent', () => {
  let component: DisplayWeekOffComponent;
  let fixture: ComponentFixture<DisplayWeekOffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayWeekOffComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayWeekOffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
