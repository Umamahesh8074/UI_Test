import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAdditionalShiftComponent } from './add-additional-shift.component';

describe('AddAdditionalShiftComponent', () => {
  let component: AddAdditionalShiftComponent;
  let fixture: ComponentFixture<AddAdditionalShiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAdditionalShiftComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAdditionalShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
