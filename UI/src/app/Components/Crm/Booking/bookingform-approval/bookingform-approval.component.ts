import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PAGE_INDEX, PAGE_SIZE, pageSizeOptions, TOTAL_ITEMS } from 'src/app/Constants/CommanConstants/Comman';
import { ApplicantInfo } from 'src/app/Models/Crm/ApplicantInfo';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { ApplicationInfoService } from 'src/app/Services/CrmServices/applicant-info.service';

@Component({
  selector: 'app-bookingform-approval',
  templateUrl: './bookingform-approval.component.html',
  styleUrls: ['./bookingform-approval.component.css'],
})
export class BookingformApprovalComponent implements OnInit {
  organizationId: number = 0;
  userId: number = 0;
   totalItems: number = TOTAL_ITEMS;
    pageSize: number = PAGE_SIZE;
    pageIndex: number = PAGE_INDEX;
    pageSizeOptions = pageSizeOptions;
    applicantInfoDetails:ApplicantInfo[]=[]
    destroy$ = new Subject<void>();
    displayedColumns: string[] = [
      'rowNumber',
      'customerName',
      'customerPhoneNumber',
      'createdDate',
      'projectName',
      'unitName',
      'approvalStatus',
      'actionsBy',
      'actions'
    ];
  constructor(private commonService: CommanService,
    private applicantInfoService:ApplicationInfoService,
     private router: Router,
     private applicationInfoService: ApplicationInfoService,
  ) {}
  ngOnInit(): void {
    this.setUserFromLocalStorage();
    this.getPendingApplicantDetails();
  }

  private setUserFromLocalStorage(): void {
    const user = this.commonService.getUserFromLocalStorage();
    if (user) {
      this.organizationId = user.organizationId;
      this.userId = user.userId;
    }
  }
  getPendingApplicantDetails(){
    this.applicantInfoService.getPendingApplicantDetails(this.pageIndex,this.pageSize,this.userId)
    .subscribe({
      next: (response) => {
        console.log(response);
        this.applicantInfoDetails = response.records;
        console.log(this.applicantInfoDetails);
        this.totalItems = response.totalRecords;
      },
      error: (error: Error) => {
        console.log(error);
      },
    });

  }
  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getPendingApplicantDetails();
  }
  goToBookingForm(event:any){
    this.fetchApplicantInfoById(event.bookingId);
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
                activeStep: 'Unit Details',
              },
            });
          },
          error: (error) => {
            console.error(error);
            console.error('Error fetching applicantInfo plan  by id:', error);
          },
        });
    }
  
}
