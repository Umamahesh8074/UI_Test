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
  TOTAL_ITEMS,
} from 'src/app/Constants/CommanConstants/Comman';
import { NAVIGATE_TO_ADD_PROJECT_CHARGE } from 'src/app/Constants/Crm/CrmConstants';
import { IProjectChargeDto } from 'src/app/Models/Crm/ProjectCharge';
import { ProjectChargeService } from 'src/app/Services/CrmServices/project-charge.service';
import { PrimeActivityCodeService } from 'src/app/Services/WorkOrderService/PrimeActivityCode/PrimeActivityCode.service';

@Component({
  selector: 'app-display-project-charge',
  templateUrl: './display-project-charge.component.html',
  styleUrls: ['./display-project-charge.component.css'],
})
export class DisplayProjectChargeComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private destroy$ = new Subject<void>();
  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;

  //pagination
  totalItems: number = TOTAL_ITEMS;
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  pageSizeOptions = pageSizeOptions;

  projectChargeName: string = '';
  projectCharges: IProjectChargeDto[] = [];

  displayedColumns: string[] = [
    'rowNumber',
    'chargeName',
    'chargeIn',
    'amountCalculated',
    'project',
    'floor',
    'phase',
    'amount',
    'status',
    'actions',
  ];

  constructor(
    private primeActivityCodeService: PrimeActivityCodeService,
    private projectChargeService: ProjectChargeService,
    private router: Router,
    public dialog: MatDialog,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllProjectCharges();
    this.primeActivityCodeService.refreshRequired.subscribe(() => {
      this.getAllProjectCharges();
    });
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getAllProjectCharges();
  }

  getAllProjectCharges() {
    console.log("get all projectCharge...");
    
    this.projectChargeService
      .getAllProjectCharges(
        this.projectChargeName,
        this.pageIndex,
        this.pageSize
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (projectCharges) => {
          this.projectCharges = projectCharges.records;
          this.totalItems = projectCharges.totalRecords;
        },
        error: (error: Error) => {
          console.error('Error fetching prime activity code:', error);
        },
      });
  }

  onSearch(chargeName: string) {
    if (
      chargeName.length >= searchTextLength ||
      chargeName.length === searchTextZero
    ) {
      this.projectChargeName = chargeName;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.getAllProjectCharges();
    }
  }

  openConfirmDialog(projectChargeId: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'Project Charges' },
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteProjectCharges(projectChargeId);
        }
      }
    );
  }

  deleteProjectCharges(projectChargeId: number) {
    this.projectChargeService
      .deleteProjectCharge(projectChargeId)
      .subscribe({
        next: (response: any) => {
          this.handleSuccessResponse(response);
        },
        error: (error: Error) => {
          console.error('Error deleting prime activity code:', error);
        },
      });
  }

  AddProjectCharge() {
    this.router.navigate([NAVIGATE_TO_ADD_PROJECT_CHARGE], {
      state: { isAdding: true },
    });
  }

  editProjectCharge(projectCharge: IProjectChargeDto) {
    this.fetchProjectChargeById(projectCharge.id);
  }

  fetchProjectChargeById(projectChargeId: number) {
    this.projectChargeService
      .getProjectChargeById(projectChargeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (projectChargeData) => {
          console.log(projectChargeData);
          this.router.navigate([NAVIGATE_TO_ADD_PROJECT_CHARGE], {
            state: {
              projectCharge: projectChargeData,
              isAdding: false,
            },
          });
        },
        error: (error) => {
          console.error(error);
          console.error('Error fetching prime activity code by id:', error);
        },
      });
  }

  handleSuccessResponse(response: any): void {
    console.log(response.message);
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
}
