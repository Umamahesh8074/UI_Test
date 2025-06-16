import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, of, Subject, takeUntil } from 'rxjs';
import { Assets, IAssets } from 'src/app/Models/Employee/assets';
import {
  Employee,
  EmployeeDto,
  IEmployee,
} from 'src/app/Models/Employee/employee';
import { IUser, User } from 'src/app/Models/User/User';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { AssetsService } from 'src/app/Services/Employee/asserts.service';
import { AssetAllocationService } from 'src/app/Services/Employee/AssetAllocationService';
import { EmployeeService } from 'src/app/Services/Employee/employee.service';
import { UserService } from 'src/app/Services/UserService/userservice.service';
import { ToastrService } from 'ngx-toastr';
import {
  searchTextLength,
  searchTextZero,
} from 'src/app/Constants/CommanConstants/Comman';

@Component({
  selector: 'app-asset-allocation',
  templateUrl: './asset-allocation.component.html',
  styleUrls: ['./asset-allocation.component.css'],
})
export class AssetAllocationComponent implements OnInit, OnDestroy {
  isModalVisible = false;
  isView = false;
  isAdding: boolean = true; // Flag to differentiate between add and edit
  private destroy$ = new Subject<void>(); // To handle unsubscription
  public user: User = new User();
  organizationId: any = 0;
  userData: IUser[] = [];
  id: number = 0;
  formData!: FormGroup;
  employeeData: EmployeeDto[] = [];
  firstName: string = '';
  assetsData: Assets[] = [];
  employees: Employee[] = [];
  employee: any = new FormControl([] as IEmployee[], Validators.required);
  selectedEmployee: IEmployee = new Employee();
  asset: any = new FormControl([] as IAssets[]);
  selectedAsset: IAssets = new Assets();
  selectedUser: IUser = new User();
  userControll: any = new FormControl([] as User[]);
  users: User[] = [];
  assetName: any;

