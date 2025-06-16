import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import { leadPageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { CommonReferenceDetailsDto } from 'src/app/Models/User/CommonReferenceDetailsDto';
import { User } from 'src/app/Models/User/User';
import { CommonreferencedetailsService } from 'src/app/Services/UserService/commonreferencedetails.service';

@Component({
  selector: 'app-displaycommonreferencedetails',
  templateUrl: './displaycommonreferencedetails.component.html',
  styleUrls: ['./displaycommonreferencedetails.component.css'],
})
export class DisplaycommonreferencedetailsComponent {
  private subscription: Subscription;
  private destroy$ = new Subject<void>();
  organizationId = 0;
  roleId = 0;
  commonReferenceDetailsData: CommonReferenceDetailsDto[] = [];
  public user: User = new User();
  displayedColumns: string[] = [
    'name',
    'commonRefKey',
    'commonRefValue',
    'refValue',
    'refOrder',
    'actions',
  ];
  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;
  commonRefValue: string = '';

  //pagination
  totalItems: number = 0;
  pageSize: number = 25;
  pageIndex: number = 0;
  pageSizeOptions = leadPageSizeOptions;
  //ng on init
  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user != null) {
      this.user = JSON.parse(user);
      this.organizationId = this.user.organizationId;
      this.roleId = this.user.roleId;
      console.log(this.user.organizationId);
    }
    this.getCommonReferenceDetailsByName('');
    this.commonReferenceDetailsService.refreshRequired
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.getCommonReferenceDetailsByName(this.commonRefValue);
      });
  }

  constructor(
    private commonReferenceDetailsService: CommonreferencedetailsService,
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
    this.getCommonReferenceDetailsByName(this.commonRefValue, this.pageIndex); // Pass pageIndex explicitly
  }

  openConfirmDialog(id: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'delete CommonReferenceType' }, // Pass the property as data to the dialog
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteCommonReferenceDetails(id);
        }
      }
    );
  }

  deleteCommonReferenceDetails(id: number) {
    this.commonReferenceDetailsService
      .deleteCommonReferenceDetails(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (comnrefData) => {
          this.getCommonReferenceDetailsByName(this.commonRefValue);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  addCommonReferenceDetails() {
    this.router.navigate(['layout/addcommonreferencedetails']);
  }

  editCommonReferenceDetails(commonreferencedetails: any) {
    this.commonReferenceDetailsService
      .getById(commonreferencedetails.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (comnrefData) => {
          this.router.navigate(['layout/addcommonreferencedetails'], {
            state: { commonreferencedetails: comnrefData },
          });
        },
        error: (error: any) => {
          console.error('Error fetching CommonReferenceDetails:', error);
        },
      });
  }

  getCommonReferenceDetailsByName(name: any, pageIndex: number = 0) {
    // Reset pageIndex if the search term has changed
    if (this.commonRefValue !== name) {
      this.pageIndex = 0;
    } else {
      this.pageIndex = pageIndex;
    }

    this.commonRefValue = name;
    this.commonReferenceDetailsService
      .fetchAllCommonReferenceDetails(
        name,
        this.roleId,
        this.pageIndex,
        this.pageSize
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (comnrefData) => {
          this.commonReferenceDetailsData = comnrefData.records;
          this.totalItems = comnrefData.totalRecords;
        },
        error: (error: any) => {
          console.error('Error fetching CommonReferenceDetails:', error);
        },
      });
  }
}
