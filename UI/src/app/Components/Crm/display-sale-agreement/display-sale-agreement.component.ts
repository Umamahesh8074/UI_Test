import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { LOGIN } from 'src/app/Apis/UserApis/User';
import {
  COMPANY_TYPE,
  PAGE_INDEX,
  PAGE_SIZE,
  pageSizeOptions,
  searchTextLength,
  searchTextZero,
  TIME_OUT,
  TOTAL_ITEMS,
} from 'src/app/Constants/CommanConstants/Comman';
import {
  CRM_MEMBER_ROLL_NAME,
  SALE_AGREEMENT_STATUS,
  STAGE_STATUS,
  TRANSACTION_TYPE,
  TRANSACTION_TYPE_PAYMENT,
  USER_MANAGE_CRM,
  USER_MANAGE_TYPE,
} from 'src/app/Constants/Crm/CrmConstants';
import { IBlock } from 'src/app/Models/Block/block';
import { CommonReferenceType } from 'src/app/Models/CommanModel/menuDto';
import {
  ApplicantInfo,
  IApplicantInfoDto,
} from 'src/app/Models/Crm/ApplicantInfo';
import { IProject } from 'src/app/Models/Project/project';
import { Unit } from 'src/app/Models/Project/unit';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';
import { IUserManageDto } from 'src/app/Models/User/UserManage';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { ApplicationInfoService } from 'src/app/Services/CrmServices/applicant-info.service';
import { CustomerStageService } from 'src/app/Services/CrmServices/customer-stages.service';
import { BlockService } from 'src/app/Services/ProjectService/Block/block.service';
import { PaymentPlanService } from 'src/app/Services/ProjectService/PaymentPlan/paymentPlan.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { StageService } from 'src/app/Services/ProjectService/Stage/stage.service';
import { UnitService } from 'src/app/Services/ProjectService/Unit/unit.service';
import { UsermanageService } from 'src/app/Services/UserManageService/usermanage.service';
import { CommonreferencedetailsService } from 'src/app/Services/UserService/commonreferencedetails.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-display-sale-agreement',
  templateUrl: './display-sale-agreement.component.html',
  styleUrls: ['./display-sale-agreement.component.css'],
})
export class DisplaySaleAgreementComponent {
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
    'projectName',
    'unitName',
    'landOwnerOrBuilder',
    'bookingDate',
    'finalPrice',
    'receivedAmount',
    'approvedStatus',
    'actions',
  ];
  isModelView: boolean = false;
  workFlowTypeId: number = 0;
  bookingId: number = 0;
  remarks: any;
  projectName: string = '';
  // projects: Project[] = [];
  units: Unit[] = [];
  projectId: any[] = [];
  // project: any = new FormControl([] as IProject[]);
  unit: FormControl = new FormControl([] as Unit[]);
  unitName: any;
  selectedUnitName: any;
  unitId: any = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  applicantName: string = '';
  applicantInfoData: IApplicantInfoDto[] = [];
  planId: any = [];
  totalPages: number = 0;
  selectedBookingId: number = 0;
  isModalOpen: boolean = false;
  selectedFile: File = new File([''], 'default.txt', { type: 'text/plain' });
  actionStatusNames: CommonReferenceType[] = [];
  selectedStatus: CommonReferenceType = new CommonReferenceType();
  actionStatusId: number = 0;
  paymentStatusName: string | undefined;
  test = 'Created';
  typeCommonReferenceDetailsId: number = 0;
  userManageData: any;
  roleName: string = '';
  crmMemberRollName = CRM_MEMBER_ROLL_NAME;
  isSignedSaleAgreement: boolean = false;
  typeId: number = 0;
  companyType: any;
  project: any = new FormControl([] as IUserManageDto[]);
  @ViewChild('allProjectSelected') private allProjectSelected?: any;
  @ViewChild('allBlockSelected') private allBlockSelected?: MatCheckbox;
  selectedprojectIds: number[] = [];
  selectedUserManageIds: number[] = [];
  selectedBlockIds: any;
  fromComponent: boolean = false;
  selectedUserManages: any[] = [];
  userManageprojects: any[] = [];
  selectedBlocks: any[] = [];
  blockId: any = [];
  blocks: any[] = [];
  block: any = new FormControl([] as IBlock[]);
  blockName: string = '';
  transactionData: Map<string, CommonReferenceDetails> = new Map();
  transactionTypeAsPayment: CommonReferenceDetails =
    new CommonReferenceDetails();
  paymentTransactionTypeId: number = 0;
  stageId: any = [];
  constructor(
    private commonService: CommanService,
    private router: Router,
    private applicationInfoService: ApplicationInfoService,
    private customerStageService: CustomerStageService,
    private projectService: ProjectService,
    private unitService: UnitService,
    private loaderService: LoaderService,
    private toastrService: ToastrService,
    private usermanageService: UsermanageService,
    private blockService: BlockService,
    private commonRefDetailsService: CommonreferencedetailsService,
    private paymentPlanService: PaymentPlanService,
    private stageService: StageService
  ) {}
  ngOnInit(): void {
    this.setUserFromLocalStorage();
    this.getCompanyTypes();
    // if (CRM_MEMBER_ROLL_NAME.includes(this.roleName)) {
    //   this.getUsermanageByUserId();
    // } else {
    //   this.fetchProjects();
    // }
    this.getUserManageTypes();
    this.getDataFromState();
    this.getActionStatus();
    // this.getAllApplicantInfos();
  }

  private setUserFromLocalStorage(): void {
    const user = this.commonService.getUserFromLocalStorage();
    if (user) {
      this.organizationId = user.organizationId;
      this.userId = user.userId;
      this.roleName = user.roleName;
    }
  }
  private getDataFromState() {
    const state = history.state;
    if (history.state.actionStatus) {
      console.log(history.state.actionStatus);
      this.selectedStatus = history.state.actionStatus;
      console.log(this.selectedStatus);
      this.actionStatusId = history.state.actionStatus.id;
      console.log(this.actionStatusId);
      if (history.state.typeId) {
        this.typeId = history.state.typeId;
      }
    }
    this.stageId = history.state.stageId;
    this.projectId = history.state.projectId;
    this.blockId = history.state.blockId;
    this.planId = history.state.planId;
    this.selectedUserManageIds = history.state.selectedUserManageIds;
    this.typeCommonReferenceDetailsId =
      history.state.typeCommonReferenceDetailsId;
    this.fromComponent = history.state.fromComponent;
    this.paymentTransactionTypeId = history.state.paymentTransactionTypeId;
    console.log(this.blockId);
    if (this.selectedUserManageIds?.length > 0 && this.projectId?.length > 0) {
      this.patchStateProjectIds(
        this.selectedUserManageIds,
        this.projectId,
        this.typeCommonReferenceDetailsId
      );
    } else {
      this.fromComponent = false;
      this.getUserManageTypes();
    }
    if (this.blockId?.length > 0) {
      this.patchStateBlockIds(this.blockId);
    }
    this.getAllApplicantInfos();
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    // this.getAllApplicantInfos();
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
          console.log('PDF file received:', response);
          this.hideLoading();
          this.downloadFile(response, fileName);

          Swal.fire({
            title: 'Downloaded',
            text: 'Your Sale Agreeement has been downloaded successfully!',
            icon: 'success',
            confirmButtonText: 'OK',
          });
        },
        error: (error: Error) => {
          console.error('Error downloading PDF:', error);
          this.hideLoading();
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

  displayProject(project: IProject): string {
    return project && project.projectName ? project.projectName : '';
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
  fetchUnits() {
    this.unitService
      .getAllUnitsBasedOnProjectId(this.projectId, this.unitName, this.blockId)
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

    this.getAllApplicantInfos();
  }
  displayUnit(unit: Unit): string {
    return unit && unit.unitName ? unit.unitName : '';
  }
  searchUnit(unit: any) {
    const query = unit.target.value;
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.unitName = query;
      this.fetchUnits();
    }
    if (query.length === searchTextZero) {
      this, (this.unitId = 0);
      this.getAllApplicantInfos();
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
      this.getAllApplicantInfos();
    }
  }
  getAllApplicantInfos() {
    this.showLoading();
    this.applicationInfoService
      .getAllApplicantInfoForSaleAgreements(
        this.pageIndex,
        this.pageSize,
        STAGE_STATUS,
        this.projectId,
        this.typeCommonReferenceDetailsId,
        this.applicantName,
        this.projectName,
        this.unitName,
        this.blockId,
        0,
        0,
        0,
        this.actionStatusId,
        this.typeId
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (applicantInfo) => {
          this.applicantInfoData = applicantInfo.records;
          this.totalItems = applicantInfo.totalRecords;
          this.hideLoading();
        },
        error: (error) => {
          console.log(error.error);
          this.hideLoading();
        },
      });
  }

  generateReport(applicantInfoData: any) {
    this.router.navigate(['/layout/crm/generatesalesaggrement'], {
      state: {
        id: applicantInfoData.unitId,
        projectId: applicantInfoData.projectId,
      },
    });
  }

  CheckIfSalesAgreementGenerated(
    id: number,
    projectId: number,
    unitName: string
  ): void {
    this.projectService
      .getAllGeneratedAgreement(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (isAgreementGenerated: boolean) => {
          if (isAgreementGenerated) {
            this.downloadSalesAgreement(id, projectId, unitName);
          } else {
            this.router.navigate(['/layout/crm/generatesalesaggrement'], {
              state: {
                id,
                projectId,
              },
            });
          }
        },
        error: (err: Error) => {
          console.error('Error checking sales agreement generation:', err);
        },
      });
  }
  downloadSalesAgreement(id: number, projectId: number, unitName: string) {
    // Show the SweetAlert confirmation dialog
    Swal.fire({
      text: 'Sales Agreement Already Generated. Do you want to download?',
      showCancelButton: true, // Show "Cancel" button
      confirmButtonText: 'Download PDF',
      cancelButtonText: 'Download DOCX',
      denyButtonText: 'No, thanks',
      showDenyButton: true, // Add "Deny" button
      reverseButtons: true, // Optional: make the "Yes" button appear on the left
      customClass: {
        popup: 'small-popup', // Add custom class for smaller popup
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // User selected PDF download
        this.downloadFiles(id, projectId, unitName, 'pdf');
      } else if (result.isDenied) {
        // User clicked "No, thanks"
        console.log('User declined to download the file');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // User selected DOCX download
        this.downloadFiles(id, projectId, unitName, 'docx');
      }
    });
  }

  private downloadFiles(
    id: number,
    projectId: number,
    unitName: string,
    fileType: string
  ) {
    this.projectService
      .downloadSalesAgreementPdfOrDocx(id, projectId, unitName, fileType)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          // Ensure the response is treated as a Blob for file handling
          const fileExtension =
            fileType.toLowerCase() === 'pdf' ? '.pdf' : '.docx';
          const fileURL = window.URL.createObjectURL(response); // Create a Blob URL
          const link = document.createElement('a'); // Create a link element
          link.href = fileURL; // Set the href to the Blob URL
          link.download = unitName + ' Sales Agreement' + fileExtension; // Set the filename
          link.click(); // Trigger the download
          window.URL.revokeObjectURL(fileURL); // Cleanup the Blob URL
        },
        error: (error: Error) => {
          console.error('Error downloading sales agreement:', error);
        },
      });
  }
  openUploadModal(applicationInfo: any) {
    console.log(applicationInfo);
    this.selectedBookingId = applicationInfo.bookingId;
    this.projectName = applicationInfo.projectName;
    this.unitName = applicationInfo.unitName;
    this.unitId = 0;
    this.isModalOpen = true;
    this.isSignedSaleAgreement = false;
  }
  openUploadModalForSignedSaleAgreement(applicationInfo: any) {
    console.log(applicationInfo);
    this.selectedBookingId = applicationInfo.bookingId;
    this.projectName = applicationInfo.projectName;
    this.unitName = applicationInfo.unitName;
    this.unitId = 0;
    this.isModalOpen = true;
    this.isSignedSaleAgreement = true;
  }

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
        this.isSignedSaleAgreement
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          console.log(response);
          this.hideLoading();
          this.closeModal();
          this.handleSuccessResponse(response);
          this.getAllApplicantInfos();
        },
        error: (error: any) => {
          this.hideLoading();
          console.error(error);
          Swal.fire('Error', error.error, 'error');
        },
      });
  }

  fileSizeDisplay: string = 'No file chosen'; // Display file information
  fileTypeError: boolean = false; // Error flag for invalid file type

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement; // Get the input element
    this.selectedFile = new File([''], 'default.txt', { type: 'text/plain' }); // Reset the selected file
    this.fileTypeError = false; // Reset the error flag

    if (input && input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFile = file;
    } else {
      this.fileSizeDisplay = 'No file chosen';
    }

    console.log('Selected File:', this.selectedFile);
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
  sendForApproval(applicantInfo: any) {
    this.showLoading();
    console.log(applicantInfo);
    this.applicationInfoService
      .moveSaleAgreementToWorkFlow(applicantInfo.bookingId, this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.hideLoading();
          Swal.fire('Success', response.message, 'success');
          this.getAllApplicantInfos();
        },
        error: (error: Error) => {
          this.hideLoading();
          console.log(error);
        },
      });
  }
  sendForApprovalAfterRework(applicantInfo: any) {
    this.showLoading();
    console.log(applicantInfo);
    this.applicationInfoService
      .moveSaleAgreementAfterWorkFlow(applicantInfo.bookingId, this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.hideLoading();
          Swal.fire('Success', response.message, 'success');
          this.getAllApplicantInfos();
        },
        error: (error: Error) => {
          this.hideLoading();
          console.log(error);
        },
      });
  }
  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }
  closeModal() {
    this.unitName = '';
    this.projectName = '';
    this.isModalOpen = false;
  }
  getActionStatus() {
    this.commonService
      .getCommanReferanceDetailsWithFilters(
        SALE_AGREEMENT_STATUS,
        this.paymentStatusName
      )
      .subscribe({
        next: (data) => {
          console.log(data);
          this.actionStatusNames = data;
          console.log(this.actionStatusNames);
        },
        error: (error: any) => {
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
  }
  onStatusChange(event: any): void {
    console.log(event);
    console.log(event.value.id);
    if (event.value.commonRefValue === 'All') {
      let val = 0;
      this.actionStatusId = 0;
    } else {
      this.actionStatusId = event.value;
    }
    this.pageIndex = PAGE_INDEX;
    this.paginator.firstPage();
    this.getAllApplicantInfos();
  }

  private getUsermanageByUserId(): void {
    console.log(this.userId);
    this.usermanageService.getUserManage(this.userId).subscribe({
      next: (response) => {
        console.log('User manage data:', response);
        this.userManageData = response;
        this.projectId = response[0].projectId;
        console.log(this.projectId);
        this.getAllApplicantInfos();
        this.fetchUnits();
      },

      error: (err) => {
        // Handle the error here
        console.error('Error fetching user manage data:', err);
      },
    });
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
  onUnitTypeBelongsChange(event: any) {
    console.log(event);
    if (event.value === 'All') {
      let val = 0;
      this.typeId = val;
    } else {
      this.typeId = event.value;
    }
    this.pageIndex = PAGE_INDEX;
    this.getAllApplicantInfos();
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
  goBack() {
    const stateData = {
      stageId: this.stageId,
      blockId: this.blockId,
      planId: this.planId,
      projectId: this.selectedprojectIds,
      selectedUserManageIds: this.selectedUserManageIds,
      typeCommonReferenceDetailsId: this.typeCommonReferenceDetailsId,
      fromComponent: true,
      typeId: this.typeId,
      paymentTransactionTypeId: this.paymentTransactionTypeId,
    };
    console.log(stateData);
    this.router.navigate(['layout/crm/crmuser/dashboard'], {
      state: stateData,
    });
  }
  searchProject(event: any): void {
    if (event.target.value.length >= 3) {
      this.projectName = event.target.value;
    } else if (event.target.value.length === 0) {
      this.projectName = '';
      this.projectId = [];
    }
  }
  onAllSelectProject() {
    console.log(this.allProjectSelected.checked);
    // this.allProjectChecked=this.allProjectSelected.checked
    if (this.allProjectSelected.checked) {
      this.selectedprojectIds = this.userManageprojects.map(
        (p: any) => p.projectId,
        0
      );
      this.selectedUserManageIds = this.userManageprojects.map(
        (p: any) => p.id,
        0
      );
      this.displayProjectNames();
    } else {
      this.selectedprojectIds = [];
      this.selectedBlockIds = [];
      this.selectedUserManageIds = [];
      this.blockId = this.selectedBlockIds;
    }
  }
  displayProjectNames() {
    console.log(this.selectedprojectIds);
    this.usermanageService
      .fetchProjectsBasedOnUserId(
        this.userId,
        this.typeCommonReferenceDetailsId,
        '',
        '',
        this.selectedprojectIds
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (projects: any) => {
          console.log(projects);
          console.log(this.selectedprojectIds);
          console.log(this.userManageprojects);
          this.userManageprojects = this.sortProject(
            this.userManageprojects,
            this.selectedprojectIds
          );
          const selectedNames = projects
            .map((project: any) => project.projectName)
            .join(', ');
          console.log(selectedNames);
          this.project.patchValue(selectedNames);
        },
      });
  }
  sortProject(projects: any[], selectedprojectIds: any): any[] {
    return projects.sort((a, b) => {
      const aSelected = selectedprojectIds.includes(a.projectId);
      const bSelected = selectedprojectIds.includes(b.projectId);
      // Place selected items first, then unselected items
      return aSelected === bSelected ? 0 : aSelected ? -1 : 1;
    });
  }
  isProjectAllSelected(): boolean {
    const allProjectIds = this.userManageprojects.map((p) => p.projectId);
    return (
      Array.isArray(this.selectedprojectIds) &&
      allProjectIds.length > 0 &&
      allProjectIds.every((id) => this.selectedprojectIds.includes(id))
    );
  }
  isSelectedProject(projectId?: number, id?: number): boolean {
    return this.selectedprojectIds?.includes(projectId ? projectId : 0);
  }
  onProjectSelect(umproject: any, event: any) {
    this.project.patchValue('');
    const selectedProject = umproject.projectId;
    const selectedUserManageId = umproject.id;
    if (event.checked) {
      if (!this.selectedprojectIds) this.selectedprojectIds = [];
      if (!this.selectedUserManageIds) this.selectedUserManageIds = [];
      if (!this.selectedprojectIds.includes(selectedProject)) {
        this.selectedprojectIds.push(selectedProject);
      }
      if (!this.selectedUserManageIds.includes(selectedUserManageId)) {
        this.selectedUserManageIds.push(selectedUserManageId);
      }
      this.displayProjectNames();
    } else {
      this.selectedprojectIds = this.selectedprojectIds?.filter(
        (projectId: any) => projectId !== selectedProject
      );
      this.selectedUserManageIds = this.selectedUserManageIds?.filter(
        (id: any) => id !== selectedUserManageId
      );
      // --- Deselect related blocks ---
      let relatedBlockIds: number[] = [];
      if (this.selectedBlockIds?.length > 0) {
        relatedBlockIds = this.selectedBlocks
          .filter((b) => b.projectId === selectedProject)
          .map((b) => b.id);

        this.selectedBlockIds = this.selectedBlockIds.filter(
          (id: any) => !relatedBlockIds.includes(id)
        );
        this.selectedBlocks = this.selectedBlocks.filter((block) =>
          this.selectedBlockIds.includes(block.id)
        );
        this.blockId = [...this.selectedBlockIds];
        const selectedNames = this.selectedBlocks
          .map((block: any) => block.name + ' ( ' + block.projectCode + ' )')
          .join(', ');
        this.block.patchValue(selectedNames);
      }
      // If no blocks left, set blockId to empty array
      if (!this.selectedBlockIds || this.selectedBlockIds.length === 0) {
        this.blockId = [];
      }
      // --- Deselect related payment plans and stages for the deselected project ---
      if (this.planId?.length > 0) {
        this.paymentPlanService
          .getAllPaymentPlansByProjectId([selectedProject], [])
          .subscribe((removedProjectPlans: any[]) => {
            const removedPlanIds = removedProjectPlans.map((plan) => plan.id);
            // Remove those planIds from planId array
            if (Array.isArray(this.planId)) {
              this.planId = this.planId.filter(
                (id: any) => !removedPlanIds.includes(id)
              );
            } else if (this.planId && removedPlanIds.includes(this.planId)) {
              this.planId = [];
            }
            // Remove related stages for the removed planIds
            if (removedPlanIds.length > 0 && this.stageId?.length > 0) {
              this.stageService
                .getStages(
                  '',
                  [selectedProject],
                  removedPlanIds,
                  '',
                  this.stageId
                )
                .subscribe((removedStages: any[]) => {
                  const removedStageIds = removedStages.map(
                    (stage) => stage.stageId
                  );
                  if (Array.isArray(this.stageId)) {
                    this.stageId = this.stageId.filter(
                      (id: any) => !removedStageIds.includes(id)
                    );
                  } else if (
                    this.stageId &&
                    removedStageIds.includes(this.stageId)
                  ) {
                    this.stageId = [];
                  }
                });
            }
          });
      }
      if (this.selectedprojectIds?.length > 0) {
        this.displayProjectNames();
      } else if (this.selectedprojectIds?.length == 0) {
        this.project.patchValue('');
      }
    }
    this.projectId = this.selectedprojectIds;
  }
  onProjectSelectButtonClick() {
    this.projectId = this.selectedprojectIds;
    if (this.projectId.length > 0) {
      this.fetchBlocks();
      this.getAllApplicantInfos();
    } else {
      this.block.setValue(null);
      this.blocks = [];
      this.unit.setValue(null);
      this.unitId = [];
      this.fromComponent = false;
      this.getAllApplicantInfos();
    }
  }
  searchBlock(event: any): void {
    if (event.target.value.length >= 3) {
      this.blockName = event.target.value;
      this.fetchBlocks();
    } else if (event.target.value.length === 0) {
      this.blockName = '';
      this.blockId = 0;
    }
  }
  fetchBlocks() {
    this.blockService
      .fetchBlocksByBlockIds(this.selectedprojectIds, '', this.blockName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blocks) => {
          this.blocks = blocks;
          console.log(this.blocks);
          if (this.selectedBlockIds?.length > 0) {
            this.selectedBlocks = this.blocks.filter((block) =>
              this.selectedBlockIds.includes(block.id)
            );
            this.blocks = this.sortBlock(this.blocks, this.selectedBlockIds);
            const selectedNames = this.selectedBlocks
              .map(
                (block: any) => block.name + ' ( ' + block.projectCode + ' )'
              )
              .join(', ');
            console.log(selectedNames);
            console.log(this.blocks);
            this.block.patchValue(selectedNames);
          } else {
            this.block.setValue(null);
          }
        },
        error: (error: Error) => {
          console.error('Error fetching blocks:', error);
        },
      });
  }
  sortBlock(block: any[], selectedBlockIds: any): any[] {
    return block.sort((a, b) => {
      const aSelected = selectedBlockIds.includes(a.id);
      const bSelected = selectedBlockIds.includes(b.id);
      return aSelected === bSelected ? 0 : aSelected ? -1 : 1;
    });
  }
  onAllSelectBlock() {
    if (this.allBlockSelected?.checked) {
      this.selectedBlockIds = (this.blocks || []).map((p: any) => p.id);
      this.displayBlockNames();
    } else {
      this.selectedBlockIds = [];
    }
  }
  isBlockAllSelected(): boolean {
    const allBlockIds = this.blocks.map((b) => b.id);
    return (
      Array.isArray(this.selectedBlockIds) &&
      allBlockIds.length > 0 &&
      allBlockIds.every((id: any) => this.selectedBlockIds.includes(id))
    );
  }
  isSelectedBlock(blockId?: number): boolean {
    return blockId != null && this.selectedBlockIds?.includes(blockId);
  }
  displayBlockNames() {
    this.blockService
      .fetchBlocksByBlockIds(this.selectedprojectIds, this.selectedBlockIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blocks: any) => {
          console.log(blocks);
          this.blocks = this.sortBlock(this.blocks, this.selectedBlockIds);
          const selectedNames = blocks
            .map((block: any) => block.name + ' ( ' + block.projectCode + ' )')
            .join(', ');
          console.log(selectedNames);
          this.block.patchValue(selectedNames);
        },
      });
  }
  onBlockSelect(block: any, event: any) {
    this.block.patchValue('');
    const selectedBlock = block.id;
    if (event.checked) {
      if (!this.selectedBlockIds) this.selectedBlockIds = [];
      if (!this.selectedBlocks) this.selectedBlocks = [];
      if (!this.selectedBlockIds.includes(selectedBlock)) {
        this.selectedBlockIds.push(selectedBlock);
        this.selectedBlocks.push(block);
      }
      this.displayBlockNames();
    } else {
      this.selectedBlockIds = this.selectedBlockIds?.filter(
        (id: any) => id !== selectedBlock
      );
      this.selectedBlocks = this.selectedBlocks?.filter(
        (b: any) => b.id !== selectedBlock
      );
      if (this.selectedBlockIds?.length > 0) {
        this.displayBlockNames();
      } else {
        this.block.patchValue('');
      }
      // Always remove related payment plans and stages for the deselected block
      if (this.planId?.length > 0) {
        this.paymentPlanService
          .getAllPaymentPlansByProjectId(this.selectedprojectIds, [
            selectedBlock,
          ])
          .subscribe((removedBlockPlans: any[]) => {
            const removedPlanIds = removedBlockPlans.map((plan) => plan.id);
            // Remove those planIds from planId array
            if (Array.isArray(this.planId)) {
              this.planId = this.planId.filter(
                (id: any) => !removedPlanIds.includes(id)
              );
            } else if (this.planId && removedPlanIds.includes(this.planId)) {
              this.planId = [];
            }
            // Remove related stages for the removed planIds
            if (removedPlanIds.length > 0 && this.stageId?.length > 0) {
              this.stageService
                .getStages(
                  '',
                  this.selectedprojectIds,
                  removedPlanIds,
                  [selectedBlock],
                  this.stageId
                )
                .subscribe((removedStages: any[]) => {
                  const removedStageIds = removedStages.map(
                    (stage) => stage.stageId
                  );
                  if (Array.isArray(this.stageId)) {
                    this.stageId = this.stageId.filter(
                      (id: any) => !removedStageIds.includes(id)
                    );
                  } else if (
                    this.stageId &&
                    removedStageIds.includes(this.stageId)
                  ) {
                    this.stageId = [];
                  }
                });
            }
          });
      }
    }
  }
  onBlockSelectButtonClick() {
    this.blockId = this.selectedBlockIds;
    if (this.blockId.length > 0) {
      this.fetchUnits();
      this.getAllApplicantInfos();
    } else {
      this.unit.setValue(null);
      this.unitId = [];
      this.fromComponent = false;
      this.getAllApplicantInfos();
    }
  }

  getUserManageTypes() {
    this.commonService
      .getRefDetailsId(USER_MANAGE_TYPE, USER_MANAGE_CRM)
      .subscribe({
        next: (data) => {
          this.typeCommonReferenceDetailsId = data;
          this.fetchProjects();
        },
        error: (error: any) => {
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
  }
  fetchProjects() {
    this.usermanageService
      .fetchProjectsBasedOnUserId(
        this.userId,
        this.typeCommonReferenceDetailsId,
        '',
        ''
      )
      .subscribe({
        next: (userManegeProjects) => {
          console.log(userManegeProjects);
          this.userManageprojects = userManegeProjects;
          if (!this.fromComponent) {
            this.projectId = this.userManageprojects.map(
              (p: { projectId: any }) => p.projectId,
              0
            );
            this.getAllApplicantInfos();
          }
        },
        error: (error) => {
          console.error('Error fetching projects:', error);
        },
      });
  }
  patchStateProjectIds(
    selectedUserManageIds: number[],
    selectedProjectIds?: number[],
    typeCommonReferenceDetailsId: number = 0
  ): void {
    this.project.patchValue('');
    console.log(selectedUserManageIds);
    console.log(selectedProjectIds);
    console.log(typeCommonReferenceDetailsId);
    this.typeCommonReferenceDetailsId = typeCommonReferenceDetailsId ?? 0;

    this.usermanageService
      .fetchProjectsBasedOnUserId(
        this.userId,
        this.typeCommonReferenceDetailsId,
        '',
        selectedUserManageIds,
        selectedProjectIds
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (projects) => {
          console.log(projects);
          console.log(this.userManageprojects);
          this.userManageprojects = this.sortProject(
            projects,
            this.selectedprojectIds
          );
          const selectedNames = projects
            .map((project: IUserManageDto) => project.projectName)
            .join(', ');
          console.log(selectedNames);
          this.project.patchValue(selectedNames);
          this.selectedprojectIds = selectedProjectIds
            ? selectedProjectIds
            : [];
          this.projectId = this.selectedprojectIds;
          console.log(this.selectedprojectIds);
          this.fetchBlocks();
        },
      });
  }
  patchStateBlockIds(selectedBlockIds?: number[]): void {
    // this.block.patchValue('');
    this.selectedBlockIds = selectedBlockIds;
    console.log(this.selectedBlockIds);
    this.blockService
      .fetchBlocksByBlockIds(this.selectedprojectIds, this.selectedBlockIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blocks) => {
          console.log(blocks);
          this.blocks = this.sortProject(blocks, this.selectedBlockIds);
          const selectedNames = blocks
            .map((block: any) => block.name + ' ( ' + block.projectCode + ' )')
            .join(', ');
          console.log(selectedNames);
          this.block.patchValue(selectedNames);
          this.selectedBlockIds = selectedBlockIds;
          this.blockId = this.selectedBlockIds;
          console.log(this.selectedBlockIds);
          this.fetchUnits();
        },
      });
  }
  getTransactionType() {
    this.commonRefDetailsService.getTransactionType(TRANSACTION_TYPE).subscribe(
      (data) => {
        console.log('Transaction Data:', data);
        this.transactionData = new Map(Object.entries(data));
        console.log(this.transactionData);
        const transactionDetails = this.transactionData.get(
          TRANSACTION_TYPE_PAYMENT
        );
        if (transactionDetails) {
          this.transactionTypeAsPayment = transactionDetails;
          this.paymentTransactionTypeId = this.transactionTypeAsPayment.id;
          console.log(this.transactionTypeAsPayment);
          console.log(this.paymentTransactionTypeId);
          this.getAllApplicantInfos();
        } else {
          console.error(
            `No transaction details found for key: ${TRANSACTION_TYPE_PAYMENT}`
          );
        }
      },
      (error) => {
        console.error('Error fetching transaction type:', error);
      }
    );
  }
  // private cleanUpPlansAndStagesAfterBlockChange() {
  //   // 1. Get all valid plan IDs for the current selected blocks
  //   this.paymentPlanService
  //     .getAllPaymentPlansByProjectId(this.projectId, this.selectedBlockIds)
  //     .subscribe((paymentPlans: any[]) => {
  //       const validPlanIds = paymentPlans.map((plan) => plan.id);

  //       // 2. Remove planIds that are not in validPlanIds
  //       if (Array.isArray(this.planId)) {
  //         this.planId = this.planId.filter((id: any) =>
  //           validPlanIds.includes(id)
  //         );
  //       } else if (this.planId && !validPlanIds.includes(this.planId)) {
  //         this.planId = [];
  //       }
  //       console.log(this.planId);
  //       // 3. Get all valid stage IDs for the current valid plan IDs
  //       // this.blockService
  //       //   .fetchStagesByPaymentPlanIds(this.planId)
  //       //   .subscribe((stages: any[]) => {
  //       //     const validStageIds = stages.map((stage) => stage.id);

  //       //     // 4. Remove stageIds that are not in validStageIds
  //       //     if (Array.isArray(this.stageId)) {
  //       //       this.stageId = this.stageId.filter((id: any) =>
  //       //         validStageIds.includes(id)
  //       //       );
  //       //     } else if (this.stageId && !validStageIds.includes(this.stageId)) {
  //       //       this.stageId = [];
  //       //     }
  //       //   });
  //     });
  // }
}