  assetId: any;
  userName: any;
  userId: any;
  constructor(
    private router: Router,
    private builder: FormBuilder,
    private commonService: CommanService,
    private assetsAllocationService: AssetAllocationService,
    private employeeService: EmployeeService,
    private assetAllocationService: AssetAllocationService,
    private assetsService: AssetsService,
    private userService: UserService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
   // Initialize form with asset allocation fields

    if (user) {
      this.user = JSON.parse(user);
      this.organizationId = this.user.organizationId;
    }
    this.initializeForm();
    this.getEmployeeDetails(this.organizationId);
    this.getEmployeeAsserts();
    this.fetchUsers();
       const data = history.state.assetAllocationData;
    if (data) {
      this.isAdding = false;
      this.patchFormData(data); // Patch form with the existing data
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete(); // Cleanup to prevent memory leaks
  }
  onEmployeeSelect(event: any) {
    this.firstName = event.option.value.firstName;
    this.id = event.option.value.id;
    this.formData.patchValue({ employeeId: this.id });
    this.getEmployeeDetails(this.organizationId, this.firstName);
  }
  onAssetsSelect(event: any) {

    this.assetName = event.option.value.assetName;
    this.assetId = event.option.value.assetId;
    this.formData.patchValue({ assetId: this.assetId });
    this.getEmployeeDetails(this.organizationId, this.firstName);
  }

  // Initialize the form with asset allocation fields
  private initializeForm(): void {
    this.formData = this.builder.group({
      allocationId: [0], // Allocation ID
      employeeId: [0], // Employee ID
      assetId: [0], // Asset ID
      allocatedDate: [new Date()], // Allocated Date
      allocatedBy: [0], // Allocated By
      returnedDate: [new Date()], // Returned Date (optional)
      conditionAtReturn: [''], // Condition at Return (optional)
      allocationStatus: ['A'], // Allocation Status
    });
  }

  // Save the allocation (add or update based on isAdding flag)
  save() {
    console.log(this.formData.valid);
    if (this.formData.valid) {
      if (this.isAdding) {
        console.log('Adding new asset allocation:', this.formData.value);
        this.assetsAllocationService
          .addEmployeeAssetAllocationDetails(this.formData.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (resp: any) => {
              console.log('Asset allocation added successfully', resp);
              this.router.navigate(['layout/employee/displayassetallocation']); // Redirect after success
            },
            error: (err: any) => {
              console.error('Error adding asset allocation:', err);
            },
          });
      } else {
        console.log('Updating asset allocation:', this.formData.value);
        this.assetsAllocationService
          .updateEmployeeAssetAllocationDetails(this.formData.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (resp: any) => {
              console.log('Asset allocation updated successfully', resp);
              this.router.navigate(['layout/employee/displayassetallocation']); // Redirect after success
            },
            error: (err: any) => {
              console.error('Error updating asset allocation:', err);
            },
          });
      }
    } else {
      console.warn('Form is invalid:', this.formData);
    }
  }
  searchUserForAuto(event: any) {
    const query = event.target.value;
    console.log(event.target.value, query);
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.userName = query;
      this.fetchUsers(this.userName);
    }
  }
  fetchUserById(userId: number) {
    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        this.selectedUser = user;
        console.log(this.selectedUser);
        this.formData.patchValue({ userId: user.userId });
      },
      error: (error) => {
        console.error('Error fetching projects:', error);
      },
    });
  }

  displayUserForAuto(userData: User): string {
    console.log(userData);
    return userData && userData.userName ? userData.userName : '';
  }
  onUserSelectForAuto(event: any): void {
    this.userId = event.option.value.userId;
    this.userName = event.option.value.userName;
    console.log(this.userId);
    this.formData.patchValue({ allocatedBy: this.userId });

   this.fetchUsers(this.userName);

  }
  private getEmployeesById(id: any): void {
    this.employeeService
      .getEmployeesById(id)
      .pipe(
        takeUntil(this.destroy$), // Automatically unsubscribe when destroy$ emits
        catchError((error) => {
          this.toastrService.error('Error fetching employee', error.message);
          return of(new Employee());
        })
      )
      .subscribe((employeeData) => {
        this.selectedEmployee = employeeData;
        this.formData.patchValue({ id: employeeData.id });
      });
  }

  private getEmployeeAssertsDetailsById(assetId: any): void {
    this.assetsService
      .getEmployeeAssertsDetailsById(assetId)
      .pipe(
        takeUntil(this.destroy$), // Automatically unsubscribe when destroy$ emits
        catchError((error) => {
          this.toastrService.error('Error fetching assets', error.message);
          return of(new Employee());
        })
      )
      .subscribe((assetData) => {
        this.selectedAsset = assetData;
        this.formData.patchValue({ assetId: assetData.assetId });
      });
  }

  fetchUsers(userName?:any) {
    this.userName=userName;
    this.userService.fetchAllUsers(this.userName, this.organizationId).subscribe({
      next: (users: any) => {
        console.log(users);
        this.userData = users;
      },
      error: (error) => {
        console.error(error);
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
          this.formData.patchValue({ id: employeeData.id });
        },
        error: (error) => {
          console.error('Error fetching users:', error);
        },
      });
  }

  displayEmployeeName(employee: IEmployee): string {
    return employee && employee.firstName ? employee.firstName : '';
  }

  searchEmployee(event: any): void {
    const query = event.target.value;
    if (query.length >= 3) {
      this.firstName = query;
      this.getEmployeeDetails();
    } else if (query.length == 0) {
      this.firstName = '';
      this.getEmployeeDetails();
    }
  }
  displayAssetName(asset: IAssets): string {
    return asset && asset.assetName ? asset.assetName : '';
  }

  searchAssets(event: any): void {
    const query = event.target.value;
    if (query.length >= 3) {
      this.assetName = query;
      this.getEmployeeAsserts(this.assetName);
    } else if (query.length == 0) {
      this.assetName = '';
      this.getEmployeeAsserts(this.assetName);
    }
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

  // Patch the form data when editing
  private patchFormData(data: any): void {
    console.log('Patching form data for update:', data);

    const employeeId = data.employeeId;
    this.getEmployeesById(employeeId);
    const assetId = data.assetId;
    this.getEmployeeAssertsDetailsById(assetId);
    const userId = data.allocatedBy;
    this.fetchUserById(userId);

    this.formData.patchValue(data);
  }

  // Clear the form
  clearForm() {
    this.formData.reset();
  }

  // Navigate back to the asset listing page
  gotoAsserts() {
    this.router.navigate(['layout/employee/displayassetallocation']);
  }
}
