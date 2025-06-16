import { DatePipe } from '@angular/common';
import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import {
  QrReportDto,
  QrReportLocationSummaryDTO,
  QrReportProjectSummaryDTO,
  QrReportUserSummaryDto,
  Reports,
} from 'src/app/Models/Reports/reports';
import { DisplaySecuritypatrol } from 'src/app/Models/Securitypatrol/securitypatrol';
import { User } from 'src/app/Models/User/User';
import { ReportsService } from 'src/app/Services/Reports/reports.service';
import { SecuritypatrolService } from 'src/app/Services/Securitypatrol/securitypatrol.service';

@Component({
  selector: 'app-displayreports',
  templateUrl: './display-reports.component.html',
  styleUrls: ['./display-reports.component.css'],
  encapsulation: ViewEncapsulation.None, // Set ViewEncapsulation to None
})
export class DisplayreportsComponent implements OnInit {
  private destroy$ = new Subject<void>();
  reportsData: Reports[] = [];
  reportsName: string = '';
  displayedProjectColumns: string[] = [
    'projectName',

    'overallCount',
    'overallStatus',
  ];

  displayedLocationColumns: string[] = [
    'location',
    'overallCount',
    'overallStatus',
  ];

  displayedUserColumns: string[] = [
    'userName',
    'overallCount',
    'overallStatus',
  ];

