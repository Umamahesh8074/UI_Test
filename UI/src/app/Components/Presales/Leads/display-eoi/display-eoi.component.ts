import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { EoiDto } from 'src/app/Models/Eoi/eoi';
import { User } from 'src/app/Models/User/User';
import { EoiService } from 'src/app/Services/Presales/eoi.service';

@Component({
  selector: 'app-display-eoi',
  templateUrl: './display-eoi.component.html',
  styleUrls: ['./display-eoi.component.css'],
})
export class DisplayEoiComponent implements OnInit, OnDestroy {
  
  public user: User = new User();
  private destroy$ = new Subject<void>();
  eoiData: EoiDto[] = [];
  organizationId: number = 0;
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  pageSizeOptions = pageSizeOptions;
  firstApplName: any='';

  constructor(
    private eoiService: EoiService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
      this.organizationId = this.user.organizationId;
      console.log('ORG ID:', this.organizationId);
    }
    this.getAllEoi();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getAllEoi();
  }

  displayedColumns: string[] = [
    'firstApplName',
    'firstApplPhoneNumber',
    'firstApplAddress',
    'secondApplName',
    'secondApplPhoneNumber',
   
    'unitTypeName',
    'projectName',
    'status',
    'actions'
  ];

  onSearch(searchText: string) {
    this.firstApplName = searchText;
    this.getAllEoi(this.firstApplName);
  }

  addAssetAllocation() {
    this.router.navigate(['layout/sales/addEoi']);
  }

  openConfirmDialog(id: number) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'EOI' },
    });

    dialogRef.componentInstance.isConfirmDelete
      .pipe(takeUntil(this.destroy$))
      .subscribe((isDelete: boolean) => {
        if (isDelete) {
          this.deleteAssetAllocation(id);
        }
      });
  }

  deleteAssetAllocation(id: number) {
    this.eoiService
      .deleteEoiDetails(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('EOI deleted successfully:', response);
          this.getAllEoi();
        },
        error: (error) => {
          console.error('Error deleting EOI:', error);
        },
      });
  }

  getAllEoi(firstApplName?: string) {
    this.eoiService
      .getAllEoiDetails(firstApplName || this.firstApplName, this.pageIndex, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (eoiData) => {
          this.eoiData = eoiData.records;
          this.totalItems = eoiData.totalRecords;
        },
        error: (error) => {
          console.error('Error fetching EOIs:', error);
        },
      });
  }

  editEoi(eoiData: EoiDto) {
    this.router.navigate(['layout/sales/addEoi'], {
      state: { eoiData: eoiData },
    });
  }
}
