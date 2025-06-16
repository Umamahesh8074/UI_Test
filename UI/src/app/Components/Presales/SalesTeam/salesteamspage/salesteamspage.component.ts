import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { ISalesTeamDto } from 'src/app/Models/Presales/salesteam';
import { User } from 'src/app/Models/User/User';
import { SaleteamService } from 'src/app/Services/Presales/SalesTeam/saleteam.service';

@Component({
  selector: 'app-salesteamspage',
  templateUrl: './salesteamspage.component.html',
  styleUrls: ['./salesteamspage.component.css'],
})
export class SalesteamspageComponent implements OnInit {
  salesTeam: ISalesTeamDto[] = [];
  projectId?: number;
  private destroy$ = new Subject<void>();

  displayedColumns: string[] = [
    'name',
    'projectName',
    'leadName',
    'status',
    'actions',
  ];
  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;

  //pagination
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  name: string = '';
  pageSizeOptions = pageSizeOptions;
  public user: User = new User();
  organizationId: any;
  constructor(
    private salesTeamService: SaleteamService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchSalesTeam();
    const user = localStorage.getItem('user');
    if (user != null) {
      this.user = JSON.parse(user);
      console.log(this.user.organizationId);
      this.organizationId = this.user.organizationId;
      console.log(this.organizationId);
    }
  }

  fetchSalesTeam() {
    this.salesTeamService
      .fetchAllSaleTeam(
        this.name,
        this.pageIndex,
        this.pageSize,
        this.projectId
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (salesTeam) => {
          console.log(salesTeam);
          this.salesTeam = salesTeam.records;
          this.totalItems = salesTeam.totalRecords;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
  addSalesTeam() {
    this.router.navigate(['layout/presales/save/salesteam'], {
      state: { organizationId: this.organizationId },
    });
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.fetchSalesTeam();
  }

  openConfirmDialog(id: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'leadSubSource' }, // Pass the property as data to the dialog
    });
    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.delete(id);
        }
      }
    );
  }

  editSalesTeam(element: any) {
    console.log(element.id);
    this.salesTeamService
      .getById(element.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (salesTeam) => {
          this.router.navigate(['layout/presales/save/salesteam'], {
            state: { saleTeam: salesTeam, organizationId: this.organizationId },
          });
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
  delete(id: any) {
    this.salesTeamService
      .deleteById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (salesTeam) => {
          this.fetchSalesTeam();
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
  onSaleTeamSerach(searchText: any) {
    console.log(searchText);
    this.name = searchText;
    this.fetchSalesTeam();
  }
}
