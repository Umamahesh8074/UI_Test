import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayLeaveRequestComponent } from './display-leave-request.component';

describe('DisplayLeaveRequestComponent', () => {
  let component: DisplayLeaveRequestComponent;
  let fixture: ComponentFixture<DisplayLeaveRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayLeaveRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayLeaveRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
