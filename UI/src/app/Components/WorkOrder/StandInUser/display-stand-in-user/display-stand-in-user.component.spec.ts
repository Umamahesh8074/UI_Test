import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayStandInUserComponent } from './display-stand-in-user.component';

describe('DisplayStandInUserComponent', () => {
  let component: DisplayStandInUserComponent;
  let fixture: ComponentFixture<DisplayStandInUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayStandInUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayStandInUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
