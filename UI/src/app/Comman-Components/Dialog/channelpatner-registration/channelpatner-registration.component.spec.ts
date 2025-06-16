import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelpatnerRegistrationDailougeComponent } from './channelpatner-registration.component';

describe('ChannelpatnerRegistrationComponent', () => {
  let component: ChannelpatnerRegistrationDailougeComponent;
  let fixture: ComponentFixture<ChannelpatnerRegistrationDailougeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelpatnerRegistrationDailougeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChannelpatnerRegistrationDailougeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
