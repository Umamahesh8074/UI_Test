import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayIndentComponent } from './display-indent.component';

describe('DisplayIndentComponent', () => {
  let component: DisplayIndentComponent;
  let fixture: ComponentFixture<DisplayIndentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayIndentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayIndentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
