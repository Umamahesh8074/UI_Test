import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayvendorComponent } from './displayvendor.component';

describe('DisplayvendorComponent', () => {
  let component: DisplayvendorComponent;
  let fixture: ComponentFixture<DisplayvendorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayvendorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayvendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
