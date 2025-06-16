import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookedUnitsComponent } from './booked-units.component';

describe('BookedUnitsComponent', () => {
  let component: BookedUnitsComponent;
  let fixture: ComponentFixture<BookedUnitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookedUnitsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookedUnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
