import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayLeadsComponent } from './display-leads.component';

describe('DisplayLeadsComponent', () => {
  let component: DisplayLeadsComponent;
  let fixture: ComponentFixture<DisplayLeadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayLeadsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
