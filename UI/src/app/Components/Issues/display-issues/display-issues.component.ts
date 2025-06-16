import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { Subject, takeUntil, tap } from 'rxjs';
import { ApproveDialogComponent } from 'src/app/Comman-Components/Dialog/approvaldialog/approvedialog.component';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import { Issues } from 'src/app/Models/Issues/issues';
import { User } from 'src/app/Models/User/User';
import { IssuesService } from 'src/app/Services/Issues/issues.service';
import { IssueApprovalComponent } from '../Approvals/issue-approval/issue-approval.component';
import { FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-displayissues',
  templateUrl: './display-issues.component.html',
  styleUrls: ['./display-issues.component.css'],
  encapsulation: ViewEncapsulation.None, // Set ViewEncapsulation to None
})
export class DisplayissuesComponent implements OnInit {
  private destroy$ = new Subject<void>();
  issuesData: Issues[] = [];
  issuesName: string = '';
  displayedColumns: string[] = ['ticketNumber', 'issueType','issueDiscription','issueStartDate','issueStatus','actions'];
  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;
  public user: User = new User();
  userId:number=0;
  roleName:string='';
  //pagination
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  remarks:string='';

  ngOnInit(): void {
    this.issuesService.refreshRequired.subscribe(() => {
      this.getIssues(this.issuesName);
    });

    const user = localStorage.getItem('user');
    if (user != null) {
      this.user = JSON.parse(user);
      this.userId=this.user.userId;
      this.roleName=this.user.roleName
      console.log(this.userId);

    }
    this.getAllIssuesWithPagination();
  }

  constructor(
    private issuesService: IssuesService,
    private router: Router,
    public dialog: MatDialog,
    private builder: FormBuilder,
  ) {
  }

  formData = this.builder.group({
    remarks: this.builder.control('',Validators.required), 
    issueId: this.builder.control('',Validators.required),
    issueType:this.builder.control('',Validators.required),
});

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getAllIssuesWithPagination();
  }

  getAllIssuesWithPagination() {
    console.log(this.roleName);
    
    this.issuesService.getAllIssuesWithPagination(this.pageIndex, this.pageSize,this.userId).pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.issuesData = resp.records;
          console.log(this.issuesData);
          this.totalItems = resp.totalRecords;
        },
        error: (err) => {
          console.error(err);
        },
      });
  }


  getIssues(issuesName: any) {
    this.issuesName = issuesName;
    this.issuesService
      .getAllIssues(issuesName, this.pageIndex, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (issuesData) => {
          this.issuesData = issuesData.records;

          this.totalItems = issuesData.totalRecords;
          console.log(this.issuesData);
          
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  // ///opening confirm dialog
  // openConfirmDialog(issuesId: any) {
  //   const dialogRef = this.dialog.open(ConfirmdialogComponent, {
  //     data: { displayedData: 'Issues' }, // Pass the property as data to the dialog
  //   });

  //   dialogRef.componentInstance.isConfirmDelete.subscribe(
  //     (isDelete: boolean) => {
  //       if (isDelete) {
    
  //       }
  //     }
  //   );
  // }

  //delete issues by issues id

  //adding issues
  addIssues() {
    this.router.navigate(['layout/facility/management/addissues']);
  }

  editIssues(issuesData: any) {
    this.router.navigate(['layout/addissues'], {
      state: { issues: issuesData },
    });
  }
  approvalIssue(issueData: any) {
    console.log(issueData);
    const dialogRef=this.dialog.open(IssueApprovalComponent, {
      data: { send: true, issueData: issueData },
      width: '50%',
    });

    // dialogRef.componentInstance.onClose.subscribe(() => {
    //   dialogRef.close(); // Close the dialog when onClose event is emitted
    // });
    // this.getCustomerDetails()
    dialogRef.afterClosed().subscribe(() => {
      // this.getCustomerDetails(); // Refresh data after dialog is closed
    });
  }
  reopenIssue()
  {
  console.log(this.formData.value);
  this.issuesService
  .updateIssues(this.formData.value)
  .pipe(takeUntil(this.destroy$))
  .subscribe({
    next: (resp:any) => {
      console.log(resp);
      this.router.navigate(['layout/facility/management/issueapproval']);
    },
    error: (err:any) => {
      console.error('Error adding Issues', err);
    },
  });
  }
}
