import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { CommonReferenceType } from 'src/app/Models/CommanModel/menuDto';
import { LogEntry } from 'src/app/Models/logentry/logentry';

import { ClientService } from 'src/app/Services/client/client.service';
import { clientinvoicereportService } from 'src/app/Services/clientinvoicereport/clientinvoicereport.service';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LogEntryService } from 'src/app/Services/logentry/logentry.service';

@Component({
  selector: 'app-displaylogentry',
  templateUrl: './displaylogentry.component.html',
  styleUrls: ['./displaylogentry.component.css'],
})
export class Displaylogentry implements OnInit {

  private destroy$ = new Subject<void>();
  clientName: string = '';
  serviceName: string = '';

  flag: boolean = false;
  logEntry:LogEntry[]=[];


  displayedColumns: string[] = [
    'procedureName',
    'message',
    'executionTime'


  ];
  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;

  //pagination
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  pageSizeOptions = pageSizeOptions;
  reportId: any;
  consumptionId: any;
  referenceKey: any;
  message: string='';
  id: any;
  executionTime: string='';
  procedureName: string='';
  formData: any;



  constructor(
    private clientinvoicereportService: clientinvoicereportService,
    private router: Router,
    public dialog: MatDialog,
    private logEntryService: LogEntryService,
    private commonService: CommanService,
  ) {

  }
  ngOnInit(): void {
    this.clientinvoicereportService.refreshRequired.subscribe(() => {

    });
    this.getLogEntry();



  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getLogEntry();  }


getLogEntry()
{
  this.logEntryService
  .getLogEntry(

    this.message,
    this.executionTime,
    this.procedureName,
    this.pageIndex,
    this.pageSize,
  )
  .pipe(takeUntil(this.destroy$))
  .subscribe({
    next: (logEntry) => {
      this.logEntry = logEntry.records;
      console.log(logEntry.records);
      this.totalItems = logEntry.totalRecords;

      // this.logEntry = this.logEntry.filter(
      //   (item, index, self) =>
      //     index === self.findIndex((t) => t.procedureName === item.procedureName)
      // );
    },
    error: (error) => {
      console.error('Error fetching users:', error);
    },
  });
}

private loadMessageById(): void {
  this.logEntryService.getMessageById(this.id).subscribe({
    next: (resp) => {
     // this.id = resp;

      this.formData.patchValue({
        clientId: resp.id,
        procedureName: resp.procedureName,
        message: resp.message
      });
    },
    error: (err) => {
      console.error('Error loading projects', err);
    },
  });
}





onselectProcedureName(event: any): void {
  const procedureName= event.value;
  console.log(procedureName);

  this.procedureName =procedureName;
  this.getLogEntryById()
 // this.onselectMessage(event)
}

getLogEntryById()
    {
      this.logEntryService
      .getLogEntryById(

        this.message,
        this.executionTime,
        this.procedureName,
        this.pageIndex,
        this.pageSize,
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (logEntry) => {
          this.logEntry = logEntry.records;
          console.log(logEntry.records);
          this.totalItems = logEntry.totalRecords;

          // this.logEntry = this.logEntry.filter(
          //   (item, index, self) =>
          //     index === self.findIndex((t) => t.procedureName === item.procedureName)
          // );
        },
        error: (error) => {
          console.error('Error fetching users:', error);
        },
      });
    }



onselectMessage(event: any): void {
    const selectedClientName= event.value;
    console.log(selectedClientName);

    this.message = selectedClientName;
    console.log(this.message);
    this.onselectExecutionTime(event)
  }
  onselectExecutionTime(event: any): void {
    const selectedClientName= event.value;
    console.log(selectedClientName);

    this.executionTime= selectedClientName;
    console.log(this.executionTime);

  }







  editClientInvoiceReport(monthlyInvoiceReport: any) {
    console.log(monthlyInvoiceReport);

    console.log("hiii");
    this.router.navigate(['layout/facility/management/addClientinvoicereport'], {

      state: { monthlyInvoiceReport: monthlyInvoiceReport },

    });
  }



  addClientInvoiceReport() {
    this.router.navigate(['layout/facility/management/addClientinvoicereport']);
  }
}
