import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFingerprintUserComponent } from './add-fingerprint-user.component';

describe('AddFingerprintUserComponent', () => {
  let component: AddFingerprintUserComponent;
  let fixture: ComponentFixture<AddFingerprintUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFingerprintUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFingerprintUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
