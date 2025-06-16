import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { Assets } from 'src/app/Models/Employee/assets';
import { AssetAllocation, AssetAllocationDto } from 'src/app/Models/Employee/AssetsAllocation';
import { EmployeeDto } from 'src/app/Models/Employee/employee';

import { User } from 'src/app/Models/User/User';
import { AssetsService } from 'src/app/Services/Employee/asserts.service';
import { AssetAllocationService } from 'src/app/Services/Employee/AssetAllocationService';
import { EmployeeService } from 'src/app/Services/Employee/employee.service';

@Component({
  selector: 'app-display-asset-allocation',
  templateUrl: './display-asset-allocation.component.html',
  styleUrls: ['./display-asset-allocation.component.css'],
})
export class DisplayAssetAllocationComponent implements OnInit, OnDestroy {
  allocationName: string = '';
  public user: User = new User();
  private destroy$ = new Subject<void>();
  assetAllocationData: AssetAllocationDto[] = [];
  organizationId: number = 0;
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  pageSizeOptions = pageSizeOptions;
  firstName:any='';
  id:any=0;
  isView = false;
  assetName:any='';
  assetsData: Assets[] = [];
  employeeData: EmployeeDto[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private assetAllocationService: AssetAllocationService,
    private router: Router,
    public dialog: MatDialog,
    private employeeService: EmployeeService,
    private assetsService: AssetsService,
  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
      this.organizationId = this.user.organizationId;
      console.log('ORG ID:', this.organizationId);
    }
    this.getEmployeeDetails();
    this.getEmployeeAsserts();
    this.getAssetAllocations();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getAssetAllocations();
  }

  displayedColumns: string[] = [
    'employeeId', // Employee Name
    'assetId', // Asset Name
    'allocatedDate', // Allocation Date
    'allocatedBy',
    'returnDate', // Return Date
    'conditionAtReturn', // Condition
    'allocationStatus',
    'actions' // Actions
  ];

  onSearch(searchText: string) {
    this.firstName = searchText;
    this.getAssetAllocations(this.firstName);
  }

  addAssetAllocation() {
    this.router.navigate(['layout/employee/addassetallocation']);
  }

  openConfirmDialog(id: number) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'delete Asset Allocation' },
    });

    dialogRef.componentInstance.isConfirmDelete
      .pipe(takeUntil(this.destroy$))
      .subscribe((isDelete: boolean) => {
        if (isDelete) {
          this.deleteAssetAllocation(id);
        }
      });
  }
  getEmployeeAsserts(assetName?: any) {
    this.assetName = assetName;
    this.assetsService
      .getAllAssets(this.assetName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (assetsData: any) => {
          this.assetsData = assetsData;
        },
        error: (error) => {
          console.error('Error fetching users:', error);
        },
      });
  }
  getEmployeeDetails(organizationId?: any, firstName?: any) {
    this.organizationId = organizationId;

    this.employeeService
      .getAllEmployeesByOrg(this.organizationId, this.firstName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (employeeData: any) => {
          this.employeeData = employeeData;

        },
        error: (error) => {
          console.error('Error fetching users:', error);
        },
      });
  }
  deleteAssetAllocation(id: number) {
    this.assetAllocationService
      .deleteEmployeeAssetAllocationDetails(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Asset allocation deleted successfully:', response);
          this.getAssetAllocations();
        },
        error: (error) => {
          console.error('Error deleting asset allocation:', error);
        },
      });
  }

  getAssetAllocations(firstName?: string) {
    this.assetAllocationService
      .getAllEmployeeAssetAllocationDetails(firstName || this.firstName,this.assetName ,this.pageIndex, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (assetAllocationData) => {
          this.assetAllocationData = assetAllocationData.records;
          this.totalItems = assetAllocationData.totalRecords;
        },
        error: (error) => {
          console.error('Error fetching asset allocations:', error);
        },
      });
  }
  onSelect(event: any): void {
    this.paginator.firstPage();
    const selectedValue = event.value;
    console.log('Selected Project ID:', selectedValue);
    this.firstName = event.value ? event.value : '';
    if (this.firstName === '') {

    }

    this.getAssetAllocations();
  }
  onSelectAssetName(event: any): void {
    this.paginator.firstPage();
    const selectedValue = event.value;
    console.log('Selected Asset Name:', selectedValue);
    this.assetName = event.value ? event.value : '';
    if (this.assetName === '') {

    }

    this.getAssetAllocations();
  }
  editAssetAllocation(assetAllocation: AssetAllocation) {
    this.assetAllocationService
      .getEmployeeAssetAllocationDetailsById(assetAllocation.allocationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.assetAllocationData = response;
          this.router.navigate(['layout/employee/addassetallocation'], {
            state: { assetAllocationData: response},
          });
        },
        error: (error) => {
          console.error('Error fetching asset allocation by ID:', error);
        },
      });
  }
}
