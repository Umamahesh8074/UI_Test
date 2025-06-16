import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { CustomerIssueDetailsDto, Issues, IssuesDto } from 'src/app/Models/Issues/issues';
import { User } from 'src/app/Models/User/User';
import { CustomerService } from 'src/app/Services/Customer/customer.service';
import { IssuesService } from 'src/app/Services/Issues/issues.service';

@Component({
  selector: 'app-re-assign-issue-type',
  templateUrl: './re-assign-issue-type.component.html',
  styleUrls: ['./re-assign-issue-type.component.css']
})
export class ReAssignIssueTypeComponent {

  roleId: number = 0;
  public user: User = new User();
  userId: number = 0;
  displayedColumns: string[] = ['ticketNumber', 'issueType','issueDiscription','issueStartDate','issueStatus', 'actions'];
  public issuesData:any;
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  pageSizeOptions = pageSizeOptions;
  private destroy$ = new Subject<void>();
  constructor(
    private issueService: IssuesService,
    private customerService: CustomerService,
    private router: Router,
    public dialog: MatDialog,
  ) { }
  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.roleId = JSON.parse(storedUser).roleId;
      // console.log(this.roleId);

    } else {
      console.error('User not found in localStorage.');
    }
    const user = localStorage.getItem('user');
    if (user != null) {
      this.user = JSON.parse(user);
      this.userId = this.user.userId;
      console.log(this.userId);
    }
    this.getReassignIssues()
  }
  getReassignIssues() {
    this.issueService.getReassignIssueTypeByUserId(this.pageIndex,this.pageSize,this.userId)
      .subscribe({
        next: (resp) => {
          this.issuesData = resp.records;
          console.log(resp);
          console.log(this.issuesData);
        },
        error: (err) => {
          console.error('Error adding Customer', err);
        },
      });


  }
  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    // this.getApprovalIndentsByRoleId(this.roleId);
  }
  editIssue(issueData: any) {
    console.log(issueData);
    
    this.router.navigate(['layout/facility/management/editreassignIssueType'], {
      state: { issueData: issueData},
    });
  }
  getIssuesByName(customerName: any) {

    this.customerService
      .getAllCustomer(customerName, this.pageIndex, this.pageIndex)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (customerData) => {
          this.totalItems = customerData.totalRecords;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }



}
