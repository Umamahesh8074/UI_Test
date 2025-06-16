import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import {
  PAGE_INDEX,
  PAGE_SIZE,
  pageSizeOptions,
} from 'src/app/Constants/CommanConstants/Comman';
import {
  EmployeeApprovalDto,
  EmployeeSaveDto,
} from 'src/app/Models/Employee/employee';
import { EmployeeService } from 'src/app/Services/Employee/employee.service';

@Component({
  selector: 'app-employeeformstages',
  templateUrl: './employeeformstages.component.html',
  styleUrls: ['./employeeformstages.component.css'],
})
export class EmployeeformstagesComponent implements OnInit {
  ngOnInit(): void {
    this.getEmployeeDetails();
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  firstName: string = '';
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  searchControl = new FormControl('');
  pageSizeOptions = pageSizeOptions;
  totalItems: number = 0;
  displayedColumns: string[] = [
    'employeeId',
    'employeeName', // First Name
    'dateOfJoining',
    'designation',
    'workflowStageName', // Email
    'workFlowStatus',
    'viewAndApprove', // Phone Number
  ];
  private destroy$ = new Subject<void>();
  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}
  employeeApproveArray: EmployeeApprovalDto[] = [];
  employeeData: EmployeeSaveDto[] = [];

  getEmployeeDetails(fileName?: string) {
    this.employeeService
      .getEmploveeForApproval(fileName, this.pageIndex, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (employeeData) => {
          console.log(employeeData);
          this.employeeApproveArray = employeeData.records;
          console.log(employeeData.records);
          this.totalItems = employeeData.totalRecords;
        },
        error: (error) => {
          console.error('Error fetching users:', error);
        },
      });
  }

  goToApprove(empId: number) {
    this.getEmployeesById(empId).subscribe({
      next: (response) => {
        console.log(response);
        this.employeeData = response;
        const approveStatusBean = this.employeeApproveArray.find((employee) => {
          console.log(employee.empId, empId);

          employee.empId === empId;
          return employee;
        });

        console.log(approveStatusBean);
        this.router.navigate(['layout/employee/approveemployee'], {
          state: {
            employeeData: this.employeeData,
            approveStatusBean: approveStatusBean,
          },
        });
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  getEmployeesById(id: number) {
    return this.employeeService
      .getEmployeesDetailsByEmployeeId(id)
      .pipe(takeUntil(this.destroy$));
  }

  onSearch(searchText: any) {
    this.paginator.firstPage();
    this.firstName = searchText;
    this.getEmployeeDetails(this.firstName);
  }
  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    history.state.pageIndex = this.pageIndex;
    history.state.pageSize = this.pageSize;
    this.getEmployeeDetails();
  }
}
