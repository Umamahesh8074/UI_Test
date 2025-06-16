import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayMenuItemComponent } from './display-menu-item.component';

describe('DisplayMenuItemComponent', () => {
  let component: DisplayMenuItemComponent;
  let fixture: ComponentFixture<DisplayMenuItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayMenuItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayMenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
