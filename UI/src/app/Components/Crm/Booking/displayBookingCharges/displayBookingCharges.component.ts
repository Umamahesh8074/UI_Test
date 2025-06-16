import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { Router } from '@angular/router';
import { PAGE_INDEX, TIME_OUT, pageSizeOptions, searchTextLength, searchTextZero } from 'src/app/Constants/CommanConstants/Comman';
import { ToastrService } from 'ngx-toastr';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import { BookingChargesService } from 'src/app/Services/CrmServices/booking-charges.service';
import { IbookingChargesDto } from 'src/app/Models/Crm/BookingCharges';
import { IProject, Project } from 'src/app/Models/Project/project';
import { FormControl } from '@angular/forms';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { MatPaginator } from '@angular/material/paginator';
import { ApplicationInfoService } from 'src/app/Services/CrmServices/applicant-info.service';

@Component({
  selector: 'app-displayBookingCharges',
  templateUrl: './displayBookingCharges.component.html',
  styleUrls: ['./displayBookingCharges.component.css'],
})
export class DisplayBookingChargesComponent implements OnInit {
  destroy$ = new Subject<void>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSize: number = 14;
  pageIndex: number = 0;
  totalPages: number = 0;
  bookingChargesDto: IbookingChargesDto[] = [];
  pageSizeOptions = pageSizeOptions;
  organizationId: number =0;
  // projectName: string = '';
  projects: Project[] = [];
  projectId: number =0;
  project: any = new FormControl([] as IProject[]);
  chargeName: string ='';
  roleName: string =''
  // bookingName: string ='';
  @Input() projectName: string = '';
  @Input() firstApplicantName: string ='';
  @Input() unitName: string ='';
 

  ngOnInit(): void {
    this.setUserFromLocalStorage();
     this.getAllBookingCharges();
     this.fetchProjects();
  }

  constructor(
    public dialog: MatDialog,
    private bookingChargesService : BookingChargesService,
    private router: Router,
    private toastrService: ToastrService,
    private projectService: ProjectService,
    private commanService: CommanService,
    private applicationInfoService: ApplicationInfoService,
    
  ) {}

  displayedColumns: string[] = [
    'rowNumber',
    'bookingName',
    'chargeName',
    'unitName',
    'chargeIn',
    'amountCalculated',
    'project',
    'floor',
    'phase',
    'amount',
    'discountPercentage',
    'discountAmount',
    'amountAfterDiscount',
    'status',
    'actions'
  ];

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['projectId'] ||
      changes['projectName'] ||
      changes['firstApplicantName'] ||
      changes['unitName']
    ) {
      this.getAllBookingCharges();
    }
  }

  getAllBookingCharges() {
    this.bookingChargesService
      .getAllBookingCharges('A',this.pageIndex, this.pageSize,this.firstApplicantName, this.chargeName,this.projectName, this.unitName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (bookingChargesDto) => {
          this.bookingChargesDto = bookingChargesDto.records;
          this.totalPages = bookingChargesDto.totalRecords;
        },
        error: (error) => {
          console.log(error.error);
        },
      });
  }

  private setUserFromLocalStorage(): void {
    const user = this.commanService.getUserFromLocalStorage();
    if (user) {
      console.log(user.organizationId);
      this.organizationId = user.organizationId;
      this.roleName = user.roleName
    }
  }

  //fetch projects based on organization id
  fetchProjects() {
    this.projectService
      .getProjectsByOrgIdWithProjectFilter(
        this.organizationId,
        this.projectName
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (projects) => {
          console.log(projects);
          this.projects = projects;
        },
        error: (error: Error) => {
          console.error('Error fetching projects:', error);
        },
      });
  }
  onProjectSelect(event: any) {
    this.projectName = event.option.value.projectName;
    this.projectId = event.option.value.projectId;
    this.fetchProjects();
    this.getAllBookingCharges()
    
  }

  displayProject(project: IProject): string {
    return project && project.projectName ? project.projectName : '';
  }

  searchProject(event: any): void {
    const query = event.target.value;
    if (query.length >= 3) {
      this.projectName = query;
      this.fetchProjects();
      this.getAllBookingCharges();
    } else if (query.length == 0) {
      this.projectName = '';
      this.fetchProjects();
      this.getAllBookingCharges();
    }
  }

 
  handleSuccessResponse(response: any): void {
    console.log(response.message);
    this.toastrService.success('', response.message, {
      timeOut: TIME_OUT,
    });
  }
  handleErrorResponse(error: any): void {
    this.toastrService.error('', error.error.message, {
      timeOut: TIME_OUT,
    });
  }

  onSearchChargeName(chargeName: string) {
    if (
      chargeName.length >= searchTextLength ||
      chargeName.length === searchTextZero
    ) {
      this.chargeName = chargeName;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.getAllBookingCharges();
    }
  }
  // onSearch(customerName: string) {
  //   if (
  //     customerName.length >= searchTextLength ||
  //     customerName.length === searchTextZero
  //   ) {
  //     this.bookingName = customerName;
  //     this.pageIndex = PAGE_INDEX;
  //     this.paginator.firstPage();
  //     this.getAllBookingCharges();
  //   }
  // }

  addBookingForm() {
    this.router.navigate(['/layout/crm/booking'], {state: { isAdding: true },});
    
  }

  editApplicantInfo(bookingChargesDto: any) {
    this.fetchApplicantInfoById(bookingChargesDto.bookingId);
  }

  fetchApplicantInfoById(id: number) {
    this.applicationInfoService
      .getApplicantInfoById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (applicantInfoData) => {
          console.log(applicantInfoData);
          this.router.navigate(['/layout/crm/booking'], {
            state: {
              applicantInfoData: applicantInfoData,
              isAdding: false,
              activeStep: 'Charges Details'
            },
          });
        },
        error: (error) => {
          console.error(error);
          console.error('Error fetching applicantInfo plan  by id:', error);
        },
      });
  }


  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
     this.getAllBookingCharges();
  }
}
