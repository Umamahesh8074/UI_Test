import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesHeadDashBoardComponent } from './sales-head-dash-board.component';

describe('SalesHeadDashBoardComponent', () => {
  let component: SalesHeadDashBoardComponent;
  let fixture: ComponentFixture<SalesHeadDashBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesHeadDashBoardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesHeadDashBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
