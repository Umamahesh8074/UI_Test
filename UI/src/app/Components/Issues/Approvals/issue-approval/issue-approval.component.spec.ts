import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueApprovalComponent } from './issue-approval.component';

describe('IssueApprovalComponent', () => {
  let component: IssueApprovalComponent;
  let fixture: ComponentFixture<IssueApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssueApprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssueApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
