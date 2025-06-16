import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpTermsAndConditionsComponent } from './cp-terms-and-conditions.component';

describe('CpTermsAndConditionsComponent', () => {
  let component: CpTermsAndConditionsComponent;
  let fixture: ComponentFixture<CpTermsAndConditionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpTermsAndConditionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CpTermsAndConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
