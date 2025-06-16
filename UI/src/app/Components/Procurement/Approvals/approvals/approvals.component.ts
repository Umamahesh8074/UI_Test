import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { forkJoin, Observable, Subject, takeUntil } from 'rxjs';
import { ApproveDialogComponent } from 'src/app/Comman-Components/Dialog/approvaldialog/approvedialog.component';
import { StoreItemDialogComponent } from 'src/app/Comman-Components/Dialog/storeitemdialog/storeitemdialog.component';
import { Approvals, IApprovals } from 'src/app/Models/Procurement/approvals';
import { IIndentItems } from 'src/app/Models/Procurement/indentDto';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';

import { ApprovalsService } from 'src/app/Services/ProcurementService/Approvals/approvals.service';
import { IndentService } from 'src/app/Services/ProcurementService/Indent/indent.service';
import { IndentItemService } from 'src/app/Services/ProcurementService/IndentItem/indent-item.service';
import { StoreInventoryService } from 'src/app/Services/ProcurementService/StoreInventory/store-inventory.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-approvals',
  templateUrl: './approvals.component.html',
  styleUrls: ['./approvals.component.css'],
})
export class ApprovalsComponent implements OnInit {
  remarks: string = '';
  approvals: IApprovals = new Approvals();
  isAdding: boolean = true;
  workflowTypeId: number = 0;
  approvalIndents: any;
  indentItems: IIndentItems[] = [];
  materialCodeIds: number[] = [];
  indentId: number = 0;
  loggedInUserId: number = 0;
  organizationId: number = 0;
  private destroy$ = new Subject<void>();
  formData!: FormGroup;
  stages: any;
  isLoading: boolean = true;
  isFromPendingApporvals: boolean = true;
  displayPageData: any;
  itemUnitIds: number[] = [];

  //pagination
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  createdUserId: number = 0;
  displayedColumns: string[] = [
    'category',
    'subCategory',
    'specification',
    'unit',
    'quantity',
  ];
  constructor(
    private router: Router,
    private approvalsService: ApprovalsService,
    public dialog: MatDialog,
    private indentItemService: IndentItemService,
    private commonService: CommanService,
    private indentService: IndentService,
    private loaderService: LoaderService,
    private storeInventoryService: StoreInventoryService
  ) {}

  ngOnInit(): void {
    this.setUserFromLocalStorage();
    this.getDataFromState();
  }

  private setUserFromLocalStorage(): void {
    const user = this.commonService.getUserFromLocalStorage();
    if (user) {
      this.loggedInUserId = user.userId;
      this.organizationId = user.organizationId;
    }
  }
  getDataFromState() {
    const { approvalIndents, isFromPendingApporvals, displayPage } =
      history.state;
    this.approvalIndents = approvalIndents;
    if (approvalIndents) {
      this.createdUserId = approvalIndents.createdUserId;
      this.indentId = approvalIndents.indentId;
      this.workflowTypeId = this.approvalIndents.workflowTypeId;
    }
    this.isFromPendingApporvals = isFromPendingApporvals;
    if (displayPage) {
      this.displayPageData = displayPage;
    }
    if (this.indentId) {
      this.loadDetails();
    }
  }

  loadDetails() {
    this.isLoading = true;
    forkJoin({
      indentItems:
        this.indentItemService.getIndentItemsByIndentIdWithPagination(
          this.indentId,
          this.pageIndex,
          this.pageSize,
          this.loggedInUserId
        ),
      stages: this.indentService.getStages(this.indentId, this.createdUserId),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ indentItems, stages }) => {
          this.indentItems = indentItems.records;
          this.materialCodeIds = this.indentItems.map(
            (item) => item.materialCodeId
          );
          this.totalItems = indentItems.totalRecords;
          this.stages = stages;
        },
        error: (err) => {
          console.error(err);
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadDetails();
  }

  updateApprovalStatus(status: string) {
    this.showLoading();
    this.approvalsService
      .updateApprovalStatus(
        this.approvalIndents.indentId,
        this.workflowTypeId,
        this.loggedInUserId,
        status,
        this.remarks
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate(['layout/procurement/approval']);
          this.hideLoading();
        },
        error: (err) => {
          console.error('Error updating Approvals', err);
          this.hideLoading();
        },
      });
  }

  approvalStatus(statuss: string) {
    this.fetchStockInventory().subscribe((canRaise) => {
      if (canRaise) {
        this.sendForApproval(statuss);
      } else {
        console.log('User chose NOT to raise indent.');
      }
    });
  }

  fetchStockInventory(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.storeInventoryService
        .getStoreInventory(this.pageIndex, this.pageSize, this.materialCodeIds)
        .subscribe({
          next: (response) => {
            if (!response.records || response.records.length === 0) {
              observer.next(true);
              observer.complete();
            } else {
              const dialogRef = this.dialog.open(StoreItemDialogComponent, {
                width: '800px',
                data: {
                  records: response.records,
                  status: 'approval',
                },
              });

              dialogRef.afterClosed().subscribe((result) => {
                if (result?.status === 'cancel') {
                  // this.router.navigate(['/layout/procurement/approval']);
                  observer.next(false);
                } else if (result?.status === 'raise') {
                  observer.next(true);
                } else {
                  observer.next(false);
                }
                observer.complete();
              });
            }
          },
          error: (error) => {
            observer.next(false);
            observer.complete();
          },
        });
    });
  }

  sendForApproval(statuss: string) {
    const dialogRef = this.dialog.open(ApproveDialogComponent, {
      width: '40%',
      height: '300px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const { status, remarks } = result;
        this.remarks = remarks;
        console.log(this.remarks, status);
        if (remarks && status !== 'cancel') {
          this.updateApprovalStatus(statuss);
        }
      }
    });
  }
  
  gotoIndent() {
    if (this.isFromPendingApporvals) {
      this.router.navigate(['layout/procurement/approval'], {
        state: {
          displayPageData: this.displayPageData,
        },
      });
    } else {
      this.router.navigate(['layout/procurement/aprove/rejected/indents'], {
        state: {
          displayPageData: this.displayPageData,
        },
      });
    }
  }

  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }
}
