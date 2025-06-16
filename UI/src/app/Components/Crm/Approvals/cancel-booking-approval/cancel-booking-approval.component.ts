import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import {
  COMPANY_TYPE,
  PAGE_INDEX,
  PAGE_SIZE,
  pageSizeOptions,
  searchTextLength,
  searchTextZero,
  TOTAL_ITEMS,
} from 'src/app/Constants/CommanConstants/Comman';
import { CommonReferenceType } from 'src/app/Models/CommanModel/menuDto';
import { ApplicantInfo } from 'src/app/Models/Crm/ApplicantInfo';
import { Project, IProject } from 'src/app/Models/Project/project';
import { Unit } from 'src/app/Models/Project/unit';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { ApplicationInfoService } from 'src/app/Services/CrmServices/applicant-info.service';
import { CustomerStageService } from 'src/app/Services/CrmServices/customer-stages.service';
import { ApprovalsService } from 'src/app/Services/ProcurementService/Approvals/approvals.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { UnitService } from 'src/app/Services/ProjectService/Unit/unit.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cancel-booking-approval',
  templateUrl: './cancel-booking-approval.component.html',
  styleUrls: ['./cancel-booking-approval.component.css'],
})
export class CancelBookingApprovalComponent implements OnInit {
  applicantName: string = '';
  organizationId: number = 0;
  userId: number = 0;
  totalItems: number = TOTAL_ITEMS;
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  pageSizeOptions = pageSizeOptions;
  applicantInfoDetails: ApplicantInfo[] = [];
  destroy$ = new Subject<void>();
  displayedColumns: string[] = [
    'rowNumber',
    'customerName',
    'customerPhoneNumber',
    'createdDate',
    'projectName',
    'unitName',
    'approvalStatus',
    'stageOwner',
    'remarks',
    'companyType',
    'actions',
  ];
  isModelView: boolean = false;
  workFlowTypeId: number = 0;
  bookingId: number = 0;
  remarks: any;
  projectName: string = '';
  projects: Project[] = [];
  units: Unit[] = [];
  projectId: any;
  project: any = new FormControl([] as IProject[]);
  unit: FormControl = new FormControl([] as Unit[]);
  unitName: any;
  selectedUnitName: any;
  unitId: number = 0;
  isSubmitted: boolean = false;
  selectedStatus: string = 'All';
  typeId: number = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  status = [
    {
      id: 1,
      value: 'All',
    },
    {
      id: 4,
      value: 'Approved',
    },
    {
      id: 3,
      value: 'Rejected',
    },
    {
      id: 4,
      value: 'Pending',
    },
  ];
  companyType: any;
  constructor(
    private commonService: CommanService,
    private applicantInfoService: ApplicationInfoService,
    private router: Router,
    private applicationInfoService: ApplicationInfoService,
    private customerStageService: CustomerStageService,
    private approvalsService: ApprovalsService,
    private projectService: ProjectService,
    private unitService: UnitService,
    private loaderService: LoaderService
  ) {}
  ngOnInit(): void {
    this.setUserFromLocalStorage();

    this.fetchProjects();
    this.getCompanyTypes();
  }

