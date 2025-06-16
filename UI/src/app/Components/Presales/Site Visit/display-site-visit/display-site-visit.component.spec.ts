import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplaySiteVisitComponent } from './display-site-visit.component';

describe('DisplaySiteVisitComponent', () => {
  let component: DisplaySiteVisitComponent;
  let fixture: ComponentFixture<DisplaySiteVisitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplaySiteVisitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplaySiteVisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
