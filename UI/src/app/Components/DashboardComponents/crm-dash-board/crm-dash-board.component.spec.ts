import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmDashBoardComponent } from './crm-dash-board.component';

describe('CrmDashBoardComponent', () => {
  let component: CrmDashBoardComponent;
  let fixture: ComponentFixture<CrmDashBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrmDashBoardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrmDashBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
