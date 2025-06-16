import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWeekOffComponent } from './add-week-off.component';

describe('AddWeekOffComponent', () => {
  let component: AddWeekOffComponent;
  let fixture: ComponentFixture<AddWeekOffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWeekOffComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddWeekOffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
