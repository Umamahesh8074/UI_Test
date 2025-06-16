import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CommonReferenceType } from 'src/app/Models/CommanModel/menuDto';
import { User } from 'src/app/Models/User/User';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { AssetsService } from 'src/app/Services/Employee/asserts.service';
import { UserService } from 'src/app/Services/UserService/userservice.service';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.css']
})
export class AssetsComponent implements OnInit{
  users:User[]=[];
  isModalVisible = false;
  isView = false;
  isAdding: boolean = true;
  private destroy$ = new Subject<void>();
  public user: User = new User();
  organizationId: any;
  formData!: FormGroup;
  assetCategoryList: CommonReferenceType[] = [];
  Asset_Category: string = 'Asset_Category';
  showOtherCategory: boolean = false;
  constructor(
    private router: Router,
     private builder: FormBuilder,
    private commonService: CommanService,
    private assetsService:AssetsService,
    private userService:UserService,

  ) {}


  ngOnInit(): void {
    const user = localStorage.getItem('user');
    this.initializeForm();
    if (user) {
      this.user = JSON.parse(user);
      this.organizationId = this.user.organizationId;
    }
    this.fetchUsers();
    this.fetchAssetCategory();
    const data = history.state.assetsData;

    if (data) {
      this.isAdding = false;
      this.patchFormData(data);
    }


  }

  private initializeForm(): void {
    this.formData = this.builder.group({
      assetId: [0],
      assetName: [''],
      assetCategory: [''],
      assetSerialNumber: [''],
      purchaseDate: [new Date()],
      assetStatus: [''],
      assetCondition: [''],
      warrantyExpiryDate: [new Date()],
      purchasePrice: [0.0],
      supplierName: [''],
      location: [''],
      allocatedCount: [0],
      damageType: [''],
      organizationId: [0],
    });
  }


  save() {
    //adding client
    if (this.formData.valid) {
      if (this.isAdding) {
        console.log(this.organizationId);
        this.formData.patchValue({ organizationId: this.organizationId });
        console.log(this.formData.value);
        this.assetsService
          .addEmployeeAssertsDetails(this.formData.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (resp: any) => {
              this.router.navigate(['layout/employee/displayassets']);
            },
            error: (err: any) => {
              console.error('Error adding employee', err);
            },
          });
      } else {
        this.assetsService
          .updateEmployeeAssertsDetails(this.formData.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.router.navigate(['layout/employee/displayassets']);
            },
            error: (err: any) => {
              console.error('Error updating employee', err);
            },
          });
      }
    }
  }
  fetchUsers() {
    this.userService.fetchAllUsers('', this.organizationId).subscribe({
      next: (users:any) => {
        console.log(users);
        this.users = users;
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

  onCategoryChange(event: any) {
    this.showOtherCategory = event.value === 'Others';

      if (!this.showOtherCategory) {
      this.formData.get('assetCategory')?.setValue(event.value);
    }
  }
  private patchFormData(data: any): void {
    console.log(data);
    console.log(data.toString + 'data for update');
    this.formData.patchValue(data);
  }
  clearForm() {
    this.formData.reset();
  }
  gotoAsserts() {
    this.router.navigate(['layout/employee/displayassets']);
  }
}
