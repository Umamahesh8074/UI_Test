import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import {
  leadPageSizeOptions,
  pageSizeOptions,
} from 'src/app/Constants/CommanConstants/Comman';
import { LeadHistoryDto } from 'src/app/Models/Presales/lead';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { LeadService } from 'src/app/Services/Presales/Leads/lead.service';

@Component({
  selector: 'app-duplicateleadhistory',
  templateUrl: './duplicateleadhistory.component.html',

  styleUrls: ['./duplicateleadhistory.component.css'],
})
export class DuplicateleadhistoryDisplayComponent implements OnInit {
  duplicateleadhistory: LeadHistoryDto = new LeadHistoryDto();
  isAdding: boolean = true;
  pageSizeOptions = leadPageSizeOptions;
  duplicatelead: LeadHistoryDto[] = [];
  totalItems: number = 0;
  pageSize: number = 25;
  pageIndex: number = 0;
  formData!: FormGroup;
  lead: any;
  stateData: any;
  phoneNumber: string = '';
  // leadName:string='';
  opportunityId: string | null = '';
  dateRange: any;
  private destroy$ = new Subject<void>();
  customStartDate: any;
  customEndDate: any;
  showDateRangePicker: boolean = false;
  isMenuLeads: boolean = false;
  leadName!: string | null;
  constructor(
    private router: Router,
    // private duplicateleadhistoryService: duplicateleadhistoryService,
    private builder: FormBuilder,
    private leadService: LeadService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    const state = history.state;
    this.stateData = history.state;
    console.log(this.stateData);
    this.phoneNumber = state.phoneNumber ?? '';
    (this.leadId = state.leadId), (this.leadName = state.leadName);
    this.opportunityId = state.opportunityId;
    console.log('phone number..' + this.phoneNumber);
    console.log('phone number..' + this.leadId);
    console.log('phone number..' + this.leadName);

    this.getDuplicateLeadHistory(this.phoneNumber);
    this.formData = this.builder.group({
      leadId: [this.duplicateleadhistory.leadId],
      leadName: [this.duplicateleadhistory.leadName],
      opportunityId: [this.duplicateleadhistory.opportunityId],
      leadStatus: [this.duplicateleadhistory.leadStatus],
      recordedDate: [this.duplicateleadhistory.recordedDate],
      note: [this.duplicateleadhistory.note],
      assignedToPresale: [this.duplicateleadhistory.assignedToPresale],
      presaleMemberName: [this.duplicateleadhistory.presaleMemberName],
      assignedToSale: [this.duplicateleadhistory.assignedToSale],
      saleMemberName: [this.duplicateleadhistory.saleMemberName],
    });
    this.initializeState();
  }
  private initializeState() {
    console.error(history.state);
    const state = history.state;
    console.log(state);
  }
  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getdata();
  }

  leadId: any;
  leadHistories: LeadHistoryDto[] = [];
  displayedColumns: string[] = [
    'id',
    'recordedDate',
    'leadStatus',
    'note',
    'presaleMemberName',
    'saleMemberName',
  ];

  isSaleTeam = false;

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  //   backToDuplicateLeadHistory(): void {
  //  const state=this.stateData;
  //     const route = 'layout/presales/duplicate/leads';
  //     this.router.navigate([route]);, {
  //       state: state,
  //     });
  // }
  backToDuplicateLeadHistory(): void {
    const state = this.stateData;
    const route = 'layout/presales/duplicate/leads';
    this.router.navigate([route], {
      state: state,
    });
  }

  getdata() {
    this.getDuplicateLeadHistory(this.phoneNumber);
  }
  getDuplicateLeadHistory(phoneNumber: string) {
    this.showLoading();
    console.log('phone number...' + phoneNumber);
    let extractedPhoneNumber = phoneNumber.split(' ')[1];
    console.log('Phone number only: ' + extractedPhoneNumber);

    this.leadService
      .fetchDuplicateLeadHistories(
        extractedPhoneNumber,
        this.pageIndex,
        this.pageSize
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log(response.records);
          this.leadHistories = response.records;
          console.log(this.leadHistories);
          console.log(this.leadHistories);
          if (this.leadHistories && this.leadHistories.length > 0) {
            this.leadId = this.leadHistories[0].leadId;
            this.leadName = this.leadHistories[0].leadName;
            this.opportunityId = this.leadHistories[0].opportunityId;
            console.log(
              'leadId' +
                this.leadId +
                'leadName' +
                this.leadName +
                'opportunityId' +
                this.opportunityId
            );
          }

          this.totalItems = response.totalRecords;
          this.hideLoading();
        },
        error: (error: any) => {
          console.error(error);
          this.hideLoading();
        },
      });
  }

  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }
}
