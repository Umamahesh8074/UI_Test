import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationTabsComponent } from './configuration-tabs.component';

describe('ConfigurationTabsComponent', () => {
  let component: ConfigurationTabsComponent;
  let fixture: ComponentFixture<ConfigurationTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationTabsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
