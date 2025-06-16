import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientServiceConfigComponent } from './client-service-config.component';

describe('ClientServiceConfigComponent', () => {
  let component: ClientServiceConfigComponent;
  let fixture: ComponentFixture<ClientServiceConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientServiceConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientServiceConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
