import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { Employee } from 'src/app/Models/Employee/employee';
import { EmployeeBankDetails } from 'src/app/Models/Employee/EmployeeBankDetails';

import { User } from 'src/app/Models/User/User';
import { EmployeeService } from 'src/app/Services/Employee/employee.service';
import { EmployeeBankDetailsService } from 'src/app/Services/Employee/EmployeeBankDetailsService';


@Component({
  selector: 'app-display-employee',
  templateUrl: './display-employee-banking-details.component.html',
  styleUrls: ['./display-employee-banking-details.component.css'],
})
export class DisplayemployeebankdetailsComponent implements OnInit {
  public user: User = new User();
  private destroy$ = new Subject<void>();
  employeeBankDetailsData: EmployeeBankDetails[] = [];
  organizationId = 0;
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  employeeId: any = '';
  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user != null) {
      this.user = JSON.parse(user);
      this.organizationId = this.user.organizationId;
      console.log(this.user.organizationId);
      console.log('ORG ID ' + this.organizationId);
    }
    this.getEmployeeBankingDetails(this.employeeId);
  }
  pageSizeOptions = pageSizeOptions;
  constructor(
    private employeeBankDetailsService: EmployeeBankDetailsService,
    private router: Router,
    public dialog: MatDialog
  ) {}


  displayedColumns: string[] = [
    'employeeId',
    'bankName', // First Name
    'bankAccountNumber', // Last Name
    'accountOpeningDate', // Email
    'aadhaarNumber', // Phone Number
    'mobileNumber', // City
    'actions',
  ];

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
  }

  addEmployeeBankingDetails() {
    this.router.navigate(['layout/employee/addemployeebankingdetails']);
  }

  editEmployee(employeeBankDetails: any) {
    console.log('id taking ', employeeBankDetails.id);
    this.getEmployeesBankingDetailsById(employeeBankDetails.id).subscribe({
      next: (response) => {
        console.log(response); // Verify if data is correctly fetched
        this.employeeBankDetailsData = response;
        // Navigate with state once the data is available
        this.router.navigate(['layout/employee/addemployeebankingdetails'], {
          state: { employeeBankDetailsData: this.employeeBankDetailsData },
        });
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  getEmployeesBankingDetailsById(id: number) {
    return this.employeeBankDetailsService
      .getEmployeesBankingDetailsById(id)
      .pipe(takeUntil(this.destroy$));
  }

  onSearch(searchText: any) {
    this.employeeId = searchText;
    this.getEmployeeBankingDetails(this.employeeId);
  }
  getEmployeeBankingDetails(employeeId?: string) {
    this.employeeId = employeeId;
    this.employeeBankDetailsService
      .getAllEmployeesBankingDetails(this.employeeId, this.pageIndex, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (employeeBankDetailsData) => {
          this.employeeBankDetailsData = employeeBankDetailsData.records;
          console.log(employeeBankDetailsData.records);
          this.totalItems = employeeBankDetailsData.totalRecords;
        },
        error: (error) => {
          console.error('Error fetching users:', error);
        },
      });
  }
  openConfirmDialog(id: number) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'delete User' },
    });

    dialogRef.componentInstance.isConfirmDelete
      .pipe(takeUntil(this.destroy$))
      .subscribe((isDelete: boolean) => {
        if (isDelete) {
          this.deleteEmployeeBankingDetails(id);
        }
      });
  }

  deleteEmployeeBankingDetails(id: number) {
    this.employeeBankDetailsService
      .deleteEmployeeBankingDetails(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('User deleted successfully:', response);
          this.getEmployeeBankingDetails(this.employeeId);
        },
        error: (error) => {
          console.error('Error deleting user:', error);
        },
      });
  }
}
