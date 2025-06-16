import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import {
  PAGE_INDEX,
  PAGE_SIZE,
  pageSizeOptions,
  searchTextLength,
  searchTextZero,
  TIME_OUT,
  TOTAL_ITEMS,
} from 'src/app/Constants/CommanConstants/Comman';
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
  selector: 'app-sale-agreement-approval',
  templateUrl: './sale-agreement-approval.component.html',
  styleUrls: ['./sale-agreement-approval.component.css'],
})
export class SaleAgreementApprovalComponent implements OnInit {
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
  selectedBookingId: number = 0;
  isModalOpen: boolean = false;
  selectedFile: any;
  isSignedSaleAgreement: boolean = false;
  ismodifiedSaleAgreement: boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  fileTypeError: boolean=false;
  fileSizeDisplay: string='';
  constructor(
    private commonService: CommanService,
    private applicantInfoService: ApplicationInfoService,
    private router: Router,
    private applicationInfoService: ApplicationInfoService,
    private customerStageService: CustomerStageService,
    private approvalsService: ApprovalsService,
    private projectService: ProjectService,
    private unitService: UnitService,
    private loaderService: LoaderService,
    private toastrService: ToastrService
  ) {}
  ngOnInit(): void {
    this.setUserFromLocalStorage();
    this.getPendingApplicantDetails();
    this.fetchProjects();
  }

  private setUserFromLocalStorage(): void {
    const user = this.commonService.getUserFromLocalStorage();
    if (user) {
      this.organizationId = user.organizationId;
      this.userId = user.userId;
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
      .getPendingApplicantDetails(
        this.pageIndex,
        this.pageSize,
        this.userId,
        this.projectId,
        this.unitId,
        this.applicantName
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
    this.selectedBookingId = applicantInfo.bookingId;
    this.projectName = applicantInfo.projectName;
    this.unitName = applicantInfo.unitName;
    this.unitId = 0;

    this.isModelView = true;
  }
  handleApprovalStatus(status: string) {
    console.log('Status:', status, 'Remarks:', this.remarks);
    this.isSubmitted = true;
    if (!this.remarks) {
      return;
    }
    this.isModelView = false;
    this.unitId = 0;
    this.isSignedSaleAgreement = false;
    this.ismodifiedSaleAgreement = true;
    this.updateApprovalStatus(status);
    this.uploadsSaleAgreement();
     this.remarks = '';
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
          this.fetchUnits(this.projectId);
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
         // Extract the filename with extension from the URL (handles query params)
         fileName = decodedUrl.split('?')[0].split('/').pop() || '';
       }
       // fileName now contains the uploaded filename with extension
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
         const fileExtension = fileName.split('.').pop()?.toLowerCase();
         let mimeType = 'application/octet-stream'; // default fallback
    
         switch (fileExtension) {
           case 'pdf':
             mimeType = 'application/pdf';
             break;
           case 'jpg':
           case 'jpeg':
             mimeType = 'image/jpeg';
             break;
           case 'png':
             mimeType = 'image/png';
             break;
           case 'gif':
             mimeType = 'image/gif';
             break;
           case 'doc':
             mimeType = 'application/msword';
             break;
           case 'docx':
             mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
             break;
           case 'docm':
             mimeType = 'application/vnd.ms-word.document.macroEnabled.12';
             break;
         }
         if (["doc", "docx", "docm"].includes(fileExtension || "")) {
           Swal.fire({
             title: 'Preview Not Supported',
             text: 'Word documents cannot be previewed in the browser. The file will be downloaded instead.',
             icon: 'info',
             confirmButtonText: 'Download',
             allowOutsideClick: true, // allow closing by clicking outside
           }).then((result) => {
             if (result.isConfirmed) {
               const blob = new Blob([response], { type: mimeType });
               const url = window.URL.createObjectURL(blob);
               const link = document.createElement('a');
               link.href = url;
               link.download = fileName;
               link.click();
               window.URL.revokeObjectURL(url);
             }
             // If dismissed (clicked outside or pressed Esc), do nothing
           });
           return;
         }
    
         // For PDF and images, open in new tab
         const blob = new Blob([response], { type: mimeType });
         const url = window.URL.createObjectURL(blob);
         window.open(url);
       }
  // openUploadModalForModifiedSaleAgreement(applicationInfo: any) {
  //   console.log(applicationInfo);
  //   this.selectedBookingId = applicationInfo.bookingId;
  //   this.projectName = applicationInfo.projectName;
  //   this.unitName = applicationInfo.unitName;
  //   this.unitId = 0;
  //   this.isModalOpen = true;
  //   this.isSignedSaleAgreement = false;
  //   this.ismodifiedSaleAgreement = true;
  // }

  uploadsSaleAgreement(): void {
    this.showLoading();
    console.log('Selected file:', this.selectedFile);
    console.log('Booking ID:', this.selectedBookingId);

    if (!this.selectedFile) {
      console.warn('No file selected for upload.');
    }

    const fileName = this.projectName + '_' + this.unitName;
    const validBookingId = this.selectedBookingId ?? 0;
    console.log(validBookingId);
    this.applicationInfoService
      .uploadSaleAgreement(
        validBookingId,
        this.selectedFile,
        fileName,
        this.isSignedSaleAgreement,
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          console.log(response);
          this.hideLoading();
          this.closeModal();
          // this.handleSuccessResponse(response);
          this.getPendingApplicantDetails();
        },
        error: (error: any) => {
          this.hideLoading();
          console.error(error);
          Swal.fire('Error', error.error, 'error');
        },
      });
  }
  closeModal() {
    this.unitName = '';
    this.projectName = '';
    this.isModalOpen = false;
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

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.selectedFile = null; // ✅ Reset to null
    this.fileTypeError = false;
    this.fileSizeDisplay = 'No file chosen';

    if (input && input.files && input.files.length > 0) {
      const file = input.files[0];

      // Optional: Check file size or type here
      if (file.size === 0) {
        console.warn('Empty file selected.');
        return;
      }

      this.selectedFile = file;
      this.fileSizeDisplay = file.name;
    }

    console.log('Selected File:', this.selectedFile);
  }
}
