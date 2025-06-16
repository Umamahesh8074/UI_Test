import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayclientinvoicereportComponent } from './displayclientinvoicereport.component';

describe('DisplayclientinvoicereportComponent', () => {
  let component: DisplayclientinvoicereportComponent;
  let fixture: ComponentFixture<DisplayclientinvoicereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayclientinvoicereportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayclientinvoicereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
