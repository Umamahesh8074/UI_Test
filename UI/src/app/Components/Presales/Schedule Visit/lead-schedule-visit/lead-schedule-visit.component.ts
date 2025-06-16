import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';
import { Subject, takeUntil } from 'rxjs';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import {
  IScheduleVisit,
  ScheduleVisit,
  ScheduleVisitDto,
} from 'src/app/Models/Presales/scheduleVisit';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LeadService } from 'src/app/Services/Presales/Leads/lead.service';
import { ScheduleVisitService } from 'src/app/Services/Presales/ScheduleVisit/schedule-visit.service';

@Component({
  selector: 'app-lead-schedule-visit',
  templateUrl: './lead-schedule-visit.component.html',
  styleUrls: ['./lead-schedule-visit.component.css'],
})
export class LeadScheduleVisitComponent implements OnInit {
  @ViewChild(MatDatepicker) datepicker!: MatDatepicker<any>;
  isAdding: boolean = true;
  formData!: FormGroup;
  leadId: number = 0;
  leadName: string = '';
  totalItems: number = 0;
  pageSize: number = 5;
  pageIndex: number = 0;
  pageSizeOptions = pageSizeOptions;
  chart: Chart | any;
  isFromManualLeadAssign: boolean = false;
  lead: any = {};
  destroy$ = new Subject<void>();
  scheduleVisit: IScheduleVisit = new ScheduleVisit();
  time: string = '12:00';
  minDate!: Date;
  scheduleVisitStatus: any[] = [];
  scheduleVisitDetails: ScheduleVisitDto[] = [];
  displayedColumns: string[] = ['visitDate', 'status', 'address', 'remarks'];
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
  isUniqueLeadsMenu: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private scheduleVisitService: ScheduleVisitService,
    private leadService: LeadService,
    private commanService: CommanService,
    private overlayContainer: OverlayContainer
  ) {}

  ngOnInit(): void {
    this.initializeFilters();
    const historyState = history.state;
    console.log('STATE DATA :', historyState);

    if (historyState.pageSize != undefined) {
      this.pageSizeFromScheduleVisit = historyState.pageSize;
    }
    if (historyState.pageIndex != undefined) {
      this.pageIndexFromScheduleVisit = historyState.pageIndex;
    }
    this.isFromManualLeadAssign = history.state.isFromManualLeadAssign;
    this.leadId = history.state.leadId;
    this.scheduleVisit = history.state.scheduleVisit;
    console.log(history.state.scheduleVisit);
    this.fetchScheduleVisitStatus();
    this.fetchLeadById();
    this.initForm();
    if (history.state.scheduleVisit && this.scheduleVisit != undefined) {
      this.isAdding = false;
      this.patchFormDataWithScheduleVisitData();
    }
    this.fetchScheduleVisit();
    console.log('LeadScheduleVisitComponent initialized');
    console.log(
      'OverlayContainer element:',
      this.overlayContainer.getContainerElement()
    );
    this.overlayContainer.getContainerElement().classList.add('form-div');
  }

  private initForm(): void {
    this.formData = this.formBuilder.group({
      address: [''],
      remarks: ['', Validators.required],
      followupDate: [new Date(), Validators.required],
      id: [0],
      leadId: [this.leadId],
      statusId: [0, Validators.required],
    });
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

  patchFormDataWithScheduleVisitData() {
    console.log(this.scheduleVisit.leadId);
    console.log(this.scheduleVisit);
    this.formData.patchValue(this.scheduleVisit);
  }

  save() {
    console.log('entered.....');
    if (this.formData.invalid) {
      // Mark all form controls as touched to show validation errors
      this.formData.markAllAsTouched();
      return; // Exit if the form is invalid
    }
    console.log(this.formData.value);
    if (this.formData.valid) {
      if (this.isAdding) {
        this.scheduleVisitService
          .saveScheduleVisit(this.formData.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              console.log(response);
              this.router.navigate(['/layout/sales/schedule/visits/ST'], {
                state: {
                  leadId: this.leadId,
                },
              });
            },
          });
      } else {
        console.log(this.formData.value);
        this.scheduleVisitService
          .updateScheduleVisit(this.formData.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              console.log(response);
              this.router.navigate(['layout/sales/schedule/visits/ST'], {
                state: {
                  leadId: this.leadId,
                },
              });
            },
          });
      }
    }
  }

  fetchLeadById() {
    this.leadService
      .fetchLeadDetails(this.leadId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.lead = response;
          this.leadId = this.lead.id;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  fetchScheduleVisitStatus() {
    const refTypeName = 'Schedule_Visit_Status';
    this.commanService
      .getRefDetailsByType(refTypeName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log(response);
          this.scheduleVisitStatus = response;
          console.log(this.scheduleVisitStatus);
        },
      });
  }

  clearForm() {
    this.formData.reset();
  }
  goToScheduleVisit() {
    console.log(this.isFromManualLeadAssign);
    if (this.isFromManualLeadAssign) {
      this.router.navigate(['/layout/presales/lead/assign/P']);
    } 

    else {
      this.router.navigate(['layout/sales/schedule/visits/ST'], {
        state: {
          leadId: this.leadId,
          pageSizeFromScheduleVisit: this.pageSizeFromScheduleVisit,
          pageIndexFromScheduleVisit: this.pageIndexFromScheduleVisit,
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.overlayContainer.getContainerElement().classList.remove('form-div');
    if (this.chart) {
      this.chart.destroy();
    }
  }

  fetchScheduleVisit() {
    console.log('entered');

    console.log(this.leadId);
    this.scheduleVisitService
      .getAllScheduleVisits(this.pageIndex, this.pageSize, this.leadId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.scheduleVisitDetails = response.records;
          this.totalItems = response.totalRecords;
          console.log(this.scheduleVisitDetails);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.fetchScheduleVisit();
  }
}
