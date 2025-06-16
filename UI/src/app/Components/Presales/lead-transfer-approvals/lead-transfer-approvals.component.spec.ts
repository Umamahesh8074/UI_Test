import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadTransferApprovalsComponent } from './lead-transfer-approvals.component';

describe('LeadTransferApprovalsComponent', () => {
  let component: LeadTransferApprovalsComponent;
  let fixture: ComponentFixture<LeadTransferApprovalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadTransferApprovalsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadTransferApprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
