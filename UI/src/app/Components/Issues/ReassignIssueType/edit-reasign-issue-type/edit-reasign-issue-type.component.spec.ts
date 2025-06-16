import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditReasignIssueTypeComponent } from './edit-reasign-issue-type.component';

describe('EditReasignIssueTypeComponent', () => {
  let component: EditReasignIssueTypeComponent;
  let fixture: ComponentFixture<EditReasignIssueTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditReasignIssueTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditReasignIssueTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
