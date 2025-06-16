import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { ReusableComponent } from 'src/app/Comman-Components/base-component/base.component';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import Swal from 'sweetalert2';
import {
  QuotationDto,
  QuotationItemDto,
} from 'src/app/Models/Procurement/quotation';
import { QuotationService } from 'src/app/Services/ProcurementService/Quotation/quotation.service';
import { MatDialog } from '@angular/material/dialog';
import { IProject, Project } from 'src/app/Models/Project/project';
import { FormBuilder, FormControl } from '@angular/forms';
import { IVendor, Vendor } from 'src/app/Models/WorkOrder/VendorData';
import {
  searchTextLength,
  searchTextZero,
} from 'src/app/Constants/CommanConstants/Comman';
import { vendorService } from 'src/app/Services/WorkOrderService/Vendor Data/vendor.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { MatPaginator } from '@angular/material/paginator';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-display-approved-quotation',
  templateUrl: './display-approved-quotation.component.html',
  styleUrls: ['./display-approved-quotation.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DisplayApprovedQuotationComponent
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

  displayedColumns: string[] = [
    'rowNumber',
    'projectName',
    'quotationCode',
    'quotationCreatedDate',
    'vendorName',
    'stageOwner',
    'totalCostWithOutGst',
    'totalCostWithGst',
    'poGeneratedStatus',
    'poStatus',
  ];

  customHeaderNames = {
    rowNumber: 'S.No',
    projectName: 'Project Name',
    quotationCode: 'Quo Code',
    quotationCreatedDate: 'Quo Created Date',
    vendorName: 'Vendor Name',
    stageOwner: 'Created By',
    totalCostWithOutGst: 'Total Cost With Out Gst',
    totalCostWithGst: 'Total Cost With Gst',
    poGeneratedStatus: 'PO Generated Status',
    poStatus: 'PO Status',
  };

  actionButtons: any[] = [
    { label: 'View Quotation', icon: 'rule', action: 'approve' },
    { label: 'Add', icon: 'add', action: 'add' },
  ];

  pipes = {
    quotationCreatedDate: 'date',
    totalCost: 'currency',
    totalCostWithOutGst: 'currency',
    totalCostWithGst: 'currency',
  };

  ngOnInit(): void {
    this.initForm();
    super.setUserFromLocalStorage();
    this.getDataFromState();
    this.fetchVendors();
    this.fetchProjects();
    this.fetchApprovedQuotations();
    this.quotationService.refreshRequired.subscribe(() => {
      this.fetchApprovedQuotations();
    });
  }

  constructor(
    private quotationService: QuotationService,
    router: Router,
    route: ActivatedRoute,
    public dialog: MatDialog,
    private vendorService: vendorService,
    private projectService: ProjectService,
    commanService: CommanService,
    private formBuilder: FormBuilder,
    private loaderService: LoaderService
  ) {
    super(commanService, router, route);
  }

  getDataFromState() {
    const { quotation, approvedQuotationPage } = history.state;
    const { indentId } = history.state;
    if (quotation) {
      this.indentId = quotation.indentId;
    }
    if (indentId) {
      this.indentId = indentId;
    }

    if (approvedQuotationPage) {
      const displayStatePageData = approvedQuotationPage;
      this.selectedProject = displayStatePageData.selectedProject;
      this.selectedVendor = displayStatePageData.selectedVendor;
      this.quotationCode = displayStatePageData.searchedQuotationCode;
      this.pageSize = displayStatePageData.pageSize;
      this.pageIndex = displayStatePageData.pageIndex;
      this.customStartDate = displayStatePageData.customStartDate;
      this.customEndDate = displayStatePageData.customEndDate;
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

  fetchApprovedQuotations() {
    this.showLoading();
    this.quotationService
      .fetchApprovedQuotations(
        this.pageIndex,
        this.pageSize,
        this.projectId,
        this.vendorId,
        this.quotationCode,
        this.customStartDate,
        this.customEndDate,
        this.userId
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (quotationData) => {
          this.quotationData = quotationData.records;
          this.totalItems = quotationData.totalRecords;

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
        },
      });
  }

  viewQuotation(row: any) {
    this.router.navigate(['./viewquotation'], {
      relativeTo: this.route.parent,
      state: {
        quotation: row,
        routeStatus: 'purchaseOrder',
        displayApprovedQuotationPage: {
          selectedProject: this.selectedProject,
          selectedVendor: this.selectedVendor,
          searchedQuotationCode: this.quotationCode,
          // searchedCreatedUserName: this.createdUserName,
          customStartDate: this.customStartDate,
          customEndDate: this.customEndDate,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
        },
      },
    });
  }

  onActionClicked(event: any): void {
    const { action, row } = event;
    if (action === 'approve') {
      this.viewQuotation(row);
    } else if (action === 'add') {
      this.createPurchaseOrder(row);
    }
  }

  createPurchaseOrder(row: any) {
    this.router.navigate(['./purchase/order'], {
      relativeTo: this.route.parent,
      state: {
        quotation: row,
        routeStatus: 'pending',
        isAdding: true,
        displayApprovedQuotationPage: {
          selectedProject: this.selectedProject,
          selectedVendor: this.selectedVendor,
          searchedQuotationCode: this.quotationCode,
          // searchedCreatedUserName: this.createdUserName,
          customStartDate: this.customStartDate,
          customEndDate: this.customEndDate,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
        },
      },
    });
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.fetchApprovedQuotations();
  }

  onSearchQuotationCode(quotationCode: any) {
    if (
      quotationCode.length >= searchTextLength ||
      quotationCode.length === searchTextZero
    ) {
      this.quotationCode = quotationCode;
      this.fetchApprovedQuotations();
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
      this.fetchApprovedQuotations();
    }
  }

  onVendorSelect(event: any) {
    this.vendorId = event.option.value.id;
    this.selectedVendor = event.option.value;
    this.fetchApprovedQuotations();
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

  //fetch projects based on organization id
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

  displayProject(project: IProject) {
    return project && project.displayProjectName
      ? project.displayProjectName
      : '';
  }
  onProjectSelect(project: any) {
    this.projectId = project.option.value.projectId;
    this.selectedProject = project.option.value;
    this.fetchApprovedQuotations();
  }
  searchProject(project: any) {
    const query = project.target.value;
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.projectName = query;
      this.fetchProjects();
    }
    if (query.length === searchTextZero) {
      this.projectId = 0;
      this.fetchApprovedQuotations();
    }
  }

  onDateChange() {
    this.pageIndex = 0;
    const startDate = this.formData.get('customStartDate')?.value;
    const endDate = this.formData.get('customEndDate')?.value;
    if (startDate !== null && endDate !== null) {
      this.dateRange = '';
      this.fetchApprovedQuotations();
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
          this.fetchApprovedQuotations();
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
    this.fetchApprovedQuotations();
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
    this.customStartDate = null;
    this.customEndDate = null;
    this.selectedProject = new Project();
    this.selectedVendor = new Vendor();
    this.fetchApprovedQuotations();
  }

  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }
}
