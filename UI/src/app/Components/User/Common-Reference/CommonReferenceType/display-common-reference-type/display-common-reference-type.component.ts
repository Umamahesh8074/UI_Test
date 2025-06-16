import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import { CommonReferenceType } from 'src/app/Models/User/CommonReferenceType';
import { CommonreferencetypeService } from 'src/app/Services/UserService/commonreferencetype.service';

@Component({
  selector: 'app-display-common-reference-type',
  templateUrl: './display-common-reference-type.component.html',
  styleUrls: ['./display-common-reference-type.component.css'],
})
export class DisplayCommonReferenceTypeComponent {
  private subscription: Subscription;
  private destroy$ = new Subject<void>();
  commonReferenceTypeData: CommonReferenceType[] = [];

  displayedColumns: string[] = ['name', 'actions'];
  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;
  name: string = '';

  //pagination
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;

  //ng on init
  ngOnInit(): void {
    this.getCommonReferenceTypeByName('');
    this.commonReferenceTypeService.refreshRequired
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.getCommonReferenceTypeByName(this.name);
      });
  }

  constructor(
    private commonReferenceTypeService: CommonreferencetypeService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.subscription = new Subscription();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.destroy$.next(); // Unsubscribe from the destroy$ Subject
    this.destroy$.complete(); // Complete the destroy$ Subject
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getCommonReferenceTypeByName(this.name); // Keep the search term
  }

  openConfirmDialog(id: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'delete CommonReferenceType' }, // Pass the property as data to the dialog
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteCommonReferenceType(id);
        }
      }
    );
  }

  deleteCommonReferenceType(id: number) {
    this.commonReferenceTypeService
      .deleteCommonReferenceType(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (comnrefData) => {
          console.log(comnrefData);

          this.getCommonReferenceTypeByName(this.name);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  addCommonReferenceType() {
    this.router.navigate(['layout/addcommonreferencetype']);
  }

  editCommonReferenceType(commonReferenceType: any) {
    this.router.navigate(['layout/addcommonreferencetype'], {
      state: { commonReferenceType: commonReferenceType },
    });
  }

  // getCommonReferenceTypeByName(name: any) {
  //   this.name = name;
  //   this.commonReferenceTypeService
  //     .getAllCommonReferenceTypeByName(name, this.pageIndex, this.pageSize)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (comnrefData) => {
  //         this.commonReferenceTypeData = comnrefData.records;
  //         this.totalItems = comnrefData.totalRecords;
  //         console.log(comnrefData.records);
  //       },
  //       error: (error: any) => {
  //         console.error('Error fetching CommonReferenceType:', error);
  //       },
  //     });
  //   }
  getCommonReferenceTypeByName(name: string) {
    if (this.name !== name) {
      this.pageIndex = 0; // Reset to first page on new search
    }
    this.name = name;
    this.commonReferenceTypeService
      .getAllCommonReferenceTypeByName(name, this.pageIndex, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (comnrefData) => {
          this.commonReferenceTypeData = comnrefData.records;
          this.totalItems = comnrefData.totalRecords;
          console.log(comnrefData.records);
        },
        error: (error: any) => {
          console.error('Error fetching CommonReferenceType:', error);
        },
      });
  }
}
