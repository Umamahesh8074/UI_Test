import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { CommonReferenceType } from 'src/app/Models/CommanModel/menuDto';
import { User } from 'src/app/Models/User/User';
import { CommanService } from 'src/app/Services/CommanService/comman.service';

import { RoleService } from 'src/app/Services/UserService/role.service';
import { Role } from 'src/app/Models/User/Role';
import { EmployeeService } from 'src/app/Services/Employee/employee.service';
import { Employee, IEmployee } from 'src/app/Models/Employee/employee';
import { EmployeeBankDetailsService } from 'src/app/Services/Employee/EmployeeBankDetailsService';
import { EmployeeBankDetails, IEmployeeBankDetails } from 'src/app/Models/Employee/EmployeeBankDetails';

@Component({
  selector: 'app-employee',
  templateUrl: './employee-banking-details.component.html',
  styleUrls: ['./employee-banking-details.component.css'],
})
export class EmployeebankdetailsComponent implements OnInit {
  isView = false;
  isAdding: boolean = true;
  private destroy$ = new Subject<void>();
  public user: User = new User();
  organizationId: any;
  formData!: FormGroup;
  isModalVisible = false;

  roles: Role[] = [];

  constructor(
    private router: Router,
    private employeeBankDetailsService: EmployeeBankDetailsService,
    private builder: FormBuilder,
    private commonService: CommanService,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    this.initializeForm();
    if (user) {
      this.user = JSON.parse(user);
      this.organizationId = this.user.organizationId;
    }
    const data = history.state.employeeBankDetailsData;

    if (data) {
      this.isAdding = false;
      this.patchFormData(data);
    }


  }
  private initializeForm(): void {
    this.formData = this.builder.group({
      id: [0],
      employeeId: ['', Validators.required],
      bankName: [''],
      bankAccountNumber: [''],
      bankIfscCode: [''],
      accountType: [''],
      accountOpeningDate: [new Date()],
      aadhaarNumber: [''],
      panNumber: [''],
      esicNumber: [''],
      mobileNumber: [''],
      status: [''],
    });
  }



  save() {
    //adding client
    if (this.formData.valid) {
      if (this.isAdding) {
        // this.formData.patchValue({ organizationId: this.organizationId });
        console.log(this.formData.value);
        this.employeeBankDetailsService
          .addEmployeeBankDetails(this.formData.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (resp: any) => {
              this.router.navigate(['layout/employee/displayemployeebankingdetails']);
            },
            error: (err: any) => {
              console.error('Error adding employee', err);
            },
          });
      } else {
        this.employeeBankDetailsService
          .updateEmployeeBankDetails(this.formData.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.router.navigate(['layout/employee/displayemployeebankingdetails']);
            },
            error: (err: any) => {
              console.error('Error updating employee', err);
            },
          });
      }
    }
  }
  get employeeIdControl() {
    return this.formData.get('employeeId');
  }
  private patchFormData(data: any): void {
    console.log(data);
    console.log(data.toString + 'data for update');
    this.formData.patchValue(data);
  }
  clearForm() {
    this.formData.reset();
  }
  gotoEmployee() {
    this.router.navigate(['layout/employee/displayemployeebankingdetails']);
  }
}
