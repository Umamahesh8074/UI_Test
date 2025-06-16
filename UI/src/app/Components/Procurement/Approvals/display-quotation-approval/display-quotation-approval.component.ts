import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs';
import { ReusableComponent } from 'src/app/Comman-Components/base-component/base.component';
import {
  PAGE_INDEX,
  TOTAL_ITEMS,
  pageSizeOptions,
  searchTextLength,
  searchTextZero,
} from 'src/app/Constants/CommanConstants/Comman';
import { Project, IProject } from 'src/app/Models/Project/project';
import { IVendor, Vendor } from 'src/app/Models/WorkOrder/VendorData';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { QuotationService } from 'src/app/Services/ProcurementService/Quotation/quotation.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { vendorService } from 'src/app/Services/WorkOrderService/Vendor Data/vendor.service';

@Component({
  selector: 'app-quotation-approval',
  templateUrl: './display-quotation-approval.component.html',
  styleUrls: ['./display-quotation-approval.component.css'],
})
export class DisplayApprovalQuotationComponent
  extends ReusableComponent
  implements OnInit
{
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dateRange: any = '';
  customStartDate: any = '';
  customEndDate: any = '';
  projectId: number = 0;
  quotationCode: string = '';
  approvalQuotations: any[] = [];
  indentCode: string = '';
  stageOwnerName: string = '';

  projectName: string = '';
  projects: Project[] = [];
  project: any = new FormControl([] as IProject[]);
  selectedProject: IProject = new Project();

  vendors: IVendor[] = [];
  vendorName: string = '';
  vendorId: number = 0;
  vendor: any = new FormControl([] as IVendor[]);
  selectedVendor: IVendor = new Vendor();

  //documents pagination
  documentTotalItems: number = TOTAL_ITEMS;
  documentPageSize: number = 15;
  documentPageIndex: number = PAGE_INDEX;
  documentPageSizeOptions = pageSizeOptions;
  documentType: string = '';
  documents: any;
  noDocuments: boolean = true;
  openDialog: boolean | undefined;
  isQuotationDocuments: boolean = true;
  quotationId: number = 0;
  displayedColumnsDocuments = ['fileName', 'createdDate', 'status', 'actions'];

  displayedColumns: string[] = [
    'rowNumber',
    'quotationCode',
    'quotationCreatedDate',
    'projectName',
    'vendorName',
    'deliveryInDays',
    'code',
    'requiredDate',
    'totalCostWithGst',
    'totalCostWithOutGst',
    'stageOwner',
    'stageName',
    'status',
    'quotationType',
  ];
  customHeaderNames = {
    quotationCode: 'Quotation Code',
    quotationCreatedDate: 'Quotation Created Date',
    projectName: 'Project Name',
    vendorName: 'Vendor Name',
    deliveryInDays: 'Delivery In Days',
    code: 'Indent Code',
    requiredDate: 'Indent Required Date',
    totalCostWithGst: 'Total Cost',
    totalCostWithOutGst: 'Total Cost with Out Gst',
    stageOwner: 'Stage Owner',
    stageName: 'Stage Name',
    status: 'Status',
    quotationType: 'Quotation Type',
  };

  actionButtons: any[] = [
    { label: 'Quotation', icon: 'rule', action: 'approve' },
    { label: 'Supported Files', icon: ' attach_file', action: 'files' },
  ];
  pipes = {
    quotationCreatedDate: 'date',
    requiredDate: 'date',
    totalCost: 'currency',
    totalCostWithOutGst: 'currency',
    totalCostWithGst: 'currency',
  };

  ngOnInit(): void {
    this.initForm();
    this.getDataFromState();
    super.setUserFromLocalStorage();
    this.getApprovalQuotations();
    this.fetchProjects();
    this.fetchVendors();
  }
  constructor(
    router: Router,
    route: ActivatedRoute,
    commanService: CommanService,
    private quotationService: QuotationService,
    private vendorService: vendorService,
    private projectService: ProjectService,
    private formBuilder: FormBuilder,
    private loaderService: LoaderService
  ) {
    super(commanService, router, route);
  }

  getDataFromState() {
    const { displayPageData } = history.state;
    console.log(displayPageData);

    if (displayPageData) {
      const displayStatePageData = displayPageData;
      this.selectedProject = displayStatePageData.quotationSelectedProject;
      this.selectedVendor = displayStatePageData.quotationSelectedVendor;
      this.quotationCode = displayStatePageData.searchedQuotationCode;
      this.indentCode = displayStatePageData.searchedIndentCode;
      this.pageSize = displayStatePageData.quotationPageSize;
      this.pageIndex = displayStatePageData.quotationPageIndex;
      this.customStartDate = displayStatePageData.quotationCustomStartDate;
      this.customEndDate = displayStatePageData.quotationCustomEndDate;
      (this.stageOwnerName = displayStatePageData.stageOwner),
        this.patchFormValues();
    }
  }

  patchFormValues() {
    if (this.selectedProject) {
      this.project.patchValue(this.selectedProject);
      this.projectId = this.selectedProject.projectId;
    }
    if (this.selectedVendor) {
      this.vendor.patchValue(this.selectedVendor);
      this.vendorId = this.selectedVendor.id;
    }
    if (this.customStartDate) {
      this.formData.get('customStartDate')?.patchValue(this.customStartDate);
    }
    if (this.customEndDate) {
      this.formData.get('customEndDate')?.patchValue(this.customEndDate);
    }
  }

  getApprovalQuotations() {
    this.showLoading();
    this.quotationService
      .getApprovalQuotationsByUserId(
        this.userId,
        this.pageIndex,
        this.pageSize,
        this.quotationCode,
        this.projectId,
        this.customStartDate,
        this.customEndDate,
        this.vendorId,
        this.indentCode,
        this.stageOwnerName
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (approvalQuotationData) => {
          this.approvalQuotations = approvalQuotationData.records;
          if (this.paginator) {
            this.paginator.pageIndex = this.pageIndex;
            this.paginator.pageSize = this.pageSize;
          }
          this.totalItems = approvalQuotationData.totalRecords;
          this.hideLoading();
        },
        error: (error) => {
          console.error(error);
          this.hideLoading();
        },
      });
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getApprovalQuotations();
  }

  onActionClicked(event: any): void {
    const { action, row } = event;
    if (action === 'approve') {
      this.viewQuotation(row);
    } else if (action == 'files') {
      this.viewDownLoads(row, 'QUOTATION_DOCUMENTS');
    }
  }

  viewQuotation(row: any) {
    this.router.navigate(['./viewquotation'], {
      relativeTo: this.route.parent,
      state: {
        quotation: row,
        routeStatus: 'pending',
        displayPage: {
          quotationSelectedProject: this.selectedProject,
          quotationSelectedVendor: this.selectedVendor,
          searchedIndentCode: this.indentCode,
          searchedQuotationCode: this.quotationCode,
          quotationCustomStartDate: this.customStartDate,
          quotationCustomEndDate: this.customEndDate,
          quotationPageIndex: this.pageIndex,
          quotationPageSize: this.pageSize,
          stageOwner: this.stageOwnerName,
        },
      },
    });
  }
  onProjectSelect(event: any) {
    this.projectId = event.option.value.projectId;
    this.selectedProject = event.option.value;
    this.formData.patchValue({ projectId: this.projectId });
    this.getApprovalQuotations();
  }

  displayProject(project: any) {
    if (typeof project === 'number' && project != undefined) {
      const pro = this.projects.find((p) => p.projectId === project);
      return pro && pro.projectName;
    } else if (project != undefined) {
      return project && project.projectName ? project.projectName : '';
    }
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
  // fetchProjects = (): void => {
  //   this.projectService
  //     .getProjectsByOrgIdWithProjectFilter(
  //       this.organizationId,
  //       this.projectName
  //     )
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (projects: Project[]) => {
  //         const allOption = new Project();
  //         allOption.projectId = 0;
  //         allOption.displayProjectName = 'All';
  //         this.projects = [allOption, ...projects];
  //       },
  //       error: (error: Error) => {
  //         console.error('Error fetching projects:', error);
  //       },
  //     });
  // };

  fetchProjects() {
    this.projectService
      .getProjectsForPO(this.projectName, this.organizationId, this.userId)
      .subscribe({
        next: (projects) => {
          const allOption = new Project();
          allOption.projectId = 0;
          allOption.displayProjectName = 'All';
          this.projects = [allOption, ...projects];
        },
        error: (error: any) => {
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
  }
  get projectIdControl(): FormControl {
    return this.formData.get('projectId') as FormControl;
  }
  fetchVendors() {
    this.vendorService
      .getVendorCodesWithOutPage('', this.vendorName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (vendorCode) => {
          const allOption = new Vendor();
          allOption.id = 0;
          allOption.vendorName = 'All';
          this.vendors = [allOption, ...vendorCode];
        },
        error: (error: Error) => {
          console.error(error);
        },
      });
  }
  searchVendor(event: any) {
    const query = event.target.value;
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.vendorName = query;
      this.fetchVendors();
    }
  }

  onVendorSelect(event: any) {
    this.vendorId = event.option.value.id;
    this.selectedVendor = event.option.value;
    if (this.formData.get('vendorId')?.value !== this.vendorId) {
      this.formData.patchValue({ vendorId: this.vendorId });
    }
    this.getApprovalQuotations();
  }

  displayVendor(vendor: any) {
    if (typeof vendor === 'number' && vendor != undefined) {
      const selectedVendor = this.vendors.find((v) => v.id === vendor);
      return selectedVendor && selectedVendor.vendorName;
    } else if (vendor != undefined) {
      return vendor && vendor.vendorName ? vendor.vendorName : '';
    }
  }
  get vendorIdControl(): FormControl {
    return this.formData.get('vendorId') as FormControl;
  }
  onSearchQuotationCode(quotationCode: string) {
    if (
      quotationCode.length > searchTextLength ||
      quotationCode.length === searchTextZero
    ) {
      this.quotationCode = quotationCode;
      this.pageIndex = PAGE_INDEX;
      this.getApprovalQuotations();
    }
  }
  onDateChange() {
    this.pageIndex = 0;
    const startDate = this.formData.get('customStartDate')?.value;
    const endDate = this.formData.get('customEndDate')?.value;
    if (startDate !== null && endDate !== null) {
      this.dateRange = '';
      this.getApprovalQuotations();
    } else {
      this.dateRange = 0;
    }
  }

  private initForm(): void {
    this.formData = this.formBuilder.group({
      customStartDate: [],
      customEndDate: [],
    });
    this.formData.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((formDataValue) => {
        if (formDataValue.customStartDate && formDataValue.customEndDate) {
          const startDate = this.formatDateTime(formDataValue.customStartDate);
          const endDate = this.formatDateTime(
            formDataValue.customEndDate,
            true
          );
          this.customStartDate = startDate;
          this.customEndDate = endDate;
          this.getApprovalQuotations();
        }
      });
  }

  formatDateTime(date: Date, isEndDate: boolean = false): string {
    if (isEndDate) {
      date.setHours(23, 59, 59, 999);
    }
    return formatDate(date, 'yyyy-MM-ddTHH:mm:ss.SSSSSS', 'en-IN');
  }

  clearDateRange(): void {
    this.formData.get('customStartDate')?.setValue('');
    this.formData.get('customEndDate')?.setValue('');
    this.customStartDate = '';
    this.customEndDate = '';
    this.getApprovalQuotations();
  }
  onSearchIndentCode(indentCode: string) {
    if (
      indentCode.length > searchTextLength ||
      indentCode.length === searchTextZero
    ) {
      this.indentCode = indentCode;
      this.pageIndex = PAGE_INDEX;
      this.getApprovalQuotations();
    }
  }
  onSearchStageOwnerName(stageOwnerName: string) {
    if (
      stageOwnerName.length > searchTextLength ||
      stageOwnerName.length === searchTextZero
    ) {
      this.stageOwnerName = stageOwnerName;
      this.pageIndex = PAGE_INDEX;
      this.getApprovalQuotations();
    }
  }
  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }
  resetForm() {
    const project = new Project();
    project.projectId = 0;
    project.displayProjectName = 'All';
    this.project.reset(project);
    this.projectId = 0;

    const vendor = new Vendor();
    vendor.id = 0;
    vendor.vendorName = 'All';
    this.vendor.reset(vendor);
    this.vendorId = 0;

    this.formData.reset({
      customStartDate: null,
      customEndDate: null,
    });

    this.quotationCode = '';
    this.indentCode = '';
    this.stageOwnerName = '';
    this.customStartDate = null;
    this.customEndDate = null;
    this.selectedProject = new Project();
    this.selectedVendor = new Vendor();
    this.getApprovalQuotations();
  }

  viewDownLoads(quotation: any, documentType: string) {
    console.log(quotation);
    this.documentType = documentType;
    let quotationId;

    if (documentType == 'QUOTATION_DOCUMENTS') {
      this.isQuotationDocuments = true;
    } else {
      this.isQuotationDocuments = false;
    }
    if (quotation.quotationId) {
      this.quotationId = quotation.quotationId;
      quotationId = quotation.quotationId;
    } else {
      this.quotationId = quotation.quotationId;
      quotationId = quotation.quotationId;
    }

    if (quotationId) {
      this.getDocumentsBasedOnId(quotationId);
    }
  }

  getDocumentsBasedOnId(quotationId: number) {
    const documentType = this.documentType;
    this.commanService
      .getDocumentById(
        quotationId,
        documentType,
        this.documentPageIndex,
        this.documentPageSize
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.documents = response.records;
          console.log(response.records);
          this.documentTotalItems = response.totalRecords;
          if (this.documents && this.documents.length > 0) {
            this.openDialog = true;
            this.noDocuments = false;
          } else {
            this.noDocuments = true;
            this.openDialog = true;
          }
        },
        error: (error: Error) => {
          console.error(error);
        },
      });
  }

  downloadDocument(document: any) {
    const documentUrl = document;
    const decodedUrl = decodeURIComponent(documentUrl);
    let fileName = '';
    if (decodedUrl) {
      fileName =
        decodedUrl.split('?')[0].split('/').pop()?.split('.pdf')[0] ?? '';
    } else {
      fileName = 'Indent';
    }
    this.commanService
      .downLoadDoc(document)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: Blob) => {
          this.downloadFile(response, fileName);
        },
        error: (error: Error) => {
          console.error(error);
        },
      });
  }

  private downloadFile(data: Blob, filename: string): void {
    const url = window.URL.createObjectURL(data);
    // window.open(url);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    this.onClose();
  }

  onDocumentPageChange(event: any) {
    this.documentPageSize = event.pageSize;
    this.documentPageIndex = event.pageIndex;
    this.getDocumentsBasedOnId(this.quotationId);
  }

  viewDocument(document: any) {
    const documentUrl = document;
    const decodedUrl = decodeURIComponent(documentUrl);
    let fileName = '';
    if (decodedUrl) {
      fileName =
        decodedUrl.split('?')[0].split('/').pop()?.split('.pdf')[0] ?? '';
    } else {
      fileName = 'quotation';
    }
    this.commanService
      .downLoadDoc(document)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: Blob) => {
          this.viewFile(response, fileName);
        },
        error: (error: Error) => {
          console.error(error);
        },
      });
  }

  private viewFile(data: Blob, filename: string): void {
    const url = window.URL.createObjectURL(data);
    window.open(url);
  }

  onClose() {
    this.openDialog = false;
  }
}
