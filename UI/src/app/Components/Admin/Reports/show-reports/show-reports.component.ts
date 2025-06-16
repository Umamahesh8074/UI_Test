import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { Router } from '@angular/router';
import { ReportService } from 'src/app/Services/CommanService/report.service';
import { IReports } from 'src/app/Models/CommanModel/Reports';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-show-reports',
  templateUrl: './show-reports.component.html',
  styleUrls: ['./show-reports.component.css'],
})
export class ShowReportsComponent implements OnInit {
  reports: IReports[] = [];
  reportName: string = '';
  displayedColumns: string[] = ['rowNumber', 'name', 'status', 'actions'];
  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //pagination
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;

  pageSizeOptions = pageSizeOptions;

  ngOnInit(): void {
    this.reportService.refreshRequired.subscribe(() => {
      this.getReports(this.reportName);
    });
  }

  constructor(
    private reportService: ReportService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.getReports(this.reportName);
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getReports(this.reportName);
  }

  getReports(reportName: any) {
    this.reportName = reportName;
    this.reportService
      .getAllReports(reportName, this.pageIndex, this.pageSize)
      .subscribe({
        next: (leadsource) => {
          this.reports = leadsource.records;
          this.totalItems = leadsource.totalRecords;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  ///opening confirm dialog
  openConfirmDialog(report: IReports) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'delete ' + report.reportName }, // Pass the property as data to the dialog
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteReport(report);
        }
      }
    );
  }

  deleteReport(report: IReports) {
    this.reportService.deleteReport(report).subscribe({
      next: (resp) => {
        console.log(resp);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  //adding reports
  addReport() {
    this.router.navigate(['layout/reports/add']);
  }

  editReport(report: IReports) {
    this.reportService.getReportById(report.reportId).subscribe({
      next: (data: IReports) => {
        console.log(data);
        this.router.navigate(['layout/reports/add'], {
          state: { report: data },
        });
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
