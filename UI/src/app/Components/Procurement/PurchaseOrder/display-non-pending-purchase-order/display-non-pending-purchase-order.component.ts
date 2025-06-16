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
  pageSizeOptions,
  searchTextLength,
  searchTextZero,
  TOTAL_ITEMS,
} from 'src/app/Constants/CommanConstants/Comman';
import {
  QuotationDto,
  QuotationItemDto,
} from 'src/app/Models/Procurement/quotation';
import { IProject, Project } from 'src/app/Models/Project/project';
import { IVendor, Vendor } from 'src/app/Models/WorkOrder/VendorData';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { PurchaseOrderService } from 'src/app/Services/ProcurementService/PurchaseOrder/purchaseorder.service';
import { QuotationService } from 'src/app/Services/ProcurementService/Quotation/quotation.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { vendorService } from 'src/app/Services/WorkOrderService/Vendor Data/vendor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-non-pending-purchase-order',
  templateUrl: './display-non-pending-purchase-order.component.html',
  styleUrls: ['./display-non-pending-purchase-order.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DisplayNonPendingPurchaseOrderComponent
  extends ReusableComponent
  implements OnInit
{
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  quotationData: QuotationDto[] = [];
  quotationItems: QuotationItemDto[] = [];
  indentId: number = 0;
  dateRange: any = '';
  customStartDate: any = '';
  customEndDate: any = '';
  selectedStatus: string = 'All';

  //search filter data
  purchaseOrderCode: string = '';
  quotationCode: string = '';
  stageOwner: string = '';

  //project auto complete fields
  projectId: number = 0;
  projectName: string = '';
  projects: Project[] = [];
  project: any = new FormControl([] as IProject[]);
  selectedProject: IProject = new Project();

  //vendor autocomplete fields
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

  //document variables started
  documents: any;
  openDialog: boolean | undefined;
  documentType: string = '';

  purchaseOrderId: number = 0;

  displayedColumns: string[] = [
    'rowNumber',
    'projectName',
    'vendorName',
    'purchaseOrderCode',
    'poCreatedDate',
    'modifiedDate',
    'storeName',
    'storeContactNumber',
    'quotationCode',
    'stageOwner',
    'totalCostWithOutGst',
    'totalCostWithGst',
    'poStatus',
  ];

  displayedColumnsDocuments = [
    'rowNumber',
    'fileName',
    'createdDate',
    'actions',
  ];

  customHeaderNames = {
    rowNumber: 'S.No',
    projectName: 'Project Name',
    purchaseOrderCode: 'PO Code',
    poCreatedDate: 'Created Date',
    modifiedDate: 'Updated Date',
    storeName: 'Store Name',
    storeContactNumber: 'Contact Number',
    quotationCode: 'Quotation Code',
    vendorName: 'Vendor Name',
    stageOwner: 'Stage Owner',
    totalCostWithOutGst: 'Total Cost With Out Gst',
    totalCostWithGst: 'Total Cost With Gst',
    poStatus: 'Status',
  };

  actionButtons: any[] = [
    { label: 'Send For Approve', icon: 'send', action: 'send' },
    { label: 'Quotation', icon: 'rule', action: 'approve' },
    { label: 'Edit', icon: 'edit', action: 'edit' },
    { label: 'PO PDF', icon: 'picture_as_pdf', action: 'pdfs' },
  ];

  pipes = {
    poCreatedDate: 'date',
    requiredDate: 'date',
    modifiedDate: 'date',
    totalCost: 'currency',
    totalCostWithOutGst: 'currency',
    totalCostWithGst: 'currency',
  };

  ngOnInit(): void {
    this.initForm();
    this.getDataFromState();
    super.setUserFromLocalStorage();
    this.fetchVendors();
    this.fetchProjects();
    this.fetchPurchaseOrderDetailsByQuotationId();
    this.quotationService.refreshRequired.subscribe(() => {
      this.fetchPurchaseOrderDetailsByQuotationId();
    });
  }

  constructor(
    private quotationService: QuotationService,
    private purchaseOrderService: PurchaseOrderService,
    private vendorService: vendorService,
    private projectService: ProjectService,
    router: Router,
    route: ActivatedRoute,
    public dialog: MatDialog,
    commanService: CommanService,
    private formBuilder: FormBuilder,
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

    console.log(displayPageData);

    if (displayPageData) {
      const displayStatePageData = displayPageData;
      this.selectedProject = displayStatePageData.poSelectedProject;
      this.selectedVendor = displayStatePageData.poSelectedVendor;
      this.quotationCode = displayStatePageData.searchedQuotationCode;
      this.purchaseOrderCode = displayStatePageData.searchedPOCode;
      this.pageSize = displayStatePageData.poPageSize;
      this.pageIndex = displayStatePageData.poPageIndex;
      this.customStartDate = displayStatePageData.poCustomStartDate;
      this.customEndDate = displayStatePageData.poCustomEndDate;
      this.stageOwner = displayStatePageData.stageOwner;
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

  fetchPurchaseOrderDetailsByQuotationId() {
    this.showLoading();
    this.purchaseOrderService
      .fetchNonPenidngPurchaseOrders(
        this.pageIndex,
        this.pageSize,
        this.purchaseOrderCode,
        this.projectId,
        this.vendorId,
        this.quotationCode,
        this.stageOwner,
        this.customStartDate,
        this.customEndDate,
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
    console.log(quotation.quotationId);
    this.quotationService
      .moveQuotationToWorkFlow(quotation.quotationId, this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          Swal.fire('Success', response.message, 'success');
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }

  viewPurchaseOrder(row: any) {
    this.router.navigate(['./view/purchase/order'], {
      relativeTo: this.route.parent,
      state: {
        purchaseOrder: row,
        routeStatus: 'approve',
        displayPage: {
          poSelectedProject: this.selectedProject,
          poSelectedVendor: this.selectedVendor,
          searchedQuotationCode: this.quotationCode,
          searchedPOCode: this.purchaseOrderCode,
          poCustomStartDate: this.customStartDate,
          poCustomEndDate: this.customEndDate,
          poPageIndex: this.pageIndex,
          poPageSize: this.pageSize,
          stageOwner: this.stageOwner,
        },
      },
    });
  }
  onActionClicked(event: any): void {
    const { action, row } = event;
    if (action === 'approve') {
      this.viewPurchaseOrder(row);
    } else if (action === 'send') {
      this.sendForApproval(row);
    } else if (action === 'pdfs') {
      this.documentType = 'PURCHASE_ORDER_PDF';
      this.viewDownLoads(row);
    }
  }

  onSearchPurchaseOrder(purchaseOrderCode: any) {
    if (
      purchaseOrderCode.length >= searchTextLength ||
      purchaseOrderCode.length === searchTextZero
    ) {
      this.purchaseOrderCode = purchaseOrderCode;
      this.fetchPurchaseOrderDetailsByQuotationId();
    }
  }

  onSearchStageOwner(stageOwner: any) {
    if (
      stageOwner.length >= searchTextLength ||
      stageOwner.length === searchTextZero
    ) {
      this.stageOwner = stageOwner;
      this.fetchPurchaseOrderDetailsByQuotationId();
    }
  }
  onSearchQuotationCode(quotationCode: any) {
    if (
      quotationCode.length >= searchTextLength ||
      quotationCode.length === searchTextZero
    ) {
      this.quotationCode = quotationCode;
      this.fetchPurchaseOrderDetailsByQuotationId();
    }
  }

  searchVendor(vendor: any) {
    const query = vendor.target.value;
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.vendorName = query;
      this.fetchVendors();
    }
    if (query.length === searchTextZero) {
      this.vendorId = 0;
      this.fetchPurchaseOrderDetailsByQuotationId();
    }
  }

  onVendorSelect(event: any) {
    this.vendorId = event.option.value.id;
    this.selectedVendor = event.option.value;
    this.fetchPurchaseOrderDetailsByQuotationId();
  }

  displayVendor(vendor: any) {
    if (typeof vendor === 'number' && vendor != undefined) {
      const selectedVendor = this.vendors.find((v) => v.id === vendor);
      return selectedVendor && selectedVendor.vendorName;
    } else if (vendor != undefined) {
      return vendor && vendor.vendorName ? vendor.vendorName : '';
    }
  }

  //added siva
  fetchVendors() {
    this.vendorService
      .getVendorCodesWithOutPage('', this.vendorName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (vendors) => {
          const allOption = new Vendor();
          allOption.id = 0;
          allOption.vendorName = 'All';
          this.vendors = [allOption, ...vendors];
        },
        error: (error: Error) => {
          console.error(error);
        },
      });
  }

  // //fetch projects based on organization id
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
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
  }

  displayProject(project: any) {
    if (typeof project === 'number' && project != undefined) {
      const pro = this.projects.find((p) => p.projectId === project);
      return pro && pro.projectName;
    } else if (project != undefined) {
      return project && project.projectName ? project.projectName : '';
    }
  }
  onProjectSelect(project: any) {
    this.projectId = project.option.value.projectId;
    this.selectedProject = project.option.value;
    this.fetchPurchaseOrderDetailsByQuotationId();
  }
  searchProject(project: any) {
    const query = project.target.value;
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.projectName = query;
      this.fetchProjects();
    }
    if (query.length === searchTextZero) {
      this.projectId = 0;
      this.fetchPurchaseOrderDetailsByQuotationId();
    }
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.fetchPurchaseOrderDetailsByQuotationId();
  }

  onDateChange() {
    this.pageIndex = 0;
    const startDate = this.formData.get('customStartDate')?.value;
    const endDate = this.formData.get('customEndDate')?.value;
    if (startDate !== null && endDate !== null) {
      this.dateRange = '';
      this.fetchPurchaseOrderDetailsByQuotationId();
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
          this.fetchPurchaseOrderDetailsByQuotationId();
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
    this.fetchPurchaseOrderDetailsByQuotationId();
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
    this.purchaseOrderCode = '';
    this.stageOwner = '';
    this.customStartDate = null;
    this.customEndDate = null;
    this.selectedProject = new Project();
    this.selectedVendor = new Vendor();
    this.fetchPurchaseOrderDetailsByQuotationId();
  }

  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }

  downloadDocument(document: any) {
    const documentUrl = document;
    const decodedUrl = decodeURIComponent(documentUrl);
    let fileName = '';
    if (decodedUrl) {
      fileName =
        decodedUrl.split('?')[0].split('/').pop()?.split('.pdf')[0] ?? '';
    } else {
      fileName = 'Work_Order';
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
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  viewDocument(document: any) {
    const documentUrl = document;
    const decodedUrl = decodeURIComponent(documentUrl);
    let fileName = '';
    if (decodedUrl) {
      fileName =
        decodedUrl.split('?')[0].split('/').pop()?.split('.pdf')[0] ?? '';
    } else {
      fileName = 'Purchase_Order';
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

  viewDownLoads(poOrderData: any) {
    if (poOrderData?.purchaseOrderId) {
      this.purchaseOrderId = poOrderData?.purchaseOrderId;
      this.getDocumentsBasedOnId(this.purchaseOrderId);
    }
  }

  getDocumentsBasedOnId(purchaseOrderId: number) {
    const documentType = this.documentType;
    this.commanService
      .getDocumentById(
        purchaseOrderId,
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
          } else {
            this.openDialog = true;
          }
        },
        error: (error: Error) => {
          console.error(error);
        },
      });
  }

  onDocumentPageChange(event: any) {
    this.documentPageSize = event.pageSize;
    this.documentPageIndex = event.pageIndex;
    this.getDocumentsBasedOnId(this.purchaseOrderId);
  }

  closeModal() {
    this.documentPageSize = 15;
    this.documentPageIndex = PAGE_INDEX;
    this.openDialog = false;
  }
}
