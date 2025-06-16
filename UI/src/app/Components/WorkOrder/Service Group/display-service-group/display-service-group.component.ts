import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
  TOTAL_ITEMS,
} from 'src/app/Constants/CommanConstants/Comman';
import { NAVIGATE_TO_ADD_SERVICE_GROUP } from 'src/app/Constants/WorkOrder/workorder';
import { IServiceGroupDto } from 'src/app/Models/WorkOrder/ServiceGroup';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { ServiceGroupService } from 'src/app/Services/WorkOrderService/ServiceGroup/ServiceGroup.service';

@Component({
  selector: 'display-service-group',
  templateUrl: './display-service-group.component.html',
  styleUrls: ['./display-service-group.component.css'],
  encapsulation: ViewEncapsulation.None, // Set ViewEncapsulation to None
})
export class DisplayServiceGroupComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private destroy$ = new Subject<void>();
  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;

  //pagination
  totalItems: number = TOTAL_ITEMS;
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  pageSizeOptions = pageSizeOptions;

  serviceGroupName: string = '';
  serviceGroupCategory: string = '';
  serviceGroupCode: string = '';
  serviceGroupDescription: string = '';
  serviceGroupData: IServiceGroupDto[] = [];

  displayedColumns: string[] = [
    'rowNumber',
    'serviceGroupCategory',
    'serviceGroupName',
    'serviceGroupCode',
    'serviceGroupType',
    'description',
    'serviceGroupStatus',
    'actions',
  ];

  ngOnInit(): void {
    this.getDataFromState();
    this.getServiceGroups();
    this.serviceGroupService.refreshRequired.subscribe(() => {
      this.getServiceGroups();
    });
  }

  constructor(
    private serviceGroupService: ServiceGroupService,
    private router: Router,
    public dialog: MatDialog,
    private toastrService: ToastrService,
    private loaderService: LoaderService
  ) {}

  getDataFromState() {
    const { statePageSize, statePageIndex } = history.state;
    console.log(statePageIndex, statePageSize);
    if (statePageSize && statePageIndex !== undefined) {
      this.pageSize = statePageSize;
      this.pageIndex = statePageIndex;
    }
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getServiceGroups();
  }

  getServiceGroups() {
    this.showLoading();
    this.serviceGroupService
      .getAllServiceGroup(
        this.serviceGroupName,
        this.serviceGroupCategory,
        this.serviceGroupCode,
        this.serviceGroupDescription,
        this.pageIndex,
        this.pageSize
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (serviceGroupData) => {
          this.totalItems = serviceGroupData.totalRecords;
          this.paginator.pageIndex = this.pageIndex;
          this.paginator.pageSize = this.pageSize;
          this.serviceGroupData = serviceGroupData.records;
          this.hideLoading();
        },
        error: (error) => {
          console.error(error);
          this.hideLoading();
        },
      });
  }

  onSearch(serviceGroupName: string) {
    if (
      serviceGroupName.length >= searchTextLength ||
      serviceGroupName.length === searchTextZero
    ) {
      this.serviceGroupName = serviceGroupName;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.getServiceGroups();
    }
  }

  openConfirmDialog(serviceGroupId: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'delete Service Group' },
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.inactiveServicegroup(serviceGroupId);
        }
      }
    );
  }

  inactiveServicegroup(serviceGroupId: number) {
    this.showLoading();
    this.serviceGroupService.inActivateServiceGroup(serviceGroupId).subscribe({
      next: (response: any) => {
        this.handleSuccessResponse(response);
        this.hideLoading();
      },
      error: (error: Error) => {
        console.error('Error deleting prime activity code:', error);
        this.hideLoading();
      },
    });
  }
  AddServiceGroup() {
    this.router.navigate([NAVIGATE_TO_ADD_SERVICE_GROUP], {
      state: {
        isAdding: true,
        statePageSize: this.pageSize,
        statePageIndex: this.pageIndex,
      },
    });
  }

  editServiceGroup(serviceGroupData: any) {
    this.fetchServiceGroupById(serviceGroupData.serviceGroupId);
  }

  fetchServiceGroupById(serviceGroupId: number) {
    this.showLoading();
    this.serviceGroupService
      .getServiceGroupById(serviceGroupId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (serviceGroupData) => {
          this.hideLoading();
          this.router.navigate([NAVIGATE_TO_ADD_SERVICE_GROUP], {
            state: {
              serviceGroup: serviceGroupData,
              isAdding: false,
              statePageSize: this.pageSize,
              statePageIndex: this.pageIndex,
            },
          });
        },
        error: (error) => {
          console.error(error);
          this.hideLoading();
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

  onCategorySearch(searchText: string) {
    if (
      searchText.length >= searchTextLength ||
      searchText.length === searchTextZero
    ) {
      this.serviceGroupCategory = searchText;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.getServiceGroups();
    }
  }

  onCodeSearch(searchText: string) {
    if (
      searchText.length >= searchTextLength ||
      searchText.length === searchTextZero
    ) {
      this.serviceGroupCode = searchText;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.getServiceGroups();
    }
  }

  onServiceCodeDescriptionSearch(searchText: string) {
    if (
      searchText.length >= searchTextLength ||
      searchText.length === searchTextZero
    ) {
      this.serviceGroupDescription = searchText;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.getServiceGroups();
    }
  }

  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }
}
