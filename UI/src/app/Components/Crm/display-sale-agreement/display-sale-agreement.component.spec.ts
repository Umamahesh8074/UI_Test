import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplaySaleAgreementComponent } from './display-sale-agreement.component';

describe('DisplaySaleAgreementComponent', () => {
  let component: DisplaySaleAgreementComponent;
  let fixture: ComponentFixture<DisplaySaleAgreementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplaySaleAgreementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplaySaleAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
