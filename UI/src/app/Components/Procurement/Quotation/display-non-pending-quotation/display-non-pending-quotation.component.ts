import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { ReusableComponent } from 'src/app/Comman-Components/base-component/base.component';
import {
  PAGE_INDEX,
  TOTAL_ITEMS,
  pageSizeOptions,
  searchTextLength,
  searchTextZero,
} from 'src/app/Constants/CommanConstants/Comman';
import {
  Quotation,
  QuotationDto,
  QuotationItemDto,
} from 'src/app/Models/Procurement/quotation';
import { IProject, Project } from 'src/app/Models/Project/project';
import { IVendor, Vendor } from 'src/app/Models/WorkOrder/VendorData';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { QuotationService } from 'src/app/Services/ProcurementService/Quotation/quotation.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { vendorService } from 'src/app/Services/WorkOrderService/Vendor Data/vendor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-non-pending-quotations',
  templateUrl: './display-non-pending-quotation.component.html',
  styleUrls: ['./display-non-pending-quotation.component.css'],
  encapsulation: ViewEncapsulation.None, // Set ViewEncapsulation to None
})
export class DisplayNonPendingQuotationComponent
  extends ReusableComponent
  implements OnInit
{
  quotationData: QuotationDto[] = [];
  quotationItems: QuotationItemDto[] = [];
  indentId: number = 0;
  dateRange: any = '';
  customStartDate: any = '';
  customEndDate: any = '';
  selectedStatus: string = 'All';
  purchaseOrderCode: string = '';
  quotationDataForEdit: Quotation = new Quotation();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  projectId: number = 0;
  projectName: string = '';
  projects: Project[] = [];
  project: any = new FormControl([] as IProject[]);

  quotationCode: string = '';
  selectedProject: IProject = new Project();
  stageOwner: string = '';

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
    'projectName',
    'quotationCode',
    'quotationCreatedDate',
    'modifiedDate',
    'vendorName',
    'stageOwner',
    'totalCostWithOutGst',
    'totalCostWithGst',
    'status',
    'quotationType',
  ];

  customHeaderNames = {
    rowNumber: 'S.No',
    projectName: 'Project Name',
    quotationCode: 'Quotation Code',
    quotationCreatedDate: 'Quotation Created Date',
    modifiedDate: 'Updated Date',
    vendorName: 'Vendor Name',
    stageOwner: 'Stage Owner',
    totalCostWithOutGst: 'Total Cost With Out Gst',
    totalCostWithGst: 'Total Cost With Gst',
    status: 'Status',
    quotationType: 'Quotation Type',
  };

  actionButtons: any[] = [
    { label: 'Send For Approve', icon: 'send', action: 'send' },
    { label: 'Quotation', icon: 'rule', action: 'approve' },
    { label: 'Edit', icon: 'edit', action: 'edit' },
    { label: 'Supported Files', icon: ' attach_file', action: 'files' },
    // { label: 'Quotation PDF', icon: 'picture_as_pdf', action: 'pdf' },
  ];

  pipes = {
    quotationCreatedDate: 'date',
    totalCost: 'currency',
    modifiedDate: 'date',
    totalCostWithOutGst: 'currency',
    totalCostWithGst: 'currency',
  };

  ngOnInit(): void {
    this.initForm();
    super.setUserFromLocalStorage();
    this.getDataFromState();
    this.fetchProjects();
    this.fetchVendors();
    this.fetchNonPendingQuotations();
    this.quotationService.refreshRequired.subscribe(() => {
      this.fetchNonPendingQuotations();
    });
  }

  constructor(
    private quotationService: QuotationService,
    router: Router,
    route: ActivatedRoute,
    public dialog: MatDialog,
    commanService: CommanService,
    private formBuilder: FormBuilder,
    private projectService: ProjectService,
    private vendorService: vendorService,
    private loaderService: LoaderService
  ) {
    super(commanService, router, route);
  }

  getDataFromState() {
    const { quotation, displayPageData } = history.state;
    const { indentId } = history.state;
    if (quotation) {
      this.indentId = quotation.indentId;
    }
    if (indentId) {
      this.indentId = indentId;
    }
    if (displayPageData) {
      const displayStatePageData = displayPageData;
      this.selectedProject = displayStatePageData.quotationSelectedProject;
      this.selectedVendor = displayStatePageData.quotationSelectedVendor;
      this.quotationCode = displayStatePageData.searchedQuotationCode;
      this.pageSize = displayStatePageData.quotationPageSize;
      this.pageIndex = displayStatePageData.quotationPageIndex;
      this.customStartDate = displayStatePageData.quotationCustomStartDate;
      this.customEndDate = displayStatePageData.quotationCustomEndDate;
      (this.stageOwner = displayStatePageData.stageOwner),
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

  fetchNonPendingQuotations() {
    this.showLoading();
    this.quotationService
      .fetchNonPenidngQuotations(
        this.pageIndex,
        this.pageSize,
        this.quotationCode,
        this.projectId,
        this.vendorId,
        this.customStartDate,
        this.customEndDate,
        this.stageOwner,
        this.selectedStatus,
        this.userId
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (quotationData) => {
          this.quotationData = quotationData.records;
          if (this.paginator) {
            this.paginator.pageIndex = this.pageIndex;
            this.paginator.pageSize = this.pageSize;
          }
          this.totalItems = quotationData.totalRecords;
          this.hideLoading();
        },
        error: (error) => {
          console.error(error);
          this.hideLoading();
        },
      });
  }

  sendForApproval(quotation: QuotationDto) {
    this.showLoading();
    this.quotationService
      .moveQuotationToWorkFlow(quotation.quotationId, this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          Swal.fire('Success', response.message, 'success');
          this.hideLoading();
        },
        error: (error: Error) => {
          this.hideLoading();
        },
      });
  }

  sendForApprovalAferRework(quotationId: number) {
    this.showLoading();
    this.quotationService
      .moveQuotationToWorkFlowAfterRework(quotationId, 'Rework')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          Swal.fire('Success', response.message, 'success');
          this.hideLoading();
        },
        error: (error: Error) => {
          this.hideLoading();
        },
      });
  }

  onSearch(quotationCode: any) {
    if (
      quotationCode.length > searchTextLength ||
      quotationCode.length === searchTextZero
    ) {
      this.quotationCode = quotationCode;
      this.pageIndex = PAGE_INDEX;
      this.fetchNonPendingQuotations();
    }
  }
  onSearchStageOwner(stageOwner: any) {
    if (
      stageOwner.length > searchTextLength ||
      stageOwner.length === searchTextZero
    ) {
      this.stageOwner = stageOwner;
      this.pageIndex = PAGE_INDEX;
      this.fetchNonPendingQuotations();
    }
  }
  viewQuotation(row: any) {
    this.router.navigate(['./viewquotation'], {
      relativeTo: this.route.parent,
      state: {
        quotation: row,
        routeStatus: 'rework',
        status: 'ApprovedQuotation',
        displayPage: {
          quotationSelectedProject: this.selectedProject,
          quotationSelectedVendor: this.selectedVendor,
          searchedQuotationCode: this.quotationCode,
          quotationCustomStartDate: this.customStartDate,
          quotationCustomEndDate: this.customEndDate,
          quotationPageIndex: this.pageIndex,
          quotationPageSize: this.pageSize,
          stageOwner: this.stageOwner,
        },
      },
    });
  }

  onActionClicked(event: any): void {
    const { action, row } = event;
    if (action === 'approve') {
      this.viewQuotation(row);
    } else if (action === 'send') {
      if (row.status === 'Reworking') {
        this.sendForApprovalAferRework(row.quotationId);
      } else {
        this.sendForApproval(row);
      }
    } else if (action === 'edit') {
      this.getQuotationByQuotationId(row.quotationId);
    } else if (action == 'files') {
      this.viewDownLoads(row, 'QUOTATION_DOCUMENTS');
    }
  }

  //filter date code

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.fetchNonPendingQuotations();
  }
  getQuotationByQuotationId(quotationId: number) {
    this.quotationService
      .fetchQuotatiByQuotationId(quotationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.quotationDataForEdit = response;
          this.router.navigate(['./addquotation'], {
            relativeTo: this.route.parent,
            state: {
              quotationData: response,
              routeStatus: 'create',
              isAdding: false,
              status: 'ApprovedQuotation',
              quotationType: 'Rework',
              displayPage: {
                quotationSelectedProject: this.selectedProject,
                quotationSelectedVendor: this.selectedVendor,
                searchedQuotationCode: this.quotationCode,
                quotationCustomStartDate: this.customStartDate,
                quotationCustomEndDate: this.customEndDate,
                quotationPageIndex: this.pageIndex,
                quotationPageSize: this.pageSize,
                stageOwner: this.stageOwner,
              },
            },
          });
          // this.editQuotation();
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }

  onProjectSelect(event: any) {
    this.projectId = event.option.value.projectId;
    this.selectedProject = event.option.value;
    this.formData.patchValue({ projectId: this.projectId });
    this.fetchNonPendingQuotations();
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
  // fetchProjects() {
  //   this.projectService
  //     .getProjectsByOrgIdWithProjectFilter(
  //       this.organizationId,
  //       '',
  //       this.projectName
  //     )
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (projects) => {
  //         const allOption = new Project();
  //         allOption.projectId = 0;
  //         allOption.displayProjectName = 'All';
  //         this.projects = [allOption, ...projects];
  //       },
  //       error: (error: Error) => {
  //         console.error('Error fetching projects:', error);
  //       },
  //     });
  // }

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
          console.error('Error fetching Project :', error);
        },
      });
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
    this.fetchNonPendingQuotations();
  }

  displayVendor(vendor: any) {
    if (typeof vendor === 'number' && vendor != undefined) {
      const selectedVendor = this.vendors.find((v) => v.id === vendor);
      return selectedVendor && selectedVendor.vendorName;
    } else if (vendor != undefined) {
      return vendor && vendor.vendorName ? vendor.vendorName : '';
    }
  }

  onDateChange() {
    this.pageIndex = 0;
    const startDate = this.formData.get('customStartDate')?.value;
    const endDate = this.formData.get('customEndDate')?.value;
    if (startDate !== null && endDate !== null) {
      this.dateRange = '';
      this.fetchNonPendingQuotations();
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
          this.fetchNonPendingQuotations();
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
    this.fetchNonPendingQuotations();
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
    this.stageOwner = '';
    this.customStartDate = null;
    this.customEndDate = null;
    this.selectedProject = new Project();
    this.selectedVendor = new Vendor();
    this.fetchNonPendingQuotations();
  }

  viewDownLoads(quotation: any, documentType: string) {
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
    this.getDocumentsBasedOnId(this.indentId);
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

  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }
}
