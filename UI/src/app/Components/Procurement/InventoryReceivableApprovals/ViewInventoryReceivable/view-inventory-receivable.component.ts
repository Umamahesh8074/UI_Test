import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, takeUntil } from 'rxjs';
import { ReusableComponent } from 'src/app/Comman-Components/base-component/base.component';
import { ApproveDialogComponent } from 'src/app/Comman-Components/Dialog/approvaldialog/approvedialog.component';
import {
  PAGE_INDEX,
  PAGE_SIZE,
  searchTextLength,
  searchTextZero,
  TOTAL_ITEMS,
} from 'src/app/Constants/CommanConstants/Comman';
import { IProject, Project } from 'src/app/Models/Project/project';
import { IVendor, Vendor } from 'src/app/Models/WorkOrder/VendorData';

import { IStagesDto } from 'src/app/Models/WorkOrder/WorkOrderBilling';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { ApprovalsService } from 'src/app/Services/ProcurementService/Approvals/approvals.service';
import { InventoryReceivableService } from 'src/app/Services/ProcurementService/InventoryReceivable/inventory-receivable.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { vendorService } from 'src/app/Services/WorkOrderService/Vendor Data/vendor.service';

@Component({
  selector: 'app-view-inventory-receivable',
  templateUrl: './view-inventory-receivable.component.html',
  styleUrls: ['./view-inventory-receivable.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ViewInventoryReceivableComponent
  extends ReusableComponent
  implements OnInit
{
  inventoryReceivables: any;
  stages: IStagesDto[] = [];
  routeStatus: string = '';
  remarks: string = '';
  workflowTypeId: number = 0;
  inventoryReceivableId: number = 0;
  inventoryReceivableItems: any = [];
  poId: number = 0;
  irId: number = 0;

  previousPageSize = PAGE_SIZE;
  previousPageIndex = PAGE_INDEX;
  previousTotalItems: number = TOTAL_ITEMS;
  previousQuotationtems: any;

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
    'irId',
    'materialCode',
    'categoryName',
    'subCategoryName',
    'specificationName',
    'inventoryUnitName',
    'totalQuantityReceived',
    'totalQuantityExceed',
  ];

  ngOnInit(): void {
    super.setUserFromLocalStorage();
    this.getDataFromState();
    this.loadDetails();
    this.fetchProjects();
    this.fetchVendors();
  }

  constructor(
    private inventoryReceivableService: InventoryReceivableService,
    commanService: CommanService,
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
    const { inventoryReceivable, routeStatus } = history.state;
    if (inventoryReceivable != null && inventoryReceivable != undefined) {
      this.inventoryReceivables = inventoryReceivable;
      this.poId = inventoryReceivable.poId;
      this.irId = inventoryReceivable.irId;
      this.routeStatus = routeStatus;
      this.workflowTypeId = inventoryReceivable.workFlowTypeId;
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
      inventoryReceivable:
        this.inventoryReceivableService.getInventoryReceivableItemsByPoId(
          this.irId,
          this.pageIndex,
          this.pageSize
        ),
      stages: this.inventoryReceivableService.getStages(this.irId, this.userId),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ inventoryReceivable, stages }) => {
          this.inventoryReceivableItems = inventoryReceivable.records;
          this.stages = stages;
          this.hideLoading();
        },
        error: (err) => {
          this.hideLoading();
        },
      });
  }

  updateApprovalStatus(status: string) {
    this.showLoading();
    this.approvalsService
      .updateApprovalStatus(
        this.irId,
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

  goBack() {
    switch (this.routeStatus) {
      case 'pending':
        this.router.navigate(['./goodsreceived/pendingapproval'], {
          relativeTo: this.route.parent,
        });
        break;
      case 'rework':
        this.router.navigate(['./goodsreceived/nonpendingapproval'], {
          relativeTo: this.route.parent,
        });
        break;
      case 'create':
        this.router.navigate(['./pending/ir'], {
          relativeTo: this.route.parent,
        });
        break;
      case 'approve':
        this.router.navigate(['./app/rej/ir'], {
          relativeTo: this.route.parent,
        });
        break;
    }
  }

  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }
}
