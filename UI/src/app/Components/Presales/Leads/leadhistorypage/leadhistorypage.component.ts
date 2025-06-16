import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { leadPageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { LeadService } from 'src/app/Services/Presales/Leads/lead.service';

@Component({
  selector: 'app-leadhistorypage',
  templateUrl: './leadhistorypage.component.html',
  styleUrls: ['./leadhistorypage.component.css'],
})
export class LeadhistorypageComponent implements OnInit, OnDestroy {
  leadId: any;
  leadHistories: any;
  displayedColumns: string[] = [
    'leadId',
    'recordedDate',
    'sourceName',
    'subSourceName',
    'leadStatus',
    'note',
    'presaleMemberName',
    'saleMemberName',
    'createdBy',
  ];
  pageSizeOptions = leadPageSizeOptions;
  destroy$ = new Subject<void>();
  isFromManualLeadAssign: boolean = false;
  isSaleTeam = false;
  stateData: any;
  navigationData: any;
  phoneNumber: string = '';
  pageSizeFromLead: number = 10;
  pageIndexFromLead: number = 0;
  custName: string = '';
  opportunityId: string = '';
  selectedSubSourcesIds: [] = [];
  //walk-in page data
  isFromWalkIn: boolean = false;
  dateRange: any;
  totalItems: number = 0;
  pageSize: number = 25;
  pageIndex: number = 0;
  statusId: number = 0;
  sourceIds: [] = [];
  isMenuLeads: boolean = false;
  customStartDate: any;
  customEndDate: any;
  assignedTo: number = 0;
  projectId: number = 0;
  isAllLeads: boolean = false;
  currentStatusDashboard: string = '';
  dashboard: string = '';
  digitalLeads: any = false;
  campaginName: any = '';
  presalesUserIds: number[] = [];
  salesUserIds: number[] = [];
  selectedUsers: any;
  leadName: string = '';
  isUniqueLeadsMenu: any;
  isCTODashboard: any;
  followUpType: any;
  leadType: any;
  ngOnInit() {
    this.initializeState();
    this.leadId = history.state.leadId;
    this.isFromManualLeadAssign = history.state.isFromManualLeadAssign;
    const state = history.state;
    this.stateData = history.state;
    this.isUniqueLeadsMenu = history.state.isUniqueLeadsMenu
      ? history.state.isUniqueLeadsMenu
      : false;
    // this.pageSizeFromLead = history.state.pageSize;
    // this.pageIndexFromLead = history.state.pageIndex;
    this.statusId = history.state.statusId;
    if (this.stateData.isFromWalkIn) {
      this.isFromWalkIn = true;
    }
    this.digitalLeads = history.state.digitalLeads
      ? history.state.digitalLeads
      : '';
    this.phoneNumber = state.phoneNumber;
    console.log('phone number..' + this.phoneNumber);
    this.navigationData = history.state;
    this.getLeadHistories();
    this.isSaleTeam = history.state.team;
  }
   isExpried='N'
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  constructor(
    private leadService: LeadService,
    private router: Router,
    private loaderService: LoaderService
  ) {}

  initializeState(): void {
    const historyState = history.state;
    console.log(history.state);

    if (historyState.pageSize != undefined) {
      this.pageSizeFromLead = historyState.pageSize;
    }
    if (historyState.pageIndex != undefined) {
      this.pageIndexFromLead = historyState.pageIndex;
    }
    this.sourceIds = history.state.sourceIds;
    this.custName = history.state.custName;
    this.opportunityId = history.state.opportunityId;
    this.selectedSubSourcesIds = history.state.subSourceIds;
    this.dateRange = history.state.dateRange;
    this.isMenuLeads = history.state.isMenuLeads;
    this.customStartDate = history.state.customStartDate;
    this.customEndDate = history.state.customEndDate;
    this.assignedTo = history.state.assignedTo;
    this.projectId = history.state.projectId;
    this.campaginName = history.state.campaginName;
    if (history.state.isAllLeads !== undefined) {
      this.isAllLeads = history.state.isAllLeads;
    }
    if (history.state.currentStatusDashboard != undefined) {
      this.currentStatusDashboard = history.state.currentStatusDashboard;
    }
    if (history.state.dashboard != undefined) {
      this.dashboard = history.state.dashboard;
    }
    this.presalesUserIds = history.state.presalesUserIds ?? [];
    this.salesUserIds = history.state.salesUserIds ?? [];
    this.selectedUsers = history.state.selectedUsers ?? [];
    this.phoneNumber = history.state.phoneNumber;
    this.statusId = history.state.statusId;
    this.isCTODashboard = history.state.isCTODashboard;
    this.followUpType = history.state.followUpType;
    this.leadType = history.state.leadType || '';
    this.isExpried=history.state.expried!=undefined?history.state.expried:this.isExpried
  }

  getLeadHistories() {
    this.showLoading();
    this.leadService
      .getLeadHistories(this.leadId, this.pageIndex, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.leadHistories = response.records;
          this.leadName = this.leadHistories[0].leadName;
          this.opportunityId = this.leadHistories[0].opportunityId;
          this.totalItems = response.totalRecords;
          this.hideLoading();
        },
        error: (error: any) => {
          console.error(error);
          this.hideLoading();
        },
      });
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getLeadHistories();
  }

  backToLeads(): void {
    const state = {
      pageSize: this.pageSizeFromLead,
      pageIndex: this.pageIndexFromLead,
      statusIds: this.statusId,
      sourceIds: this.sourceIds,
      selectedSubSourcesIds: this.selectedSubSourcesIds,
      phoneNumber: this.phoneNumber,
      custName: this.custName,
      opportunityId: history.state.opportunityId,
      subSourceIds: this.selectedSubSourcesIds,
      dateRange: this.dateRange,
      isMenuLeads: this.isMenuLeads,
      customStartDate: this.customStartDate,
      customEndDate: this.customEndDate,
      assignedTo: this.assignedTo,
      projectId: this.projectId,
      currentStatusDashboard: this.currentStatusDashboard,
      dashboard: this.dashboard,
      campaginName: this.campaginName,
      presalesUserIds: this.presalesUserIds,
      salesUserIds: this.salesUserIds,
      selectedUsers: this.selectedUsers,
      statusId: this.statusId,
      isCTODashboard: this.isCTODashboard,
      followUpType: this.followUpType,
      leadType: this.leadType,
      expried:this.isExpried
    };

    if (this.isFromWalkIn) {
      this.router.navigate(['/layout/walk_in/leads'], { state });
    } else if (this.isFromManualLeadAssign) {
      this.router.navigate(['/layout/presales/lead/assign/P']);
    } else if (this.isAllLeads === true) {
      this.router.navigate(['/layout/sales/all/leads'], { state });
    } else if (this.digitalLeads) {
      this.router.navigate(['/layout/presales/digitalleads'], { state });
    } else if (this.isUniqueLeadsMenu) {
      const route = this.isSaleTeam
        ? '/layout/sales/unique/leads/ST'
        : '/layout/presales/unique/leads/PST';
      this.router.navigate([route], {
        state,
      });
    } else {
      const route = this.isSaleTeam
        ? '/layout/sales/leads/ST'
        : '/layout/presales/leads/PST';
      this.router.navigate([route], {
        state,
      });
    }
  }

  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }
}
