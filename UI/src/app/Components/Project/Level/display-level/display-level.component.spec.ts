import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayLevelComponent } from './display-level.component';

describe('DisplayLevelComponent', () => {
  let component: DisplayLevelComponent;
  let fixture: ComponentFixture<DisplayLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayLevelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
