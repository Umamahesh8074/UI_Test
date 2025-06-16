import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayclientComponent } from './displayclient.component';

describe('DisplayclientComponent', () => {
  let component: DisplayclientComponent;
  let fixture: ComponentFixture<DisplayclientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayclientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayclientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
