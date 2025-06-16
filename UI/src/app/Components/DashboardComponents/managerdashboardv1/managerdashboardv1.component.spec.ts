import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Managerdashboardv1Component } from './managerdashboardv1.component';

describe('Managerdashboardv1Component', () => {
  let component: Managerdashboardv1Component;
  let fixture: ComponentFixture<Managerdashboardv1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Managerdashboardv1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Managerdashboardv1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
