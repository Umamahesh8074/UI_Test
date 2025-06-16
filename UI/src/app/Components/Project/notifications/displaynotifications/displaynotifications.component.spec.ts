import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplaynotificationsComponent } from './displaynotifications.component';

describe('DisplayprojectComponent', () => {
  let component: DisplaynotificationsComponent;
  let fixture: ComponentFixture<DisplaynotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplaynotificationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplaynotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
