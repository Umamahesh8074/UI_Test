import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandInUserComponent } from './stand-in-user.component';

describe('StandInUserComponent', () => {
  let component: StandInUserComponent;
  let fixture: ComponentFixture<StandInUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StandInUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StandInUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
