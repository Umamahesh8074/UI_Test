import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayApprovedSaleagreementsComponent } from './display-approved-saleagreements.component';

describe('DisplayApprovedSaleagreementsComponent', () => {
  let component: DisplayApprovedSaleagreementsComponent;
  let fixture: ComponentFixture<DisplayApprovedSaleagreementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayApprovedSaleagreementsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayApprovedSaleagreementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
