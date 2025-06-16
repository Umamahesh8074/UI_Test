import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { Subject, takeUntil, tap } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { Project } from 'src/app/Models/Project/project';
import { Qrtransactiondata } from 'src/app/Models/Qrtransactiondata/qrtransactiondata';
import { User } from 'src/app/Models/User/User';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { QrtransactiondataService } from 'src/app/Services/Qrtransactiondata/qrtransactiondata.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-displayqrtransactiondata',
  templateUrl: './display-qrtransactiondata.component.html',
  styleUrls: ['./display-qrtransactiondata.component.css'],
  encapsulation: ViewEncapsulation.None, // Set ViewEncapsulation to None
})
export class DisplayqrtransactiondataComponent implements OnInit {
  projectName: string = '';

  projectData: Project[] = [];

  private destroy$ = new Subject<void>();
  qrtransactiondataData: Qrtransactiondata[] = [];
  qrtransactiondataName: string = '';
  displayedColumns: string[] = ['projectName', 'location', 'status'];
  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;

  //pagination
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  public user: User = new User();
  qrTransactionData: any;
  organizationId = 0;
  pageSizeOptions=pageSizeOptions;
  ngOnInit(): void {
    const user = localStorage.getItem("user");
    if (user != null) {
      this.user = JSON.parse(user);
      this.organizationId = this.user.organizationId;
      console.log(this.user.organizationId);
      console.log("ORG ID " + this.organizationId);
    }
    this.qrtransactiondataService.refreshRequired.subscribe(() => {
      this.getQrtransactiondata(this.projectName, this.organizationId);
    });
    this.qrTransactionData = history.state.qrgenerator;
    this.getQrtransactiondata(this.projectName, this.organizationId);
  }
  onSearch(searchText: any) {
    this.projectName = searchText;
    this.getQrtransactiondata(this.projectName, this.organizationId);
  }
  constructor(
    private qrtransactiondataService: QrtransactiondataService,
    private router: Router,
    public dialog: MatDialog,
    private projectService: ProjectService,
  ) {
    this.getQrtransactiondata(this.qrtransactiondataName, this.organizationId);
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getQrtransactiondata(this.qrtransactiondataName, this.organizationId);


  }

  getQrtransactiondata(projectName: any, organizationId:number) {
    this.qrtransactiondataName = projectName;
    this.qrtransactiondataService
      .getAllQrtransactiondata(projectName, this.pageIndex, this.pageSize, organizationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (qrtransactiondataData) => {
          this.qrtransactiondataData = qrtransactiondataData.records;
          this.totalItems = qrtransactiondataData.totalRecords;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }


  ///opening confirm dialog
  openConfirmDialog(qrtransactiondataId: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'Qrtransactiondata' }, // Pass the property as data to the dialog
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteQrtransactiondata(qrtransactiondataId);
        }
      }
    );
  }

  //delete qrtransactiondata by qrtransactiondata id
  deleteQrtransactiondata(qrtransactiondataId: number) {
    this.qrtransactiondataService
      .deleteQrtransactiondata(qrtransactiondataId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (qrtransactiondataData) => {
          console.log(qrtransactiondataData);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  //adding qrtransactiondata
  addQrtransactiondata() {
    this.router.navigate(['facility/management/addqrtransactiondata']);
  }

  editQrtransactiondata(qrtransactiondataData: any) {
    this.router.navigate(['layout/facility/management/qrtransaction'], {
      state: { qrtransactiondata: qrtransactiondataData },
    });
  }


  public isRecordsShown: boolean = false;
  // public startDate: null | undefined;
  // public endDate: null | undefined;

  onClickGenerateExcel() {
    // if (this.startDate != null || this.endDate != null) {
    //   //alert('Both date fields are mandatory!');
    // }


    this.qrtransactiondataService
      .generateExcel(this.projectName)
      .subscribe((response: Blob) => {

        // Create a blob from the response data
        const blob = new Blob([response], {

          type: 'application/vnd.ms-excel',
        });

        // For other browsers
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'report.xls';
        document.body.appendChild(a);
        a.click();

        // Cleanup
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        Swal.fire({
          position: 'center',
          icon: 'success',
          text: 'Report Downloded Successfully',
          showConfirmButton: false,
          timer: 2000,
        });
      });

  }
}
