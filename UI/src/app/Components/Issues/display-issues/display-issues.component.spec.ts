import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayissuesComponent } from './display-issues.component';

describe('DisplayIssuesComponent', () => {
  let component: DisplayissuesComponent;
  let fixture: ComponentFixture<DisplayissuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayissuesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayissuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