  displayedAllColumns: string[] = [
    'projectName',
    'userName',
   'location',
   'scheduleTime',
   'createdDate',
   'status'

  ];
  showProjectTable: boolean = true;
  showLocationTable: boolean = false;
  showUserTable: boolean = false;
  showAllTable: boolean = false;
//   displayedOverallColumns: string[] = [
//     ' projectName',
//     'location',
//     'userName',
//  'createdDate',
//     'status'

//   ];

  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;
  formData!: FormGroup;
  securitypatrolData: DisplaySecuritypatrol[] = [];
  yesCount: number = 0;
  noCount: number = 0;
  total: number = 0;
  isView = false;
  yesPercentage: number = 0;
  public user: User = new User();
  //pagination
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  securitypatrol: any;
  organizationId = 0;
  securityPatrolName: string = '';
  securityPatrol: any = [];
  qrReportProject: QrReportProjectSummaryDTO[] = [];
  qrReportLocation: QrReportLocationSummaryDTO[] = [];
  qrReportUser: QrReportUserSummaryDto[] = [];
  qrReportOrg: QrReportDto[] = [];
  qrgenertorId: number = 0;
  projectId: number = 0;
  userId: number=0;

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user != null) {
      this.user = JSON.parse(user);
      this.organizationId = this.user.organizationId;
      console.log(this.user.organizationId);
      console.log('ORG ID ' + this.organizationId);
      this.getSecuritypatrolProject();
    }
    this.calculateCountsAndPercentages();    
    this.initForm();
  }

  constructor(
    private reportsService: ReportsService,
    private router: Router,
    public dialog: MatDialog,
    private securitypatrolService: SecuritypatrolService,
    private formBuilder: FormBuilder
  ) {
  }


  private initForm(): void {
    this.formData = this.formBuilder.group({
      projectId: [''],
      qrgenertorId: [''],
      userId: [''],
      projectName:[''],
      location:['']
    });
  }

  onClear() {

    console.log("hiii");
    this.formData.get('projectId')?.reset();
    this.formData.get('location')?.reset();
    this.formData.get('userId')?.reset();


    this.getSecuritypatrolProject();

  }
  onSelect(event: any): void {
    const selectedValue = event.value;
    console.log('Selected Project ID:', selectedValue);
    this.projectId = event.value;
    this.showProjectTable = false;
    this.showLocationTable = true;
    this.showUserTable = false;
    this.showAllTable = false;

    this.getSecuritypatrolLocation();
    //this.getSecuritypatrolLocation();
    // Add your custom logic here, e.g., update other form controls, fetch data, etc.
  }

  onSelectLocation(event: any): void {
    const selectedValue = event.value;
    console.log('Selected Project ID:', selectedValue);
    this.qrgenertorId = event.value;
    this.showProjectTable = false;
    this.showLocationTable =false;
    this.showUserTable = true;
    this.showAllTable = false;

    this.getSecuritypatrolUser();
    //this.getSecuritypatrolLocation();
    // Add your custom logic here, e.g., update other form controls, fetch data, etc.
  }

  onSelectUser(event: any): void {
    const selectedValue = event.value;
    console.log('Selected Project ID:', selectedValue);
    this.userId = event.value;
    this.showProjectTable = false;
    this.showLocationTable =false;
    this.showUserTable = false;
    this.showAllTable = true;
    this.getSecuritypatrol();
    //this.getSecuritypatrolLocation();
    // Add your custom logic here, e.g., update other form controls, fetch data, etc.
  }

  // private loadLocations(): void {
  //   this.qrgeneratorService.getQrgeneratorById(this.user.organizationId,this.buildingId).subscribe({
  //     next: (resp) => { // Ensure resp is correctly typed as Qrgenerator
  //       this.qr = resp; // Assign the single Qrgenerator object directly
  //     },
  //     error: (err) => {
  //       console.error('Error loading QR generator', err);
  //     },
  //   });
  // }
  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getSecuritypatrolProject();
  }
  onRowClick(reports: any, type: string) {
    switch (type) {
      case 'project':
        // Navigate to the project-related table
        this.showProjectTable = true;
        this.showLocationTable = false;
        this.showUserTable = false;
        this.showAllTable = false;
        this.projectId=reports;
        this.getSecuritypatrolLocation(); // Optionally pass the clicked project data
        break;

      case 'location':
        // Navigate to the location-related table
        this.showProjectTable = false;
        this.showLocationTable = true;
        this.showUserTable = false;
        this.showAllTable = false;
        this.qrgenertorId=reports;
        this.getSecuritypatrolUser();; // Optionally pass the clicked location data
        break;

      case 'user':
        // Navigate to the user-related table
        this.showProjectTable = false;
        this.showLocationTable = false;
        this.showUserTable = true;
        this.showAllTable = false;
        this.userId=reports;
        this.getSecuritypatrol(); // Optionally pass the clicked user data
        break;

      case 'all':
        // Navigate to the overall data table
        this.showProjectTable = false;
        this.showLocationTable = false;
        this.showUserTable = false;
        this.showAllTable = true;
        this.navigateToAllDetails(reports); // Optionally pass the clicked org data
        break;

      default:
        break;
    }
  }
  navigateToProjectDetails(reports: any) {
    console.log('Navigating to Project:', reports);
    // Add specific logic to handle project-related data or navigation
  }

  navigateToLocationDetails(reports: any) {
    console.log('Navigating to Location:', reports);
    // Add specific logic to handle location-related data or navigation
  }

  navigateToUserDetails(reports: any) {
    console.log('Navigating to User:', reports);
    // Add specific logic to handle user-related data or navigation
  }

  navigateToAllDetails(reports: any) {
    console.log('Navigating to Overall Reports:', reports);
    // Add specific logic to handle overall data or navigation
  }

  getSecuritypatrol() {

    console.log(this.organizationId);

    this.securitypatrolService

      .getAllSecuritypatrol(
        this.securityPatrolName,
        this.pageIndex,
        this.pageSize,
        this.organizationId,
        this.projectId,
        this.qrgenertorId,
        this.userId
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (qrReportOrg) => {
          this.qrReportOrg = qrReportOrg.records;
          console.log(this.qrReportOrg);

          this.totalItems = qrReportOrg.totalRecords;
          this.showProjectTable = false;
          this.showLocationTable = false;
          this.showUserTable = false;
          this.showAllTable = true;

        },
        error: (error) => {
          console.error(error);
        },
      });
    // Fetch initial data
  }

  getSecuritypatrolProject() {
    console.log(this.organizationId);

    this.securitypatrolService

      .getAllSecuritypatrolProject(
        this.securityPatrolName,
        this.pageIndex,
        this.pageSize,
        this.organizationId,
        this.projectId
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (qrReportProject) => {
          this.qrReportProject = qrReportProject.records;
          console.log(this.qrReportProject);

          this.totalItems = qrReportProject.totalRecords;
        },
        error: (error) => {
          console.error(error);
        },
      });
    // Fetch initial data
  }

  getSecuritypatrolLocation() {



    console.log(this.organizationId);

    this.securitypatrolService

      .getAllSecuritypatrolLocation(
        this.securityPatrolName,
        this.pageIndex,
        this.pageSize,
        this.organizationId,
        this.projectId
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (qrReportLocation) => {
          this.qrReportLocation = qrReportLocation.records;
          console.log(this.qrReportLocation);
          this.securityPatrol = this.qrReportLocation;
          this.totalItems = qrReportLocation.totalRecords;
          this.showProjectTable = false;
          this.showLocationTable = true;
          this.showUserTable = false;
          this.showAllTable = false;
        },
        error: (error) => {
          console.error(error);
        },
      });
    // Fetch initial data
  }

  getSecuritypatrolUser() {

    console.log(this.organizationId);

    this.securitypatrolService

      .getAllSecuritypatrolUser(
        this.securityPatrolName,
        this.pageIndex,
        this.pageSize,
        this.organizationId,
        this.projectId,
        this.qrgenertorId
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (qrReportUser) => {
          this.qrReportUser = qrReportUser.records;
          console.log(this.qrReportLocation);

          this.totalItems = qrReportUser.totalRecords;

          this.showProjectTable = false;
          this.showLocationTable = false;
          this.showUserTable = true;
          this.showAllTable = false;
        },
        error: (error) => {
          console.error(error);
        },
      });
    // Fetch initial data
  }

  calculateCountsAndPercentages() {
    if (this.securitypatrolData) {
      console.log(this.securitypatrolData);

      this.yesCount = this.securitypatrolData.filter(
        (dto) => dto.check === 'Yes'
      ).length;
      this.noCount = this.securitypatrolData.filter(
        (dto) => dto.check === 'No'
      ).length;
      this.total = this.yesCount + this.noCount;

      if (this.total > 0) {
        this.yesPercentage = (this.yesCount / this.total) * 100;
      }
    }
  }
  ///opening confirm dialog
  openConfirmDialog(reportsId: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'Reports' }, // Pass the property as data to the dialog
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteReports(reportsId);
        }
      }
    );
  }

  //delete reports by reports id
  deleteReports(reportsId: number) {
    this.reportsService
      .deleteReports(reportsId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (reportsData: any) => {
          console.log(reportsData);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  //adding reports
  addReports() {
    this.router.navigate(['layout/addreports']);
  }

  editReports(reportsData: any) {
    this.router.navigate(['layout/addreports'], {
      state: { reports: reportsData },
    });
  }
}
