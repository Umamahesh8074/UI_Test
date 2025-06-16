import { formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { ReusableComponent } from 'src/app/Comman-Components/base-component/base.component';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import { searchTextZero } from 'src/app/Constants/CommanConstants/Comman';
import { Project, IProject } from 'src/app/Models/Project/project';
import { FeildOfficerpatrolDto } from 'src/app/Models/Securitypatrol/feildofficerpatrol';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';
import { UserDto } from 'src/app/Models/User/UserDto';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { FieldofficerpatrolServiceService } from 'src/app/Services/FacilityManagement/fieldofficerpatrol-service.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { UserService } from 'src/app/Services/UserService/userservice.service';

@Component({
  selector: 'app-display-feildofficerpatrol',
  templateUrl: './display-feildofficerpatrol.component.html',
  styleUrls: ['./display-feildofficerpatrol.component.css'],
})
export class DisplayFeildofficerpatrolComponent extends ReusableComponent {
  displayedColumns: string[] = [
    'rowNumber',
    'createdDate',
    'userName',
    'projectName',
    'inTime',
    'outTime',
    'location',
    'phoneNumber',
    'actions',
  ];
  feildOfficerPatrolData: FeildOfficerpatrolDto[] = [];
  projects: Project[] = [];
  project: any = new FormControl([] as IProject[]);
  user: any = new FormControl([]);
  projectName: string = '';
  projectId: number = 0;
  userName: string = '';
  roleName: any = ['FO'];
  userNames: UserDto[] = [];
  dateRange: any;
  startDate: any
  endDate: any
  selectedUserId: number = 0;
  daysType: string = 'Filter_Days';
  days: CommonReferenceDetails[] = [];
  showDateRangePicker: boolean = false;
  selectedDay:any
  ngOnInit(): void {
    super.setUserFromLocalStorage();
    this.initForm();
    this.fetchProjects();
    this.getAllusersByRole();
    this.fetchFilterDays();
    this.fetchFieldOfficerPatrolData();
  }

  constructor(
    private feildOfficerPatrolService: FieldofficerpatrolServiceService,
    router: Router,
    route: ActivatedRoute,
    public dialog: MatDialog,
    commanService: CommanService,
    private formBuilder: FormBuilder,
    private projectService: ProjectService,
    private userService: UserService,
  ) {
    super(commanService, router, route);
  }

  fetchFieldOfficerPatrolData() {
    this.feildOfficerPatrolService
      .getAllFeildOfficerPatrol(
        this.pageIndex,
        this.pageSize,
        this.organizationId,
        this.projectId,
        this.userName,
        this.selectedUserId,
        this.startDate,
        this.endDate,
        this.dateRange,
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (patrolData) => {
          this.feildOfficerPatrolData = patrolData.records;
          this.totalItems = patrolData.totalRecords;
          console.log(this.feildOfficerPatrolData);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  fetchProjects() {
    this.projectService
      .getProjectsByOrgIdWithProjectFilter(
        this.organizationId,
        this.projectName
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (projects) => {
          console.log(projects);
          this.projects = projects;
        },
        error: (error: Error) => {
          console.error('Error fetching projects:', error);
        },
      });
  }
  onProjectSelect(event: any) {
    this.projectName = event.option.value.projectName;
    this.projectId = event.option.value.projectId;
    this.fetchFieldOfficerPatrolData();
  }
  displayProject(project: Project): string {
    return project && project.projectName ? project.projectName : '';
  }
  searchProject(event: any): void {
    const query = event.target.value;
    if (query.length >= 3) {
      this.projectName = query;
      this.fetchProjects();
      // this.fetchFeildOfficerPatrolData();
    } else if (query.length == 0) {
      this.projectName = '';
      this.fetchProjects();
      // this.fetchFeildOfficerPatrolData();
    }
  }
  onSearch(searchText: any) {
    if (searchText.length >= 3 || searchText.length === searchTextZero) {
      this.userName = searchText;
      this.pageIndex = 0; // Reset page index when searching
      this.fetchFieldOfficerPatrolData();
    }
  }
  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.fetchFieldOfficerPatrolData();
  }
  getAllusersByRole() {
    this.userService
      .getUsersByRoleName(this.roleName, this.organizationId, '', this.userName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (userNames) => {
          console.log(userNames);
          this.userNames = userNames;
        },
        error: (error: Error) => {
          console.error('Error fetching projects:', error);
        },
      });
  }
  onUserSelect(event: any) {
    this.selectedUserId = event.option.value.userId;
    this.fetchFieldOfficerPatrolData();
  }

  displayUser(user: UserDto): string {
    return user && user.userName ? user.userName : '';
  }
  searchUser(event: any): void {
    const query = event.target.value;
    if (query.length >= 3) {
      this.userName = query;
      this.getAllusersByRole();
      // this.fetchFeildOfficerPatrolData();
    } else if (query.length == 0) {
      this.userName = '';
      this.getAllusersByRole();
      // this.fetchFeildOfficerPatrolData();
    }
  }
  private initForm(): void {
    this.formData = this.formBuilder.group({
      startDate: [],
      endDate: [],
    });
    this.formData.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((formDataValue) => {
        if (formDataValue.startDate && formDataValue.endDate) {
          const startDate = this.formatDateTime(formDataValue.startDate);
          const endDate = this.formatDateTime(formDataValue.endDate, true);
          console.log(startDate);
          console.log(endDate);
          this.startDate = startDate;
          this.endDate = endDate;
          this.fetchFieldOfficerPatrolData();
        }
      });
   
  }

  formatDateTime(date: Date, isEndDate: boolean = false): string {
    if (isEndDate) {
      date.setHours(23, 59, 59, 999);
    }
    return formatDate(date, 'yyyy-MM-ddTHH:mm:ss.SSSSSS', 'en-IN');
  }

  openConfirmDialog(patrolId: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'Feild Officer Patrol' }, // Pass the property as data to the dialog
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteFeildOfficerPatrol(patrolId);
        }
      }
    );
  }

  deleteFeildOfficerPatrol(patrolId: number) {
    this.feildOfficerPatrolService
      .deleteFeildOfficerPatrolId(patrolId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          console.log(data);
          this.fetchFieldOfficerPatrolData();
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
  
  private fetchFilterDays() {
    this.commanService.getRefDetailsByType(this.daysType).subscribe({
      next: (response: CommonReferenceDetails[]) => {
        this.days = response.filter((day) => {
          const value = day.commonRefValue.toLowerCase();
          return !value.includes('tomo') && !value.includes('next');
        });
        // this.handleDateRange(this.stateData);
      },
      error: (error) => console.error(error),
    });
  }
  handleDaySelection(commonRefObject: CommonReferenceDetails | null) {
    // If "All" option is selected
    if (!commonRefObject) {
      this.dateRange = 999;
      this.startDate = null;
      this.endDate = null;
      this.formData.patchValue({
        startDate: null,
        endDate: null,
      });
      this.fetchFieldOfficerPatrolData();
      this.showDateRangePicker = false;
    } else {
      this.dateRange = commonRefObject.commonRefKey;
      if (
        commonRefObject.commonRefValue &&
        commonRefObject.commonRefValue.includes('Custom')
      ) {
        this.showDateRangePicker = true;
        this.dateRange = '';
      } else {
        this.startDate = null;
        this.endDate = null;
        this.formData.patchValue({
          startDate: null,
          endDate: null,
        });
        this.fetchFieldOfficerPatrolData();
        this.showDateRangePicker = false;
        }
        
        
      }
      
    }
  
}
