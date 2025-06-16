import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
import {
  Employee,
  EmployeeDto,
  EmployeeSaveDto,
} from 'src/app/Models/Employee/employee';
import { IProject, Project } from 'src/app/Models/Project/project';
import { Role } from 'src/app/Models/User/Role';

import { User } from 'src/app/Models/User/User';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { EmployeeService } from 'src/app/Services/Employee/employee.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { RoleService } from 'src/app/Services/UserService/role.service';
import { UserService } from 'src/app/Services/UserService/userservice.service';

@Component({
  selector: 'app-display-employee',
  templateUrl: './display-employee.component.html',
  styleUrls: ['./display-employee.component.css'],
})
export class DisplayEmployeeComponent implements OnInit {
  public user: User = new User();
  private destroy$ = new Subject<void>();
  employeeData: EmployeeSaveDto[] = [];
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
  projectFc: FormControl = new FormControl([] as Project[]);

  searchControl = new FormControl('');
  project: Project[] = [];
  selectedProject: IProject = new Project();
  projectName: string = '';
  shiftIdList: CommonReferenceType[] = [];
  Shift_Timings: string = 'Shift_Timings';
  shiftId: any;
  roles: Role[] = [];
  roleNames = ['Manager', 'Operation Manager', 'Field Officer']; // Example list of role names
  users: User[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  stateData: any;
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
    this.getProjects();
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
    'dateOfJoining',
    'shiftTiming',
    'employeeStatus', // Employee Status
    'status',
    'formstatus',
    'actions',
  ];

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    history.state.pageIndex = this.pageIndex;
    history.state.pageSize = this.pageSize;
    this.getEmployeeDetails();
  }

  addEmployee() {
    this.router.navigate(['layout/employee/addemployee']);
  }

  editEmployee(employee: any) {
    console.log('id taking ', employee.id);
    this.getEmployeesById(employee.id).subscribe({
      next: (response) => {
        console.log(response);
        this.employeeData = response;
        console.log(this.employeeData);
        this.router.navigate(['layout/employee/addemployee'], {
          state: { employeeData: this.employeeData, approvalStatus: false },
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
  searchProject(event: any): void {
    this.paginator.firstPage();
    const query = event.target.value;
    this.projectName = query;
    this.getProjects();
  }
  onProjectSelect(event: any) {
    this.paginator.firstPage();
    const selectedValue = event.option.value.projectId;
    console.log('Selected Project ID:', selectedValue);
    this.projectId = event.option.value.projectId
      ? event.option.value.projectId
      : '';
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
  displayProject(project: Project): string {
    return project && project.projectName ? project.projectName : '';
  }
  getProjects() {
    this.projectService
      .getProjects(this.projectName, this.organizationId)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.project = data;
          console.log(this.project);
        },
        error: (error: any) => {
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
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

  onSearch(searchText: any) {
    this.paginator.firstPage();
    this.firstName = searchText;
    this.getEmployeeDetails(this.firstName);
  }

  onSelectEmployeeId(searchTextEmp: any) {
    this.paginator.firstPage();

    this.employeeId = searchTextEmp;

    this.getEmployeeDetails('', this.employeeId);
  }

  getEmployeeDetails(firstName?: string, employeeId?: string) {
    this.firstName = firstName;
    this.employeeId = employeeId;

    this.employeeService
      .getAllEmployees(
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
          // console.log(employeeData);
          this.employeeData = employeeData.records;
          // console.log(employeeData.records);
          this.totalItems = employeeData.totalRecords;
          console.log(this.totalItems);
        },
        error: (error) => {
          console.error('Error fetching users:', error);
        },
      });
  }

  private initializeState() {
    console.error(history.state);
    const state = history.state;
    this.stateData = state;
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

  openConfirmDialog(id: number) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'delete User' },
    });

    dialogRef.componentInstance.isConfirmDelete
      .pipe(takeUntil(this.destroy$))
      .subscribe((isDelete: boolean) => {
        if (isDelete) {
          this.deleteEmployee(id);
        }
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

  deleteEmployee(id: number) {
    this.employeeService
      .deleteEmployee(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Employee deleted successfully:', response);
          this.getEmployeeDetails(this.employeeId);
        },
        error: (error) => {
          console.error('Error deleting Employee:', error);
        },
      });
  }
  onClear() {
    this.projectFc.reset();

    this.searchControl.reset();
    // Check if formData is defined before accessing its value
    if (this.formData) {
      // Clear the form values using patchValue

      this.formData.patchValue({
        employeeRoleId: '',
        projectId: '',
        employeeId: '',
        reportingManager: '',
        firstName: '',
        shiftId: '',
      });
    }

    this.projectId = '';
    this.employeeRoleId = '';
    this.employeeId = '';
    this.reportingManager = '';
    this.firstName = '';
    this.shiftId = '';

    this.getEmployeeDetails();
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
