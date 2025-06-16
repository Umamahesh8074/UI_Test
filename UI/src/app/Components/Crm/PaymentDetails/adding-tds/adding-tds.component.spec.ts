import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddingTdsComponent } from './adding-tds.component';

describe('AddingTdsComponent', () => {
  let component: AddingTdsComponent;
  let fixture: ComponentFixture<AddingTdsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddingTdsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddingTdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
