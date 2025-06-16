import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayItemUnitComponent } from './display-item-unit.component';

describe('DisplayItemUnitComponent', () => {
  let component: DisplayItemUnitComponent;
  let fixture: ComponentFixture<DisplayItemUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayItemUnitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayItemUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
