import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LeadFollowupDto } from 'src/app/Models/Presales/leadFollowup';
import { User } from 'src/app/Models/User/User';
import { LeadFollowupService } from 'src/app/Services/Presales/Leads/lead-followup.service';

@Component({
  selector: 'app-display-followups',
  templateUrl: './display-followups.component.html',
  styleUrls: ['./display-followups.component.css'],
})
export class DisplayFollowupsComponent implements OnInit, OnDestroy {
  // Pagination
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  startDate: any;
  endDate: any;
  isChannelPartner: boolean = true;
  userId: number = 0;
  followups: any[] = [];
  leadName: string = '';
  leadId: number = 0;
  isSalesTeamFollowups: boolean = false;
  dateRange: any = 999;
  statusId: any;
  isLeadFollowups: boolean = false;
  isFromDashBoard: boolean = false;
  displayedColumns: string[] = [
    'rowNumber',
    'opportunityId',
    'leadName',
    'followupDate',
    'type',
    'remarks',
    'status',
    'presalesMember',
    'salesMember',
    'actions',
  ];
  user: User = new User();
  showAssignToSaleDate: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private destroy$ = new Subject<void>();
  leadPageSize: number = 25;
  leadPageIndex: number = 0;
  sourceIds: [] = [];
  isMenuLeads: boolean = false;
  custName: string = '';
  opportunityId: string = '';
  selectedSubSourcesIds: [] = [];
  phoneNumber: string = '';
  leadFilterCustomStartDate: any;
  leadFilterCustomEndDate: any;
  projectId: number = 0;
  assignedTo: number = 0;
  isAllLeads: boolean = false;
  constructor(
    private followupService: LeadFollowupService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  followUpIds: any;
  ngOnInit(): void {
    this.initializeState();
    const user = this.getUserFromLocalStorage();
    this.isFromDashBoard = history.state.isFromDashBoard;
    console.log('isdashboard..........' + this.isFromDashBoard);

    if (user) {
      this.user = user;
      this.userId = this.user.userId || 0;
      if (this.followUpIds) {
        console.log(this.followUpIds);
        this.fetchCalendarFollowups('');
      } else {
        if (
          this.user.roleName.toLowerCase().includes('channel') ||
          this.user.roleName.toLowerCase().includes('cp')
        ) {
          this.fetchCpFollowups();
        } else {
          this.fetchFollowUpsByLoggedInUser();
        }
      }
    }
    if (
      this.user.roleName.toLocaleLowerCase().includes('channel') ||
      this.user.roleName.toLocaleLowerCase().includes('cp')
    ) {
      console.log('entered......');
      this.isChannelPartner = false;
      console.log(this.isChannelPartner);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initializeState(): void {
    const historyState = history.state;
    console.log(historyState);
    console.log(historyState.statusId);
    // this.dateRange = historyState.dateRange;
    this.startDate = historyState.customStartDate;
    this.endDate = historyState.customEndDate;
    console.log('start and end date ', this.startDate, this.endDate);
    this.statusId = historyState.statusId;
    this.leadId = historyState.leadId || '';
    this.followUpIds = historyState.followupIds || '';
    console.log(this.leadId);
    this.isLeadFollowups = this.leadId > 0 ? true : false;
    this.isSalesTeamFollowups = historyState.isSalesTeamFollowUs || false;

    if (historyState.leadPageSize != undefined) {
      this.leadPageSize = historyState.leadPageSize;
    }
    if (historyState.leadPageIndex != undefined) {
      this.leadPageIndex = historyState.leadPageIndex;
    }
    //Added By Thara
    this.statusId = history.state.statusId;
    this.sourceIds = history.state.sourceIds;
    this.custName = history.state.custName;
    this.opportunityId = history.state.opportunityId;
    this.selectedSubSourcesIds = history.state.selectedSubSourcesIds;
    this.dateRange = history.state.dateRange;
    this.isMenuLeads = history.state.isMenuLeads;
    this.phoneNumber = history.state.phoneNumber;
    this.leadFilterCustomStartDate = history.state.customStartDate;
    this.leadFilterCustomEndDate = history.state.customEndDate;
    this.projectId = history.state.projectId;
    this.assignedTo = history.state.assignedTo;
    this.isAllLeads = history.state.isAllLeads;
  }

  getUserFromLocalStorage(): User | null {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    console.log(this.followUpIds);
    if (this.followUpIds) {
      this.fetchCalendarFollowups('');
    } else {
      this.fetchFollowUpsByLoggedInUser();
    }
  }

  onSearch(searchText: string): void {
    this.paginator.firstPage();
    this.leadName = searchText;
    this.fetchFollowUpsByLoggedInUser();
  }

  fetchFollowUpsByLoggedInUser(): void {
    // this.paginator.firstPage();
    this.fetchFollowups(this.leadName);
  }

  //added
  fetchCpFollowups() {
    this.fetchcpFollowups(this.leadName);
  }

  fetchcpFollowups(leadName: string) {
    console.log(this.statusId);
    this.followupService
      .fetchCpFollowups(
        leadName,
        this.pageIndex,
        this.pageSize,
        this.user.userId,
        this.user.roleId,
        this.leadId,
        this.dateRange,
        this.statusId,
        this.startDate,
        this.endDate,
        0,
        0,
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

  //added

  fetchFollowups(searchText: string): void {
    this.followupService
      .fetchFollowUpsBasedOnLoggedInUser(
        searchText,
        this.pageIndex,
        this.pageSize,
        this.user.userId,
        this.user.roleId,
        this.leadId,
        this.isSalesTeamFollowups,
        this.dateRange,
        this.statusId,
        this.isLeadFollowups,
        this.startDate,
        this.endDate,
        this.user.roleName,
        0,
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

  addFollowup(): void {
    const route = this.isSalesTeamFollowups
      ? '/layout/sales/followups/save/ST'
      : '/layout/presales/followups/save/PST';
    this.router.navigate([route], {
      state: {
        leadId: this.leadId,
        isSalesTeamFollowUs: this.isSalesTeamFollowups,
        followUps: this.followups,
        isFromDashBoard: false,
        disableActionButton: this.isChannelPartner,
      },
    });
  }

  updateFollowup(followupId: number): void {
    this.fetchLeadFollowUp(followupId);
  }

  fetchLeadFollowUp(followupId: number): void {
    this.followupService
      .fetchFollowup(followupId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log(response);
          const route = this.isSalesTeamFollowups
            ? 'layout/sales/followups/save/ST'
            : 'layout/presales/followups/save/PST';
          this.router.navigate([route], {
            state: { followup: response, leadId: this.leadId },
          });
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  backToLeads(): void {
    let route = this.isSalesTeamFollowups
      ? '/layout/sales/leads/ST'
      : '/layout/presales/leads/PST';

    if (this.isAllLeads === true) {
      route = '/layout/sales/all/leads';
    }
    this.router.navigate([route], {
      state: {
        pageSize: this.leadPageSize,
        pageIndex: this.leadPageIndex,
        statusId: this.statusId,
        sourceIds: this.sourceIds,
        phoneNumber: this.phoneNumber,
        custName: this.custName,
        opportunityId: this.opportunityId,
        selectedSubSourcesIds: this.selectedSubSourcesIds,
        isMenuLeads: this.isMenuLeads,
        dateRange: this.dateRange,
        customStartDate: this.leadFilterCustomStartDate,
        customEndDate: this.leadFilterCustomEndDate,
        projectId: this.projectId,
        assignedTo: this.assignedTo,
      },
    });
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

  isFollowupEditVisible(followup: any): boolean {
    const isAssignedToSales = followup.assignedToSales > 0;
    const isPresalesMember =
      this.user.roleName.toLowerCase() === 'presales member';
    const isSalesMember = this.user.roleName.toLowerCase() === 'sales member';
    return (!isAssignedToSales && isPresalesMember) || isSalesMember;
  }
}
