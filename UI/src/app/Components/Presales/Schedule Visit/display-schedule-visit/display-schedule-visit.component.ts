import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import {
  IScheduleVisit,
  ScheduleVisit,
  ScheduleVisitDto,
} from 'src/app/Models/Presales/scheduleVisit';
import { ScheduleVisitService } from 'src/app/Services/Presales/ScheduleVisit/schedule-visit.service';

@Component({
  selector: 'app-display-schedule-visit',
  templateUrl: './display-schedule-visit.component.html',
  styleUrls: ['./display-schedule-visit.component.css'],
})
export class DisplayScheduleVisitComponent implements OnInit {
  destroy$ = new Subject<void>();

  //pagination
  page: number = 0;
  size: number = 10;
  totalItems: number = 0;
  pageSizeOptions = pageSizeOptions;
  leadId: number = 0;

  scheduleVisits: ScheduleVisitDto[] = [];
  scheduleVisit: IScheduleVisit = new ScheduleVisit();
  isSaleTeam = false;
  displayedColumns: string[] = [
    'leadName',
    'opportunityId',
    'dateTime',
    'address',
    'comments',
    'status',
    'actions',
  ];
  pageSizeFromScheduleVisit: number = 10;
  pageIndexFromScheduleVisit: number = 0;
  sourceIds: [] = [];
  isMenuLeads: boolean = false;
  custName: string = '';
  opportunityId: string = '';
  selectedSubSourcesIds: [] = [];
  phoneNumber: string = '';
  dateRange: any = 999;
  statusId: any;
  leadFilterCustomStartDate: any;
  leadFilterCustomEndDate: any;

  constructor(
    private scheduleVisitService: ScheduleVisitService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeFilters();
    this.getAllScheduleVisits();
    this.leadId = history.state.leadId;
    console.log(history.state.leadId);
    this.isSaleTeam = history.state.team;
    const historyState = history.state;
    if (historyState.pageSizeFromScheduleVisit != undefined) {
      this.pageSizeFromScheduleVisit = historyState.pageSizeFromScheduleVisit;
    }
    if (historyState.pageIndexFromScheduleVisit != undefined) {
      this.pageIndexFromScheduleVisit = historyState.pageIndexFromScheduleVisit;
    }
  }
  initializeFilters() {
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
  }
  //get all schedule visits
  getAllScheduleVisits() {
    console.log(this.leadId);
    this.scheduleVisitService
      .getAllScheduleVisits(this.page, this.size, history.state.leadId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log(response);
          this.scheduleVisits = response.records;
        },
        error: (error: any) => {
          console.log(error);
        },
      });
  }

  addScheduleVisit() {
    this.router.navigate(['layout/presales/schedule/visit'], {
      state: { leadId: this.leadId },
    });
  }

  onPageChange(event: any) {
    console.log(event);
  }

  //updating schedule visit
  updateScheduleVisit(scheduleVisitId: any) {
    this.fetchScheduleVisit(scheduleVisitId);
  }

  //getting schedule visit based on id for update schedule visit
  fetchScheduleVisit(scheduleVisitId: number) {
    console.log(scheduleVisitId);
    console.log(this.leadId);
    this.scheduleVisitService
      .getScheduleVisit(scheduleVisitId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.scheduleVisit = response;
          console.log(this.scheduleVisit);
          console.log(response);
          this.router.navigate(['layout/sales/schedule/visit'], {
            state: { scheduleVisit: this.scheduleVisit, leadId: this.leadId },
          });
        },
      });
  }
  onSearch(data: any) {
    console.log(data);
  }

  goToLeads() {
    const route = this.isSaleTeam
      ? '/layout/sales/leads/ST'
      : '/layout/presales/leads/PST';
    this.router.navigate([route], {
      state: {
        pageSize: this.pageSizeFromScheduleVisit,
        pageIndex: this.pageIndexFromScheduleVisit,
        statusId: this.statusId,
        sourceIds: this.sourceIds,
        phoneNumber: this.phoneNumber,
        custName: this.custName,
        opportunityId: this.opportunityId,
        selectedSubSourcesIds: this.selectedSubSourcesIds,
        isMenuLeads: this.isMenuLeads,
        customStartDate: this.leadFilterCustomStartDate,
        customEndDate: this.leadFilterCustomEndDate,
        dateRange: this.dateRange,
      },
    });
  }
}
