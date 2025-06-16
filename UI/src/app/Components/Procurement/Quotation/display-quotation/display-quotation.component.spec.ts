import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayquotationComponent } from './display-quotation.component';

describe('DisplayQuotationComponent', () => {
  let component: DisplayquotationComponent;
  let fixture: ComponentFixture<DisplayquotationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayquotationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayquotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
