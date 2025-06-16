import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelPartnerDashBoardComponent } from './cp-dash-board.component';

describe('SalesHeadDashBoardComponent', () => {
  let component: ChannelPartnerDashBoardComponent;
  let fixture: ComponentFixture<ChannelPartnerDashBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelPartnerDashBoardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChannelPartnerDashBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
