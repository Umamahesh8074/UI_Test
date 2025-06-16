import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelPatnerRegisterComponent } from './channel-patner-register.component';

describe('ChannelPatnerRegisterComponent', () => {
  let component: ChannelPatnerRegisterComponent;
  let fixture: ComponentFixture<ChannelPatnerRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelPatnerRegisterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChannelPatnerRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
