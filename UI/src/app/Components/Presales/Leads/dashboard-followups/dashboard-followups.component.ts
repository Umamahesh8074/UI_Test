import { Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LeadFollowupDto } from 'src/app/Models/Presales/leadFollowup';
import { User } from 'src/app/Models/User/User';
import { LeadFollowupService } from 'src/app/Services/Presales/Leads/lead-followup.service';

@Component({
  selector: 'app-dashboard-followups',
  templateUrl: './dashboard-followups.component.html',
  styleUrls: ['./dashboard-followups.component.css'],
})
export class DashboardFollowupsComponent {
  // Pagination
  totalItems: number = 0;
  pageSize: number = 20;
  pageIndex: number = 0;

  userId: number = 0;
  followups: LeadFollowupDto[] = [];
  leadName: string = '';
  leadId: number = 0;
  isSalesTeamFollowups: boolean = false;
  dateRange: any;
  statusIds: any;
  isLeadFollowups: boolean = false;
  displayedColumns: string[] = [
    'rowNumber',
    'OpportunityId',
    'leadName',
    'followupDate',
    'type',
    'remarks',
    'presalesMember',
    'salesMember',
    'status',
    // 'actions',
  ];
  user: User = new User();
  customStartDate: any;
  customEndDate: any;
  cpUserId: number = 0;
  subsourceId: number = 0;
  isCpUserId: boolean = false;
  private destroy$ = new Subject<void>();
  isSalesUser: boolean = false;
  isDashboardFollowups: boolean = true;
  projectId: number = 0;
  followUpIds: any;
  isFromDashBoard: boolean = false;
  isChannelPartner: boolean = true;
  isMemberDashBoard: boolean = false;
  isManagerDashBoard: boolean = false;
  isSalesHeadDashboard: boolean = false;
  isDigitalMarketingDashboard: boolean = false;
  isExpried:any='N'
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(
    private followupService: LeadFollowupService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeState();
    const user = this.getUserFromLocalStorage();
    if (this.followUpIds) {
      this.fetchCalendarFollowups('');
    } else {
      if (user) {
        this.user = user;
        // this.userId = this.user.userId || 0;
        this.isSalesUser = this.user.roleName
          .toLocaleLowerCase()
          .includes('presale')
          ? false
          : true;
        this.fetchFollowUpsByLoggedInUser();
        if (
          this.user.roleName.toLocaleLowerCase().includes('channel') ||
          this.user.roleName.toLocaleLowerCase().includes('cp')
        ) {
          console.log('entered......');
          this.isChannelPartner = false;
          console.log(this.isChannelPartner);
        } else {
          this.isChannelPartner = true;
          this.displayedColumns.push('actions');
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initializeState(): void {
    const historyState = history.state;
    this.dateRange = historyState.dateRange;
    this.cpUserId = history.state.cpUserId;
    this.isFromDashBoard = history.state.isFromDashBoard;
    console.log(historyState);
    console.log(this.isFromDashBoard);

    this.followUpIds = historyState.followupIds;
    console.log(this.cpUserId);
    if (this.cpUserId != undefined && this.cpUserId > 0) {
      console.log('cpUserId', this.cpUserId);
      const user = this.getUserFromLocalStorage();
      if (user) {
        console.log(user.userId);
        this.userId = user.userId;
      }
      this.subsourceId = this.cpUserId;
      console.log(this.userId);
      this.isCpUserId = true;
    } else {
      console.log('userid', this.user.userId);
      const user = this.getUserFromLocalStorage();
      if (user) {
        console.log(user.userId);
        this.userId = user.userId;
      }
      this.subsourceId = this.cpUserId;
      console.log(this.userId);
      // this.isCpUserId = true;
    }

    this.customStartDate = historyState.customStartDate;
    this.customEndDate = historyState.customEndDate;
    this.statusIds = historyState.statusIds;
    this.projectId = historyState.projectId;
    this.leadId = historyState.leadId || '';
    this.isLeadFollowups = this.leadId > 0 ? true : false;
    this.isSalesTeamFollowups = historyState.isSalesTeamFollowUs || false;
    this.isMemberDashBoard = historyState.isMemberDashBoard === true;
    this.isManagerDashBoard = historyState.isManagerDashBoard === true;
    this.isSalesHeadDashboard = historyState.isSalesHeadDashboard === true;
    this.isDigitalMarketingDashboard =
    historyState.isDigitalMarketingDashboard === true;
     this.isExpried=history.state.expried
  }

  getUserFromLocalStorage(): User | null {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    if (this.followUpIds) {
      this.fetchCalendarFollowups(this.leadName);
    } else {
      this.fetchFollowUpsByLoggedInUser();
    }
  }

  onSearch(searchText: string): void {
    this.leadName = searchText;
    this.paginator.firstPage();
    if (this.followUpIds) {
      this.fetchCalendarFollowups(searchText);
    } else {
      this.fetchFollowUpsByLoggedInUser();
    }
  }

  fetchFollowUpsByLoggedInUser(): void {
    if (this.user.roleName.toLocaleLowerCase() === 'sales head') {
      this.fetchFollowups(this.leadName);
    } else {
      this.fetchcpFollowups(this.leadName);
    }
  }
  fetchFollowups(searchText: string): void {
    console.log(this.leadId);
    console.log(this.subsourceId);
    this.followupService
      .fetchFollowUpsBasedOnLoggedInUser(
        searchText,
        this.pageIndex,
        this.pageSize,
        this.userId,
        this.user.roleId,
        this.leadId,
        this.isSalesTeamFollowups,
        this.dateRange,
        this.statusIds,
        this.isLeadFollowups,
        this.customStartDate,
        this.customEndDate,
        this.user.roleName,
        this.projectId,
        this.isFromDashBoard
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.totalItems = response.totalRecords;
          this.followups = response.records;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
  fetchcpFollowups(leadName: string) {
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;
    console.log('fetchcpFollowups', this.userId);
    console.log(this.statusIds, this.leadId);
    this.followupService
      .fetchCpFollowups(
        leadName,
        this.pageIndex,
        this.pageSize,
        this.userId,
        user?.roleId,
        this.leadId,
        this.dateRange,
        this.statusIds,
        this.customStartDate,
        this.customEndDate,
        this.projectId,
        this.subsourceId,
        this.isFromDashBoard
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.totalItems = response.totalRecords;
          this.followups = response.records;
          console.log(this.followups);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  updateFollowup(followupId: number, leadId: number): void {
    this.leadId = leadId;
    this.fetchLeadFollowUp(followupId);
  }

  gotToAddFollowup(leadId: number): void {
    console.log('dash board folloowups*****************');
    this.leadId = leadId;
    const route = this.isSalesUser
      ? 'layout/sales/followups/save/ST'
      : 'layout/presales/followups/save/PST';
    this.router.navigate([route], {
      state: {
        leadId: this.leadId,
        isDashboardFollowups: this.isDashboardFollowups,
        dateRange: this.dateRange,
        isMenuLeads: false,
        customStartDate: this.customStartDate,
        customEndDate: this.customEndDate,
        statusIds: this.statusIds,
        gotToAddFollowup: false,
        isFromDashBoard: this.isFromDashBoard,
        disableActionButton: this.isChannelPartner,
      },
    });
  }

  fetchLeadFollowUp(followupId: number): void {
    this.followupService
      .fetchFollowup(followupId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const route = this.isSalesUser
            ? 'layout/sales/followups/save/ST'
            : 'layout/presales/followups/save/PST';
          this.router.navigate([route], {
            state: {
              followup: response,
              leadId: this.leadId,
              isDashboardFollowups: this.isDashboardFollowups,
              isFromDashBoard: true,
              disableActionButton: this.isChannelPartner,
              followUpIds: this.followUpIds,
              isMemberDashBoard: this.isMemberDashBoard,
              isSalesHeadDashboard: this.isSalesHeadDashboard,
              isManagerDashBoard: this.isManagerDashBoard,
              isDigitalMarketingDashboard: this.isDigitalMarketingDashboard,
            },
          });
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  backToLeads(): void {
    const stateData = {
      dateRange: this.dateRange,
      isMenuLeads: false,
      customStartDate: this.customStartDate,
      customEndDate: this.customEndDate,
      cpUserId: this.cpUserId,
      isMemberDashBoard: this.isMemberDashBoard,
      expried:this.isExpried
    };

    if (this.isMemberDashBoard) {
      this.router.navigate(['layout/memberdashboard'], {
        state: stateData,
      });
    } else if (this.isManagerDashBoard) {
      this.router.navigate(['layout/mangerdashboard'], {
        state: stateData,
      });
    } else if (this.isSalesHeadDashboard) {
      this.router.navigate(['layout/salesheaddashboard'], {
        state: stateData,
      });
    } else if (this.isDigitalMarketingDashboard) {
      this.router.navigate(['layout/digitalmarketing'], {
        state: stateData,
      });
    } else if (!this.isCpUserId) {
      const route = this.isSalesTeamFollowups
        ? '/layout/sales/leads/ST'
        : '/layout/presales/leads/PST';
      this.router.navigate([route]);
    } else {
      this.router.navigate(['layout/cpdashboard'], {
        state: stateData,
      });
    }
  }
  fetchCalendarFollowups(searchText: string): void {
    this.followupService
      .fetchFollowupsData(
        searchText,
        this.pageIndex,
        this.pageSize,
        this.followUpIds
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.totalItems = response.totalRecords;
          this.followups = response.records;
          console.log(this.followups);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
  onLeadRowClick(leadId: number, followupId?: number) {
    console.log(leadId);
    if (followupId) {
      this.fetchLeadFollowUp(followupId);
    }
    this.gotToAddFollowup(leadId);
  }
  isNotLastColumn(event: MouseEvent): boolean {
    const clickedElement = event.target as HTMLElement;
    const parentRow = clickedElement.parentElement; // it's the parent element
    if (parentRow && parentRow.children) {
      const lastCell = parentRow.children[parentRow.children.length - 1];
      return clickedElement !== lastCell;
    }
    return true; // Default to true if structure is unexpected
  }
}
