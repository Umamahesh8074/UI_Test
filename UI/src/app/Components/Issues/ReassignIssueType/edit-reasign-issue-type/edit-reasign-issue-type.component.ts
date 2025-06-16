import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { CustomerService } from 'src/app/Services/Customer/customer.service';
import { IssuesService } from 'src/app/Services/Issues/issues.service';

@Component({
  selector: 'app-edit-reasign-issue-type',
  templateUrl: './edit-reasign-issue-type.component.html',
  styleUrls: ['./edit-reasign-issue-type.component.css'],
})
export class EditReasignIssueTypeComponent implements OnInit {
  issueData: any;
  issueType: string = 'Issue_Type';
  issueTypeName: string = '';
  private destroy$ = new Subject<void>();
  issuesTypeData: CommonReferenceDetails[] = [];
  selectedIssueType: any;
  constructor(
    private issueService: IssuesService,
    private customerService: CustomerService,
    private router: Router,
    public dialog: MatDialog,
    private builder: FormBuilder,
    private commonService: CommanService
  ) {}
  ngOnInit(): void {
    this.issueData = history.state.issueData;
    console.log(this.issueData);
    this.issueTypeName = this.issueData.issueTypeName;
    this.getAllIssueTypes();
  }
  formData = this.builder.group({
    issueId: this.builder.control(0),
    issueTypeId: this.builder.control(0),
    remarks: this.builder.control('', Validators.required),
    issueTypeName: this.builder.control('', Validators.required),
  });
  getAllIssueTypes() {
    this.issueService
      .getIssueTypes(this.issueType, this.issueTypeName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.issuesTypeData = resp;
          console.log(resp);
          console.log(this.issuesTypeData);
        },
        error: (err) => {
          console.error('Error adding Customer', err);
        },
      });
  }
  clearForm() {
    this.formData.reset();
  }

  gotoWorkflowstages() {
    this.router.navigate(['/layout/workflowstages']);
  }
  save() {
    console.log();

    this.formData.patchValue({ issueId: this.issueData.issueId });
    this.formData.patchValue({
      issueTypeName: this.selectedIssueType.commonRefValue,
    });
    this.formData.patchValue({ issueTypeId: this.selectedIssueType.id });
    console.log(this.formData.value);
    this.issueService
      .updateReassignIssueType(this.formData.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp: any) => {
          console.log(resp);
          this.router.navigate(['layout/facility/management/issueapproval']);
        },
        error: (err: any) => {
          console.error('Error adding Issues', err);
        },
      });
  }
  onIssueTypeChange(event: any) {
    this.selectedIssueType = event.value;
    const selectedId = this.selectedIssueType.id;
    const selectedValue = this.selectedIssueType.commonRefValue;
    console.log('Selected ID:', selectedId);
    console.log('Selected Value:', selectedValue);
    // You can also store these values or perform other actions here
  }
}