  private setUserFromLocalStorage(): void {
    const user = this.commonService.getUserFromLocalStorage();
    if (user) {
      this.organizationId = user.organizationId;
      this.userId = user.userId;
      this.getPendingApplicantDetails();
    }
  }
  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getPendingApplicantDetails();
  }
  goToBookingForm(event: any) {
    // this.fetchApplicantInfoById(event.bookingId);
  }
  getPendingApplicantDetails() {
    this.showLoading();
    this.applicantInfoService
      .getPendingApplicantDetailsForCancelBooking(
        this.pageIndex,
        this.pageSize,
        this.userId,
        this.projectId,
        this.unitId,
        this.applicantName,
        this.selectedStatus,
        this.typeId
      )
      .subscribe({
        next: (response) => {
          this.hideLoading();
          console.log(response);
          this.applicantInfoDetails = response.records;
          console.log(this.applicantInfoDetails);
          this.totalItems = response.totalRecords;
        },
        error: (error: Error) => {
          this.hideLoading();
          console.log(error);
        },
      });
  }
  downloadUploadedSalesAgreement(filePath: string): void {
    this.showLoading();
    const decodedUrl = decodeURIComponent(filePath);
    let fileName = 'Sale Agreement'; // Default file name
    if (decodedUrl) {
      fileName =
        decodedUrl.split('?')[0].split('/').pop()?.split('.pdf')[0] || fileName;
    }
    this.customerStageService
      .generateDemandLetterPdf(filePath)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: Blob) => {
          this.hideLoading();
          console.log('PDF file received:', response);
          this.downloadFile(response, fileName);
          Swal.fire({
            title: 'Downloaded',
            text: 'Your Sale Agreeement has been downloaded successfully!',
            icon: 'success',
            confirmButtonText: 'OK',
          });
        },
        error: (error: Error) => {
          this.hideLoading();
          console.error('Error downloading PDF:', error);
          Swal.fire({
            title: 'Error',
            text: 'Failed to download the PDF. Please try again later.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        },
      });
  }

  downloadFile(response: Blob, fileName: string): void {
    const blob = new Blob([response], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  }
  goToApprovals(applicantInfo: any) {
    console.log(applicantInfo);
    this.workFlowTypeId = applicantInfo.workflowTypeId;
    this.bookingId = applicantInfo.bookingId;
    console.log(this.workFlowTypeId, this.bookingId);
    this.isModelView = true;
  }
  handleApprovalStatus(status: string) {
    console.log('Status:', status, 'Remarks:', this.remarks);
    this.isSubmitted = true;
    if (!this.remarks) {
      return;
    }
    this.isModelView = false;
    this.updateApprovalStatus(status);
    console.log('Remarks exist:', this.remarks);
  }

  updateApprovalStatus(status: string) {
    this.showLoading();
    console.log(
      this.bookingId,
      this.workFlowTypeId,
      this.userId,
      status,
      this.remarks
    );
    this.approvalsService
      .updateApprovalStatus(
        this.bookingId,
        this.workFlowTypeId,
        this.userId,
        status,
        this.remarks
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.hideLoading();
          console.log('updated successfully');
          this.getPendingApplicantDetails();
        },
        error: (err) => {
          this.hideLoading();
          console.error('Error updating Approvals', err);
        },
      });
  }
  onClose() {
    this.isModelView = false;
    this.remarks = '';
    // this.getPendingApplicantDetails();
  }
  resizeTextarea(event: any) {
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
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
          // this.fetchUnits(this.projectId);
        },
        error: (error: Error) => {
          console.error('Error fetching projects:', error);
        },
      });
  }
  onProjectSelect(event: any) {
    this.projectName = event.option.value.projectName;
    this.projectId = event.option.value.projectId;
    this.unit.setValue(null);
    this.unitId = 0;
    this.fetchUnits(this.projectId);
    this.getPendingApplicantDetails();
  }

  displayProject(project: IProject): string {
    return project && project.projectName ? project.projectName : '';
  }

  searchProject(event: any): void {
    const query = event.target.value;
    if (query.length >= 3) {
      this.projectName = query;
      this.fetchProjects();
    } else if (query.length == 0) {
      this.projectName = '';
      this.fetchProjects();
    }
  }

  getAllUnits(unitName: string) {
    this.unitService
      .getUnitByName(this.unitName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log(response.records);
          this.units = response;
          this.selectedUnitName = response[0];
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  fetchUnits(projectId: number) {
    this.unitService
      .getAllUnitsBasedOnProjectId(projectId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.units = data;
          console.log(data);
        },
        error: (error: Error) => {
          console.error('Error fetching units:', error);
        },
      });
  }
  onUnitSelect(event: any) {
    this.unitName = event.option.value.unitName;
    this.unitId = event.option.value.id;
    console.log(this.unitId);
    this.getPendingApplicantDetails();
  }
  displayUnit(unit: Unit): string {
    return unit && unit.unitName ? unit.unitName : '';
  }
  searchUnit(eventOrValue: any): void {
    console.log(eventOrValue);

    let query: string;
    if (eventOrValue instanceof Event) {
      const inputElement = eventOrValue.target as HTMLInputElement;
      query = inputElement.value;
      console.log(query);
    } else {
      query = eventOrValue;
      console.log(query);
    }
    if (query.length >= 1) {
      this.unitName = query;
      console.log(this.unitName);
      this.getAllUnits(this.unitName);
    } else if (query.length === 0) {
      this.unitName = '';
      this.getAllUnits(this.unitName);
    }
  }
  onSearchApplicantName(applicantName: string) {
    if (
      applicantName.length >= searchTextLength ||
      applicantName.length === searchTextZero
    ) {
      this.applicantName = applicantName;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.getPendingApplicantDetails();
    }
  }
  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }
  viewDocument(filePath: string) {
    this.showLoading();
    const documentUrl = filePath;
    const decodedUrl = decodeURIComponent(documentUrl);
    let fileName = '';
    if (decodedUrl) {
      fileName =
        decodedUrl.split('?')[0].split('/').pop()?.split('.pdf')[0] ?? '';
    } else {
      fileName = 'Demand Letter';
    }

    // Pass the filePath directly to the service method
    this.customerStageService
      .generateDemandLetterPdf(filePath)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: Blob) => {
          this.viewFile(response, fileName);
          this.hideLoading();
        },
        error: (error: Error) => {
          this.hideLoading();
          console.error('Error downloading PDF:', error);
        },
      });
  }
  viewFile(response: Blob, fileName: string) {
    const blob = new Blob([response], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  }
  getShortRemarks(description: string): string {
    if (!description) return '';
    const words = description.split(' ');
    return words.slice(0, 3).join(' ') + (words.length > 3 ? '...' : '');
  }
  onStatusChange(selectedValue: string): void {
    this.selectedStatus = selectedValue;
    this.getPendingApplicantDetails();
  }
  onUnitTypeBelongsChange(event: any) {
    console.log(event);
    if (event.value === 'All') {
      let val = 0;
      this.typeId = val;
    } else {
      this.typeId = event.value;
    }
    this.pageIndex = PAGE_INDEX;
    this.getPendingApplicantDetails();
  }

  getCompanyTypes() {
    this.commonService
      .getCommanReferanceDetailsWithFilters(COMPANY_TYPE)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.companyType = data;
          const allOption = new CommonReferenceType();
          allOption.id = 0;
          allOption.commonRefValue = 'All';
          this.companyType = [allOption, ...data];
          console.log(this.companyType);
          console.log(this.companyType);
        },
        error: (error: any) => {
          console.error('Error fetching Company Types :', error);
        },
      });
  }
  onSearch(customerName: string) {
    if (
      customerName.length >= searchTextLength ||
      customerName.length === searchTextZero
    ) {
      this.applicantName = customerName;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.getPendingApplicantDetails();
    }
  }
}
