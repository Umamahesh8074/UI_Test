import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { Level, ProjectLevelDto } from 'src/app/Models/Project/level';
import { LevelService } from 'src/app/Services/ProjectService/Level/level.service';

@Component({
  selector: 'app-display-level',
  templateUrl: './display-level.component.html',
  styleUrls: ['./display-level.component.css'],
})
export class DisplayLevelComponent {
  destroy$ = new Subject<void>();

  levelName: string = '';
  projectName: string = '';
  towerName: string = '';

  totalPages: number = 0;
  levelsData: Level[] = [];
  totalItems: number = 0;
  pageSizeOptions = pageSizeOptions;

  pageSize: number = 15;
  pageIndex: number = 0;

  projectLevel: ProjectLevelDto | undefined;
  displayedColumns: string[] = [
    'rowNumber',
    'projectName',
    'blockName',
    'levelname',
    'noOfUnits',
    'status',
    'actions',
  ];

  ngOnInit(): void {
    this.levelService.refresh.subscribe(() => {
      this.getAllLevels();
    });

    this.getAllLevels();
  }

  constructor(
    private levelService: LevelService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  getAllLevels() {
    this.levelService
      .getAllLevels(
        this.levelName,
        this.pageIndex,
        this.pageSize,
        this.projectName,
        this.towerName
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log(response.records);
          this.levelsData = response.records;
          console.log(this.levelsData);
          this.totalItems = response.totalRecords;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  onSerachProject(projectName: string) {
    console.log(projectName);
    if (this.projectName !== projectName) {
      this.pageIndex = 0;
    }
    this.projectName = projectName;
    if (this.projectName.length > 3 || this.projectName.length == 0) {
      this.getAllLevels();
    }
  }

  onSerachTower(towerName: string) {
    console.log(towerName);
    if (this.towerName !== towerName) {
      this.pageIndex = 0;
    }
    this.towerName = towerName;
    this.getAllLevels();
  }

  onSerachLevel(levelName: string) {
    if (this.levelName !== levelName) {
      this.pageIndex = 0;
    }
    this.levelName = levelName;
    this.getAllLevels();
  }

  addLevel() {
    this.router.navigate(['layout/project/level']);
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getAllLevels();
  }

  //open confirm dialog
  openConfirmDialog(levelId: number) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'delete Level' }, // Pass the property as data to the dialog
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteBlock(levelId);
        }
      }
    );
  }

  deleteBlock(levelId: number) {
    this.levelService
      .deleteLevel(levelId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  getLevelsByBlockId(levelId: any) {
    console.log(levelId);
    return this.levelService
      .getLevelsByBlockId(levelId)
      .pipe(takeUntil(this.destroy$));
  }

  editLevel(level: any) {
    console.log(level.levelId);
    this.getLevelsByBlockId(level.levelId).subscribe({
      next: (response) => {
        console.log(response);
        this.projectLevel = response;
        this.router.navigate(['layout/project/level'], {
          state: { projectLevel: this.projectLevel },
        });
      },
    });
  }
}
