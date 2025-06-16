import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { Subject, takeUntil, tap } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { Project } from 'src/app/Models/Project/project';
import { Qrgenerator } from 'src/app/Models/Qrgenerator/qrgenerator';
import { User } from 'src/app/Models/User/User';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { QrgeneratorService } from 'src/app/Services/Qrgenerator/qrgenerator.service';

@Component({
  selector: 'app-displayqrgenerator',
  templateUrl: './display-qrgenerator.component.html',
  styleUrls: ['./display-qrgenerator.component.css'],
  encapsulation: ViewEncapsulation.None, // Set ViewEncapsulation to None
})
export class DisplayqrgeneratorComponent implements OnInit {
  projectName: string = '';
  pageSizeOptions=pageSizeOptions;
  projectData: Project[] = [];

  private destroy$ = new Subject<void>();
  qrgeneratorData: Qrgenerator[] = [];
  qrGeneratorName: string = '';
  displayedColumns: string[] = ['projectName', 'location', 'status', 'actions'];
  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;

  //pagination
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  qrgenerator: any;
  public user: User = new User();
  organizationId = 0;
  orgId: any;
  referenceKey: any;

  onSearch(searchText: any) {
    this.projectName = searchText;
    this.getQrgenerator(this.projectName, this.organizationId);
  }


  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user != null) {
      this.user = JSON.parse(user);
      this.organizationId = this.user.organizationId;
      console.log(this.user.organizationId);
      console.log(this.organizationId);
    }

    this.getQrgenerator(this.qrGeneratorName,this.organizationId);

    // this.qrgeneratorService.refreshRequired.subscribe(() => {
    //   this.getQrgenerator(this.projectName);
    // });
    this.qrgenerator = history.state.qrgenerator;


  }

  constructor(
    private qrgeneratorService: QrgeneratorService,
    private router: Router,

    public dialog: MatDialog

  ) {
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getQrgenerator(this.qrGeneratorName,this.organizationId);
  }

  getQrgenerator(projectName: any,organizationId:number) {
    this.qrGeneratorName = projectName;
    console.log(projectName);
    console.log(this.qrGeneratorName);
    this.qrgeneratorService
      .getAllQrgenerator(
        this.qrGeneratorName,
        this.pageIndex,
        this.pageSize,
        organizationId
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (qrgeneratorData) => {
          this.qrgeneratorData = qrgeneratorData.records;
          this.totalItems = qrgeneratorData.totalRecords;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  ///opening confirm dialog
  openConfirmDialog(id: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'Qrgenerator' }, // Pass the property as data to the dialog
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteQrgenerator(id);
        }
      }
    );
  }

  //delete qrgenerator by qrgenerator id
  deleteQrgenerator(id: number) {
    this.qrgeneratorService
      .deleteQrgenerator(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          console.log();
          this.getQrgenerator(this.qrGeneratorName,this.organizationId);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  //adding qrgenerator
  addQrgenerator() {
    this.router.navigate(['layout/facility/management/qrgenerator']);
  }


  editQrgenerator(qrgeneratorData: any) {

    this.qrgeneratorService
      .getQrgeneratorId(qrgeneratorData.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {


          this.router.navigate(['layout/facility/management/qrgenerator'], {
            state: {
              orgId: this.orgId,
              referenceKey: this.referenceKey,
              qrgenerator: data,
            },
          });
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  // editQrgenerator(qrgeneratorData: any) {

  //   this.router.navigate(['layout/facility/management/qrgenerator'], {
  //     state: { qrgenerator: qrgeneratorData },
  //   });
  // }
}
