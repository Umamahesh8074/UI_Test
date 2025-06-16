import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { CommonReferenceType } from 'src/app/Models/CommanModel/menuDto';
import { Assets } from 'src/app/Models/Employee/assets';
import { User } from 'src/app/Models/User/User';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { AssetsService } from 'src/app/Services/Employee/asserts.service';

@Component({
  selector: 'app-displayassets',
  templateUrl: './displayassets.component.html',
  styleUrls: ['./displayassets.component.css'],
})
export class DisplayassetsComponent implements OnInit{
  assetName: any = '';
  public user: User = new User();
  private destroy$ = new Subject<void>();
  assetCategory:any='';
  assetsData: Assets[] = [];
  assetsDataEmp: Assets[] = [];
  organizationId = 0;
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  isView = false;
  assetCategoryList: CommonReferenceType[] = [];
  Asset_Category: string = 'Asset_Category';
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user != null) {
      this.user = JSON.parse(user);
      this.organizationId = this.user.organizationId;
      console.log(this.user.organizationId);
      console.log('ORG ID ' + this.organizationId);
    }

    this.getEmployeeAsserts();

   this.fetchAssetCategory();
    this.getAssetsDetails();
  }
  pageSizeOptions = pageSizeOptions;
  constructor(
    private assetsService: AssetsService,
    private router: Router,
    public dialog: MatDialog,
    private commonService: CommanService,
  ) {}
  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getAssetsDetails();
  }
  displayedColumns: string[] = [

    'assetCategory', // Asset Category
    'assetName', // Asset Name
    'assetSerialNumber', // Asset Serial Number
    'purchaseDate', // Purchase Date
    'warrantyExpiryDate', // Warranty Expiry Date
    'purchasePrice', // Purchase Price
    'supplierName', // Supplier Name
    'actions', // Actions
  ];


  addAssetDetails() {
    this.router.navigate(['layout/employee/addassets']);
  }


  openConfirmDialog(id: number) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: ' delete User' },
    });

    dialogRef.componentInstance.isConfirmDelete
      .pipe(takeUntil(this.destroy$))
      .subscribe((isDelete: boolean) => {
        if (isDelete) {
          this.deleteAssetDetails(id);
        }
      });
  }

  deleteAssetDetails(id: number) {
    this.assetsService
      .deleteEmployeeAssertsDetails(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('User deleted successfully:', response);
          this.getAssetsDetails();
        },
        error: (error) => {
          console.error('Error deleting user:', error);
        },
      });
  }
  onSelectAssetName(event: any): void {
    this.paginator.firstPage();
    const selectedValue = event.value;
    console.log('Selected Asset Name:', selectedValue);
    this.assetName = event.value ? event.value : '';
    if (this.assetName === '') {

    }

    this.getAssetsDetails();
  }
  onSelectAssetCategory(event: any): void {
    this.paginator.firstPage();
    const selectedValue = event.value;
    console.log('Selected Asset Category:', selectedValue);
    this.assetCategory = event.value ? event.value : '';
    if (this.assetCategory === '') {
      this.assetName='';
    }

    this.getAssetsDetails();
  }


  getAssetsDetails() {

    this.assetsService
      .getAllEmployeeAssertsDetails(this.assetName,this.assetCategory ,this.pageIndex, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (assetsData) => {
          this.assetsData = assetsData.records;
          console.log(assetsData.records);
          this.totalItems = assetsData.totalRecords;
        },
        error: (error) => {
          console.error('Error fetching users:', error);
        },
      });
  }
  editAssets(asset: any) {

    this.getAssetsById(asset.assetId).subscribe({
      next: (response) => {
        console.log(response); // Verify if data is correctly fetched
        this.assetsData = response;

        this.router.navigate(['layout/employee/addassets'], {
          state: { assetsData: this.assetsData },
        });
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  fetchAssetCategory(): void {
    console.log(this.Asset_Category);
    this.commonService.getRefDetailsByType(this.Asset_Category).subscribe({
      next: (types) => {
        this.assetCategoryList = types;
      },
      error: (error: any) => {
        console.error('Error fetching  types:', error);
      },
    });
  }



  getEmployeeAsserts(assetName?: any) {
    this.assetName = assetName;
    this.assetsService
      .getAllAssets(this.assetName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (assetsData: any) => {
          this.assetsDataEmp = assetsData;
        },
        error: (error) => {
          console.error('Error fetching users:', error);
        },
      });
  }
  getAssetsById(id: number) {
    return this.assetsService
      .getEmployeeAssertsDetailsById(id)
      .pipe(takeUntil(this.destroy$));
  }

}
