import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayFingerprintAssignedUserComponent } from './display-fingerprint-assigned-user.component';

describe('DisplayFingerprintAssignedUserComponent', () => {
  let component: DisplayFingerprintAssignedUserComponent;
  let fixture: ComponentFixture<DisplayFingerprintAssignedUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayFingerprintAssignedUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayFingerprintAssignedUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
