import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayClientServiceConfigComponent } from './display-client-service-config.component';

describe('DisplayClientServiceConfigComponent', () => {
  let component: DisplayClientServiceConfigComponent;
  let fixture: ComponentFixture<DisplayClientServiceConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayClientServiceConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayClientServiceConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
