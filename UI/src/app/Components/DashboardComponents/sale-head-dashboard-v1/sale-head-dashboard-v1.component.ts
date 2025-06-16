import { formatDate } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatSelectChange } from '@angular/material/select';
import { NavigationEnd, Router } from '@angular/router';
import { ChartComponent } from 'chart.js';
import { ApexOptions } from 'ng-apexcharts';
import { filter, Subject, takeUntil } from 'rxjs';
import {
  DIGITAL_PARTNER,
  pageSizeOptions,
} from 'src/app/Constants/CommanConstants/Comman';
import { MapDto } from 'src/app/Models/Presales/lead';
import { LeadSource } from 'src/app/Models/Presales/leadsource';
import {
  ILeadSubSourceDto,
  LeadSubSource,
} from 'src/app/Models/Presales/leadsubsource';
import { IProject, Project } from 'src/app/Models/Project/project';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';
import { Login } from 'src/app/Models/User/Login';
import { User } from 'src/app/Models/User/User';
import { UserDto } from 'src/app/Models/User/UserDto';
import { AuthService } from 'src/app/Services/CommanService/auth.service';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LeadsCommonService } from 'src/app/Services/CommanService/leads-common.service';
import { StateServiceService } from 'src/app/Services/CommanService/state-service.service';
import { LeadbudgetService } from 'src/app/Services/LeadBugetService/leadbudget.service';
import { LeadService } from 'src/app/Services/Presales/Leads/lead.service';
import { LeadSubsourceService } from 'src/app/Services/Presales/LeadSubSource/lead-subsource.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { UserService } from 'src/app/Services/UserService/userservice.service';

import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import Swal from 'sweetalert2';
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
interface TeamMapDto {
  status: string;
  count: number;
  userId: number;
  userName: string;
  teamId: number;
  teamName: string;
  projectId: number;
  projectName: string;
}

interface AggregatedTeamData {
  teamName: string;
  assignedLeads: number;
  siteVisitDone: number;
  nonContactable: number;
  followUps: number;
}
@Component({
  selector: 'app-sale-head-dashboard-v1',
  templateUrl: './sale-head-dashboard-v1.component.html',
  styleUrls: ['./sale-head-dashboard-v1.component.css'],
})
export class SaleHeadDashboardV1Component {
  @ViewChild(MatDatepicker) datepicker!: MatDatepicker<any>;
  leadsData: MapDto[] = [];
  assignedTo?: number;
  user: User = new User();
  Mainuser: User = new User();
  leadFollowUpTotal: number = 0;
  pageSizeOptions = pageSizeOptions;
  totalLeads: number = 0;
  newLeads: number = 0;
  dashboardTotalLeads: number = 0;
  scheduledVisits: number = 0;
  followups: number = 0;
  dashboardFollowups: number = 0;
  siteVisitDoneCount: number = 0;
  closedLeads: number = 0;
  lostLeads: number = 0;
  nonContactableLeads: number = 0;
  siteVisitProspectFollowups: number = 0;

  totalQualifiedCount: number = 0;
  totalFollowCount: number = 0;
  totalVisitProspectCount: number = 0;
  totalSitVisitDoneCount: number = 0;
  totalNonContactableCount: number = 0;
  totalJunkCount: number = 0;
  totalRevisitProposedCount: number = 0;
  totalRevisitDone: number = 0;
  totalLostCount: number = 0;
  totalBookedLeadsCount: number = 0;
  totalSitvisitConfirmedCount: number = 0;
  totalNewLead: number = 0;
  totalCancelledBooking: number = 0;
  totalEoiReceviedCount: number = 0;
  bookedCount: number = 0;
  lostCount: number = 0;
  lostId: number = 0;
  isShow: boolean = false;
  isShowSourcePie: boolean = false;
  bookedCancelledCount: number = 0;
  private destroy$ = new Subject<void>();
  today: any;
  daysType: string = 'Filter_Days';
  followupStatusType: string = 'Lead_Status';
  moduleNames: string[] = [];
  siteVisitDoneId: number = 0;
  siteVisitProspectId: number[] = [];
  bookedId: number = 0;
  followupIds: number[] = [];
  revisitDoneStatusId: number = 0;
  bookedCancelledId: number = 0;
  days: CommonReferenceDetails[] = [];
  dateRange: any = 0;
  statusId: number = 0;
  userRole: string = '';
  // chart: Chart | any;
  projectName: string = '';
  userName: string = '';
  projects: Project[] = [];
  UserDetails: UserDto[] = [];
  displayedColumns: string[] = [
    'userName',
    'newLeads',
    'noOfFollowups',
    'noOfSiteVisitDone',
    'booked',
  ];
  newLeadId: any;
  ncStatusId: number = 0;
  showDateRangePicker = false;
  formData!: FormGroup;
  startDate: any;
  endDate: any;
  eoiReceivedStatus: number = 0;
  eoiReceivedId: any;
  digitalPartner: any;
  digitalPartnerName: any = '';

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
  teamLeadsData: TeamMapDto[] = [];
  teamData: AggregatedTeamData[] = [];
  organizationId: number = 0;
  unassignedLeads: number = 0;
  public login: Login = new Login('', '');
  leadBudgetSpend: any = [];
  leadBudget: any;
  leadBudgetdateRangeForm!: FormGroup;
  nonContactableStatusId: any;
  nonContactableCount: any;
  projectId: any = [];
  userId: number = 0;
  project: any = new FormControl([] as IProject[]);
  teamWiseDataColumns: string[] = [
    'teamName',
    'assignedLeads',
    'siteVisitDone',
    'nonContactable',
    'followUps',
  ];
  treeData: any;
  User: any = new FormControl([] as UserDto[]);
  sources: LeadSource[] = [];
  filteredSources: LeadSource[] = [];
  sourceId: number = 0;
  selectedDay: any;
  followUpId: number = 0;
  followUpCount: number = 0;
  salesLeads: any = false;
  currentFollowups = 0;
  currentSiteVisitDoneCount = 0;
  currentSiteVisitProspectFollowups = 0;
  currentNonContactableCount = 0;
  currentBookedCount = 0;
  currentBookedCancelledCount = 0;
  currentDashboardTotalLeads = 0;
  currentNewLeads = 0;
  currentUnassignedLeads = 0;
  currentDashboardFollowups = 0;
  currentFollowupIds: number[] = [];
  currentLost: number = 0;
  currentReVisitProposed: number = 0;
  currentReVisitProposedId: number = 0;
  currentSitevisitId: number = 0;
  currentSitevisitconfirmId = 0;
  currentEoiReceivedStatus: number = 0;
  siteVisitConfirmId = 0;
  currentSiteVisitConfirm = 0;
  currentJunk = 0;
  junkId = 0;
  currentQualified = 0;
  qualifiedId = 0;
  currentrevisitDoneCount = 0;
  reVisitDoneId = 0;
  panel1Expanded = true; //First accordion expanded by default
  panel2Expanded = false;
  sourceSubsourceMap: { [key: number]: number[] } = {};
  sourceIds: any[] = [];
  subSourceIds: number[] = [];
  source: any = new FormControl([] as LeadSource[]);
  selectedSubSourcesIds: number[] = [];
  filteredSubSources: LeadSubSource[] = [];
  subSourceId: any = '';
  subSources: any = [];
  @ViewChild('chart') chart: ChartComponent | undefined;
  public leadSourceChartOptions: Partial<ApexOptions> = {};
  subSourceControl = new FormControl([]);
  memberActivityColumns: string[] = [
    'userName',
    'assignedCount',
    'followUpsCount',
  ];
  presaleMemberReport: any = [];
  saleMemberReport: any = [];
  cpTotalQualifiedCount: number = 0;
  cpTotalFollowCount: number = 0;
  cpTotalVisitProspectCount: number = 0;
  cpTotalSitVisitDoneCount: number = 0;
  cpTotalNonContactableCount: number = 0;
  cpTotalJunkCount: number = 0;
  cpTotalRevisitProposedCount: number = 0;
  cpTotalRevisitDone: number = 0;
  cpTotalLostCount: number = 0;
  cpTotalBookedLeadsCount: number = 0;
  cpTotalSitvisitConfirmedCount: number = 0;
  cpTotalNewLead: number = 0;
  cpTotalCancelledBooking: number = 0;
  cpTotalEoiReceviedCount: number = 0;
  @ViewChild('allSelected') private allSelected?: MatOption;
  reVisitDoneCount: number = 0;
  selectedprojectIds: any;
  @ViewChild('allProjectSelected') private allProjectSelected?: any;
  salesLostCount: any = 0;
  salesLostId: any = 0;
  salesNonContactable: any = 0;
  salesNonContactableId: any = 0;
  salesJunkCount = 0;
  salesJunkId = 0;
  salesDNDcount = 0
  salesDNDId = 0
  salesFollowupCount = 0
  salesFollwupId = 0;
  currentSalesLostCount: any = 0;
  currentSalesNonContactable: any = 0;
  currentSalesJunkCount = 0;
  currentSalesDNDcount = 0
  currentSalesFollowupCount = 0
  totalSalesDND: any = 0;
  totalSalesLost: any = 0;
  totalSalesJunk: any = 0;
  totalSalesNonConctactable: any = 0
  totalSalesFollowUp: any = 0
  cpTotalSalesDND: any = 0;
  cpTotalSalesLost: any = 0;
  cpTotalSalesJunk: any = 0;
  cpTotalSalesNonConctactable: any = 0
  cpTotalSalesFollowUp: any = 0
  isExpried:any='N'
  

