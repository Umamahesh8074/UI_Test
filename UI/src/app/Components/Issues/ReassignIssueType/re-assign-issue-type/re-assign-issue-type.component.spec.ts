import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReAssignIssueTypeComponent } from './re-assign-issue-type.component';

describe('ReAssignIssueTypeComponent', () => {
  let component: ReAssignIssueTypeComponent;
  let fixture: ComponentFixture<ReAssignIssueTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReAssignIssueTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReAssignIssueTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
