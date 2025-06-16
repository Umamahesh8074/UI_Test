import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import {
  pageSizeOptions,
  PAGE_INDEX,
  PAGE_SIZE,
} from 'src/app/Constants/CommanConstants/Comman';
import { CommonReferenceType } from 'src/app/Models/CommanModel/menuDto';
import { Employee, EmployeeDto } from 'src/app/Models/Employee/employee';
import { Project } from 'src/app/Models/Project/project';
import { Role } from 'src/app/Models/User/Role';

import { User } from 'src/app/Models/User/User';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { EmployeeService } from 'src/app/Services/Employee/employee.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { RoleService } from 'src/app/Services/UserService/role.service';
import { UserService } from 'src/app/Services/UserService/userservice.service';

@Component({
  selector: 'app-display-resigned-employee',
  templateUrl: './display-resigned-employee.component.html',
  styleUrls: ['./display-resigned-employee.component.css'],
})
export class DisplayResignedEmployeeComponent implements OnInit {
  public user: User = new User();
  private destroy$ = new Subject<void>();
  employeeData: EmployeeDto[] = [];
  employeeShiftData: EmployeeDto[] = [];
  organizationId = 0;
  totalItems: number = 0;
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  formData!: FormGroup;
  employeeId: any = '';
  employeeRoleId: any = '';
  status: any = '';
  isView = false;
  firstName: any = '';
  projectId: any;
  projectAssigned: any = '';
  reportingManager: any = '';
  project: Project[] = [];
  shiftIdList: CommonReferenceType[] = [];
  Shift_Timings: string = 'Shift_Timings';
  shiftId: any;
  roles: Role[] = [];
  roleNames = ['Manager', 'Operation Manager', 'Field Officer']; // Example list of role names
  users: User[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user != null) {
      this.user = JSON.parse(user);
      this.organizationId = this.user.organizationId;
      console.log(this.user.organizationId);
      console.log('ORG ID ' + this.organizationId);
    }

    this.status = 'A';
    this.fetchProjects();
    this.fetchRoles();
    this.fetchReportingManager();
    this.getEmployeeDetailsForEmployeeName(this.organizationId);
    this.fetchShifts();
    this.getEmployeeDetails(this.employeeId);
  }
  pageSizeOptions = pageSizeOptions;
  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    public dialog: MatDialog,
    private roleService: RoleService,
    private projectService: ProjectService,
    private userService: UserService,
    private builder: FormBuilder,
    private commonService: CommanService
  ) {}
  displayedColumns: string[] = [
    'employeeId',
    'firstName', // First Name
    'project',
    'role',
    'email', // Email
    'phoneNumber', // Phone Number
    'reportingManager',
    'lastWorkingDay',
    'employeeStatus', // Employee Status
    'status',
  ];

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    history.state.pageIndex = this.pageIndex;
    history.state.pageSize = this.pageSize;
    this.getEmployeeDetails();
  }

  getEmployeesById(id: number) {
    return this.employeeService
      .getEmployeesById(id)
      .pipe(takeUntil(this.destroy$));
  }
  onSelect(event: any): void {
    this.paginator.firstPage();
    const selectedValue = event.value;
    console.log('Selected Project ID:', selectedValue);
    this.projectId = event.value ? event.value : '';
    if (this.projectId === '') {
      this.employeeRoleId = '';
      this.employeeId = '';
      this.reportingManager = '';
      this.projectId = '';
      this.firstName = '';
      this.shiftId = '';
    }

    this.getEmployeeDetails();
  }

  onselectRole(event: any): void {
    this.paginator.firstPage();
    const selectedValue = event.value;
    console.log('Selected Role ID:', selectedValue);
    this.employeeRoleId = event.value ? event.value : '';
    if (this.employeeRoleId === '') {
      this.employeeId = '';

      this.reportingManager = '';
      this.firstName = '';
      this.shiftId = '';
    }

    this.getEmployeeDetails();
  }
  onselectReportingManager(event: any): void {
    this.paginator.firstPage();
    const selectedValue = event.value;
    console.log('Selected Reporting Manager Id:', selectedValue);
    this.reportingManager = event.value ? event.value : '';
    if (this.reportingManager === '') {
      this.reportingManager = '';
      this.firstName = '';
      this.shiftId = '';
    }

    this.getEmployeeDetails();
  }

  onselectShiftTimings(event: any): void {
    this.paginator.firstPage();
    const selectedValue = event.value;
    console.log('Selected Reporting Shift Timing:', selectedValue);
    this.shiftId = event.value ? event.value : '';
    if (this.shiftId === '') {
      this.firstName = '';
      this.shiftId = '';
    }

    this.getEmployeeDetails();
  }
  onselectStatus(event: any): void {
    this.paginator.firstPage();
    const selectedValue = event.value;
    console.log('Selected status:', selectedValue);
    this.status = event.value ? event.value : '';
    if (this.status === '') {
      this.status = '';
      this.firstName = '';
    }

    this.getEmployeeDetails();
  }
  fetchReportingManager(): void {

    this.userService
      .fetchUsersByRolesAndOrganization(this.roleNames, this.organizationId)
      .subscribe({
        next: (users: any) => {
          console.log(users);
          this.users = users;
        },
        error: (error) => {
          console.error('Error fetching users:', error);
        },
      });
  }
  onSelectEmployeeId(event: any): void {
    this.paginator.firstPage();


    this.employeeId = event.value ? event.value : '';

    if (this.employeeId === '') {
      this.getEmployeeDetails(this.employeeId);
    }
    this.getEmployeeDetails(this.employeeId);
  }

  onSearch(searchText: any) {
    this.paginator.firstPage();
    this.firstName = searchText;
    this.getEmployeeDetails(this.firstName);
  }
  getEmployeeDetails(firstName?: string) {
    this.firstName = firstName;

    this.employeeService
      .getAllResignedEmployees(
        this.projectId,
        this.employeeRoleId,
        this.reportingManager,
        this.employeeId,
        this.status,
        this.organizationId,
        this.firstName,
        this.shiftId,
        this.pageIndex,
        this.pageSize
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (employeeData) => {
          this.employeeData = employeeData.records;
          console.log(employeeData.records);
          this.totalItems = employeeData.totalRecords;
        },
        error: (error) => {
          console.error('Error fetching users:', error);
        },
      });
  }

  fetchShifts(): void {
    console.log(this.Shift_Timings);
    this.commonService.getRefDetailsByType(this.Shift_Timings).subscribe({
      next: (types) => {
        this.shiftIdList = types;
      },
      error: (error: any) => {
        console.error('Error fetching  shifts:', error);
      },
    });
  }

  fetchRoles() {
    this.roleService.fetchAllRoles('', this.organizationId).subscribe({
      next: (roles: any) => {
        console.log(roles);
        this.roles = roles;
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }

  fetchProjects() {
    this.projectService.getProjectsByOrgId(this.organizationId).subscribe({
      next: (project: any) => {
        console.log(project);

        this.project = project;
      },
      error: (err) => {
        console.error('Error adding projects', err);
      },
    });
  }

  getEmployeeDetailsForEmployeeName(organizationId?: any) {
    this.organizationId = organizationId;

    this.employeeService
      .getAllEmployeesByOrg(this.organizationId, this.firstName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (employeeData: any) => {
          this.employeeShiftData = employeeData;
        },
        error: (error) => {
          console.error('Error fetching users:', error);
        },
      });
  }
}
