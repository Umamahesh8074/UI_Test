import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { Router } from '@angular/router';
import { ReportFieldsService } from 'src/app/Services/CommanService/report-fields.service';
import {
  IReportField,
  IReportFieldDto,
} from 'src/app/Models/CommanModel/ReportField';
import { ReportsService } from 'src/app/Services/Reports/reports.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-display-reportField-field',
  templateUrl: './display-report-field.component.html',
  styleUrls: ['./display-report-field.component.css'],
})
export class DisplayreportFieldComponent implements OnInit {
  reportFields: IReportFieldDto[] = [];

  reportFieldName: string = '';
  displayedColumns: string[] = [
    'rowNumber',
    'reportName',
    'fieldName',
    'status',
    'actions',
  ];
  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //pagination
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;

  pageSizeOptions = pageSizeOptions;

  ngOnInit(): void {
    this.reportFieldService.refreshRequired.subscribe(() => {
      this.getReportFields(this.reportFieldName);
    });
  }

  constructor(
    private reportFieldService: ReportFieldsService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.getReportFields(this.reportFieldName);
  }

  onSearch(reportFieldName: any) {
    this.pageIndex = 0;
    this.paginator.firstPage();
    this.getReportFields(reportFieldName);
  }
  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getReportFields(this.reportFieldName);
  }

  getReportFields(reportFieldName: any) {
    this.reportFieldName = reportFieldName;
    this.reportFieldService
      .getAllReportFields(reportFieldName, this.pageIndex, this.pageSize)
      .subscribe({
        next: (resp) => {
          console.log(JSON.stringify(resp.records));
          this.reportFields = resp.records;
          this.totalItems = resp.totalRecords;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  ///opening confirm dialog
  openConfirmDialog(reportField: IReportField) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: ' delete ' + reportField.fieldName }, // Pass the property as data to the dialog
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteReportField(reportField);
        }
      }
    );
  }

  deleteReportField(reportField: IReportField) {
    this.reportFieldService.deleteReportField(reportField).subscribe({
      next: (resp) => {
        console.log(resp);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  //adding reportField
  addReportField() {
    this.router.navigate(['layout/report/field/add']);
  }

  editReportField(reportField: IReportFieldDto) {
    this.reportFieldService.getReportFieldById(reportField.fieldId).subscribe({
      next: (data: IReportField) => {
        console.log(data);
        this.router.navigate(['layout/report/field/add'], {
          state: { reportField: data },
        });
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
