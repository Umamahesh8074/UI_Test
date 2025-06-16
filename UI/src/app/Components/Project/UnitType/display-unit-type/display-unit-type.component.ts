import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { UnitType } from 'src/app/Models/Project/unit';
import { UnitTypeService } from 'src/app/Services/ProjectService/UnitType/unittype.service';

@Component({
  selector: 'app-display-unit',
  templateUrl: './display-unit-type.component.html',
  styleUrls: ['./display-unit-type.component.css'],
})
export class DisplayUnitTypeComponent {
  destroy$ = new Subject<void>();

  page: number = 0;
  size: number = 10;
  totalPages: number = 0;
  unitsData: UnitType[] = [];

  unitTypeName: string = '';

  pageSizeOptions = pageSizeOptions;

  unitType: UnitType = new UnitType();

  projectUnit: any[] = [];

  displayedColumns: string[] = ['name', 'rate', 'status', 'actions'];
  totalItems: number = 0;
  pageSize: number = 25;
  pageIndex: number = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.unitService.refreshRequired.subscribe(() => {
      this.getAllUnits(this.unitTypeName);
    });
  }

  constructor(
    private unitService: UnitTypeService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.getAllUnits(this.unitTypeName);
  }

  getAllUnits(uniTypeName: any) {
    this.unitService
      .getAllUnits(uniTypeName, this.page, this.size)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.unitsData = response.records;
          this.totalItems = response.totalRecords;

          this.paginator.pageIndex = this.pageIndex;
          this.paginator.pageSize = this.pageSize;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  addUnit() {
    this.router.navigate(['layout/unittypes']);
  }

  onPageChange(event: any) {}
  openConfirmDialog(id: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'delete Unit Type' }, // Pass the property as data to the dialog
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteUnitType(id);
        }
      }
    );
  }

  //delete block by block id
  deleteUnitType(unitTypeId: number) {
    console.log(unitTypeId);
    this.unitService
      .deleteUnitType(unitTypeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          console.log('reloading');
          this.getAllUnits('');
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  getUnitTypesById(unitTypeId: any) {
    return this.unitService
      .getUnitTypeById(unitTypeId)
      .pipe(takeUntil(this.destroy$));
  }

  editUnit(unitType: any) {
    console.log(unitType.id);
    this.getUnitTypesById(unitType.id).subscribe({
      next: (response) => {
        console.log(response);
        this.unitType = response;
        // Navigate with state once the data is available
        this.router.navigate(['layout/unittypes'], {
          state: { unitType: this.unitType },
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
