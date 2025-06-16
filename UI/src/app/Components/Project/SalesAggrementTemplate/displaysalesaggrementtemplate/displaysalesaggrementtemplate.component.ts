import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { ISalesAggrementTemplateDto } from 'src/app/Models/Project/salesAggrementTemplate';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';

@Component({
  selector: 'app-displaysalesaggrementtemplate',
  templateUrl: './displaysalesaggrementtemplate.component.html',
  styleUrls: ['./displaysalesaggrementtemplate.component.css'],
})
export class DisplaysalesaggrementtemplateComponent implements OnInit {
  private destroy$ = new Subject<void>();
  salesAggrementTemplateDto: ISalesAggrementTemplateDto[] = [];
  displayedColumns: string[] = [
    'projectName',
    'salesAggrementTemplateName',
    'actions',
  ];

  // Pagination
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  pageSizeOptions = pageSizeOptions;
  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;
  projectName: any;

  constructor(
    private projectService: ProjectService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllTemplates();
  }

  // Fetch all templates with pagination
  getAllTemplates(salesAggrementTemplateName?: any): void {
  salesAggrementTemplateName = salesAggrementTemplateName;
    this.projectService
      .getAllTemplates(salesAggrementTemplateName,this.pageIndex, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp: any) => {
          console.log(resp);
          this.salesAggrementTemplateDto = resp.records;
          this.totalItems = resp.totalRecords;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  // Handle pagination
  onPageChange(event: any): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getAllTemplates();
  }

  // Confirm delete dialog
  openConfirmDialog(templateId: any): void {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'delete Sales Agreement Template' },
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteTemplate(templateId);
        }
      }
    );
  }

  // Delete template by ID
  deleteTemplate(templateId: number): void {
    console.log(templateId);
    this.projectService
      .deleteTemplate(templateId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          console.log(resp);
          this.getAllTemplates(); // Refresh the list after deletion
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  // Navigate to add new template
  addTemplate(): void {
    this.router.navigate(['layout/crm/salesaggrementtemplate']);
  }
}
