import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayCpLeadsComponent } from './display-cp-leads.component';

describe('DisplayCpLeadsComponent', () => {
  let component: DisplayCpLeadsComponent;
  let fixture: ComponentFixture<DisplayCpLeadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayCpLeadsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayCpLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
