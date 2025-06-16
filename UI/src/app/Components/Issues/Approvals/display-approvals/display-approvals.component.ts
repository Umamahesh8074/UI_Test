import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CustomerIssueDetailsDto } from 'src/app/Models/Issues/issues';
import { User } from 'src/app/Models/User/User';
import { CustomerService } from 'src/app/Services/Customer/customer.service';
import { IssuesService } from 'src/app/Services/Issues/issues.service';
import { IssueApprovalComponent } from '../issue-approval/issue-approval.component';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-display-approvals',
  templateUrl: './display-approvals.component.html',
  styleUrls: ['./display-approvals.component.css']
})
export class DisplayIssueApprovalsComponent implements OnInit {


  roleId:number=0;
  public user: User = new User();
  userId:number=0;
  displayedColumns: string[]=[]
  projectIssueDetails:any;
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  roleName:string='';
  issueStatus:string='Issue_Status';
  pageSizeOptions=pageSizeOptions;
  status: string = '';
  issuesTypeData:CommonReferenceDetails[]=[];
  private destroy$ = new Subject<void>();
  isDisplay: boolean=false;
  issueData: any;
  isView: any;

  constructor(
    private issueService: IssuesService,
    private customerService:CustomerService,
    private router: Router,
    public dialog: MatDialog,
    private commonService:CommanService,
    private route: ActivatedRoute,
    private builder: FormBuilder,
    
  ) {}
  formData = this.builder.group({
    remarks: this.builder.control('', Validators.required),
    issueId: this.builder.control('', Validators.required),
    issueType: this.builder.control('', Validators.required),
  });
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
      this.userId=this.user.userId;
      this.roleName=this.user.roleName
      console.log(this.userId);
    }
   
    this.route.queryParams.subscribe(params => {
      this.status = params['status'];
      // this.fetchIssues();
    });
    this.getCustomerDetails()
    this.setDisplayedColumns()
    this.getAllIssueStatus();
  }

  setDisplayedColumns() {
    if (this.roleName === 'Admin') {
      this.displayedColumns = [
       'rowNumber', 'customerName', 'ProjectName',
        'issueNumber', 'issueType','status','issueStartDate','issueDiscription', 'image', 'assignedTo'
      ];
    } else {
      this.displayedColumns = [
        'customerName', 'ProjectName', 'blockName', 'levelName', 'unitName', 
        'issueNumber', 'issueType', 'status','image', 'actions'
      ];
    }
  }


  getCustomerDetails(){
    console.log(this.status);
    
    this.issueService.getIssuesByUserId(this.userId,this.roleName,this.pageIndex, this.pageSize,this.status)
    .subscribe({
      next: (resp) => {
        this.projectIssueDetails=resp.records;
        console.log(resp);
        console.log(this.projectIssueDetails);
        this.totalItems = resp.totalRecords; 
      },
      error: (err) => {
        console.error('Error adding Customer', err);
      },
    });
  }
  getAllIssueStatus()
  {
    this.commonService
        .getRefDetailsByType(this.issueStatus)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (resp) => {
            this.issuesTypeData=resp;
            console.log(resp);
            console.log(this.issuesTypeData);
            
          },
          error: (err) => {
            console.error('Error adding Customer', err);
          },
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
  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    // this.getApprovalIndentsByRoleId(this.roleId);
  }
   //view project details sending data to dialog
   approvalIssue(issueData: any) {
    console.log(issueData);
    this.isDisplay=true;
    if (issueData != null) {
      this.isView = true
      this.issueData = issueData;
      console.log(issueData);
      
      // this.issueNumber = this.issueData.issueNumber
      // this.imgeUrl =  this.issueData.imagePath;
      // this.isImageDisplay = data.isImageDisplay;
      // console.log(this.imgeUrl);
      // this.loadImage()

    }
    // const dialogRef=this.dialog.open(IssueApprovalComponent, {
    //   data: { send: true, issueData: issueData },
    //   width: '50%',
    // });
    // // dialogRef.componentInstance.onClose.subscribe(() => {
    // //   dialogRef.close(); // Close the dialog when onClose event is emitted
    // // });
    // // this.getCustomerDetails()
    // dialogRef.afterClosed().subscribe(() => {
    //   this.getCustomerDetails(); // Refresh data after dialog is closed
    // });
  }
  displayImage(issueData: any) {
    console.log(issueData);

    const dialogRef=this.dialog.open(IssueApprovalComponent, {
      data: { send: true, issueData: issueData ,isImageDisplay: true },
      width: '50%',
    });
    dialogRef.afterClosed().subscribe(() => {
      dialogRef.close();  // Refresh data after dialog is closed
    });
  }
}
