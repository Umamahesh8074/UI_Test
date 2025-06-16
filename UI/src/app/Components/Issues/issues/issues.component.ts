import { Component, OnInit } from '@angular/core';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Block } from 'src/app/Models/Block/block';
import { Customer } from 'src/app/Models/Customer/customer';
import { CustomerIssueDetailsDto, IIssues, Issues } from 'src/app/Models/Issues/issues';
import { Level } from 'src/app/Models/Project/level';
import { Project } from 'src/app/Models/Project/project';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';
import { User } from 'src/app/Models/User/User';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { CustomerService } from 'src/app/Services/Customer/customer.service';
import { IssuesService } from 'src/app/Services/Issues/issues.service';
import { BlockService } from 'src/app/Services/ProjectService/Block/block.service';
import { LevelService } from 'src/app/Services/ProjectService/Level/level.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-issues',
  templateUrl: './issues.component.html',

  styleUrls: ['./issues.component.css'],
})
export class AddIssuesComponent implements OnInit {
  issues: IIssues = new Issues();
  isAdding: boolean = true;
  projectData: Project[] = [];
  userDetails:any;
  customerData:CustomerIssueDetailsDto[]=[];
  projectTypeId:number=0;
  userId:number=0;
  projectId:number=0;
  userIssues:CustomerIssueDetailsDto[]=[];
  phoneNo:string='';
  projectTypeData:string='';
  blockData:Block[]=[];
  levelsData:Level[]=[];
  issueType:string='';
  issueTypeName:string='Issue_Type';
  issuesTypeData:CommonReferenceDetails[]=[];
  issuesSubTypeData:CommonReferenceDetails[]=[];
  public user: User = new User();
  private destroy$ = new Subject<void>();
  projectIssueDetails:any;
  selectedFile: File | null = null;
  imageFile!: File;
  fileName:string='';
  constructor(
    private router: Router,
    private issueService: IssuesService,
    private builder: FormBuilder,
    private commonService:CommanService,
    private customerService:CustomerService,
  ) {}

  ngOnInit(): void {
    this.issues = history.state.issues;
    if (history.state.issues != null) {
      this.isAdding = false;
    }

    const user = localStorage.getItem('user');
    if (user != null) {
      this.user = JSON.parse(user);
      this.userId=this.user.userId;
      console.log(this.userId);

    }
    this.getUserInfo();
    this.getAllIssueTypes();
    this.getCustomerDetails();
   
  }

  formData = this.builder.group({
    issuesId: this.builder.control(0),
    issueTypeId:this.builder.control('',Validators.required),
    issueDescription:this.builder.control('',Validators.required),
    issueSubTypeId:this.builder.control('',Validators.required),
    projectId:this.builder.control(this.projectId),
    customerId:this.builder.control(this.userId),
    issueTypeName:this.builder.control(''),
    image:this.builder.control("")
  });
  
  getUserInfo()
  {
    this.customerService.getUserInfoById(this.userId)
    .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (resp) => {
            this.userDetails=resp;
            console.log(this.userDetails);
             console.log(this.userDetails.projectId);
             this.projectId=this.userDetails.projectId;
             this.phoneNo=this.userDetails.phoneNumber;
          //  this. getAlluserProjectDetails();
           this.getCustomerDetails();
          },
          error: (err) => {
            console.error('Error adding Customer', err);
          },
        });
  }
  getCustomerDetails(){
    console.log(this.userId);
    this.customerService.getUserDetailsByUserId(this.userId)
    .subscribe({
      next: (resp) => {
        this.projectIssueDetails=resp;
        console.log(resp);
        console.log(this.projectIssueDetails);
        
      },
      error: (err) => {
        console.error('Error adding Customer', err);
      },
    });
  

  }

  getAllIssueTypes()
  {
    this.commonService
        .getRefDetailsByType(this.issueTypeName)
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
  getAllSubIssueTypes(issueName:string)
  {
     this.issueType=issueName
    console.log(this.issueType);
    
    this.commonService
        .getRefDetailsByType(issueName)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (resp) => {
            this.issuesSubTypeData=resp;
            console.log(resp);
            console.log(this.issuesSubTypeData);
            
          },
          error: (err) => {
            console.error('Error adding Customer', err);
          },
        });
  }

  getAlluserProjectDetails()
  {
    console.log(this.phoneNo);
    this.customerService.getUserIssueByPhoneNo(this.phoneNo)
    .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (resp) => {
            this.customerData=resp;
            console.log(resp);
            console.log(this.customerData);
            
          },
          error: (err) => {
            console.error('Error adding Customer', err);
          },
        });
  }
  save() {
    //adding issues
    if (this.isAdding) {
      this.formData.patchValue({ projectId: this.projectId });
      this.formData.patchValue({ customerId: this.userId });
      this.formData.patchValue({ issueTypeName: this.issueType });     
       console.log(this.formData.value);
      this.issueService
        .addIssues(this.formData.value,this.imageFile)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (resp) => {
            this.router.navigate(['layout/facility/management/issues']);
          },
          error: (err) => {
            console.error('Error adding Issues', err);
          },
        });
    } else {
      //updating issues
      // this.issueService
      //   .updateIssues(this.formData.value)
      //   .pipe(takeUntil(this.destroy$))
      //   .subscribe({
      //     next: () => {
      //       this.router.navigate(['layout/issues']);
      //     },
      //     error: (err) => {
      //       console.error('Error updating Issues', err);
      //     },
      //   });
    }
  }
  clearForm() {
    this.formData.reset();
  }

  gotoIssuess() {
    this.router.navigate(['layout/issues']);
  }
  // onFileSelected(event: any): void {
  //   this.selectedFile = event.target.files[0];
  // }
  onFileSelect(event: any): void {
      this.imageFile = event.target.files[0];
      console.log(this.imageFile);  
  }


  onUpload(): void {
    
  }
}
