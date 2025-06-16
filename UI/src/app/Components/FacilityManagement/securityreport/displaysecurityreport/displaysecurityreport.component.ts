import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import {
  PAGE_INDEX,
  PAGE_SIZE,
  pageSizeOptions,
} from 'src/app/Constants/CommanConstants/Comman';
import { SecurityReport } from 'src/app/Models/Facility Management/SecurityReport';
import { IProject, Project } from 'src/app/Models/Project/project';
import { Qrgenerator } from 'src/app/Models/Qrgenerator/qrgenerator';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';
import { User } from 'src/app/Models/User/User';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { SecurityReportService } from 'src/app/Services/FacilityManagement/security-report.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { QrgeneratorService } from 'src/app/Services/Qrgenerator/qrgenerator.service';
import { formatDate } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-displaysecurityreport',
  templateUrl: './displaysecurityreport.component.html',
  styleUrls: ['./displaysecurityreport.component.css'],
})
export class DisplaysecurityreportComponent {
  private destroy$ = new Subject<void>();
  totalItems: number = 0;
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  userId: any;
  organizationId: any;
  formData!: FormGroup;
  pageSizeOptions = pageSizeOptions;
  user: User = new User();
  userName: string = '';
  securityReportData: SecurityReport[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
selectedProject: IProject = new Project();
projectFc: FormControl = new FormControl([] as Project[]);
  daysType: string = 'Filter_Days';
  projectId: any;
  status: string = '';
  projectName: string = '';
  location: any;
  project: Project[] = [];
  days: CommonReferenceDetails[] = [];
  selectedDay: any;
  startDate: any;
  endDate: any;
  isView = false;
  rangeOfDays: any = 0;
  qrGenerator: Qrgenerator[] = [];
  showDatePicker: boolean = false; // Initially hide the date picker
  isMenuSecurityReport = true;
  displayedColumns: string[] = [
    'date',
    'projectName',
    'location',
    'userName',
    'scheduleTime',
    'status',
  ];
  constructor(
    private router: Router,
    private securityReportService: SecurityReportService,
    private builder: FormBuilder,
    private commanService: CommanService,
    private projectService: ProjectService,
    private qrgeneratorService: QrgeneratorService,
    private commonService: CommanService
  ) {}

  ngOnInit(): void {
    this.initForm();

    const user = localStorage.getItem('user');
    if (user) {
      console.log(user, 'user');

      this.user = JSON.parse(user);
      // this.userId = this.user.userId;
      this.organizationId = this.user.organizationId;
    }
    this.loadProjects();
    this.getsecurityReport();
    this.loadAllLocationsNames();
    this.fetchFilterDays();
    this.getProjects();
  }

  private initForm(): void {
    this.formData = this.builder.group({
      projectName: [''],
      location: [''],
      scheduleTime: [''],
      status: [''],
      userId: [0],
      userName: [''],
      phoneNumber: [''],
      scheduleId: [0],
      scheduleTimeId: [0],
      imageUrl: [''],
      createdDate: [null], // For LocalDateTime
      qrScanStatus: [''],
      formatedScheduleTime: [''], // Adjusted spelling to match camelCase convention
    });
  }

  onSelect(event: any): void {
    this.paginator.firstPage();
    const selectedValue = event.value;
    console.log('Selected Project ID:', selectedValue);
    this.projectId = event.value ? event.value : '';
    if (this.projectId === '') {
      this.location = '';
      this.userId = '';
      this.status = '';
      this.rangeOfDays = '';
      this.startDate = '';
      this.endDate = '';
    }

    this.getsecurityReport();
    this.loadAllLocationsNames();
  }

  onSelectLocation(event: any): void {
    this.paginator.firstPage();
    const selectedValue = event.value;
    console.log('Selected Project ID:', selectedValue);
    this.location = event.value ? event.value : '';

    if (this.location === '') {
      this.userId = '';
      this.status = '';
      this.rangeOfDays = '';
      this.startDate = '';
      this.endDate = '';
    }

    this.getsecurityReport();
  }
  onSelectUser(event: any): void {
    this.paginator.firstPage();
    const selectedValue = event.value;
    console.log('Selected Project ID:', selectedValue);
    this.userId = event.value ? event.value : '';
    if (this.userId === '') {
      this.status = '';
      this.rangeOfDays = '';
      this.startDate = '';
      this.endDate = '';
    }
    this.getsecurityReport();
  }

  onSelectStatus(event: any): void {
    this.paginator.firstPage();
    const selectedValue = event.value;
    console.log('Selected Project ID:', selectedValue);
    this.status = event.value ? event.value : '';

    if (this.status === '') {
      this.rangeOfDays = '';
      this.startDate = '';
      this.endDate = '';
    }

    this.getsecurityReport();
  }

  private loadProjects(): void {
    this.projectService.getProjectsByOrgId(this.user.organizationId).subscribe({
      next: (resp) => {
        this.project = resp;
      },
      error: (err) => {
        console.error('Error loading projects', err);
      },
    });
  }

  fetchFilterDays() {
    this.commonService.getRefDetailsByType(this.daysType).subscribe({
      next: (response: CommonReferenceDetails[]) => {
        // Filter the days to include only the desired commonRefValues
        this.days = response.filter((day) =>
          ['Yesterday', 'Today', 'Custom Date', 'Last Month'].includes(
            day.commonRefValue
          )
        );

        // Set "Today" as the default if it exists
        this.selectedDay = this.days.find((day) => day.commonRefKey === '0');
      },
      error: (error) => console.error(error),
    });
  }

  private loadAllLocationsNames(): void {
    this.qrgeneratorService
      .getQrgeneratorById(this.user.organizationId, this.projectId)
      .subscribe({
        next: (resp) => {
          this.qrGenerator = resp;
        },
        error: (err) => {
          console.error('Error loading projects', err);
        },
      });
  }

  handleDaySelection(commonRefObject: CommonReferenceDetails | null) {
    this.paginator.firstPage();
    console.log('method called');
    console.log(commonRefObject?.commonRefValue);

    if (!commonRefObject) {
      console.log('All selected');
      this.rangeOfDays = 999;
      this.startDate = null;
      this.endDate = null;

      this.showDatePicker = false;
      this.isMenuSecurityReport = false;
      this.initDateForm();
    } else {
      this.rangeOfDays = commonRefObject.commonRefKey;
      if (
        commonRefObject.commonRefValue &&
        commonRefObject.commonRefValue.includes('Custom')
      ) {
        console.log('Custom Date');
        this.showDatePicker = true;
        this.rangeOfDays = '';
        this.rangeOfDays = this.rangeOfDays; // This won't be used for a single date
        this.initDateForm();
      } else if (commonRefObject?.commonRefValue === 'Yesterday') {
        console.log('All selected');
        this.rangeOfDays = 1;
        this.startDate = null;
        this.endDate = null;
        this.showDatePicker = false;
        this.isMenuSecurityReport = false;
        this.rangeOfDays = this.rangeOfDays;
        // console.log(this.rangeOfDays);
        // this.navigateToAbsent( this.rangeOfDays);

        this.getsecurityReport();
      } else if (commonRefObject?.commonRefValue === 'Today') {
        console.log('All selected');
        this.rangeOfDays = 0;
        this.startDate = null;
        this.endDate = null;
        this.showDatePicker = false;
        this.isMenuSecurityReport = false;
        this.rangeOfDays = this.rangeOfDays;
        console.log(this.rangeOfDays);

        this.getsecurityReport();
        // this.navigateToAbsent( );
      } else if (commonRefObject?.commonRefValue === 'Last Month') {
        console.log('All selected');
        this.rangeOfDays = 30;
        this.startDate = '';
        this.endDate = '';
        this.showDatePicker = false;
        this.isMenuSecurityReport = false;
        this.rangeOfDays = this.rangeOfDays;
        console.log(this.rangeOfDays);

        this.getsecurityReport();
        // this.navigateToAbsent( );
      } else {
        this.startDate = null;
        this.endDate = null;

        this.formData.patchValue({
          startDate: null,
          entDate: null,
        });
        this.isMenuSecurityReport = false;

        this.showDatePicker = false;
      }
    }
  }

  initDateForm(userId?: any, rangeOfDays?: any): void {
    this.userId = userId;
    this.rangeOfDays = rangeOfDays;
    console.log(this.userId, this.rangeOfDays);
    // Initialize the form with a null default value for the date
    this.formData = this.builder.group({
      startDate: [], // Set initial value to null
      endDate: [],
    });

    // Subscribe to form value changes
    this.formData.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((formDataValue) => {
        console.log('Form Value Changes:', formDataValue);

        const startDate = formDataValue.startDate;
        const endDate = formDataValue.endDate;

        // Log the selected start date
        console.log('Selected Date:', startDate);

        if (startDate && endDate) {
          // Format the selected start date
          this.startDate = this.formatDateTime(new Date(startDate));
          this.endDate = this.formatDateTime(new Date(endDate));

          console.log('Formatted Start Date:', this.startDate);

          // Call navigateToCount with the selected date

          this.getsecurityReport();
        }
      });
  }
  formatDateTime(date: Date): string {
    return formatDate(date, 'yyyy-MM-ddTHH:mm:ss.SSSSSS', 'en-IN');
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
      this.location = '';
    this.userId = '';
    this.status = '';
    this.rangeOfDays = '';
    this.startDate = '';
    this.endDate = '';
    }

    this.getsecurityReport();
    this.loadAllLocationsNames();
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


  private getsecurityReport() {
    this.securityReportService
      .getAllSecurityReport(
        this.organizationId,
        this.projectId,
        this.location,
        this.userId,
        this.status,
        this.rangeOfDays,
        this.startDate,
        this.endDate,
        this.pageIndex,
        this.pageSize
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.securityReportData = resp.records; // Assign response data to the securityReportData array
          console.log(resp.records);
          this.totalItems = resp.totalRecords;
          console.log(this.totalItems);
        },
        error: (error) => {
          console.error('Error fetching users:', error);
        },
      });
  }

  downloadExcel() {
    this.securityReportService
      .downloadExcel(
        this.organizationId,
        this.projectId,
        this.location,
        this.userId,
        this.status,
        this.rangeOfDays,
        this.startDate,
        this.endDate
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.downloadFile(response, 'Security Report');
          console.log('Excel downloaded successfully');
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  private downloadFile(
    data: Blob,
    filename: string,
    needTime: boolean = true
  ): void {
    const now = new Date();
    const timestamp = now.toLocaleDateString() + '_' + now.toLocaleTimeString();
    const blob = new Blob([data], {
      type: 'application/vnd.ms-excel',
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    needTime
      ? (a.download = filename + '_' + timestamp + '.xls')
      : (a.download = filename + '.xls');

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
  onSearch(searchText: any) {
    this.userName = searchText;
    console.log(this.userName);
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    history.state.pageIndex = this.pageIndex;
    history.state.pageSize = this.pageSize;
    this.getsecurityReport();
  }

  onClear() {


    this.projectFc.reset();


    // Check if formData is defined before accessing its value


    this.projectId = '';
    this.location = '';
    this.userId = '';
    this.status = '';
    this.rangeOfDays = '';
    this.startDate = '';
    this.endDate = '';

    this.getsecurityReport();
  }
}
