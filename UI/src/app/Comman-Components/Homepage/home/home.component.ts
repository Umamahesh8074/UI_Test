import { OverlayContainer } from '@angular/cdk/overlay';
import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { MapDto, TeamDashBoardDataDto } from 'src/app/Models/Presales/lead';
import { IProject, Project } from 'src/app/Models/Project/project';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';
import { User } from 'src/app/Models/User/User';
import { AuthService } from 'src/app/Services/CommanService/auth.service';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { StateServiceService } from 'src/app/Services/CommanService/state-service.service';
import { LeadbudgetService } from 'src/app/Services/LeadBugetService/leadbudget.service';
import { LeadFollowupService } from 'src/app/Services/Presales/Leads/lead-followup.service';
import { LeadService } from 'src/app/Services/Presales/Leads/lead.service';
import { CommonreferencedetailsService } from 'src/app/Services/UserService/commonreferencedetails.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild(MatDatepicker) datepicker!: MatDatepicker<any>;
  leadsData: MapDto[] = [];
  assignedTo?: number;
  user: User = new User();
  leadFollowUpTotal: number = 0;
  pageSizeOptions = pageSizeOptions;
  totalLeads: number = 0;
  assignedLeads: number = 0;
  scheduledVisits: number = 0;
  followups: number = 0;
  siteVisitDoneCount: number = 0;
  closedLeads: number = 0;
  lostLeads: number = 0;
  nonContactableLeads: number = 0;
  siteVisitProspectFollowups: number = 0;
  bookedLeadsCount: number = 0;
  private destroy$ = new Subject<void>();
  today: any;
  daysType: string = 'Filter_Days';
  followupStatusType: string = 'Lead_Status';
  moduleNames: string[] = [];
  siteVisitDoneId: number = 0;
  siteVisitProspectId: number = 0;
  revisitDoneStatusId: number = 0;
  days: CommonReferenceDetails[] = [];
  dateRange: any = 0;
  statusId: number = 0;
  userRole: string = '';
  chart: Chart | any;
  projectName: string = '';
  projects: Project[] = [];
  displayedColumns: string[] = [
    'userName',
    'assignedLeads',
    'noOfFollowups',
    'noOfSiteVisitDone',
    'booked',
  ];
  isUserManager: boolean = false;

  showDateRangePicker = false;
  formData!: FormGroup;
  startDate: any;
  endDate: any;

  // displayedColumns: string[] = [
  //   'userName',
  //   'assignedLeads',
  //   'noOfFollowups',
  //   'noOfSiteVisitConfirm',
  //   'noOfSiteVisitDone',
  // ];
  displayedLeadBudgetColumns: string[] = [
    'sourceName',
    'subSourceName',
    'totalAmonut',
    'leadCount',
    'CPL',
    'bookedLeadCount',
    'CPB',
    'siteVisitDoneLeadCount',
    'CPV',
  ];
  teamData: TeamDashBoardDataDto[] = [];
  filteredData: MatTableDataSource<TeamDashBoardDataDto> = new MatTableDataSource<TeamDashBoardDataDto>();
  organizationId: number = 0;

  leadBudgetSpend: any = [];
  leadBudget: any;
  leadBudgetdateRangeForm!: FormGroup;
  nonContactableStatusId: any;
  nonContactableCount: any;
  projectId: number = 0;
  project: any = new FormControl([] as IProject[]);

  constructor(
    private router: Router,
    private leadService: LeadService,
    private followupService: LeadFollowupService,
    private commonService: CommanService,
    private commonRefDetailService: CommonreferencedetailsService,
    private formBuilder: FormBuilder,
    private stateService: StateServiceService,
    private leadBudgetService: LeadbudgetService,
    private overlayContainer: OverlayContainer,
    private authService: AuthService
  ) {}
  ngOnInit() {
    this.initForm();
    this.initLeadBudgetDateRange();
    this.today = new Date().toDateString();
    this.fetchFilterDays();
    const user = localStorage.getItem('user');
    console.log('HomeComponent initialized');
    console.log(
      'OverlayContainer element:',
      this.overlayContainer.getContainerElement()
    );
    this.overlayContainer.getContainerElement().classList.add('home-dropdown');

    if (user) {
      console.log('user');
      this.user = JSON.parse(user);
      this.userRole = this.user.roleName;
      this.fetchProjects();
      this.navigateToDashBoardBasedOnHomePath();
      //this.navigateToDashBoardBasedOnLoggedIn(this.userRole);
      this.isUserManager = this.userRole.toLocaleLowerCase().includes('manager')
        ? true
        : false;
      this.fetchTeamLeadsData();
      this.organizationId = this.user.organizationId;
      this.fetchLeadsData(this.user.userId);
      this.fetchDashboardFollowupsData();
      this.fetchTotalLeadsCount();
      this.getNonContactableLeadCount();
      this.userRole.toLocaleLowerCase().includes('sales')
        ? this.moduleNames.push('S,PS')
        : this.moduleNames.push('P,PS');
      this.fetchFollowupStatusList();
    }
  }
  navigateToDashBoardBasedOnHomePath() {
    const homePagePath = this.authService.getDashBoardPath();
    console.log('Home page Path => ' + homePagePath);
    if (homePagePath) {
      this.router.navigate([homePagePath]);
    } else {
      this.router.navigate(['/layout/plain']);
    }
  }

  navigateToDashBoardBasedOnLoggedIn(userRole: String) {
    console.log('User Role ', userRole);
    if (
      this.userRole.toLocaleLowerCase().includes('channel') ||
      this.userRole.toLocaleLowerCase().includes('cp')
    ) {
      console.log('entered channel partner role');
      this.router.navigate(['layout/presales/cp/dashboard']);
    } else if (this.userRole.toLocaleLowerCase() === 'sales head') {
      this.router.navigate(['layout/head/dashboard']);
    }
    else if (this.userRole.toLocaleLowerCase() === 'presales member') {
      this.router.navigate(['layout/presales/member/dashboard']);
    }
    else if (this.userRole.toLocaleLowerCase() === 'sales member') {
      this.router.navigate(['layout/sales/member/dashboard']);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    console.log('HomeComponent destroyed');
    this.overlayContainer
      .getContainerElement()
      .classList.remove('home-dropdown');
    if (this.chart) {
      this.chart.destroy();
    }
  }

  navigateTo(table: string) {
    this.router.navigate([`/${table}`]);
  }

  navigateToLeads() {
    const userRoleLower = this.userRole.toLowerCase();
    const route = userRoleLower.includes('presale')
      ? 'layout/presales/leads/PST'
      : 'layout/sales/leads/ST';

    // Define the state object with the necessary properties
    const state = {
      dateRange: this.dateRange,
      isMenuLeads: false,
      customStartDate: this.startDate,
      customEndDate: this.endDate,
    };

    // Set the state in the StateService
    this.stateService.setState('stateData', state);

    // Navigate to the desired route with the state data
    this.router.navigate([route], {
      state: state,
    });
  }
  goToLeads() {
    const userRoleLower = this.userRole.toLowerCase();
    const route = userRoleLower.includes('presale')
      ? 'layout/presales/leads/PST'
      : 'layout/sales/leads/ST';

    // Define the state object with the necessary properties
    const state = {
      dateRange: this.dateRange,
      isMenuLeads: false,
      customStartDate: this.startDate,
      customEndDate: this.endDate,
      statusId: this.statusId,
    };

    // Set the state in the StateService
    this.stateService.setState('stateData', state);

    // Navigate to the desired route with the state data
    this.router.navigate([route], {
      state: state,
    });
  }
  navigateToLeadsForNonContactable() {
    console.log('non contactable');
    this.commonService
      .getRefDetailsId('Lead_Status', 'NC')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('NC status');
          console.log(response);
          this.statusId = response;
          this.goToLeads();
        },
        error: (error) => console.error(error),
      });
  }

  navigateToFollowups(value?: string) {
    console.log(value);

    const userRoleLower = this.userRole.toLowerCase();
    const route = userRoleLower.includes('presale')
      ? 'layout/presales/dashboard/followups/PST'
      : 'layout/sales/dashboard/followups/ST';

    let statusIds: number[] = [];

    // Check if value exists and includes either 'Confirm' or 'Done'
    if (value) {
      if (value.includes('Prospect')) {
        statusIds.push(this.siteVisitProspectId);
      } else if (value.includes('Done')) {
        statusIds.push(this.siteVisitDoneId);
        statusIds.push(this.revisitDoneStatusId);
      }
      // If value does not include either 'Confirm' or 'Done', statusId remains 0
    }
    this.router.navigate([route], {
      state: {
        dateRange: this.dateRange,
        statusIds: statusIds,
        customStartDate: this.startDate,
        customEndDate: this.endDate,
      },
    });
  }

  fetchLeadsData(userId: number) {
    this.leadService
      .fetchDashBoardLeads(
        userId,
        this.user.roleId,
        this.dateRange,
        this.startDate,
        this.endDate
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: MapDto[]) => {
          this.leadsData = response;
          this.assignedLeads = this.leadsData.reduce(
            (total, lead) => total + lead.value,
            0
          );
        },
        error: (error) => console.error(error),
      });
  }

  fetchDashboardFollowupsData() {
    this.followupService
      .fetchDashboardFollowupsData(
        this.user.userId,
        this.user.roleId,
        this.dateRange,
        this.startDate,
        this.endDate
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: MapDto[]) => {
          this.followups = response.reduce(
            (total, lead) => total + lead.value,
            0
          );

          // Exclude site visit done followups
          const filteredResponse = response.filter(
            (lead) =>
              !lead.status.toLowerCase().includes('done') &&
              !lead.status.toLowerCase().includes('prospect')
            // &&
            // !lead.status.toLowerCase().includes('booked')
          );

          // Calculate the total follow-ups excluding 'done' and 'prospect'
          this.followups = filteredResponse.reduce(
            (total, lead) => total + lead.value,
            0
          );

          response.forEach((lead) => {
            const leadStatus = lead.status.toLowerCase().trim();
            console.log(leadStatus);

            if (['site visit done', 'revisit done'].includes(leadStatus)) {
              this.siteVisitDoneCount += lead.value;
            } else if (leadStatus.includes('confirm')) {
              this.scheduledVisits = lead.value;
            } else if (leadStatus.includes('prospect')) {
              this.siteVisitProspectFollowups = lead.value;
            }
          });
        },
        error: (error) => console.error(error),
      });
  }

  fetchFilterDays() {
    this.commonService.getRefDetailsByType(this.daysType).subscribe({
      next: (response: CommonReferenceDetails[]) => {
        this.days = response;
      },
      error: (error) => console.error(error),
    });
  }
  handleDaySelection(commonRefObject: CommonReferenceDetails) {
    this.dateRange = commonRefObject.commonRefKey;

    if (commonRefObject.commonRefValue.includes('Custom')) {
      console.log('Custom Date');
      this.showDateRangePicker = true;
      this.dateRange = '';
    } else {
      this.startDate = null;
      this.endDate = null;
      this.formData.patchValue({
        customStartDate: null,
        customEndDate: null,
      });
      this.fetchLeadsData(this.user.userId);
      this.fetchDashboardFollowupsData();
      this.fetchNonContactableLeadCount();
      this.fetchTeamLeadsData();
      this.showDateRangePicker = false;
    }
  }

  fetchTotalLeadsCount() {
    this.leadService
      .fetchTotalLeadsCount(this.user.userId, this.user.roleId,'')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: MapDto[]) => {
          this.totalLeads = response.reduce(
            (total, lead) => total + lead.value,
            0
          );
          response.forEach((lead) => {
            const leadStatus = lead.status.toLowerCase();
            if (leadStatus === 'closed') {
              this.closedLeads = lead.value;
            } else if (leadStatus === 'lost') {
              this.lostLeads = lead.value;
            } else if (leadStatus === 'rnr') {
              this.nonContactableLeads = lead.value;
            } else if (leadStatus === 'booked') {
              this.bookedLeadsCount = lead.value;
            }
          });
          this.createChart();
        },
        error: (error) => console.error(error),
      });
  }

  createChart(): void {
    if (!this.isAllDataZero()) {
      const canvas = document.getElementById('MyChart') as HTMLCanvasElement;
      if (canvas) {
        this.chart = new Chart(canvas, {
          type: 'pie',
          data: {
            labels: ['Total', 'Booked', 'Closed', 'Lost'],
            datasets: [
              {
                label: 'Count',
                data: [
                  this.totalLeads,
                  this.bookedLeadsCount,
                  this.closedLeads,
                  this.lostLeads,
                ],
                backgroundColor: ['#329ca8', 'green', 'purple', 'red'],
                hoverOffset: 4,
              },
            ],
          },
          options: {
            aspectRatio: 2.2,
            plugins: {
              legend: {
                position: 'right', // Set legend position to bottom
              },
            },
          },
        });
      }
    }
  }

  isAllDataZero(): boolean {
    return (
      this.totalLeads === 0 &&
      this.bookedLeadsCount === 0 &&
      this.closedLeads === 0 &&
      this.lostLeads === 0
    );
  }

  fetchFollowupStatusList() {
    this.commonRefDetailService
      .fetchLeadStatusListByRole(this.followupStatusType, this.moduleNames)
      .subscribe({
        next: (response) => {
          // console.log('Status list received: ', response);

          response.forEach((crd: CommonReferenceDetails) => {
            const status = crd.commonRefValue.toLowerCase().trim();
            if (status.includes('site visit done')) {
              this.siteVisitDoneId = crd.id;
            } else if (status.includes('prospect')) {
              this.siteVisitProspectId = crd.id;
            } else if (status.includes('revisit done')) {
              this.revisitDoneStatusId = crd.id;
            }
          });
        },
        error: (error) => {
          console.error('Error fetching follow-up status list:', error);
        },
      });
  }
  fetchTeamLeadsData(): void {
    console.log(this.userRole);

    if (this.userRole.toLocaleLowerCase().includes('manager')) {
      this.leadService
        .fetchTeamLeadsData(
          this.user.userId,
          this.user.roleId,
          this.dateRange,
          this.startDate,
          this.endDate
        )
        .subscribe({
          next: (response: TeamDashBoardDataDto[]) => {
            this.teamData = response;
            this.filteredData.data = this.teamData;
          },
          error: (error) => console.error(error),
        });
    } else {
      console.log('Not a manager');
    }
  }

  applyFilter(event: Event, column: string): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filteredData.filterPredicate = (data: TeamDashBoardDataDto, filter: string) => {
      const value = data[column as keyof TeamDashBoardDataDto]?.toString().toLowerCase();
      return value.includes(filter);
    };
    this.filteredData.filter = filterValue;
  }

  private initForm(): void {
    this.formData = this.formBuilder.group({
      customStartDate: [],
      customEndDate: [],
    });
    this.formData.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((formDataValue) => {
        if (formDataValue.customStartDate && formDataValue.customEndDate) {
          const startDate = this.formatDateTime(formDataValue.customStartDate);
          const endDate = this.formatDateTime(
            formDataValue.customEndDate,
            true
          );
          this.startDate = startDate;
          this.endDate = endDate;
          this.fetchLeadsData(this.user.userId);
          this.fetchDashboardFollowupsData();
          this.fetchNonContactableLeadCount();
          this.fetchTeamLeadsData();
        }
      });
  }

  formatDateTime(date: Date, isEndDate: boolean = false): string {
    if (isEndDate) {
      date.setHours(23, 59, 59, 999);
    }
    return formatDate(date, 'yyyy-MM-ddTHH:mm:ss.SSSSSS', 'en-IN');
  }

  getLeadBugdetSpent(startDate: any, endDate: any) {
    this.leadBudgetService
      .getAllBudgetSpent(startDate, endDate, this.organizationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          console.log(response);
          const leadBudgetSpend = response;
          if (leadBudgetSpend.length > 0) {
            // Removed parentheses
            console.log(leadBudgetSpend[leadBudgetSpend.length - 1]); // Accessing the last element
            this.leadBudget = leadBudgetSpend[leadBudgetSpend.length - 1];
            leadBudgetSpend.pop();
            this.leadBudgetSpend = leadBudgetSpend;
          }
        },
        error: (error) => console.error(error),
      });
  }

  initLeadBudgetDateRange() {
    this.leadBudgetdateRangeForm = this.formBuilder.group({
      leadBudgetCustomStartDate: null,
      leadBudgetCustomEndDate: null,
    });
    this.leadBudgetdateRangeForm.valueChanges.subscribe((formData) => {
      this.onLeadBudgetDateRangeChange(formData);
    });
  }

  onLeadBudgetDateRangeChange(formDataValue: any) {
    console.log(formDataValue);
    if (
      formDataValue.leadBudgetCustomStartDate &&
      formDataValue.leadBudgetCustomEndDate
    ) {
      const startDate = this.formatDateTime(
        formDataValue.leadBudgetCustomStartDate
      );
      const endDate = this.formatDateTime(
        formDataValue.leadBudgetCustomEndDate,
        true
      );
      this.getLeadBugdetSpent(startDate, endDate);
    }
  }

  getNonContactableLeadCount() {
    console.log('non contactable');
    this.commonService
      .getRefDetailsId('Lead_Status', 'NC')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('NC status');
          console.log(response);
          this.statusId = response;
          this.nonContactableStatusId = this.statusId;
          this.fetchNonContactableLeadCount();
        },
        error: (error) => console.error(error),
      });
  }

  fetchNonContactableLeadCount() {
    this.leadService
      .fetchDashBoardNoncontactableLeads(
        this.user.userId,
        this.user.roleId,
        this.dateRange,
        this.startDate,
        this.endDate,
        this.nonContactableStatusId
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log(response);
          if (response?.length > 0) {
            console.log(response[0].value);
            this.nonContactableCount = response[0].value;
          } else {
            this.nonContactableCount = 0;
          }
        },
        error: (error) => console.error(error),
      });
  }
  // onRowClick(row: TeamDashBoardDataDto): void {
  //   this.router.navigate(['layout/presales/leads/PST'], { queryParams: { userId: row.userId ,userName:row.userName} });
  // }
  onRowClick(row: any): void {
    console.log('enterd...');
    console.log('Row clicked:', row);

    const userRoleLower = this.userRole.toLowerCase();
    const route = userRoleLower.includes('presale')
      ? 'layout/presales/leads/PST'
      : 'layout/sales/leads/ST';
    const queryParams = {
      userId: row.userId,
      userName: row.userName,
      dateRange: this.dateRange,
    };
   
    this.router.navigate([route], { queryParams });
  }

  searchProject(event: any) {
    if (event.target.value.length >= 3) {
      console.log(event.target.value);
      this.projectName = event.target.value;
      this.fetchProjects();
    } else {
      this.projectName = '';
      this.fetchProjects();
    }
  }

  fetchProjects() {
    this.leadService.fetchProjects(this.projectName,this.user.organizationId).subscribe({
      next: (projects) => {
        console.log(this.projects);
        this.projects = projects;
      },
      error: (error) => {
        console.error('Error fetching projects:', error);
      },
    });
  }

  onProjectSelect(event: any) {
    console.log(event.option.value);
    this.projectId = event.option.value.projectId;
    this.formData.patchValue({ projectId: this.projectId });
  }

  displayProject(project: IProject): string {
    return project && project.projectName ? project.projectName : '';
  }

  headers = [
    { key: 'userName', value: 'User Name' },
    { key: 'assignedLeads', value: 'Assigned Leads' },
    { key: 'noOfFollowups', value: 'Follow-ups' },
    { key: 'noOfSiteVisitDone', value: 'Site Visit Done' },
  ];
}
