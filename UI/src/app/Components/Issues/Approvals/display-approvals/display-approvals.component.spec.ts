import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayIssueApprovalsComponent } from './display-approvals.component';

describe('DisplayApprovalsComponent', () => {
  let component: DisplayIssueApprovalsComponent;
  let fixture: ComponentFixture<DisplayIssueApprovalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayIssueApprovalsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayIssueApprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
