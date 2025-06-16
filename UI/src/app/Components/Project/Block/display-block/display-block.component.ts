import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { Observable, Subject, takeUntil } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { ProjectBlockDto } from 'src/app/Models/Block/block';
import { BlockService } from 'src/app/Services/ProjectService/Block/block.service';

@Component({
  selector: 'app-displayblock',
  templateUrl: './display-block.component.html',
  styleUrls: ['./display-block.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DisplayblockComponent implements OnInit {
  private destroy$ = new Subject<void>();
  blockData: any[] = [];
  projectBlock: ProjectBlockDto | undefined;

  pageSizeOptions = pageSizeOptions;

  projectName: string = '';
  blockName: string = '';

  displayedColumns: string[] = [
    'rowNumber',
    'projectName',
    'blockName',
    'noOfLevels',
    'status',
    'actions',
  ];
  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;

  //pagination
  totalItems: number = 0;
  pageSize: number = 15;
  pageIndex: number = 0;

  ngOnInit(): void {
    this.blockService.refreshRequired.subscribe(() => {
      this.getBlocks();
    });
    this.getBlocks();
  }

  constructor(
    private blockService: BlockService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getBlocks();
  }

  onSerachBlockName(blockName: string) {
    console.log(blockName);
    if (this.blockName !== blockName) {
      this.pageIndex = 0;
    }
    this.blockName = blockName;
    this.getBlocks();
  }

  getBlocks() {
    this.blockService
      .getAllBlock(
        this.blockName,
        this.pageIndex,
        this.pageSize,
        this.projectName
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blockData) => {
          this.blockData = blockData.records;
          console.log(this.blockData);
          this.totalItems = blockData.totalRecords;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  onSearchProject(projectName: string) {
    console.log(projectName);
    this.projectName = projectName;
    if (this.projectName.length > 3 || this.projectName.length == 0) {
      this.getBlocks();
    }
  }

  openConfirmDialog(blockId: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'delete Block' },
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteBlock(blockId);
        }
      }
    );
  }

  //delete block by block id
  deleteBlock(blockId: number) {
    console.log(blockId);
    this.blockService
      .deleteBlock(blockId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blockData) => {
          console.log(blockData);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  //adding block
  addBlock() {
    this.router.navigate(['layout/addblock']);
  }

  getBlockByProjectId(blockId: any): Observable<any> {
    return this.blockService
      .getBlocksByProject(blockId)
      .pipe(takeUntil(this.destroy$));
  }

  editBlock(blockData: any): void {
    console.log(blockData.id);
    this.getBlockByProjectId(blockData.id).subscribe({
      next: (response) => {
        console.log(response); // Verify if data is correctly fetched
        this.projectBlock = response;
        // Navigate with state once the data is available
        this.router.navigate(['layout/addblock'], {
          state: { projectBlock: this.projectBlock },
        });
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
