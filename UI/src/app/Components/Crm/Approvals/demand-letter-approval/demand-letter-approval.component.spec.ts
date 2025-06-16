import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandLetterApprovalComponent } from './demand-letter-approval.component';

describe('DemandLetterApprovalComponent', () => {
  let component: DemandLetterApprovalComponent;
  let fixture: ComponentFixture<DemandLetterApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemandLetterApprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemandLetterApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
