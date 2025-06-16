import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import {
  PAGE_INDEX,
  PAGE_SIZE,
  pageSizeOptions,
  searchTextLength,
  searchTextZero,
  TIME_OUT,
} from 'src/app/Constants/CommanConstants/Comman';
import { GetInventoryReceivablesDto } from 'src/app/Models/Procurement/inventory-receivable';
import { InventoryReceivableService } from 'src/app/Services/ProcurementService/InventoryReceivable/inventory-receivable.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { IProject, Project } from 'src/app/Models/Project/project';
import { IVendor, Vendor } from 'src/app/Models/WorkOrder/VendorData';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { User } from 'src/app/Models/User/User';
import { vendorService } from 'src/app/Services/WorkOrderService/Vendor Data/vendor.service';
import {
  IPurcahseOrder,
  PurchaseOrder,
} from 'src/app/Models/Procurement/purchaseorder';
import { PurchaseOrderService } from 'src/app/Services/ProcurementService/PurchaseOrder/purchaseorder.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'display-inventory-receivable',
  templateUrl: './display-inventory-receivable.component.html',
  styleUrls: ['./display-inventory-receivable.component.css'],
})
export class DisplayIRComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private destroy$ = new Subject<void>();
  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;
  totalItems: number = 0;
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  pageSizeOptions = pageSizeOptions;
  projectId: any;
  vendorId: any;
  getInventoryReceivableData: GetInventoryReceivablesDto[] = [];
  projectFc: FormControl = new FormControl([] as Project[]);
  vendor: any = new FormControl([] as IVendor[]);
  users: User[] = [];
  vendorName: string = '';
  projectName: string = '';
  vendors: IVendor[] = [];
  selectedProject: IProject = new Project();
  selectedVendor: IVendor = new Vendor();
  public user: User = new User();
  organizationId = 0;
  project: Project[] = [];
  code: any;
  purchaseOrder: PurchaseOrder[] = [];
  selectedPo: IPurcahseOrder = new PurchaseOrder();
  formData!: FormGroup;
  dateRange: any = '';
  customStartDate: any = '';
  customEndDate: any = '';
  purchaseOrderFc: FormControl = new FormControl([] as PurchaseOrder[]);

  displayedColumns: string[] = [
    'rowNumber',
    'indentCode',
    'quotationCode',
    'poCode',
    'projectName',
    'vendorName',
    'invoiceReceivableStatus',
    'actions',
  ];

  irId: number = 0;
  poId: number = 0;
  storeId: number = 0;

  ngOnInit(): void {
    this.initForm();
    const user = localStorage.getItem('user');
    if (user != null) {
      this.user = JSON.parse(user);
      this.organizationId = this.user.organizationId;
    }

    this.getAllInventoryReceivables();
    this.getProjects();
    this.fetchVendors();
    this.getAllPurchaseOrder();
    this.patchFormData();
  }
  patchFormData() {
    this.selectedProject = history.state.displaypage.selectedProject;
    this.selectedPo = history.state.displaypage.selectedPo;
    this.selectedVendor = history.state.displaypage.selectedVendor;
    history.state.displaypage.selectedSpecification;
    this.pageSize = history.state.displaypage.pageSize;
    this.pageIndex = history.state.displaypage.pageIndex;
    this.patchFormValues();
  }

  patchFormValues() {
    if (this.selectedProject) {
      this.projectFc.patchValue(this.selectedProject);
      this.projectId = this.selectedProject.projectId;
    }
    this.getAllInventoryReceivables();
  }
  constructor(
    private inventoryReceivableService: InventoryReceivableService,
    private router: Router,
    public dialog: MatDialog,
    private toastrService: ToastrService,
    private projectService: ProjectService,
    private vendorService: vendorService,
    private formBuilder: FormBuilder,
    private purchaseOrderService: PurchaseOrderService
  ) {}

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    history.state.pageIndex = this.pageIndex;
    history.state.pageSize = this.pageSize;
    this.getAllInventoryReceivables();
  }

  getAllInventoryReceivables() {
    this.inventoryReceivableService
      .getAllInventoryReceivable(
        this.projectId,
        this.vendorId,
        this.poId,
        this.pageIndex,
        this.pageSize
      )
      .subscribe((response) => {
        console.log(response.totalRecords);

        this.getInventoryReceivableData = response.records;
        this.totalItems = response.totalRecords;
      });
  }

  addInventoryReceivable() {
    this.router.navigate(['layout/procurement/addgoodsreceived'], {
      state: {
        isAdding: true,
        displayPage: {
          selectedProject: this.selectedProject,
          selectedPo: this.selectedPo,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
        },
      },
    });
  }

  handleSuccessResponse(response: any): void {
    this.toastrService.success('', response.message, {
      timeOut: TIME_OUT,
    });
  }

  handleErrorResponse(error: any): void {
    this.toastrService.error('', error.error.message, {
      timeOut: TIME_OUT,
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getInventoryById(irId: number) {
    return this.inventoryReceivableService
      .getInventoryDetailsById(irId)
      .pipe(takeUntil(this.destroy$));
  }

  searchProject(event: any): void {
    this.paginator.firstPage();
    const query = event.target.value;
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.projectName = query;
      this.getProjects();
    }
  }
  getProjects() {
    this.projectService
      .getProjectsForPO(this.projectName, this.organizationId, this.user.userId)
      .subscribe({
        next: (data) => {
          this.project = data;
        },
        error: (error: any) => {
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
  }

  onProjectSelect(event: any) {
    this.paginator.firstPage();
    this.selectedProject = event.option.value;
    this.projectId = event.option.value.projectId
      ? event.option.value.projectId
      : '';

    if (this.projectId === '') {
      this.vendorId = '';
    }
    this.getAllInventoryReceivables();
  }

  displayProject(project: IProject) {
    return project && project.displayProjectName
      ? project.displayProjectName
      : 'All';
  }

  searchVendorCode(event: any) {
    const query = event.target.value;
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.vendorName = query;
      this.fetchVendors();
    }
  }
  fetchVendors() {
    this.vendorService
      .getVendorCodesWithOutPage('', this.vendorName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (vendorName) => {
          this.vendors = vendorName;
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }

  onVendorCodeSelect(event: any) {
    this.paginator.firstPage();
    this.vendorId = event.option.value.id ? event.option.value.id : '';
    this.selectedVendor = event.option.value;

    if (this.vendorId === '') {
    }

    this.getAllInventoryReceivables();
  }
  displayVendorCode(vendor: Vendor) {
    return vendor && vendor.vendorName ? vendor.vendorName : 'All';
  }

  searchPurchaseOrder(event: any): void {
    const query = event.target.value;
    this.code = query;
    this.getAllPurchaseOrder();
  }
  getAllPurchaseOrder() {
    this.purchaseOrderService
      .fetchAllPurchaseOrders(this.code, this.organizationId, this.user.userId)
      .subscribe({
        next: (purchaseOrder) => {
          this.purchaseOrder = purchaseOrder;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  displayPurchaseOrder(purchaseOrder: PurchaseOrder): string {
    return purchaseOrder && purchaseOrder.poCode ? purchaseOrder.poCode : 'All';
  }

  onPurchaseOrderSelect(event: any): void {
    this.poId = event.option.value.id ? event.option.value.id : '';
    this.selectedPo = event.option.value;
    this.getAllInventoryReceivables();
  }

  onDateChange() {
    this.pageIndex = 0;
    this.paginator.firstPage();
    const startDate = this.formData.get('customStartDate')?.value;
    const endDate = this.formData.get('customEndDate')?.value;
    if (startDate !== null && endDate !== null) {
      this.dateRange = '';
      this.getAllInventoryReceivables();
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
          this.getAllInventoryReceivables();
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
    this.getAllInventoryReceivables();
  }

  resetForm() {
    this.selectedProject = new Project();
    this.selectedProject.projectName = 'All';
    this.projectId = 0;

    const vendor = new Vendor();
    this.vendorId = 0;
    this.vendor.reset(vendor);
    vendor.vendorName = 'All';

    this.pageSize = 15;
    this.pageIndex = 0;
    this.getAllInventoryReceivables();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'RECEIVED':
        return 'closed';
      case 'NOT RECEIVED':
        return 'short-closed';
      case 'Pending':
        return 'closed';
      case 'Not Applicable':
        return 'not-applicable';
      case 'PARTIALLY RECEIVED':
        return 'partially-received';
      case 'YET TO RECEIVE':
        return 'partially-supplied';
      case 'SHORT CLOSED':
        return 'short-closed';
      case 'APPROVED':
        return 'closed';
      default:
        return 'short-closed';
    }
  }

  goToInventoryItems(data: any) {
    console.log(data);
    this.router.navigate(['layout/procurement/goodsreceived/items'], {
      state: {
        poId: data.poId,
      },
    });
  }
}
