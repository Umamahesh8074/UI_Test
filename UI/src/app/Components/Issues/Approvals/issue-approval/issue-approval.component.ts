import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  DomSanitizer,
  SafeResourceUrl,
  SafeUrl,
} from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import {
  ApprovalIndentDto,
  Approvals,
  IApprovals,
} from 'src/app/Models/Procurement/approvals';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';
import { User } from 'src/app/Models/User/User';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { IssuesService } from 'src/app/Services/Issues/issues.service';
import { ApprovalsService } from 'src/app/Services/ProcurementService/Approvals/approvals.service';
import { IndentService } from 'src/app/Services/ProcurementService/Indent/indent.service';

@Component({
  selector: 'app-issue-approval',
  templateUrl: './issue-approval.component.html',
  styleUrls: ['./issue-approval.component.css'],
})
export class IssueApprovalComponent implements OnInit {
  approvals: IApprovals = new Approvals();
  isAdding: boolean = false;
  workflowTypeId: number = 0;
  approvalIndents: ApprovalIndentDto = new ApprovalIndentDto();
  userId: number = 0;
  issueNumber: string = '';
  private destroy$ = new Subject<void>();
  displayedColumns: string[] = [
    'issueNumber',
    'issueType',
    'issueSubType',
    'remarks',
  ];
  issueStatus: string = 'Issue_Status';
  issueData: any;
  isView = false;
  public user: User = new User();
  roleName: string = '';
  @Output() onClose: EventEmitter<void> = new EventEmitter<void>();
  isImageDisplay: boolean = true; // Replace with your condition
  imgeUrl: any;
  imagePath: string = 'D:\\Upload\\1721206272478.jpeg'; // Your local file path
  imageToShow: any;
  imageUri: any;
  issuesTypeData: CommonReferenceDetails[] = [];
  constructor(
    private router: Router,
    private builder: FormBuilder,
    private issueService: IssuesService,
    private commonService: CommanService,
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<IssueApprovalComponent>
  ) {
    if (data.issueData != null) {
      this.isView = data.send;
      this.issueData = data.issueData;
      console.log(data.issueData);

      this.issueNumber = this.issueData.issueNumber;
      this.imgeUrl = this.issueData.imagePath;
      this.isImageDisplay = data.isImageDisplay;
      console.log(this.imgeUrl);
      this.loadImage();
    }
  }
  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user != null) {
      this.user = JSON.parse(user);
      this.userId = this.user.userId;
      this.roleName = this.user.roleName;
      console.log(this.userId);
    }
  }
  formData = this.builder.group({
    remarks: this.builder.control('', Validators.required),
    issueId: this.builder.control('', Validators.required),
    issueType: this.builder.control('', Validators.required),
  });

  //pagination
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
  }

  // close dialog
  closeDialog() {
    this.dialogRef.close();
  }
  clearForm() {
    this.formData.reset();
  }
  updateStatus(status: string) {}

  loadImage(): void {
    this.issueService.getImage(this.imgeUrl).subscribe((response) => {
      const url = window.URL.createObjectURL(response);
      this.imageUri = this.sanitizer.bypassSecurityTrustUrl(url);
    });
  }
  save() {
    if (this.roleName !== 'Customer') {
      // Only execute if isAdding is true
      if (this.isAdding) {
        console.log(this.issueNumber);
        this.formData.patchValue({ issueId: this.issueData.issueId });
        this.formData.patchValue({ issueType: this.issueData.issueType });
        console.log(this.formData.value);
        this.issueService
          .updateIssues(this.formData.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (resp: any) => {
              console.log(resp);
              this.router.navigate([
                'layout/facility/management/issueapproval',
              ]);
              this.closeDialog();
            },
            error: (err: any) => {
              console.error('Error updating Issue', err);
            },
          });
      } else {
        if (this.isImageDisplay) {
          this.closeDialog();
        }
      }
    } else {
      // Customer role logic
      if (this.isAdding) {
        this.formData.patchValue({ issueId: this.issueData.issueId });
        this.formData.patchValue({ issueType: this.issueData.commonRefValue });
        console.log(this.formData.value);
        this.issueService
          .reOpenIssue(this.formData.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (resp: any) => {
              console.log(resp);
              this.router.navigate([
                'layout/facility/management/issueapproval',
              ]);
              this.closeDialog();
            },
            error: (err: any) => {
              console.error('Error reopening Issue', err);
            },
          });
      } else {
        // Close the dialog without making a backend call
        this.closeDialog();
      }
    }
  }

  getAllIssueStatus() {
    this.commonService
      .getRefDetailsByType(this.issueStatus)
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
}