  constructor(
    private router: Router,
    private leadService: LeadService,
    private commonService: CommanService,
    private formBuilder: FormBuilder,
    private stateService: StateServiceService,
    private leadBudgetService: LeadbudgetService,
    private userService: UserService,
    private authService: AuthService,
    private leadCommonService: LeadsCommonService,
    private projectService: ProjectService,
    private leadSubSource: LeadSubsourceService,
    private loaderService: LoaderService
  ) { }

  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }

  ngOnInit() {
    this.initForm();
    this.initLeadBudgetDateRange();
    console.log('next fecth projects');

    this.fetchLeadSources();
    this.today = new Date().toDateString();
    const user = localStorage.getItem('user');
    const MainUser = localStorage.getItem('Mainuser');

    if (user) {
      this.user = JSON.parse(user);
      this.userRole = this.user.roleName;
      this.organizationId = this.user.organizationId;
      this.fetchProjects();
      this.fetchFilterDays();
      // this.fetchLeadsData(this.user.userId);
      this.fetchTotalLeadsCount();
      this.fetchCpTotalLeadsCount();
      this.userRole.toLocaleLowerCase().includes('sales')
        ? this.moduleNames.push('S,PS')
        : this.moduleNames.push('P,PS');
      //this.getProjectReport();
      // this.fetchLeadsDashboardCount();
    }
    if (MainUser) {
      this.Mainuser = JSON.parse(MainUser);
      this.fetchUser();
    }
    console.log(history.state.panel1Expanded);
    this.panel1Expanded =
      history.state.panel1Expanded == undefined
        ? this.panel1Expanded
        : history.state.panel1Expanded;
    this.panel2Expanded =
      history.state.panel2Expanded == undefined
        ? this.panel2Expanded
        : history.state.panel2Expanded;
    this.getDigitalParter();
    this.digitalPartnerName = history.state.digitalPartner
      ? history.state.digitalPartner
      : '';
    // this.hideLoading();
    this.salesLeads = history.state.salesLeads === true;
   this.isExpried=history.state.expried!=undefined?history.state.expried:this.isExpried
    console.log(history.state)
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    // if (this.chart) {
    //   this.chart.destroy();
    // }
  }

  navigateTo(table: string) {
    this.router.navigate([`/${table}`]);
  }

  navigateToLeads() {
    const userRoleLower = this.userRole.toLowerCase();
    let route = userRoleLower.includes('presale')
      ? 'layout/presales/leads/PST'
      : 'layout/sales/leads/ST';

    if (userRoleLower === 'sales head' || userRoleLower.includes('cto')) {
      route = 'layout/presales/leads/PST';
    }

    // Define the state object with the necessary properties
    const state = {
      dateRange: this.dateRange,
      isMenuLeads: false,
      customStartDate: this.startDate,
      customEndDate: this.endDate,
      projectId: this.projectId,
      // statusId: this.newLeadId,
      dashboard: 'Yes',
      isSalesHeadDashboard: true,
      panel1Expanded: this.panel1Expanded,
      panel2Expanded: this.panel2Expanded,
      digitalPartner: this.digitalPartnerName,
      sourceIds: this.sourceIds,
      selectedSubSourcesIds: this.selectedSubSourcesIds,
      expried:this.isExpried
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
          console.log(response);
          this.statusId = response;
          // this.navigateToLeads();
          const userRoleLower = this.userRole.toLowerCase();
          let route = userRoleLower.includes('presale')
            ? 'layout/presales/leads/PST'
            : 'layout/sales/leads/ST';

          if (userRoleLower === 'sales head') {
            route = 'layout/presales/leads/PST';
          }
          // Define the state object with the necessary properties
          const state = {
            dateRange: this.dateRange,
            isMenuLeads: false,
            customStartDate: this.startDate,
            customEndDate: this.endDate,
            ncStatusId: this.statusId,
          };

          // Set the state in the StateService
          this.stateService.setState('stateData', state);

          // Navigate to the desired route with the state data
          this.router.navigate([route], {
            state: state,
          });
        },
        error: (error) => console.error(error),
      });
  }

  navigateToFollowups(value?: any) {
    const userRoleLower = this.userRole.toLowerCase();
    const route = userRoleLower.includes('presale')
      ? 'layout/presales/dashboard/followups/PST'
      : 'layout/sales/dashboard/followups/ST';
    let statusIds: number[] = value;
    if (statusIds.length <= 0) {
      statusIds = [0];
    }
    this.router.navigate([route], {
      state: {
        dateRange: this.dateRange,
        statusIds: statusIds,
        customStartDate: this.startDate,
        customEndDate: this.endDate,
        projectId: this.projectId,
        isFromDashBoard: true,
        isSalesHeadDashboard: true,
        digitalPartner: this.digitalPartnerName,
      },
    });
  }

  // fetchLeadsData(userId: number) {
  //   this.leadService
  //     .getDashBoardCount(
  //       userId,
  //       this.user.roleId,
  //       this.dateRange,
  //       this.startDate,
  //       this.endDate,
  //       this.projectId
  //     )
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (response: MapDto[]) => {
  //         this.leadsData = response;
  //         this.processDashBoardData();
  //       },
  //       error: (error) => console.error(error),
  //     });
  // }

  // fetchLeadsData(userId: number) {
  //   this.newLeads = 0;
  //   this.scheduledVisits = 0;
  //   this.followups = 0;
  //   this.siteVisitDoneCount = 0;
  //   this.closedLeads = 0;
  //   this.lostLeads = 0;
  //   this.nonContactableLeads = 0;
  //   this.siteVisitProspectFollowups = 0;
  //   this.bookedCount = 0;
  //   this.dashboardFollowups = 0;
  //   this.siteVisitDoneId = [];
  //   this.siteVisitProspectId = [];
  //   this.followupIds = [];

  //   this.leadService
  //     .getProjectTeamReportForChannelPatner(
  //       this.user.userId,
  //       this.user.roleId,
  //       this.dateRange ? this.dateRange : 0,
  //       this.startDate,
  //       this.endDate,
  //       0,
  //       0,
  //       0
  //     )
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (resp: any[]) => {
  //         resp.forEach(
  //           (record: {
  //             name: string;
  //             followUp: number;
  //             followUpId: any;
  //             qualified: number;
  //             qualifiedId: any;
  //             junk: number;
  //             junkId: any;
  //             lost: number;
  //             lostId: any;
  //             reVisitProposed: number;
  //             reVisitProposedId: any;
  //             siteVisitConfirm: number;
  //             siteVisitConfirmId: any;
  //             siteVisitDone: number;
  //             nonContactable: any;
  //             booked: number;
  //             visitProspect: number;
  //             cancelledBookings: number;
  //             bookedId: any;
  //             visitProspectId: number[];
  //             cancelledBookingsId: number;
  //             siteVisitDoneId: any;
  //           }) => {
  //             console.log(record.name);
  //             if (record.name === 'PreSales') {
  //               if (record.followUp > 0) {
  //                 this.dashboardFollowups += record.followUp;
  //                 this.followupIds.push(record.followUpId);
  //               }

  //               if (record.qualified > 0) {
  //                 this.followups += record.qualified;
  //                 this.followupIds.push(record.qualifiedId);
  //               }

  //               if (record.junk > 0) {
  //                 this.followups += record.junk;
  //                 this.followupIds.push(record.junkId);
  //               }

  //               if (record.lost > 0) {
  //                 this.followups += record.lost;
  //                 this.followupIds.push(record.lostId);
  //               }

  //               if (record.reVisitProposed > 0) {
  //                 this.followups += record.reVisitProposed;
  //                 this.followupIds.push(record.reVisitProposedId);
  //               }

  //               if (record.siteVisitConfirm > 0) {
  //                 this.dashboardFollowups += record.siteVisitConfirm;
  //                 this.followupIds.push(record.siteVisitConfirmId);
  //               }

  //               this.siteVisitDoneCount += record.siteVisitDone;
  //               this.nonContactableCount += record.nonContactable;
  //               this.bookedCount = record.booked;
  //               this.siteVisitProspectFollowups = record.visitProspect;
  //               this.bookedCancelledCount = record.cancelledBookings;

  //               this.bookedId = [record.bookedId];
  //               this.siteVisitProspectId = record.visitProspectId;
  //               this.bookedCancelledId = record.cancelledBookingsId;
  //               this.siteVisitDoneId = [record.siteVisitDoneId];
  //             } else if (record.name === 'Sales') {
  //               if (record.followUp > 0) {
  //                 this.dashboardFollowups += record.followUp;
  //                 this.followupIds.push(record.followUpId);
  //               }

  //               if (record.qualified > 0) {
  //                 this.followups += record.qualified;
  //                 this.followupIds.push(record.qualifiedId);
  //               }

  //               if (record.junk > 0) {
  //                 this.followups += record.junk;
  //                 this.followupIds.push(record.junkId);
  //               }

  //               if (record.lost > 0) {
  //                 this.followups += record.lost;
  //                 this.followupIds.push(record.lostId);
  //               }

  //               if (record.reVisitProposed > 0) {
  //                 this.dashboardFollowups += record.reVisitProposed;
  //                 this.followupIds.push(record.reVisitProposedId);
  //               }

  //               if (record.siteVisitConfirm > 0) {
  //                 this.followups += record.siteVisitConfirm;
  //                 this.followupIds.push(record.siteVisitConfirmId);
  //               }

  //               this.siteVisitDoneCount += record.siteVisitDone;
  //               this.nonContactableCount += record.nonContactable;
  //               this.bookedCount = record.booked;
  //               this.siteVisitProspectFollowups = record.visitProspect;
  //               this.bookedCancelledCount = record.cancelledBookings;

  //               this.bookedId = [record.bookedId];
  //               this.siteVisitProspectId = record.visitProspectId;
  //               this.bookedCancelledId = record.cancelledBookingsId;
  //               this.siteVisitDoneId = [record.siteVisitDoneId];
  //             }
  //           }
  //         );

  //         // Further processing for the additional leads section
  //         resp.forEach(
  //           (record: {
  //             name: string;
  //             assignedLeads: number;
  //             nonContactable: any;
  //           }) => {
  //             if (record.name === 'PreSales') {
  //               this.newLeads += record.assignedLeads;
  //               this.nonContactableCount = record.nonContactable;
  //               console.log('PreSales', this.newLeads);
  //             } else if (record.name === 'Sales') {
  //               this.newLeads += record.assignedLeads;
  //               this.nonContactableCount = record.nonContactable;
  //               console.log('Sales', this.newLeads);
  //             }
  //           }
  //         );
  //       },
  //       error: (err: any) => {},
  //     });
  // }

  fetchFilterDays() {
    this.commonService.getRefDetailsByType(this.daysType).subscribe({
      next: (response: CommonReferenceDetails[]) => {
        this.days = response.filter((day) => {
          const value = day.commonRefValue.toLowerCase();
          return !value.includes('tomo') && !value.includes('next');
        });
        // this.selectedDay = this.days.find((day) => day.commonRefKey === '0'); // Set "Today" as the default
        this.patchDateFilterAndFetchData();
      },
      error: (error) => console.error(error),
    });
  }

  patchDateFilterAndFetchData() {
    const dayToFind = history.state.dateRange;
    const startDate = history.state.customStartDate;
    const endDate = history.state.customEndDate;
    this.projectId = history.state.projectId;
    if (this.projectId?.length > 0) {
      this.patchStateProjectIds(this.projectId)
    }
    if (
      startDate !== undefined &&
      endDate !== undefined &&
      startDate !== null &&
      endDate !== null
    ) {
      // const start
      this.startDate = startDate;
      this.endDate = endDate;
      this.selectedDay = this.days.find((day) => day.commonRefKey === 'Custom');
      this.showDateRangePicker = true;
      this.formData.patchValue({
        customStartDate: this.leadCommonService.convertToDateTime(startDate),
        customEndDate: this.leadCommonService.convertToDateTime(endDate),
      });
    } else if (dayToFind !== undefined) {
      if (dayToFind === 0) {
        this.selectedDay = this.days.find((day) => day.commonRefKey === '0');
        this.dateRange = dayToFind;
      } else if (dayToFind != 0) {
        this.dateRange = dayToFind;
        this.selectedDay = this.days.find(
          (day) => day.commonRefKey === dayToFind
        );
        console.log(this.selectedDay);
      }
      // alert('Fetching data');
      // this.fetchLeadsDashboardCount();
    } else {
      this.selectedDay = this.days.find((day) => day.commonRefKey === '0');
    }
    this.sourceIds = history.state.sourceIds || [];
    this.formData.value.sourceIds = this.sourceIds;
    this.formData.patchValue({ sourceIds: this.sourceIds });

    if (this.sourceIds?.length > 0) {
      this.patchStateSubSourcesBySourceIds(this.sourceIds);
    }
    this.subSourceIds = history.state.subSourceIds || [];
    this.selectedSubSourcesIds = history.state.subSourceIds || [];
    // this.selectedSubSourcesIds = this.subSourceIds;
    this.fetchLeadsDashboardCount();
    this.fetchLeadsCurrentStatusDashboardCount();
    this.getLeadSourceCount();
    this.getProjectReport();
    this.getPresaleMemberReport();
    this.getSaleMemberReport();
  }

  handleDaySelection(commonRefObject: CommonReferenceDetails) {
    this.dateRange = commonRefObject.commonRefKey;
    if (commonRefObject.commonRefValue.includes('Custom')) {
      this.showDateRangePicker = true;
      this.dateRange = '';
    } else {
      this.startDate = null;
      this.endDate = null;
      this.formData.patchValue({
        customStartDate: null,
        customEndDate: null,
      });
      // this.fetchLeadsData(this.user.userId);
      this.getProjectReport();
      this.fetchLeadsDashboardCount();
      this.fetchLeadsCurrentStatusDashboardCount();
      this.getLeadSourceCount();
      this.getPresaleMemberReport();
      this.getSaleMemberReport();
      this.showDateRangePicker = false;
    }
    console.log(this.showDateRangePicker);
  }
  //without cp source
  fetchTotalLeadsCount() {
    this.leadService
      .fetchTotalLeadsCount(this.user.userId, this.user.roleId, '')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: MapDto[]) => {
          response.forEach((lead) => {
            const leadStatus = lead.status;
            if (leadStatus === 'Q') {
              this.totalQualifiedCount = lead.value;
            } else if (leadStatus === 'LF') {
              this.totalFollowCount = lead.value;
            } else if (leadStatus === 'VP') {
              this.totalVisitProspectCount = lead.value;
            } else if (leadStatus === 'SVD') {
              this.totalSitVisitDoneCount = lead.value;
            } else if (leadStatus === 'NC') {
              this.totalNonContactableCount = lead.value;
            } else if (leadStatus === 'JL') {
              this.totalJunkCount = lead.value;
            } else if (leadStatus === 'RVP') {
              this.totalRevisitProposedCount = lead.value;
            } else if (leadStatus === 'LO') {
              this.totalLostCount = lead.value;
            } else if (leadStatus === 'B') {
              this.totalBookedLeadsCount = lead.value;
            } else if (leadStatus === 'SVC') {
              this.totalSitvisitConfirmedCount = lead.value;
            } else if (leadStatus === 'NL') {
              this.totalNewLead = lead.value;
            } else if (leadStatus === 'CB') {
              this.totalCancelledBooking = lead.value;
            } else if (leadStatus === 'EOI') {
              this.totalEoiReceviedCount = lead.value;
            }
            else if (leadStatus === 'SNC'){
              this.totalSalesNonConctactable=lead.value
            }
            else if (leadStatus==='SJ'){
              this.totalSalesJunk=lead.value
            }
            else if (leadStatus === 'SL'){
              this.totalSalesLost=lead.value
            }
            else if (leadStatus === 'SDND'){
              this.totalSalesDND=lead.value
            }
            else if (leadStatus === 'SF'){
              this.totalSalesFollowUp=lead.value
            }
          });
          this.updateChartOptions(response);
          // this.createChart();
        },
        error: (error) => console.error(error),
      });
  }

  // createChart(): void {
  //   if (!this.isAllDataZero()) {
  //     const canvas = document.getElementById('MyChart') as HTMLCanvasElement;
  //     if (canvas) {
  //       this.chart = new Chart(canvas, {
  //         type: 'pie',
  //         data: {
  //           labels: ['Total', 'Booked', 'Closed', 'Lost'],
  //           datasets: [
  //             {
  //               label: 'Count',
  //               data: [
  //                 this.totalLeads,
  //                 this.totalBookedLeadsCount,
  //                 this.closedLeads,
  //                 this.lostLeads,
  //               ],
  //               backgroundColor: ['#329ca8', 'green', 'purple', 'red'],
  //               hoverOffset: 4,
  //             },
  //           ],
  //         },
  //         options: {
  //           aspectRatio: 2.2,
  //           plugins: {
  //             legend: {
  //               position: 'right', // Set legend position to bottom
  //             },
  //           },
  //         },
  //       });
  //     }
  //   }
  // }

  isAllDataZero(): boolean {
    return (
      this.totalLeads === 0 &&
      this.totalBookedLeadsCount === 0 &&
      this.closedLeads === 0 &&
      this.lostLeads === 0
    );
  }

  private initForm(): void {
    this.formData = this.formBuilder.group({
      customStartDate: [],
      customEndDate: [],
      sourceIds: new FormControl(''),
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

  searchProject(event: any) {
    if (event.target.value.length >= 3) {
      this.projectName = event.target.value;
      this.fetchProjects();
    } else if (event.target.value.length === 0) {
      this.projectName = '';
      this.projectId = 0;
      this.fetchProjects();
      // this.getProjectReport();
      // this.fetchLeadsDashboardCount();
      // this.fetchLeadsCurrentStatusDashboardCount();
      // this.getLeadSourceCount();
      // this.getPresaleMemberReport();
      // this.getSaleMemberReport();
    }
  }

  searchUser(event: any) {
    if (event.target.value.length >= 3 || event.target.value.length == 0) {
      this.userName = event.target.value;
      this.fetchUser();
    }
  }
  fetchProjects() {
    // this.projectService
    //   .getAllProjects(this.projectName, 0, 100, 'Y', this.user.organizationId)
    //   .subscribe({
    //     next: (projects) => {
    //       this.projects = projects.records;
    //       // alert(this.projectId);
    //     },
    //     error: (error) => {
    //       console.error('Error fetching projects:', error);
    //     },
    //   });
    this.projectName = this.projectName || '';
    this.projectService
      .getAllProjects(this.projectName, 0, 1000, 'Y', this.user.organizationId)
      .subscribe({
        next: (projects) => {
          this.projects = projects.records;
          if (this.selectedprojectIds?.length > 0) {
            this.sortProject(this.projects, this.selectedprojectIds)
            console.log(this.projects)
            // const projectId = this.projects.map(p => p.projectId)
            // console.log(this.projects)
            // if (projectId.length == this.selectedprojectIds.length) {
            //   console.log(this.projectId)
            //   this.projectId.push(0)
            // }
          }

        },
        error: (error) => {
          console.error('Error fetching projects:', error);
        },
      });
  }

  patchProject() {
    this.projectService
      .getAllProjects(this.projectName, 0, 100, 'Y', this.user.organizationId)
      .subscribe({
        next: (projects) => {
          this.projects = projects.records;
          if (this.projectId > 0) {
            this.project.patchValue(
              this.projects.find(
                (project: any) => this.projectId === project.projectId
              )
            );
          }
        },
        error: (error) => {
          console.error('Error fetching projects:', error);
        },
      });
  }
  fetchUser() {
    this.userService
      .getUserByManagerId(this.Mainuser.userId, this.userName)
      .subscribe({
        next: (UserDetails) => {
          this.UserDetails = UserDetails;
        },
        error: (error) => {
          console.error('Error fetching UserDetails:', error);
        },
      });
  }


  onUserSelect(event: any) {
    this.userId = event.option.value.userId;
    this.login.identifier = event.option.value.email;
    this.login.password = event.option.value.showPassword;

    this.userService.login(this.login).subscribe({
      next: (response) => {
        this.user = response.userDto;
        // Swal.fire('Login!', 'success');
        this.authService.setUser(JSON.stringify(this.user));
        this.authService.setRole(this.user.roleName);
        this.authService.setAccessToken(response.accessToken);
        this.authService.setRefreshToken(response.token);
        console.log(this.user.homePath);
        this.navigateToDashBoard(this.user.homePath);
      },
      error: (err) => {
        if (err.status === 0) {
          Swal.fire('Failed', 'Failed to connect to server', 'error');
        } else if (err.status === 403 || err.status == 401) {
          Swal.fire('Failed', 'Invalid Credentials', 'error');
        } else {
          Swal.fire('Failed', 'An unexpected error occurred', 'error');
        }
        console.error('Failed to fetch:', err);
      },
    });
  }
  private navigateToDashBoard(homePath: string) {
    this.authService.setDashBoardPath(homePath);
    this.router.navigate(['/layout']).then(() => {
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => {
          window.location.reload();
        });
    });
  }

  displayProject(project: IProject): string {
    return project && project.projectName ? project.projectName : 'All';
  }

  displayUser(user: User): string {
    return user && user.userName ? user.userName : '';
  }

  // processDashBoardData() {
  //   this.totalLeads = 0;
  //   this.newLeads = 0;
  //   this.scheduledVisits = 0;
  //   this.followups = 0;
  //   this.siteVisitDoneCount = 0;
  //   this.closedLeads = 0;
  //   this.lostLeads = 0;
  //   this.nonContactableLeads = 0;
  //   this.siteVisitProspectFollowups = 0;
  //   this.bookedCount = 0;

  //   this.siteVisitDoneId = [];
  //   this.siteVisitProspectId = [];
  //   this.followupIds = [];

  //   this.leadsData.forEach((data) => {
  //     switch (data.status) {
  //       case 'Assigned Leads':
  //         this.newLeads = data.value;
  //         break;
  //       case 'Booked':
  //         this.bookedCount = data.value;
  //         this.bookedId.push(data.statusId);
  //         break;
  //       case 'Qualified':
  //       case 'Follow-up':
  //       case 'Site Visit Confirm':
  //       case 'Lost':
  //       case 'Junk':
  //         this.followups += data.value;
  //         this.followupIds.push(data.statusId);
  //         break;
  //       case 'Non-Contactable':
  //         this.nonContactableLeads = data.value;
  //         break;
  //       case 'Site Visit Done':
  //       case 'Revisit Done':
  //         this.siteVisitDoneCount = data.value;
  //         this.siteVisitDoneId.push(data.statusId);
  //         break;

  //       case 'Visit Prospect':
  //         this.siteVisitProspectFollowups = data.value;
  //         this.siteVisitProspectId.push(data.statusId);
  //         break;
  //       case 'Cancelled Booking':
  //         this.bookedCancelledCount = data.value;
  //         this.bookedCancelledId = data.statusId;
  //         break;
  //       default:
  //         console.warn(`Unknown status: ${data.status}`);
  //     }
  //   });
  // }

  // fetchTeamWiseData() {
  //   this.leadService
  //     .teamWiseLeadsData(
  //       this.user.userId,
  //       this.user.roleId,
  //       this.dateRange,
  //       this.startDate,
  //       this.endDate
  //     )
  //     .subscribe({
  //       next: (response) => {
  //         this.teamLeadsData = response;
  //         this.processDashBoardTeamData();
  //       },
  //       error: (error) => {
  //         console.error('Error fetching team wise data:', error);
  //       },
  //     });
  // }

  processDashBoardTeamData(): void {
    const teamMap = new Map<number, AggregatedTeamData>();

    this.teamLeadsData.forEach((lead) => {
      if (!teamMap.has(lead.teamId)) {
        teamMap.set(lead.teamId, {
          teamName: lead.teamName,
          assignedLeads: 0,
          siteVisitDone: 0,
          nonContactable: 0,
          followUps: 0,
        });
      }

      const team = teamMap.get(lead.teamId)!;

      switch (lead.status) {
        case 'Assigned Leads':
          team.assignedLeads += lead.count;
          break;
        case 'Site Visit Done':
        case 'Revisit Done':
          team.siteVisitDone += lead.count;
          break;
        case 'Non-Contactable':
          team.nonContactable += lead.count;
          break;
        case 'Follow-up':
        case 'Junk':
        case 'Qualified':
        case 'Site Visit Confirm':
        case 'Lost':
          team.followUps += lead.count;
          break;
      }
    });

    this.teamData = Array.from(teamMap.values());
  }

  getProjectReport() {
    const apiSourceIds = this.sourceIds?.filter((value) => value !== 'All');
    this.leadService
      .getProjectTeamReport(
        this.user.userId,
        this.user.roleId,
        this.dateRange ? this.dateRange : 0,
        this.startDate,
        this.endDate,
        this.projectId,
        '',
        '',
        apiSourceIds,
        this.selectedSubSourcesIds,
        this.digitalPartnerName,
        this.isExpried
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.treeData = resp;
          // this.hideLoading();
        },
        error: (err) => {
          // this.hideLoading();
        },
      });
  }

  expandedNodes = new Set<string>();
  activeNodes = new Set<string>();

  getUniqueId(node: any, ...indices: number[]): string {
    return `${node.name}-${indices.join('-')}`;
  }

  isActive(id: string): boolean {
    return this.activeNodes.has(id);
  }

  isExpanded(id: string): boolean {
    return this.expandedNodes.has(id);
  }

  toggle(id: string): void {
    if (this.expandedNodes.has(id)) {
      this.expandedNodes.delete(id);
    } else {
      this.expandedNodes.add(id);
    }

    if (this.activeNodes.has(id)) {
      this.activeNodes.delete(id); // Deselect row
    } else {
      this.activeNodes.add(id); // Select new row
    }
  }

  @ViewChild('chart') Chart: ChartComponent | undefined;
  public chartOptions: Partial<ApexOptions> = {};
  public cpChartOptions: Partial<ApexOptions> = {};

  updateChartOptions(resp: any) {
    // Define your data points
    const totalQualifiedCount = this.totalQualifiedCount || 0;
    const totalFollowUpCount = this.totalFollowCount || 0;
    const totalVisitProspect = this.totalVisitProspectCount || 0;
    const totalSiteVisitDone = this.closedLeads || 0;
    const totalNonContactableCount = this.totalNonContactableCount || 0;
    const totalJunkCount = this.totalJunkCount;
    const totalRevisitDone = this.totalRevisitDone;
    const totalLostLeads = this.totalLostCount || 0;
    const totalBookedLeadsCount = this.totalBookedLeadsCount || 0;
    const totalSitvisitConfirmedCount = this.totalSitvisitConfirmedCount;
    const totalNewLead = this.totalNewLead;
    const totalCancelledBooking = this.totalCancelledBooking;
    const totalEoiReceviedCount = this.totalEoiReceviedCount;
    const totalSalesFollowUp=this.totalSalesFollowUp;
    const totalSalesLost=this.totalSalesLost;
    const totalSalesNonContactableCount=this.totalSalesNonConctactable;
    const totalSalesJunk=this.totalJunkCount;
    const totalSalesDND=this.totalSalesDND;

    // Prepare series data and labels
    const series = [
      totalNewLead,
      totalFollowUpCount,
      totalSitvisitConfirmedCount,
      totalNonContactableCount,
      totalVisitProspect,
      totalSiteVisitDone,
      totalSalesFollowUp,
      totalSalesLost,
      totalSalesNonContactableCount,
      totalSalesFollowUp,
      totalSalesLost,
      totalSalesNonContactableCount,
      totalSalesJunk,
      totalSalesDND,
      totalRevisitDone,
      totalBookedLeadsCount,
      totalCancelledBooking,
      totalQualifiedCount,
      totalLostLeads,
      totalJunkCount,
      totalEoiReceviedCount,
    ];

    // Initialize labels as an empty array
    let labels: string[] = [
      'New Lead',
      'Follow Ups',
      'SiteVisit Confirm',
      'Non Contactable',
      'Visit Prospect',
      'SiteVisit Done',
      'Sales Follow Up',
      'Sales Lost',
      'Sales Non-Contactable',
      'Sales Junk',
      'Sales DND',
      'Revisit Done',
      'Booked',
      'Cancelled Booking',
      'Qualified',
      'Lost',
      'Junk',
      'EOI Recevied',
    ];

    // Use `map` to transform `resp` and populate `labels`

    // resp.filter((res: any) => res.status !== "Total").map((res: any) => res.status);

    // resp.map((item:any) => item.sourceName);
    // Set chart options
    this.chartOptions = {
      series: series,
      chart: {
        width: 400,
        type: 'pie',
      },
      labels: labels,
      colors: [
        '#C1AEFC',
        '#2AADB2',
        '#F6C275',
        '#B48E75',
        '#30BACC',
        '#A5AF81',
        '#44769c',
        '#a83e69',
        '#f5b0c3',
        '#8c6f9e',
        '#b8b291',
        '#7B338F',
        '#3FCA79',
        '#2977B2',
        '#338F5E',
        '#6B8A7A',
        '#CA4F98',
        '#D3DE5F',
      ],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };

    // Show or hide the chart based on the presence of data
    this.isShow = series.some((value) => value > 0);
  }

  fetchLeadsDashboardCount() {
    const apiSourceIds = this.sourceIds?.filter((value) => value !== 'All');
    console.log(this.sourceIds);
    this.followups = 0;
    this.siteVisitDoneCount = 0;
    this.siteVisitProspectFollowups = 0;
    this.nonContactableCount = 0;
    this.bookedCount = 0;
    this.bookedCancelledCount = 0;
    this.dashboardTotalLeads = 0;
    this.newLeads = 0;
    this.unassignedLeads = 0;
    this.dashboardFollowups = 0;
    this.salesLeads = 0;
    this.followUpCount = 0;
    this.lostCount = 0;
    this.reVisitDoneCount = 0;
    this.salesJunkCount = 0
    this.salesLostCount = 0;
    this.salesFollowupCount = 0;
    this.salesNonContactable = 0
    this.salesDNDcount = 0;
    this.leadService
      .fetchLeadsDashboardCountV1(
        this.user.userId,
        this.user.roleId,
        this.digitalPartnerName,
        this.dateRange,
        this.startDate,
        this.endDate,
        this.projectId,
        '',
        '',
        '',
        apiSourceIds,
        this.selectedSubSourcesIds,
        this.isExpried
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.dashboardTotalLeads = resp.assignedLeads;
          this.newLeads = resp.newLeads;
          this.dashboardFollowups =
            resp.siteVisitConfirm + resp.reVisitProposed;
          if (resp.siteVisitConfirmId) {
            this.followupIds.push(resp.siteVisitConfirmId);
          }
          if (resp.reVisitProposedId) {
            this.followupIds.push(resp.reVisitProposedId);
            this.followups = this.followups + resp.reVisitProposed;
          }
          this.siteVisitDoneCount = resp.siteVisitDone;
          this.nonContactableCount = resp.nonContactable;
          this.unassignedLeads = resp.unassignedLeads;
          this.lostCount = resp.lost;
          this.lostId = resp.lostId;
          this.bookedCount = resp.booked;
          this.siteVisitProspectFollowups = resp.visitProspect;
          this.bookedCancelledCount = resp.cancelledBookings;
          this.newLeadId = resp.newLeadId;
          this.bookedId = resp.bookedId;
          this.siteVisitProspectId = resp.visitProspectId;
          this.bookedCancelledId = resp.cancelledBookingsId;
          this.siteVisitDoneId = resp.siteVisitDoneId;
          this.reVisitDoneId = resp.reVisitDoneId;
          this.reVisitDoneCount = resp.reVisitDone;
          this.ncStatusId = resp.nonContactableId;
          this.newLeadId = resp.newLeadId;
          this.eoiReceivedStatus = resp.eoiReceivedStatus;
          this.eoiReceivedId = resp.eoiReceivedId;
          this.followUpId = resp.followUpId;
          this.followUpCount = resp.followUp;
          this.salesLeads = resp.salesLeads;
          this.salesDNDId = resp.salesDNDId;
          this.salesDNDcount = resp.salesDND;
          this.salesNonContactable = resp.salesNoncontactable;
          this.salesNonContactableId = resp.salesNoncontactableId;
          this.salesJunkCount = resp.salesJunk;
          this.salesJunkId = resp.salesJunkId;
          this.salesLostCount = resp.salesLost;
          this.salesLostId = resp.salesLostId;
          this.salesFollowupCount = resp.salesFollowUp;
          this.salesFollwupId = resp.salesFollowUpId;
        },
        error: (err) => { },
      });
  }

  navigateToLeadsByStatus(statusId: any) {
    const userRoleLower = this.userRole.toLowerCase();
    let route = userRoleLower.includes('presale')
      ? 'layout/presales/leads/PST'
      : 'layout/sales/leads/ST';

    if (userRoleLower === 'sales head') {
      route = 'layout/presales/leads/PST';
    }
    // Define the state object with the necessary properties
    const state = {
      dateRange: this.dateRange,
      isMenuLeads: false,
      customStartDate: this.startDate,
      customEndDate: this.endDate,
      projectId: this.projectId,
      statusId: statusId,
      dashboard: 'Yes',
      isSalesHeadDashboard: true,
      panel1Expanded: this.panel1Expanded,
      panel2Expanded: this.panel2Expanded,
      digitalPartner: this.digitalPartnerName,
      sourceIds: this.sourceIds,
      selectedSubSourcesIds: this.selectedSubSourcesIds,
      expried:this.isExpried
    };

    console.log(`Data type of status: ${statusId}` + typeof statusId);
    // Set the state in the StateService
    this.stateService.setState('stateData', state);

    // Navigate to the desired route with the state data
    this.router.navigate([route], {
      state: state,
    });
  }

  onDateRangeChange(): void {
    const formDataValue = this.formData.value;
    if (formDataValue.customStartDate && formDataValue.customEndDate) {
      const startDate = this.formatDateTime(formDataValue.customStartDate);
      const endDate = this.formatDateTime(formDataValue.customEndDate, true);

      this.startDate = startDate;
      this.endDate = endDate;

      // Replace the alert and call necessary API methods.
      this.getProjectReport();
      this.fetchLeadsDashboardCount();
      this.fetchLeadsCurrentStatusDashboardCount();
      this.getLeadSourceCount();
      this.getPresaleMemberReport();
      this.getSaleMemberReport();
    }
  }

  navigateToUnassignedLeads() {
    console.log('unassigned leads');
    const userRoleLower = this.userRole.toLowerCase();
    let route = userRoleLower.includes('presale')
      ? 'layout/presales/leads/PST'
      : 'layout/sales/leads/ST';

    if (userRoleLower === 'sales head' || userRoleLower.includes('cto')) {
      route = 'layout/presales/leads/PST';
    }

    // Define the state object with the necessary properties
    const state = {
      dateRange: this.dateRange,
      isMenuLeads: false,
      customStartDate: this.startDate,
      customEndDate: this.endDate,
      projectId: this.projectId,
      // statusId: this.newLeadId,
      dashboard: 'Yes',
      isSalesHeadDashboard: true,
      isUnassignedLeads: true,
      userId: this.user.userId,
      panel1Expanded: this.panel1Expanded,
      panel2Expanded: this.panel2Expanded,
      digitalPartner: this.digitalPartnerName,
      sourceIds: this.sourceIds,
      selectedSubSourcesIds: this.selectedSubSourcesIds,
      expried:this.isExpried
    };
    // Set the state in the StateService
    this.stateService.setState('stateData', state);

    // Navigate to the desired route with the state data
    this.router.navigate([route], {
      state: state,
    });
    console.log(state);
  }

  navigateToSaleLeads() {
    this.salesLeads = true;
    const userRoleLower = this.userRole.toLowerCase();
    let route = userRoleLower.includes('presale')
      ? 'layout/presales/leads/PST'
      : 'layout/sales/leads/ST';

    if (userRoleLower === 'sales head' || userRoleLower.includes('cto')) {
      route = 'layout/presales/leads/PST';
    }

    // Define the state object with the necessary properties
    const state = {
      dateRange: this.dateRange,
      isMenuLeads: false,
      customStartDate: this.startDate,
      customEndDate: this.endDate,
      projectId: this.projectId,
      // statusId: this.newLeadId,
      dashboard: 'Yes',
      isSalesHeadDashboard: true,
      salesLeads: this.salesLeads,
      panel1Expanded: this.panel1Expanded,
      panel2Expanded: this.panel2Expanded,
      digitalPartner: this.digitalPartnerName,
      sourceIds: this.sourceIds,
      selectedSubSourcesIds: this.selectedSubSourcesIds,
      expried:this.isExpried
    };
    // Set the state in the StateService
    this.stateService.setState('stateData', state);

    // Navigate to the desired route with the state data
    this.router.navigate([route], {
      state: state,
    });
  }

  fetchLeadsCurrentStatusDashboardCount() {
    this.showLoading();
    // alert(this.formData.value.sourceIds);
    console.log(this.formData.value.sourceIds);
    // const apiSourceIds = this.sourceIds?.filter((value) => value !== 'All');
    const apiSourceIds = this.formData.value.sourceIds;
    this.currentFollowups = 0;
    this.currentSiteVisitDoneCount = 0;
    this.currentSiteVisitProspectFollowups = 0;
    this.currentNonContactableCount = 0;
    this.currentBookedCount = 0;
    this.currentBookedCancelledCount = 0;
    this.currentDashboardTotalLeads = 0;
    this.currentNewLeads = 0;
    this.currentUnassignedLeads = 0;
    this.currentDashboardFollowups = 0;
    this.currentLost = 0;
    this.currentSiteVisitDoneCount = 0;
    this.currentEoiReceivedStatus = 0;
    this.currentSiteVisitConfirm = 0;
    this.currentJunk = 0;
    this.currentQualified = 0;
    this.currentrevisitDoneCount = 0;
    this.currentSalesLostCount = 0;
    this.currentSalesNonContactable = 0;
    this.currentSalesJunkCount = 0;
    this.currentSalesDNDcount = 0
    this.currentSalesFollowupCount = 0
    this.leadService
      .fetchLeadsCurrentStatusDashboardCount(
        this.user.userId,
        this.user.roleId,
        this.digitalPartnerName,
        this.dateRange,
        this.startDate,
        this.endDate,
        this.projectId,
        '',
        '',
        '',
        apiSourceIds,
        this.selectedSubSourcesIds,
        this.isExpried
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.currentDashboardTotalLeads = resp.assignedLeads;
          this.currentNewLeads = resp.newLeads;
          this.currentReVisitProposed = resp.reVisitProposed;
          this.currentSiteVisitDoneCount = resp.siteVisitDone;
          this.currentNonContactableCount = resp.nonContactable;
          this.currentUnassignedLeads = resp.unassignedLeads;
          //this.currentLost = resp.lost;
          this.lostId = resp.lostId;
          this.currentBookedCount = resp.booked;
          this.currentSiteVisitProspectFollowups = resp.visitProspect;
          this.currentBookedCancelledCount = resp.cancelledBookings;
          this.newLeadId = resp.newLeadId;
          this.bookedId = resp.bookedId;
          this.siteVisitProspectId = resp.visitProspectId;
          this.bookedCancelledId = resp.cancelledBookingsId;
          this.siteVisitDoneId = resp.siteVisitDoneId;
          this.ncStatusId = resp.nonContactableId;
          this.newLeadId = resp.newLeadId;
          this.currentEoiReceivedStatus = resp.eoiReceivedStatus;
          this.eoiReceivedId = resp.eoiReceivedId;
          this.followUpId = resp.followUpId;
          this.currentLost = resp.lost;
          this.currentSiteVisitConfirm = resp.siteVisitConfirm;
          this.siteVisitConfirmId = resp.siteVisitConfirmId;
          this.currentJunk = resp.junk;
          this.junkId = resp.junkId;
          this.currentQualified = resp.qualified;
          this.qualifiedId = resp.qualifiedId;
          this.reVisitDoneId = resp.reVisitDoneId;
          this.currentReVisitProposedId = resp.reVisitProposedId;
          this.currentrevisitDoneCount = resp.reVisitDone;
          this.currentFollowups = resp.followUp;
          this.salesDNDId = resp.salesDNDId;
          this.currentSalesDNDcount = resp.salesDND;
          this.currentSalesNonContactable = resp.salesNoncontactable;
          this.salesNonContactableId = resp.salesNoncontactableId;
          this.currentSalesJunkCount = resp.salesJunk;
          this.salesJunkId = resp.salesJunkId;
          this.currentSalesLostCount = resp.salesLost;
          this.salesLostId = resp.salesLostId;
          this.currentSalesFollowupCount = resp.salesFollowUp;
          this.salesFollwupId = resp.salesFollowUpId;
          //this.currentFollowUpCount=resp.followUp;
          this.hideLoading();
        },
        error: (err) => {
          this.hideLoading();
        },
      });
  }

  navigateToLeadsCurrentStatus() {
    const userRoleLower = this.userRole.toLowerCase();
    let route = userRoleLower.includes('presale')
      ? 'layout/presales/leads/PST'
      : 'layout/sales/leads/ST';

    if (userRoleLower === 'sales head' || userRoleLower.includes('cto')) {
      route = 'layout/presales/leads/PST';
    }

    // Define the state object with the necessary properties
    const state = {
      dateRange: this.dateRange,
      isMenuLeads: false,
      customStartDate: this.startDate,
      customEndDate: this.endDate,
      projectId: this.projectId,
      // statusId: this.newLeadId,
      currentStatusDashboard: 'Yes',
      isSalesHeadDashboard: true,
      panel1Expanded: this.panel1Expanded,
      panel2Expanded: this.panel2Expanded,
      digitalPartner: this.digitalPartnerName,
      sourceIds: this.sourceIds,
      selectedSubSourcesIds: this.selectedSubSourcesIds,
      expried:this.isExpried
    };
    // Set the state in the StateService
    this.stateService.setState('stateData', state);

    // Navigate to the desired route with the state data
    this.router.navigate([route], {
      state: state,
    });
  }

  navigateToLeadsByCurrentStatus(statusId: any) {
    const userRoleLower = this.userRole.toLowerCase();
    let route = userRoleLower.includes('presale')
      ? 'layout/presales/leads/PST'
      : 'layout/sales/leads/ST';

    if (userRoleLower === 'sales head') {
      route = 'layout/presales/leads/PST';
    }
    // Define the state object with the necessary properties
    const state = {
      dateRange: this.dateRange,
      isMenuLeads: false,
      customStartDate: this.startDate,
      customEndDate: this.endDate,
      projectId: this.projectId,
      statusId: Number(statusId),
      currentStatusDashboard: 'Yes',
      isSalesHeadDashboard: true,
      panel1Expanded: this.panel1Expanded,
      panel2Expanded: this.panel2Expanded,
      digitalPartner: this.digitalPartnerName,
      sourceIds: this.sourceIds,
      selectedSubSourcesIds: this.selectedSubSourcesIds,
      expried:this.isExpried
    };

    // Set the state in the StateService
    this.stateService.setState('stateData', state);

    // Navigate to the desired route with the state data
    this.router.navigate([route], {
      state: state,
    });
  }

  onPanelOpen(panelNumber: number): void {
    if (panelNumber === 1) {
      this.panel1Expanded = true;
      this.panel2Expanded = false;
    } else if (panelNumber === 2) {
      this.panel1Expanded = false;
      this.panel2Expanded = true;
    }
  }
  onPanelClose(panelNumber: number): void {
    if (panelNumber === 1) {
      this.panel1Expanded = false;
      this.panel2Expanded = true; // Automatically open the other panel
    } else if (panelNumber === 2) {
      this.panel1Expanded = true; // Automatically open the other panel
      this.panel2Expanded = false;
    }
  }

  getLeadSourceCount() {
    this.leadService
      .getLeadSourceCount(
        this.dateRange ? this.dateRange : 0,
        this.startDate,
        this.endDate,
        this.projectId,
        '',
        this.isExpried
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp: { sourceName: string; leadCount: number }[]) => {
          // Map response data to chart labels and datasets
          //this.chartData.labels = resp.map((item) => item.sourceName);
          //  this.chartData.datasets[0].data = resp.map((item) => item.leadCount);
          this.updateLeadSourceChartOptions(resp);

          //console.log(this.chartData); // Debugging purposes
        },
        error: (err) => {
          console.error('Error fetching lead source count:', err);
        },
      });
  }

  updateLeadSourceChartOptions(res: any) {
    // alert('hhh');
    // Define the order for labels and corresponding data
    const sourceOrder = [
      'Self',
      'Walk-In',
      'Social Media',
      'Reference',
      'Portal',
      'BTL',
      'Channel Partner',
      'Digital',
    ];

    // Initialize series data with zero counts
    const series = new Array(sourceOrder.length).fill(0);

    // Map response data to series based on sourceOrder
    res.forEach((resp: any) => {
      const index = sourceOrder.indexOf(resp.sourceName);
      if (index !== -1) {
        series[index] = resp.leadCount || 0;
      }
    });

    // Set chart options
    this.leadSourceChartOptions = {
      series: series,
      chart: {
        width: 380,
        type: 'pie',
      },
      labels: sourceOrder, // Use the predefined order for labels
      colors: [
        '#FF6384', // Red
        '#36A2EB', // Blue
        '#FFCE56', // Yellow
        '#4BC0C0', // Teal
        '#9966FF', // Purple
        '#FF9F40', // Orange
        '#8BC34A', // Green
        '#00ACC1', // Cyan
      ],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };

    // Show or hide the chart based on the presence of data
    this.isShowSourcePie = series.some((value) => value > 0);
  }

  getDigitalParter() {
    this.commonService.fetchCommonReferenceTypes(DIGITAL_PARTNER).subscribe({
      next: (data) => {
        this.digitalPartner = data.filter(
          (e) => e.commonRefKey == 'DIGITAL_PARTNER'
        );
        //this.setDefaultStatus();
      },
      error: (error) => {
        console.error(error?.message);
      },
    });
  }

  handleDigitalParterSelection(event: any) {
    console.log(event);
    this.getProjectReport();
    this.digitalPartnerName = event;
    this.fetchLeadsDashboardCount();
    this.fetchLeadsCurrentStatusDashboardCount();
    this.getPresaleMemberReport();
    this.getSaleMemberReport();
  }

  selectedSources: LeadSource[] = [];

  onSelectionSourceChange(event: MatSelectChange) {
    console.log(event);
    // alert(' sources length ' + this.sources.length);

    let selectedIds = event.value;
    const previouslySelectedIds = [...this.sourceIds]; // Store previous selection

    // Find unchecked (deselected) values
    const uncheckedIds = previouslySelectedIds.filter(
      (id) => !selectedIds.includes(id)
    );
    console.log('Unchecked values:', uncheckedIds);

    // alert('Selected sources length ' + selectedIds.length);
    // If 'All' was previously selected but now other items are removed, remove 'All'
    if (
      !selectedIds.includes('All') &&
      selectedIds.length === this.sources.length
    ) {
      this.sourceIds = [];
    } else if (
      this.sourceIds.includes('All') &&
      selectedIds.length !== this.sources.length + 1
    ) {
      // alert(
      //   'If All was previously selected but now other items are removed, remove All'
      // );
      selectedIds = selectedIds.filter((id: any) => id !== 'All');
      this.sourceId = selectedIds;
      this.sourceIds = selectedIds;
    } else if (event.value.includes('All')) {
      // alert('All');
      this.sourceIds = this.sources.map((source) => source.leadSourceId);
      this.sourceIds = [
        'All',
        ...this.sources.map((source) => source.leadSourceId),
      ];
      this.selectedSubSourcesIds = this.sources.map(
        (source) => source.leadSourceId
      );
    } else {
      this.sourceId = selectedIds;
      this.sourceIds = selectedIds;
      // Handle deselection logic by comparing currently selected sources with previously selected ones
      const previouslySelectedSources = Object.keys(
        this.sourceSubsourceMap
      ).map(Number);
      const deselectedSourceIds = previouslySelectedSources.filter(
        (sourceId) => !selectedIds.includes(sourceId)
      );
      console.log(deselectedSourceIds);

      // Remove related sub-sources when source is deselected
      deselectedSourceIds.forEach((sourceId) => {
        if (this.sourceSubsourceMap[sourceId]) {
          const subsourceIds = this.sourceSubsourceMap[sourceId];

          // Remove each subSourceId from selectedSubSourcesIds
          subsourceIds.forEach((subSourceId) => {
            this.selectedSubSourcesIds = this.selectedSubSourcesIds?.filter(
              (id) => id !== subSourceId
            );
          });

          // Remove the entry from sourceSubsourceMap
          delete this.sourceSubsourceMap[sourceId];
        }
      });

      console.log(this.selectedSubSourcesIds); // Corrected log statement for selectedSubSourcesIds
      this.subSourceId = this.selectedSubSourcesIds;
      // console.log(
      //   'Updated sourceSubsourceMap after deselection:',
      //   this.sourceSubsourceMap
      // );
      // console.log('Updated selectedSubSourcesIds:', this.selectedSubSourcesIds);

      // For newly selected sources, ensure the sourceSubsourceMap is initialized
      selectedIds.forEach((sourceId: number) => {
        // this.sourceId = sourceId; // Set the current sourceId
        // Initialize array if the sourceId doesn't exist in the map
        if (!this.sourceSubsourceMap[sourceId]) {
          this.sourceSubsourceMap[sourceId] = [];
        }
        // console.log(
        //   `Map for sourceId ${sourceId}:`,
        //   this.sourceSubsourceMap[sourceId]
        // );
      });

      // this.paginator.firstPage();
      console.log(selectedIds);
      this.fetchSubSourcesBySourceIds(selectedIds);
      this.sourceIds = selectedIds;
    }
    // this.getProjectReport();

    //this.getDuplicateLeads();
    this.fetchLeadsDashboardCount();
    this.fetchLeadsCurrentStatusDashboardCount();
    this.getProjectReport();
    this.getPresaleMemberReport();
    this.getSaleMemberReport();
  }

  fetchSubSourcesBySourceIds(selectedIds: number[]): void {
    console.log(selectedIds);
    this.leadSubSource
      .fetchBySourceIds(selectedIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (subSources: any) => {
          this.subSources = subSources;
          this.filteredSubSources = this.subSources;
          this.filteredSubSources = this.sortSubSources(this.subSources);
          this.selectedSubSourcesIds = this.selectedSubSourcesIds?.filter(
            (id) =>
              this.filteredSubSources.some(
                (subSource) => subSource.leadSubSourceId === id
              )
          );
          const stateSubSources = this.subSources.filter((source: any) =>
            this.selectedSubSourcesIds.includes(source.leadSubSourceId)
          );

          const selectedNames = stateSubSources
            .map((source: any) => source.name)
            .join(', ');
          this.subSourceControl.patchValue(selectedNames);
          // this.patchStateSubSourcesBySourceIds(selectedIds);
        },
      });
  }
  fetchSubSourcesBySourceIdsone(selectedIds: number[]): void {
    console.log(selectedIds);
    this.leadSubSource
      .fetchBySourceIds(selectedIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (subSources: any) => {
          this.subSources = subSources;
          this.filteredSubSources = this.subSources;
          this.filteredSubSources = this.sortSubSources(this.subSources);
          this.selectedSubSourcesIds = this.selectedSubSourcesIds?.filter(
            (id) =>
              this.filteredSubSources.some(
                (subSource) => subSource.leadSubSourceId === id
              )
          );
          const stateSubSources = this.subSources.filter((source: any) =>
            this.selectedSubSourcesIds.includes(source.leadSubSourceId)
          );
          console.log(this.selectedSubSourcesIds);
          const selectedNames = stateSubSources
            .map((source: any) => source.name)
            .join(', ');
          this.subSourceControl.patchValue(selectedNames);
          this.fetchLeadsCurrentStatusDashboardCount();
          this.getLeadSourceCount();
          this.getPresaleMemberReport();
          this.getSaleMemberReport();
          this.getProjectReport();
          this.fetchLeadsDashboardCount();
        },
      });
  }
  patchStateSubSourcesBySourceIds(selectedIds: number[]): void {
    // alert('patching');
    this.leadSubSource
      .fetchBySourceIds(selectedIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (subSources: any) => {
          this.subSources = subSources;

          this.filteredSubSources = this.subSources;
          this.filteredSubSources = this.sortSubSources(this.subSources);

          const stateSubSources = this.subSources.filter((source: any) => {
            this.subSourceIds.includes(source.leadSubSourceId);
          });

          const selectedNames = stateSubSources
            .map((source: any) => source.name)
            .join(', ');
          this.subSourceControl.patchValue(selectedNames);
          this.selectedSubSourcesIds = this.subSourceIds;
        },
      });
  }
  sortSubSources(subSources: any[]): any[] {
    return subSources.sort((a, b) => {
      const aSelected = this.selectedSubSourcesIds?.includes(a.leadSubSourceId);
      const bSelected = this.selectedSubSourcesIds?.includes(b.leadSubSourceId);

      // Place selected items first, then unselected items
      return aSelected === bSelected ? 0 : aSelected ? -1 : 1;
    });
  }
  onSelectionSubSourceChange(subSource: any, event: any) {
    const selectedSubSourceId = subSource.leadSubSourceId;
    // Get the sub-source ID
    const sourceId = subSource.sourceId; // Get the corresponding source ID
    if (event.checked) {
      if (this.sourceSubsourceMap[sourceId]) {
        this.sourceSubsourceMap[sourceId]?.push(selectedSubSourceId);
      }
      this.selectedSubSourcesIds?.push(selectedSubSourceId); // Add to selected IDs
    } else {
      // Remove sub-source ID from selected IDs
      this.selectedSubSourcesIds = this.selectedSubSourcesIds?.filter(
        (id) => id !== selectedSubSourceId
      );

      // Remove sub-source ID from sourceSubsourceMap
      if (this.sourceSubsourceMap[sourceId]) {
        this.sourceSubsourceMap[sourceId] = this.sourceSubsourceMap[
          sourceId
        ].filter((id) => id !== selectedSubSourceId);

        // Optional: Remove the key from the map if the array is empty
        if (this.sourceSubsourceMap[sourceId].length === 0) {
          delete this.sourceSubsourceMap[sourceId];
        }
      }
    }

    console.log('Updated sourceSubsourceMap:', this.sourceSubsourceMap);

    // Additional processing
    this.filteredSubSources = this.sortSubSources(this.filteredSubSources);

    console.log('Selected SubSource IDs:', this.selectedSubSourcesIds);
    console.log('Selected Sources:', this.selectedSources);

    //this.paginator.firstPage();
    this.patchStateSubSourcesBySourceIds(this.sourceIds);

    this.subSourceIds = this.selectedSubSourcesIds;
    //this.getDuplicateLeads();
    this.fetchLeadsDashboardCount();
    this.fetchLeadsCurrentStatusDashboardCount();
    this.getProjectReport();
    this.getPresaleMemberReport();
    this.getSaleMemberReport();
  }

  isSelected(subSourceId: number): boolean {
    return this.selectedSubSourcesIds?.includes(subSourceId);
  }
  searchSubSource(event: any): void {
    const searchTerm = event.target.value.toLowerCase();
    if (!searchTerm) {
      this.filteredSubSources = [...this.subSources];
    } else {
      this.filteredSubSources = this.subSources.filter((source: any) =>
        source.name.toLowerCase()?.includes(searchTerm)
      );
    }
    this.filteredSubSources = this.filteredSubSources.sort((a, b) => {
      const aSelected = this.selectedSubSourcesIds?.includes(a.leadSubSourceId);
      const bSelected = this.selectedSubSourcesIds?.includes(b.leadSubSourceId);

      // Place selected items first, then unselected items
      return aSelected === bSelected ? 0 : aSelected ? -1 : 1;
    });
  }

  fetchLeadSources(): void {
    this.leadService.fetchLeadSources().subscribe({
      next: (sources: LeadSource[]) => {
        this.sources = sources;
        this.filteredSources = this.sources;
      },
      error: (error: any) => {
        console.error('Error fetching lead sources:', error);
      },
    });
  }

  getPresaleMemberReport() {
    const apiSourceIds = this.sourceIds?.filter((value) => value !== 'All');
    this.leadService
      .fetchMemberReport(
        this.user.userId,
        this.user.roleId,
        this.digitalPartnerName,
        this.dateRange,
        this.startDate,
        this.endDate,
        this.projectId,
        '',
        '',
        '',
        apiSourceIds,
        this.selectedSubSourcesIds,
        104,
        '',
        this.isExpried
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          console.log(resp);
          this.presaleMemberReport = resp;
        },
        error: (err) => { },
      });
  }

  getSaleMemberReport() {
    const apiSourceIds = this.sourceIds?.filter((value) => value !== 'All');
    this.leadService
      .fetchMemberReport(
        this.user.userId,
        this.user.roleId,
        this.digitalPartnerName,
        this.dateRange,
        this.startDate,
        this.endDate,
        this.projectId,
        '',
        '',
        '',
        apiSourceIds,
        this.selectedSubSourcesIds,
        '',
        105,
        this.isExpried
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.saleMemberReport = resp;
        },
        error: (err) => { },
      });
  }

  fetchCpTotalLeadsCount() {
    this.leadService
      .fetchTotalLeadsCount(this.user.userId, this.user.roleId, 'Yes')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: MapDto[]) => {
          response.forEach((lead) => {
            const leadStatus = lead.status;
            if (leadStatus === 'Q') {
              this.cpTotalQualifiedCount = lead.value;
            } else if (leadStatus === 'LF') {
              this.cpTotalFollowCount = lead.value;
            } else if (leadStatus === 'VP') {
              this.cpTotalVisitProspectCount = lead.value;
            } else if (leadStatus === 'SVD') {
              this.cpTotalSitVisitDoneCount = lead.value;
            } else if (leadStatus === 'NC') {
              this.cpTotalNonContactableCount = lead.value;
            } else if (leadStatus === 'JL') {
              this.cpTotalJunkCount = lead.value;
            } else if (leadStatus === 'RP') {
              this.cpTotalRevisitProposedCount = lead.value;
            } else if (leadStatus === 'LO') {
              this.cpTotalLostCount = lead.value;
            } else if (leadStatus === 'B') {
              this.cpTotalBookedLeadsCount = lead.value;
            } else if (leadStatus === 'SVC') {
              this.cpTotalSitvisitConfirmedCount = lead.value;
            } else if (leadStatus === 'NL') {
              this.cpTotalNewLead = lead.value;
            } else if (leadStatus === 'CB') {
              this.cpTotalCancelledBooking = lead.value;
            } else if (leadStatus === 'EOI') {
              this.cpTotalEoiReceviedCount = lead.value;
            }else if (leadStatus === 'SF') {
              this.cpTotalSalesFollowUp= lead.value;
            }else if (leadStatus === 'SJ') {
              this.cpTotalJunkCount = lead.value;
            }else if (leadStatus === 'SDND') {
              this.cpTotalSalesDND = lead.value;
            }else if (leadStatus === 'SL') {
              this.cpTotalLostCount = lead.value;
            }else if (leadStatus === 'SNC') {
              this.cpTotalSalesNonConctactable = lead.value;
            }
            
          });
          this.updateCpChartOptions(response);
          // this.createChart();
        },
        error: (error) => console.error(error),
      });
  }

  updateCpChartOptions(resp: any) {
    // Define your data points
    const totalQualifiedCount = this.cpTotalQualifiedCount || 0;
    const totalFollowUpCount = this.cpTotalFollowCount || 0;
    const totalVisitProspect = this.cpTotalVisitProspectCount || 0;
    const totalSiteVisitDone = this.closedLeads || 0;
    const totalNonContactableCount = this.cpTotalNonContactableCount || 0;
    const totalJunkCount = this.cpTotalJunkCount;
    const totalRevisitDone = this.cpTotalRevisitDone;
    const totalLostLeads = this.cpTotalLostCount || 0;
    const totalBookedLeadsCount = this.cpTotalBookedLeadsCount || 0;
    const totalSitvisitConfirmedCount = this.cpTotalSitvisitConfirmedCount;
    const totalNewLead = this.cpTotalNewLead;
    const totalCancelledBooking = this.cpTotalCancelledBooking;
    const totalEoiReceviedCount = this.cpTotalEoiReceviedCount;
    const totalSalesLost=this.cpTotalSalesLost;
    const totalSalesDND=this.cpTotalSalesDND;
    const totalSalesJunk=this.cpTotalJunkCount;
    const totalSalesNonConctactable=this.totalNonContactableCount;
    const totalSalesFollowUp=this.totalSalesFollowUp
    // Prepare series data and labels
    const series = [
      totalNewLead,
      totalFollowUpCount,
      totalSitvisitConfirmedCount,
      totalNonContactableCount,
      totalVisitProspect,
      totalSiteVisitDone,
      totalSalesFollowUp,
      totalSalesLost,
      totalSalesNonConctactable,
      totalSalesJunk,
      totalSalesDND,
      totalRevisitDone,
      totalBookedLeadsCount,
      totalCancelledBooking,
      totalQualifiedCount,
      totalLostLeads,
      totalJunkCount,
      totalEoiReceviedCount,
    ];

    // Initialize labels as an empty array
    let labels: string[] = [
      'New Lead',
      'Follow Ups',
      'SiteVisit Confirm',
      'Non Contactable',
      'Visit Prospect',
      'SiteVisit Done',
      'Sales Follow-Up',
      'Sales Lost',
      'Sales Non-Contabtable',
      'Sales Junk',
      'Sales DND',
      'Revisit Done',
      'Booked',
      'Cancelled Booking',
      'Qualified',
      'Lost',
      'Junk',
      'EOI Recevied',
    ];

    // Use `map` to transform `resp` and populate `labels`

    // resp.filter((res: any) => res.status !== "Total").map((res: any) => res.status);

    // resp.map((item:any) => item.sourceName);
    // Set chart options
    this.cpChartOptions = {
      series: series,
      chart: {
        width: 400,
        type: 'pie',
      },
      labels: labels,
      colors: [
        '#C1AEFC',
        '#2AADB2',
        '#F6C275',
        '#B48E75',
        '#30BACC',
        '#A5AF81',
        '#44769c',
        '#a83e69',
        '#f5b0c3',
        '#8c6f9e',
        '#b8b291',
        '#7B338F',
        '#3FCA79',
        '#2977B2',
        '#338F5E',
        '#6B8A7A',
        '#CA4F98',
        '#D3DE5F',
      ],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };

    // Show or hide the chart based on the presence of data
    this.isShow = series.some((value) => value > 0);
  }

  togglePerOne(): void {
    this.sourceIds = this.formData.value.sourceIds;
    if (this.allSelected?.selected) {
      // this.filteredSubSources = [];
      this.allSelected.deselect();
      this.sourceIds = this.formData.value.sourceIds;
      // this.formData.controls['sourceIds'].patchValue([
      //   ...this.sources.map((item) => item.leadSourceId),
      //   0,
      // ]);

      // return;
      this.sourceIds = this.formData.value.sourceIds;
      // alert(this.sourceIds);
    }
    if (
      this.formData.controls['sourceIds'].value.length == this.sources.length
    ) {
      //  alert('SECOND IFF');
      this.allSelected?.select();
      this.selectedSubSourcesIds = [];
    }

    // this.updateSubSourceIds();
    this.fetchSubSourcesBySourceIdsone(this.sourceIds);

    // this.fetchLeadsCurrentStatusDashboardCount();
  }

  toggleAllSelection() {
    if (this.allSelected?.selected) {
      // alert('all selected');
      this.selectedSubSourcesIds = [];
      this.formData.controls['sourceIds'].patchValue([
        ...this.sources.map((item) => item.leadSourceId),
        0,
      ]);
      // this.sourceIds = [];
      this.subSourceIds = [];
    } else {
      // alert('elseeeeeeeeeeee');
      this.formData.controls['sourceIds'].patchValue([]);
      this.sourceIds = this.formData.value.sourceIds;
    }
    this.sourceIds = this.formData.value.sourceIds;

    // this.updateSubSourceIds();
    // alert('length ' + this.subSourceIds);
    this.fetchSubSourcesBySourceIdsone(this.sourceIds);
  }

  updateSubSourceIds() {
    const selectedSourceIdsSet = new Set(this.sourceIds);

    this.subSourceIds = this.subSourceIds.filter((subSourceId) =>
      this.subSources.some(
        (sub: ILeadSubSourceDto) =>
          sub.leadSubSourceId === subSourceId &&
          selectedSourceIdsSet.has(sub.leadSourceId)
      )
    );
  }

  resetForm(): void {
    this.formData.reset();
    this.sourceIds = [];
    this.selectedSources = [];
    this.allSelected?.deselect();
    this.digitalPartnerName = '';
    this.dateRange = 0;
    this.selectedDay = 0;
    this.startDate = null;
    this.endDate = null;
    const todayOption = this.days.find((d) => d.commonRefValue === 'Today');
    console.log(todayOption); // should not be undefined
    this.selectedDay = todayOption;
    if (todayOption) {
      this.showDateRangePicker = false;
    } else {
      console.error('Today option is undefined');
    }
    this.projectId = 0;
    this.fetchSubSourcesBySourceIdsone(this.sourceIds);
  }
  resetAutoInput(auto: MatAutocomplete): void {
    auto.options.forEach((option) => option.deselect());
    this.project.reset();
    this.project.setValue(null);
    this.resetForm();
  }

  displayProjectNames() {
    if (this.selectedprojectIds.length > 0) {
      this.projectService
        .getProjectsByIds('', this.user.organizationId, this.selectedprojectIds, 'Y')
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (projects: any) => {
            console.log(projects)
            this.projects = this.sortProject(this.projects, this.selectedprojectIds)
            const selectedNames = projects
              .map((project: any) => project.projectName)
              .join(', ');
            console.log(selectedNames);
            this.project.patchValue(selectedNames);
          },
        });
    }
    else {
      this.project.patchValue('');
    }
  }


  isProjectAllSelected(): boolean {
    const allProjectIds = this.projects.map(p => p.projectId);
    return Array.isArray(this.selectedprojectIds) &&
      allProjectIds.length > 0 &&
      allProjectIds.every(id => this.selectedprojectIds.includes(id));
  }

  onProjectSelect(project: any, event: any) {
    //this.allProjectChecked=false;
    this.project.patchValue('')
    console.log(event);

    const selectedProject = project.projectId;
    console.log('selected project id' + selectedProject);

    // Get the sub-source ID
    console.log(this.selectedprojectIds)
    if (event.checked) {
      if (!this.selectedprojectIds) {
        this.selectedprojectIds = [];
      }
      this.selectedprojectIds?.push(selectedProject);
      this.displayProjectNames()
      // alert(this.selectedSubSourcesIds); // Add to selected IDs
    } else {
      // Remove sub-source ID from selected IDs
      this.selectedprojectIds = this.selectedprojectIds?.filter(
        (id: any) => id !== selectedProject
      );
      console.log(this.selectedprojectIds)
      if (this.selectedprojectIds?.length > 0) {
        this.displayProjectNames()
      }
      else if (this.selectedprojectIds?.length == 0) {
        this.project.patchValue('');
      }
    }
    //this.projectId = this.selectedprojectIds
    //console.log(this.projectId)
  }
  SelectedProject(projectId?: number): boolean {
    return this.selectedprojectIds?.includes(projectId);
  }

  fetchProjectsByIds(selectedIds: any) {
    this.projectName = this.projectName || '';
    this.projectService
      .getProjectsByIds(this.projectName, this.user.organizationId, selectedIds, 'Y')
      .subscribe({
        next: (projects) => {
          this.projects = projects.records;
        },
        error: (error) => {
          console.error('Error fetching projects:', error);
        },
      });
  }

  patchStateProjectIds(selectedIds: number[]): void {
    this.project.patchValue('')
    this.projectService
      .getProjectsByIds('', this.user.organizationId, selectedIds, 'Y')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (projects: any) => {
          console.log(projects)
          this.projects = this.sortProject(this.projects, selectedIds)
          const selectedNames = projects
            .map((project: any) => project.projectName)
            .join(', ');
          console.log(selectedNames);
          this.project.patchValue(selectedNames);
          this.selectedprojectIds = selectedIds;
          console.log(this.selectedprojectIds)
          this.projectId = this.selectedprojectIds
          console.log(this.projectId)
          //  this.checkAllProjectSeleted(this.selectedprojectIds)
          //this.isSelectedProject();
          // this.selectedSubSourcesIds = this.selectedSubSourcesIds;
        },
      });

  }

  sortProject(projects: any[], selectedprojectIds: any): any[] {
    return projects.sort((a, b) => {
      const aSelected = selectedprojectIds.includes(a.projectId);
      const bSelected = selectedprojectIds.includes(b.projectId);
      // Place selected items first, then unselected items
      return aSelected === bSelected ? 0 : aSelected ? -1 : 1;
    });
  }
  onAllSelectProject() {

    console.log(this.allProjectSelected.checked)
    // this.allProjectChecked=this.allProjectSelected.checked
    if (this.allProjectSelected.checked) {
      this.selectedprojectIds = this.projects.map((p: any) => p.projectId, 0)
    } else {
      this.selectedprojectIds = []
    }
    console.log(this.projectId)
    //this.projectId = this.selectedprojectIds
    this.displayProjectNames();
  }
  isSelectedProject(projectId?: number): boolean {
    return this.selectedprojectIds?.includes(projectId);
  }

  onProjectSelectButtonClick() {
    this.projectId = this.selectedprojectIds
    this.getProjectReport();
    this.fetchLeadsDashboardCount();
    this.fetchLeadsCurrentStatusDashboardCount();
    this.getLeadSourceCount();
    this.getPresaleMemberReport();
    this.getSaleMemberReport();
  }

   onToggle(event: any) {
    const currentToggleState = event.checked;
    if(currentToggleState){
     this.isExpried=''
    }
    else{
      this.isExpried='N'
    }
    console.log(this.isExpried)
     this.getProjectReport();
    this.fetchLeadsDashboardCount();
    this.fetchLeadsCurrentStatusDashboardCount();
    this.getLeadSourceCount();
    this.getPresaleMemberReport();
    this.getSaleMemberReport();
   }
   
}
