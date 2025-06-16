import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { Router } from '@angular/router';
import { ReportFieldsService } from 'src/app/Services/CommanService/report-fields.service';
import { IReportField } from 'src/app/Models/CommanModel/ReportField';
import { ReportsService } from 'src/app/Services/Reports/reports.service';
import { ExcelMappingService } from 'src/app/Services/CommanService/excel-mapping.service';
import {
  IExcelMapping,
  IExcelMappingDto,
} from 'src/app/Models/CommanModel/excelMapping';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-display-excel-mappings',
  templateUrl: './display-excel-mappings.component.html',
  styleUrls: ['./display-excel-mappings.component.css'],
})
export class DisplayExcelMappingsComponent implements OnInit {
  reportFields: IReportField[] = [];
  excelMappings: IExcelMappingDto[] = [];
  expectedHeader: string = '';
  displayedColumns: string[] = [
    'rowNumber',
    'fieldName',
    'expectedHeader',
    'reportFieldStatus',
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
      this.getExcelMappings(this.expectedHeader);
    });
  }

  constructor(
    private reportFieldService: ReportFieldsService,
    private excelMappingService: ExcelMappingService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.getExcelMappings(this.expectedHeader);
  }

  onSearch(expectedHeader: any) {
    this.pageIndex = 0;
    this.paginator.firstPage();
    this.getExcelMappings(expectedHeader);
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getExcelMappings(this.expectedHeader);
  }

  getExcelMappings(expectedHeader: any) {
    this.expectedHeader = expectedHeader;
    this.excelMappingService
      .getAllExcelMappings(expectedHeader, this.pageIndex, this.pageSize)
      .subscribe({
        next: (resp) => {
          console.log(JSON.stringify(resp.records));
          this.excelMappings = resp.records;
          this.totalItems = resp.totalRecords;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  ///opening confirm dialog
  openConfirmDialog(excelMapping: IExcelMapping) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'delete ' + excelMapping.expectedHeader }, // Pass the property as data to the dialog
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteExcelMapping(excelMapping);
        }
      }
    );
  }

  deleteExcelMapping(excelMapping: IExcelMapping) {
    this.excelMappingService.deleteExcelMapping(excelMapping).subscribe({
      next: (resp) => {
        console.log(resp);
        this.getExcelMappings(this.expectedHeader);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  //adding reportField
  addExcelMapping() {
    this.router.navigate(['layout/excel/mapping/add']);
  }

  editExcelMapping(excelMapping: IExcelMapping) {
    this.excelMappingService.getExcelMappingById(excelMapping.id).subscribe({
      next: (data: IExcelMapping) => {
        console.log(data);
        this.router.navigate(['layout/excel/mapping/add'], {
          state: { excelMapping: data },
        });
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
