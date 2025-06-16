import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { tickStep } from 'd3';
import { forkJoin, takeUntil } from 'rxjs';
import { ReusableComponent } from 'src/app/Comman-Components/base-component/base.component';
import { ApproveDialogComponent } from 'src/app/Comman-Components/Dialog/approvaldialog/approvedialog.component';
import {
  PAGE_INDEX,
  PAGE_SIZE,
  pageSizeOptions,
  searchTextLength,
  searchTextZero,
  TOTAL_ITEMS,
} from 'src/app/Constants/CommanConstants/Comman';
import { Charges } from 'src/app/Models/Procurement/charges';
import { IndentItems } from 'src/app/Models/Procurement/indentDto';
import { IProject, Project } from 'src/app/Models/Project/project';
import { IVendor, Vendor } from 'src/app/Models/WorkOrder/VendorData';

import { IStagesDto } from 'src/app/Models/WorkOrder/WorkOrderBilling';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { ApprovalsService } from 'src/app/Services/ProcurementService/Approvals/approvals.service';
import { IndentService } from 'src/app/Services/ProcurementService/Indent/indent.service';
import { QuotationService } from 'src/app/Services/ProcurementService/Quotation/quotation.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { vendorService } from 'src/app/Services/WorkOrderService/Vendor Data/vendor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-quotation',
  templateUrl: './create-quotation.component.html',
  styleUrls: ['./create-quotation.component.css'],
  encapsulation: ViewEncapsulation.None, // Set ViewEncapsulation to None
})
export class CreateQuotationComponent
  extends ReusableComponent
  implements OnInit
{
  quotationData: any;
  quotationItems: any[] = [];
  indentItems: IndentItems[] = [];
  charges: Charges[] = [];
  quotationId: number = 0;
  indentId: number = 0;
  stages: IStagesDto[] = [];
  indentStages: IStagesDto[] = [];
  quotationCharges: any[] = [];
  routeStatus: string = '';
  remarks: string = '';
  expanded: boolean[] = [];
  workflowTypeId: number = 0;
  panelOpenState = false;
  indentTotalItems: number = 0;
  isLoading: boolean = false;
  displayPageData: any;
  displayApprovedQuotationPage: any;
  pageDataFromCreateQuotation: any;
  openDialog: boolean | undefined;

  previousPageSize = PAGE_SIZE;
  previousPageIndex = PAGE_INDEX;
  previousTotalItems: number = TOTAL_ITEMS;
  previousQuotationtems: any;

  //documents pagination
  termsAndConTotalItems: number = TOTAL_ITEMS;
  termsAndConPageSize: number = 15;
  termsAndConPageIndex: number = PAGE_INDEX;
  termsAndConPageSizeOptions = pageSizeOptions;

  vendorTotalItems: number = TOTAL_ITEMS;
  vendorPageSize: number = 15;
  vendorPageIndex: number = PAGE_INDEX;
  vendorPageSizeOptions = pageSizeOptions;
  vendorHistory: any;
  isVendorHistoryPresent: boolean = false;
  materialCodeId: number = 0;
  currentItemPrice: number = 0;
  vendorId: number = 0;

  displayedColumnsTermsAndCon = ['rowNumber', 'termsAndConditions'];
  termsAndConditions: any;
  indentCreatedUserId: number = 0;
  quotationCreatedUserId: number = 0;

  projectId: number = 0;
  projectName: string = '';
  projects: Project[] = [];
  project: any = new FormControl([] as IProject[]);
  vendors: IVendor[] = [];
  vendorName: string = '';
  vendor: any = new FormControl([] as IVendor[]);
  selectedProject: IProject = new Project();
  selectedVendor: IVendor = new Vendor();

  displayedColumns: string[] = [
    'ItemId',
    'category',
    'subCategory',
    'specification',
    'unit',
    'cost',
    'quantity',
    'quotationItemCostWithOutGst',
    'gst',
    'discount',
    'quotationItemCostWithGst',
    'actions',
  ];

  displayedColumns1: string[] = [
    'ItemId',
    'vendorName',
    'projectName',
    'approvedDate',
    'category',
    'subCategory',
    'specification',
    'unit',
    'cost',
    'quantity',
    'quotationItemCostWithOutGst',
    'gst',
    'discount',
    'quotationItemCostWithGst',
  ];

  displayedColumns2: string[] = [
    'id',
    'transportCharge',
    'loadingCharge',
    'unLoadingCharge',
    'installationCharge',
    'otherCharge',
  ];

  ngOnInit(): void {
    super.setUserFromLocalStorage();
    this.getDataFromState();
    this.loadDetails();
    this.fetchProjects();
    this.fetchVendors();
  }

  constructor(
    private quotationService: QuotationService,
    commanService: CommanService,
    private indentService: IndentService,
    router: Router,
    private dialog: MatDialog,
    route: ActivatedRoute,
    private loaderService: LoaderService,
    private projectService: ProjectService,
    private vendorService: vendorService,
    private approvalsService: ApprovalsService
  ) {
    super(commanService, router, route);
  }

  getDataFromState() {
    const {
      quotation,
      routeStatus,
      displayPage,
      statePageDataFromCreateQuotation,
      displayApprovedQuotationPage,
    } = history.state;

    if (displayPage) {
      this.displayPageData = displayPage;
    }
    if (displayApprovedQuotationPage) {
      this.displayApprovedQuotationPage = displayApprovedQuotationPage;
    }
    if (statePageDataFromCreateQuotation) {
      this.pageDataFromCreateQuotation = statePageDataFromCreateQuotation;
    }
    if (quotation != null && quotation != undefined) {
      this.quotationData = quotation;
      this.indentTotalItems = this.indentItems.length;
      this.indentId = quotation.indentId;
      this.indentItems = quotation.indentItems;
      this.routeStatus = routeStatus;
      this.workflowTypeId = quotation.workflowTypeId;
      this.quotationId = quotation.quotationId;
      this.indentCreatedUserId = quotation.createdUserId;
      this.quotationCreatedUserId = quotation.quoCreatedBy;
    }
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadDetails();
  }

  onPreviousQuotationPageChange(event: any) {
    this.previousPageSize = event.pageSize;
    this.previousPageIndex = event.pageIndex;
    this.loadDetails();
  }

  loadDetails() {
    this.showLoading();
    forkJoin({
      quotationData: this.quotationService.fetchQuotationBasedonQuotationId(
        this.quotationId,
        this.pageIndex,
        this.pageSize
      ),

      previousQuotationtems:
        this.quotationService.getPreviousQuotationItemsByQuotationIdWithPagination(
          this.quotationId,
          this.previousPageIndex,
          this.previousPageSize
        ),
      stages: this.quotationService.getStages(
        this.quotationId,
        this.quotationCreatedUserId
      ),
      indentStages: this.indentService.getStages(
        this.indentId,
        this.indentCreatedUserId
      ),
      quotationCharges: this.quotationService.getQuotationCharges(
        this.quotationId
      ),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({
          quotationData,
          stages,
          indentStages,
          previousQuotationtems,
          quotationCharges,
        }) => {
          this.quotationItems = quotationData.records;
          this.totalItems = quotationData.totalRecords;
          this.stages = stages;
          this.indentStages = indentStages;
          this.quotationCharges = quotationCharges;
          console.log('quotationCharges:', this.quotationCharges);
          this.previousQuotationtems = previousQuotationtems.records;
          this.previousTotalItems = previousQuotationtems.totalRecords;
          this.hideLoading();
        },
        error: (err) => {
          this.hideLoading();
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  updateApprovalStatus(status: string) {
    this.showLoading();
    this.approvalsService
      .updateApprovalStatus(
        this.quotationId,
        this.workflowTypeId,
        this.userId,
        status,
        this.remarks
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate(['layout/procurement/pending/quotation']);
          this.hideLoading();
        },
        error: (err) => {
          console.error('Error updating Approvals', err);
          this.hideLoading();
        },
      });
  }

  approvalStatus(statuss: string) {
    const dialogRef = this.dialog.open(ApproveDialogComponent, {
      width: '40%',
      height: '300px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const { status, remarks } = result;
        this.remarks = remarks;
        if (remarks && status !== 'cancel') {
          this.updateApprovalStatus(statuss);
        }
      }
    });
  }

  goBack() {
    switch (this.routeStatus) {
      case 'pending':
        this.router.navigate(['./pending/quotation'], {
          relativeTo: this.route.parent,
          state: {
            indentId: this.indentId,
            displayPageData: this.displayPageData,
            pageDataFromCreateQuotation: this.pageDataFromCreateQuotation,
          },
        });
        break;
      case 'rework':
        this.router.navigate(['./app/rej/rework/quotation'], {
          relativeTo: this.route.parent,
          state: {
            indentId: this.indentId,
            displayPageData: this.displayPageData,
            pageDataFromCreateQuotation: this.pageDataFromCreateQuotation,
          },
        });
        break;

      case 'create':
        this.router.navigate(['./createquotation'], {
          relativeTo: this.route.parent,
          state: {
            indentId: this.indentId,
            displayPageData: this.displayPageData,
            pageDataFromCreateQuotation: this.pageDataFromCreateQuotation,
          },
        });
        break;
      case 'approve':
        this.router.navigate(['./quotations'], {
          relativeTo: this.route.parent,
          state: {
            indentId: this.indentId,
            displayPageData: this.displayPageData,
            pageDataFromCreateQuotation: this.pageDataFromCreateQuotation,
          },
        });
        break;

      case 'purchaseOrder':
        this.router.navigate(['./display/purchase/order'], {
          relativeTo: this.route.parent,
          state: {
            approvedQuotationPage: this.displayApprovedQuotationPage,
          },
        });
        break;
    }
  }

  onTermsAndCondPageChange(event: any) {}

  onClose() {
    this.openDialog = false;
  }
  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }

  viewIndent() {
    this.openDialog = true;
  }

  viewTermsAndCon() {
    this.getTermsAndConBasedOnId();
  }

  viewVendorHistory(event: any) {
    console.log(event);
    this.materialCodeId = event.materialCodeId;
    this.currentItemPrice = event.price;
    this.getVendorHistory();
  }

  getVendorHistory() {
    this.quotationService
      .getVendorHistory(
        this.vendorPageIndex,
        this.vendorPageSize,
        this.vendorId,
        this.quotationId,
        this.materialCodeId,
        this.projectId
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.vendorHistory = response.records;
          if (response.records.length > 0) {
            this.isVendorHistoryPresent = true;
            this.vendorTotalItems = response.totalRecords;
          } else {
            this.projectId = 0;
            this.vendorId = 0;
            this.project.setValue(null);
            this.vendor.setValue(null);
            Swal.fire({
              icon: 'info',
              title: 'No Data Found',
              text: 'No vendor history is available for this item.',
              confirmButtonText: 'OK',
            });
          }
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }

  getTermsAndConBasedOnId() {
    this.commanService
      .getTermsAndCond(
        this.quotationId,
        this.termsAndConPageIndex,
        this.termsAndConPageSize
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.termsAndConditions = response.records;
          this.termsAndConTotalItems = response.totalRecords;
        },
        error: (error: Error) => {
          console.error(error);
        },
      });
  }

  onVendorHistoryPageChange(event: any) {
    this.vendorPageIndex = event.pageIndex;
    this.vendorPageSize = event.pageSize;
    this.getVendorHistory();
  }

  onCloseVendorHistory() {
    this.isVendorHistoryPresent = false;
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
    this.getVendorHistory();
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

  onProjectSelect(event: any) {
    this.projectId = event.option.value.projectId;
    this.selectedProject = event.option.value;
    this.formData.patchValue({ projectId: this.projectId });
    this.getVendorHistory();
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
}
