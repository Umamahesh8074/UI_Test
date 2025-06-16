import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayChannelPartnerComponent } from './display-channel-partner.component';

describe('DisplayChannelPartnerComponent', () => {
  let component: DisplayChannelPartnerComponent;
  let fixture: ComponentFixture<DisplayChannelPartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayChannelPartnerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayChannelPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
