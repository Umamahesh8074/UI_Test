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
import { InventoryReceivableService } from 'src/app/Services/ProcurementService/InventoryReceivable/inventory-receivable.service';
import { QuotationService } from 'src/app/Services/ProcurementService/Quotation/quotation.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { vendorService } from 'src/app/Services/WorkOrderService/Vendor Data/vendor.service';

@Component({
  selector: 'app-inventory-receivable-pending-approval',
  templateUrl: './inventory-receivable-pending-approval.component.html',
  styleUrls: ['./inventory-receivable-pending-approval.component.css'],
})
export class InventoryReceivablePendingApprovalComponent
  extends ReusableComponent
  implements OnInit
{
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dateRange: any = '';
  customStartDate: any = '';
  customEndDate: any = '';
  projectId: number = 0;
  stageOwnerName: string = '';
  purchaseOrderCode: string = '';
  inventoryReceivables: any[] = [];

  projectName: string = '';
  projects: Project[] = [];
  project: any = new FormControl([] as IProject[]);
  selectedProject: IProject = new Project();

  vendors: IVendor[] = [];
  vendorName: string = '';
  vendorId: number = 0;
  vendor: any = new FormControl([] as IVendor[]);
  selectedVendor: IVendor = new Vendor();

  displayedColumns: string[] = [
    'rowNumber',
    'purchaseOrderCode',
    'projectName',
    'vendorName',
    'invoiceNumber',
    'invoiceAmount',
    'invoiceDate',
    'currentStageOwner',
    'currentStageName',
    'approvalStatus',
  ];
  customHeaderNames = {
    purchaseOrderCode: 'Purchase Order Code',
    projectName: 'Project Name',
    vendorName: 'Vendor Name',
    invoiceNumber: 'Invoice Number',
    invoiceAmount: 'Invoice Amount',
    invoiceDate: 'Invoice Date',
    currentStageOwner: 'Stage Owner',
    currentStageName: 'Stage Name',
    approvalStatus: 'Status',
  };

  actionButtons: any[] = [
    { label: 'Inventory Receivable Items', icon: 'rule', action: 'approve' },
  ];
  pipes = {
    quotationCreatedDate: 'date',
    requiredDate: 'date',
    invoiceDate:'date',
    totalCost: 'currency',
    totalCostWithOutGst: 'currency',
    totalCostWithGst: 'currency',
  };

  ngOnInit(): void {
    this.initForm();
    this.getDataFromState();
    super.setUserFromLocalStorage();
    this.getPendingInventoryReceivables();
    this.fetchProjects();
    this.fetchVendors();
  }
  constructor(
    router: Router,
    route: ActivatedRoute,
    commanService: CommanService,
    private inventoryReceivableService: InventoryReceivableService,
    private vendorService: vendorService,
    private projectService: ProjectService,
    private formBuilder: FormBuilder,
    private loaderService: LoaderService
  ) {
    super(commanService, router, route);
  }

  getDataFromState() {
    const { displayPageData } = history.state;

    if (displayPageData) {
      const displayStatePageData = displayPageData;
      this.selectedProject = displayStatePageData.quotationSelectedProject;
      this.selectedVendor = displayStatePageData.quotationSelectedVendor;
      this.purchaseOrderCode = displayStatePageData.searchedPurchaseOrderCode;
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

  getPendingInventoryReceivables() {
    this.showLoading();
    this.inventoryReceivableService
      .getPendingInventoryReceivables(
        this.pageIndex,
        this.pageSize,
        this.userId,
        this.purchaseOrderCode,
        this.projectId,
        this.customStartDate,
        this.customEndDate
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (inventoryReceivables) => {
          if (this.paginator) {
            this.paginator.pageIndex = this.pageIndex;
            this.paginator.pageSize = this.pageSize;
          }
          this.inventoryReceivables = inventoryReceivables.records;
          this.totalItems = inventoryReceivables.totalRecords;
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
    this.getPendingInventoryReceivables();
  }

  onActionClicked(event: any): void {
    const { action, row } = event;
    if (action === 'approve') {
      this.viewExceededInventoryReceivables(row);
    }
  }

  viewExceededInventoryReceivables(row: any) {
    console.log('Selected Row:', row);
    this.router.navigate(['layout/procurement/view/goodsreceived/items'], {
      state: {
        inventoryReceivable: row,
        routeStatus: 'pending',
      },
    });
  }
  onProjectSelect(event: any) {
    this.projectId = event.option.value.projectId;
    this.selectedProject = event.option.value;
    this.formData.patchValue({ projectId: this.projectId });
    this.getPendingInventoryReceivables();
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
    this.getPendingInventoryReceivables();
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
  onSearchPurchaseOrderCode(purchaseOrderCode: string) {
    if (
      purchaseOrderCode.length > searchTextLength ||
      purchaseOrderCode.length === searchTextZero
    ) {
      this.purchaseOrderCode = purchaseOrderCode;
      this.pageIndex = PAGE_INDEX;
      this.getPendingInventoryReceivables();
    }
  }
  onDateChange() {
    this.pageIndex = 0;
    const startDate = this.formData.get('customStartDate')?.value;
    const endDate = this.formData.get('customEndDate')?.value;
    if (startDate !== null && endDate !== null) {
      this.dateRange = '';
      this.getPendingInventoryReceivables();
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
          this.getPendingInventoryReceivables();
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
    this.getPendingInventoryReceivables();
  }

  onSearchStageOwnerName(stageOwnerName: string) {
    if (
      stageOwnerName.length > searchTextLength ||
      stageOwnerName.length === searchTextZero
    ) {
      this.stageOwnerName = stageOwnerName;
      this.pageIndex = PAGE_INDEX;
      this.getPendingInventoryReceivables();
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

    this.purchaseOrderCode = '';
    this.stageOwnerName = '';
    this.customStartDate = null;
    this.customEndDate = null;
    this.selectedProject = new Project();
    this.selectedVendor = new Vendor();
    this.getPendingInventoryReceivables();
  }
}
