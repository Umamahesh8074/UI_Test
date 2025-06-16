import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayprojectComponent } from './displayproject.component';

describe('DisplayprojectComponent', () => {
  let component: DisplayprojectComponent;
  let fixture: ComponentFixture<DisplayprojectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayprojectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayprojectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
