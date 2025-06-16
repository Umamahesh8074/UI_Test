import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { Block } from 'src/app/Models/Block/block';
import { CommonReferenceType } from 'src/app/Models/CommanModel/menuDto';
import { Lead } from 'src/app/Models/Presales/lead';
import {
  ILeadFollowup,
  LeadFollowupDto,
} from 'src/app/Models/Presales/leadFollowup';
import { Level } from 'src/app/Models/Project/level';
import { Project } from 'src/app/Models/Project/project';
import { IUser, User } from 'src/app/Models/User/User';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LeadsCommonService } from 'src/app/Services/CommanService/leads-common.service';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { LeadFollowupService } from 'src/app/Services/Presales/Leads/lead-followup.service';
import { LeadService } from 'src/app/Services/Presales/Leads/lead.service';
import { ScheduleVisitService } from 'src/app/Services/Presales/ScheduleVisit/schedule-visit.service';
import { BookingService } from 'src/app/Services/ProjectService/Booking/booking.service';
import { CommonreferencedetailsService } from 'src/app/Services/UserService/commonreferencedetails.service';
import { UserService } from 'src/app/Services/UserService/userservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lead-followup',
  templateUrl: './lead-followup.component.html',
  styleUrls: ['./lead-followup.component.css'],
})
export class LeadFollowupComponent implements OnInit, OnDestroy {
  projectFilterCtrl = new FormControl('');
  filteredLeads: any;
  selectedProjects: any;

  isAdding = true;
  followupForm!: FormGroup;
  infoForm!: FormGroup;
  leads: Lead[] = [];
  followupTypes: CommonReferenceType[] = [];
  followupStatusList: CommonReferenceType[] = [];
  followup!: ILeadFollowup;
  // lead: ILead = new Lead();
  // lead: ILeadDto = new LeadDto();
  lead: any;
  private destroy$ = new Subject<void>();
  followups: LeadFollowupDto[] = [];
  leadId: number = 0;
  isSalesTeamFollowUp: boolean = false;
  displayedColumns: string[] = [
    'createdDate',
    'followupDate',
    'status',
    'subStatus',
    'type',
    'remarks',
    'createdBy',
    'actions',
  ];
  lostStatus: string = 'Lost_Status';
  followupStatusType: string = 'Lead_Status';
  user: User = new User();
  totalItems: number = 0;
  pageSize: number = 20;
  pageIndex: number = 0;
  pageSizeOptions = pageSizeOptions;
  isSalesTeamFollowups: boolean = false;
  dateRange: any = 999;
  statusId: any;
  isLeadFollowups: boolean = false;
  time: string = '12:00';
  maxDate = new Date();
  minDate!: Date;
  isLostStatus: boolean = false;
  isReasonOthers: boolean = false;
  lostStatusList: CommonReferenceType[] = [];
  moduleNames: string[] = [];
  customStartDate: any;
  customEndDate: any;
  leadFilterCustomStartDate: any;
  leadFilterCustomEndDate: any;
  stateData: any;
  leadPageSize: number = 25;
  leadPageIndex: number = 0;
  isFromDashBoard: boolean = false;
  assignedTo: number = 0;
  custPhoneNumber: any = '';
  //walk page fields
  isFromWalkIn: boolean = false;

  isFromManualLeadAssign: boolean = false;
  disableActionButton: boolean = true;
  isModelView: boolean = false;
  blocks: Block[] = [];
  levels: Level[] = [];
  units: any[] = [];
  projects: Project[] = [];
  status: string = 'Available';
  isFollowUpAdded: boolean = false;
  //minDate:any = new Date(new Date().setMonth(this.maxDate.getMonth() - 2));
  sourceIds: [] = [];
  isMenuLeads: boolean = false;
  custName: string = '';
  opportunityId: string = '';
  subSourcesIds: [] = [];
  phoneNumber: string = '';
  projectId: number = 0;
  isAllLeads: boolean = false;
  currentStatusDashboard: string = '';
  dashboard: string = '';
  allLeads: any;
  projectIds: number[] = [];
  leadStatusId: any;
  preSaleUser = new FormControl<IUser | null>(null);
  userData: any = [];
  presalesUserSerachText: any = '';
  presaleMemeberId: any;

  salesUser = new FormControl<IUser | null>(null);
  salesUserData: any = [];
  salesUserSerachText: any = '';
  saleMemeberId: any;
  isSalesTeam = false;
  isSalesTeamFollowUs = false;
  isDisableAssignment: boolean = true;
  isExpiringPage: any = false;
  digitalPartner: any = '';
  selectedFollowupStatus: string = '';
  digitalLeads: any = false;
  camapaginName: any;
  selectedLeadIds: number[] = [];
  selectedLeads: any = [];
  presalesUserIds: number[] = [];
  salesUserIds: number[] = [];
  selectedUsers: any;
  targetUserId: any;
  sourceUserId: any;
  isUniqueLeadsMenu: any = false;
  isCP: boolean = false;
  sourceId: number = 0;
  followupIds: any;

  isMemberDashBoard: boolean = false;
  isManagerDashBoard: boolean = false;
  isSalesHeadDashboard: boolean = false;
  isDigitalMarketingDashboard: boolean = false;
  isCTODashboard: any;
  followUpType: any;
  salesLeads: any = false;
  isUnassignedLeads: any = false;
  leadType: any;
  today = new Date();
  maxFollDate = new Date();
  isExpried = 'N';
  leadTypes: CommonReferenceType[] = [];
  leadTypeIdControl = new FormControl('', [
    Validators.required,
    Validators.min(1),
  ]);
  isDisplayLeadTypes: boolean = false;
  selectedLeadTypeId: number = 0;
  constructor(
    private followupService: LeadFollowupService,
    private router: Router,
    private formBuilder: FormBuilder,
    private leadService: LeadService,
    private route: ActivatedRoute,
    private scheduleVisitService: ScheduleVisitService,
    private toasterService: ToastrService,
    private commonRefDetailService: CommonreferencedetailsService,
    public bookingService: BookingService,
    public leadCommonService: LeadsCommonService,
    public userService: UserService,
    private loaderService: LoaderService,
    private commonService: CommanService,
    private leadFollowupService: LeadFollowupService
  ) {}

  ngOnInit(): void {
    this.fetchLeadTypes();
    this.maxFollDate.setDate(this.today.getDate() + 15);
    const user = this.getUserFromLocalStorage();

    this.route.params.subscribe((params) => this.setTeamType(params));
    this.isMemberDashBoard = history.state.isMemberDashBoard === true;
    this.isManagerDashBoard = history.state.isManagerDashBoard === true;
    this.isSalesHeadDashboard = history.state.isSalesHeadDashboard === true;
    this.isDigitalMarketingDashboard =
      history.state.isDigitalMarketingDashboard === true;
    this.isExpried =
      history.state.expried != undefined
        ? history.state.expried
        : this.isExpried;
    this.initializeFilters();
    if (user) {
      this.user = user;
      // this.fetchFollowups();
      if (
        this.user.roleName.toLowerCase().includes('channel partner') ||
        this.user.roleName.toLowerCase().includes('cp users')
      ) {
        this.isCP = true;
      }
    }
    // alert( history.state.disableActionButton)
    const state = history.state;
    this.isExpiringPage = history.state.isExpiringPage;
    this.stateData = history.state;
    this.followup = state.followup;
    this.leadId = state.leadId;
    this.isUniqueLeadsMenu = state.isUniqueLeadsMenu
      ? state.isUniqueLeadsMenu
      : this.isUniqueLeadsMenu;
    this.isAdding = !this.followup;
    this.isFromDashBoard = history.state.isFromDashBoard;
    this.isFromManualLeadAssign = history.state.isFromManualLeadAssign;

    this.followupIds = history.state.followUpIds;
    if (history.state.disableActionButton == undefined) {
      this.disableActionButton = true;
    } else {
      if (
        this.user.roleName.toLocaleLowerCase().includes('channel') ||
        this.user.roleName.toLocaleLowerCase().includes('cp')
        // || this.user.roleName.toLocaleLowerCase().includes('presales manager')
      ) {
        this.disableActionButton = true;
      } else {
        this.disableActionButton = history.state.disableActionButton;
      }
    }
    this.updateDisplayColumns();
    if (state.pageSize != undefined) {
      this.leadPageSize = state.pageSize;
    }
    if (state.pageIndex != undefined) {
      this.leadPageIndex = state.pageIndex;
    }
    if (state.isFromWalkIn != undefined) {
      this.isFromWalkIn = state.isFromWalkIn;
    }

    this.isSalesTeamFollowUp = this.user.roleName
      .toLocaleLowerCase()
      .includes('presale')
      ? false
      : true;
    this.user.roleName.toLocaleLowerCase().includes('presales')
      ? this.moduleNames.push('P,PS')
      : this.moduleNames.push('S,PS');
    this.initForm();
    this.initFormOfInfo();
    this.fetchFollowupTypes();
    this.fetchFollowupStatusList();
    this.route.params.subscribe((params) => {
      this.isSalesTeamFollowUp = params['ST'] === 'ST';
    });
    if (this.leadId) {
      this.fetchLeadById(this.leadId);
      this.fetchPresaleUsers(this.presalesUserSerachText);
      this.fetchSaleUsers(this.salesUserSerachText);
      this.isLeadFollowups = true;
      this.fetchFollowups();
    }

    // if (!this.isAdding && this.followup) {
    //   this.patchFormWithFollowupData();
    // }
    this.digitalLeads = history.state.digitalLeads
      ? history.state.digitalLeads
      : '';
  }
  initializeFilters() {
    console.log(history.state);

    this.leadStatusId = history.state.statusId;
    this.sourceIds = history.state.sourceIds;
    this.subSourcesIds = history.state.selectedSubSourcesIds;
    this.custName = history.state.custName;
    this.opportunityId = history.state.opportunityId;
    // this.selectedSubSourcesIds = history.state.selectedSubSourcesIds;
    this.dateRange =
      history.state.dateRange === undefined ? '' : history.state.dateRange;
    this.isMenuLeads = history.state.isMenuLeads;
    this.phoneNumber = history.state.phoneNumber;
    this.leadFilterCustomStartDate = history.state.customStartDate;
    this.leadFilterCustomEndDate = history.state.customEndDate;
    this.projectId = history.state.projectId;
    this.assignedTo = history.state.assignedTo;
    this.isAllLeads = history.state.isAllLeads;
    this.digitalPartner = history.state.digitalPartner;
    if (history.state.currentStatusDashboard != undefined) {
      this.currentStatusDashboard = history.state.currentStatusDashboard;
    }
    if (history.state.dashboard != undefined) {
      this.dashboard = history.state.dashboard;
    }
    this.camapaginName = history.state.campaginName;
    this.presalesUserIds = history.state.presalesUserIds ?? [];
    this.salesUserIds = history.state.salesUserIds ?? [];
    this.selectedUsers = history.state.selectedUsers ?? [];
    this.targetUserId = history.state.targetUserId ?? '';
    this.sourceUserId = history.state.sourceUserId ?? '';
    this.sourceId = history.state.sourceId;
    this.isCTODashboard = history.state.isCTODashboard;
    this.followUpType = history.state.followUpType;
    this.salesLeads = history.state.salesLeads === true;
    this.isUnassignedLeads = history.state.isUnassignedLeads === true;
    this.leadType = history.state.leadType || '';
    this.leadType = history.state.leadType;
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    const currentTime = new Date();
    const hours24 = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const ampm = hours24 >= 12 ? 'PM' : 'AM';
    const hours12 = hours24 % 12 || 12; // Convert '0' to '12'
    const currentTimeString = `${String(hours12).padStart(2, '0')}:${String(
      minutes
    ).padStart(2, '0')} ${ampm}`;
    this.followupForm = this.formBuilder.group({
      id: [0],
      leadId: [this.leadId, Validators.required],
      followupDate: [new Date(), Validators.required],
      followupTime: [
        currentTimeString,
        [
          Validators.required,
          this.timeValidator(currentTimeString, new Date()),
        ],
      ],
      followupType: [''],
      typeId: [0],
      statusId: [0, Validators.required],
      remarks: ['', Validators.required],
      subStatusId: [0],
    });

    if (!this.isAdding && this.followup) {
      this.followupForm.patchValue(this.followup);
      this.patchFormWithFollowupData();
    } else {
      //this.minDate = new Date();
      this.minDate = new Date(new Date().setMonth(this.maxDate.getMonth() - 2));
    }
  }

  private patchFormWithFollowupData(): void {
    // Extract followup date
    const followupDate = new Date(this.followup.followupDate);

    // Set minDate to a past date to allow updating past dates
    //this.minDate = new Date(followupDate.getFullYear() - 1, 0, 1); // For example, 1 year before the followup date
    this.minDate = new Date(new Date().setMonth(this.maxDate.getMonth() - 2));
    // Extract date in YYYY-MM-DD format
    const date = followupDate;

    // Extract time in 'h:mm AM/PM' format for Indian Standard Time
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    };

    const time = followupDate.toLocaleString('en-IN', options); // e.g., '6:30 AM'

    this.followupForm = this.formBuilder.group({
      id: [this.followup?.id],
      leadId: [this.followup?.leadId],
      followupDate: [date || '', Validators.required],
      followupTime: [time || '', Validators.required],
      typeId: [this.followup?.typeId || ''],
      statusId: [this.followup?.statusId || '', Validators.required],
      remarks: [this.followup?.remarks || '', Validators.required],
      phoneNumber: [''],
      projectId: [''],
    });
  }
  private initFormOfInfo() {
    this.infoForm = this.formBuilder.group({
      customerName: ['', Validators.required],
      customerPhoneNo: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{10}$')],
      ],
      emailId: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      projectId: [''],
      blockId: [''],
      levelId: [''],
      unitId: [''],
      coApplicantName: ['', Validators.required],
      coapplicantEmailid: ['', [Validators.required, Validators.email]],
      coApplicantPhoneNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{10}$')],
      ],
      basicPrice: [],
      finalPrice: [],
      leadId: [],
      coapplicantaddress: [],
    });
  }

  private fetchFollowupTypes(): void {
    this.followupService.fetchFollowupTypes('Followup_Type').subscribe({
      next: (types) => (this.followupTypes = types),
      error: (error) => this.handleErrorResponse(error),
    });
  }

  private fetchFollowupStatusList(): void {
    this.commonRefDetailService
      .fetchLeadStatusListByRole(this.followupStatusType, this.moduleNames)
      .subscribe({
        next: (status) => {
          // Filtering the list based on the condition
          status = status.filter(
            (e: any) => e.commonRefKey && !e.commonRefKey.includes('NL')
          );
          this.followupStatusList = status;
        },
        error: (error) => this.handleErrorResponse(error),
      });
  }

  private fetchLeadById(leadId: number): void {
    this.leadService.fetchLeadDetails(leadId).subscribe({
      next: (lead) => {
        this.lead = lead;
        this.selectedLeadIds.push(lead.id);
        this.selectedLeads.push(lead);
        this.getProjectsByLeadPhoneNumber();
        if (this.lead.assignedToPreSales) {
          this.patchPesaleMember();
        }
        if (this.lead.assignedToSales) {
          this.patchSaleMember();
        }
      },
      error: (error) => this.handleErrorResponse(error),
    });
  }

  patchPesaleMember() {
    this.userService.getUserById(this.lead.assignedToPreSales).subscribe({
      next: (user) => {
        this.preSaleUser.patchValue(user);
      },
      error: (error) => console.log(error),
    });
  }

  patchSaleMember() {
    this.userService.getUserById(this.lead.assignedToSales).subscribe({
      next: (user) => {
        this.salesUser.patchValue(user);
      },
      error: (error) => console.log(error),
    });
  }
  // save(): void {
  //   console.log('Adding followup');
  //   if (this.followupForm.value.statusId <= 0) {
  //     this.followupForm
  //       .get('statusId')
  //       ?.setErrors({ lessThanOrEqualToZero: true });
  //   }
  //   if (this.followupForm.valid) {
  //     const statusId = this.followupForm.value.statusId;
  //     const status = this.followupStatusList.find(
  //       (status) => status.id === statusId
  //     );
  //     console.log(status);
  //     console.log('Is adding followup', this.isAdding);
  //     const formData = this.followupForm.value;

  //     // Parse and combine date and time
  //     const followupDateTime = new Date(formData.followupDate);
  //     const timeParts = formData.followupTime.split(':');
  //     let hours = parseInt(timeParts[0], 10);
  //     const minutes = parseInt(timeParts[1], 10);

  //     // Adjust hours based on AM/PM
  //     const isPM = formData.followupTime.includes('PM');
  //     if (isPM && hours !== 12) {
  //       hours += 12; // Convert PM hour to 24-hour format
  //     } else if (!isPM && hours === 12) {
  //       hours = 0; // Convert 12 AM to 0 hours
  //     }

  //     followupDateTime.setHours(hours);
  //     followupDateTime.setMinutes(minutes);

  //     // Format the combined date and time
  //     formData.followupDate = this.formatDateTime(followupDateTime);
  //     console.log('phoneNumber' + this.lead.phoneNumber);
  //     console.log('projectId' + this.lead.projectId);

  //     formData.phoneNumber = this.lead.phoneNumber;
  //     formData.projectId = this.lead.projectId;
  //     console.log(formData);

  //     if (status?.commonRefValue.toLocaleLowerCase().includes('visit')) {
  //       console.log('saving schedule visit');

  //       const visitOperation = this.isAdding
  //         ? this.scheduleVisitService.saveScheduleVisit(formData)
  //         : this.scheduleVisitService.updateScheduleVisit(formData);

  //       visitOperation.pipe(takeUntil(this.destroy$)).subscribe({
  //         next: (response) => response,
  //         error: (error) => {},
  //         // this.handleError(
  //         //   'Failed to add schedule visit. Please try again later.',
  //         //   error
  //         // ),
  //       });
  //     }
  //     if (this.isModelView) {
  //       this.goToBooking(formData, this.isSalesTeamFollowUp);
  //     } else {
  //       const followupOperation = this.isAdding
  //         ? this.followupService.saveFollowup(
  //             formData,
  //             this.isSalesTeamFollowUp
  //           )
  //         : this.followupService.updateFollowup(
  //             formData,
  //             this.isSalesTeamFollowUp
  //           );

  //       followupOperation.pipe(takeUntil(this.destroy$)).subscribe({
  //         next: (response) => {
  //           console.log('..................' + this.isFollowUpAdded);
  //           // this.goToBooking()
  //           // this.handleSuccess(response);
  //           this.leadCommonService.handleSuccessResponse(response);
  //           this.gotoFollowUps();
  //         },
  //         error: (error) => this.handleErrorResponse(error),
  //       });
  //     }
  //   } else {
  //     console.log('Form is invalid');

  //     if (!this.followupForm.value.statusId) {
  //       this.followupForm.get('statusId')?.setErrors({ required: true });
  //     }
  //   }
  // }
  save(): void {
    // console.log(this.followupForm.getRawValue());
    if (this.selectedLeads.length === 0) {
      this.displayErrorMessage();
    }
    console.log('Adding followup');
    if (this.followupForm.getRawValue().statusId <= 0) {
      this.followupForm
        .get('statusId')
        ?.setErrors({ lessThanOrEqualToZero: true });
    }
    if (this.followupForm.valid && this.selectedLeads.length > 0) {
      const statusId = this.followupForm.getRawValue().statusId;
      const status = this.followupStatusList.find(
        (status) => status.id === statusId
      );
      console.log('Is adding followup', this.isAdding);
      const formData = this.followupForm.getRawValue();

      // Parse and combine date and time
      const followupDateTime = new Date(formData.followupDate);
      const timeParts = formData.followupTime.split(':');
      let hours = parseInt(timeParts[0], 10);
      const minutes = parseInt(timeParts[1], 10);

      // Adjust hours based on AM/PM
      const isPM = formData.followupTime.includes('PM');
      if (isPM && hours !== 12) {
        hours += 12; // Convert PM hour to 24-hour format
      } else if (!isPM && hours === 12) {
        hours = 0; // Convert 12 AM to 0 hours
      }

      followupDateTime.setHours(hours);
      followupDateTime.setMinutes(minutes);

      // Format the combined date and time
      formData.followupDate = this.formatDateTime(followupDateTime);
      // console.log('phoneNumber' + this.lead.phoneNumber);
      // console.log('projectId' + this.lead.projectId);

      formData.phoneNumber = this.lead.phoneNumber;
      formData.projectId = this.lead.projectId;

      // if (status?.commonRefValue.toLocaleLowerCase().includes('visit')) {
      //   console.log('saving schedule visit');
      //   const visitOperation = this.isAdding
      //     ? this.scheduleVisitService.saveScheduleVisit(formData)
      //     : this.scheduleVisitService.updateScheduleVisit(formData);

      //   visitOperation.pipe(takeUntil(this.destroy$)).subscribe({
      //     next: (response) => response,
      //     error: (error) => {},
      //     // this.handleError(
      //     //   'Failed to add schedule visit. Please try again later.',
      //     //   error
      //     // ),
      //   });
      // }

      if (this.isDisplayLeadTypes === true && this.leadTypeIdControl.invalid) {
        this.leadTypeIdControl.markAsTouched();
        return;
      } else {
        this.selectedLeadTypeId = Number(this.leadTypeIdControl.value);
      }

      this.leadCommonService.showLoading();
      if (this.isModelView) {
        this.goToBooking(formData, this.isSalesTeamFollowUp);
      } else {
        const followupOperation = this.isAdding
          ? this.followupService.addFollowupToLead(
              this.lead.phoneNumber,
              this.selectedLeadIds,
              formData,
              this.isSalesTeamFollowUp
            )
          : this.followupService.updateFollowup(
              formData,
              this.isSalesTeamFollowUp,
              this.selectedLeadTypeId
            );

        followupOperation.pipe(takeUntil(this.destroy$)).subscribe({
          next: (response) => {
            this.leadCommonService.hideLoading();
            this.handleSuccessResponse(response);
          },

          error: (error) => {
            this.handleErrorResponse(error);
            this.leadCommonService.hideLoading();
          },
        });
      }
    } else {
      console.log('Form is invalid');

      if (!this.followupForm.getRawValue().statusId) {
        this.followupForm.get('statusId')?.setErrors({ required: true });
      }

      Object.keys(this.followupForm.controls).forEach((key) => {
        const controlErrors = this.followupForm.get(key)?.errors;
        if (controlErrors) {
          console.log(`Field: ${key}, Errors:`, controlErrors);
        }
      });
    }
  }

  private handleSuccess(response: any): void {
    this.toasterService.success('', response.message, {
      timeOut: 3000, // Set success timeout to 3 seconds
      closeButton: true, // Enable close button if needed
      progressBar: true, // Show progress bar to indicate the timeout
      progressAnimation: 'decreasing', // Progress bar animation
    });

    this.gotoFollowUps();
  }
  handleSuccessResponse(response: any): void {
    Swal.fire({
      title: 'Success!',
      text: response.message || 'Operation completed successfully.',
      icon: 'success',
      confirmButtonText: 'OK',
    }).then(() => {
      this.gotoFollowUps();
    });
  }
  private handleErrorResponse(error: any): void {
    // console.error('Error saving/updating lead:', error.error.message);
    this.toasterService.error('Failed', error.error.message, {
      timeOut: 3000, // Set success timeout to 3 seconds
    });
  }

  gotoFollowUps(): void {
    const state = {
      dateRange: this.dateRange,
      statusIds: this.leadStatusId,
      leadPageSize: this.leadPageSize,
      leadPageIndex: this.leadPageIndex,
      isFromDashBoard: this.isFromDashBoard,
      statusId: this.leadStatusId,
      sourceIds: this.sourceIds,
      subSourceIds: this.subSourcesIds,
      selectedSubSourcesIds: this.subSourcesIds,
      phoneNumber: this.phoneNumber,
      custName: this.custName,
      opportunityId: this.opportunityId,
      isMenuLeads: this.isMenuLeads,
      customStartDate: this.leadFilterCustomStartDate,
      customEndDate: this.leadFilterCustomEndDate,
      projectId: this.projectId,
      assignedTo: this.assignedTo,
      isAllLeads: this.isAllLeads,
      currentStatusDashboard: this.currentStatusDashboard,
      dashboard: this.dashboard,
      pageIndex: this.leadPageIndex,
      pageSize: this.leadPageSize,
      digitalPartner: this.digitalPartner,
      campaginName: this.camapaginName,
      presalesUserIds: this.presalesUserIds,
      salesUserIds: this.salesUserIds,
      selectedUsers: this.selectedUsers,
      sourceUserId: this.sourceUserId,
      targetUserId: this.targetUserId,
      sourceId: this.sourceId,
      followupIds: this.followupIds,
      isMemberDashBoard: this.isMemberDashBoard,
      isManagerDashBoard: this.isManagerDashBoard,
      isSalesHeadDashboard: this.isSalesHeadDashboard,
      isDigitalMarketingDashboard: this.isDigitalMarketingDashboard,
      isCTODashboard: this.isCTODashboard,
      followUpType: this.followUpType,
      salesLeads: this.salesLeads,
      isUnassignedLeads: this.isUnassignedLeads,
      leadType: this.leadType,
      expried: this.isExpried,
    };
    if (this.stateData.isDashboardFollowups) {
      this.router.navigate(['/layout/presales/dashboard/followups/PST'], {
        state,
      });
    } else if (this.isFromWalkIn) {
      this.router.navigate(['/layout/walk_in/leads'], { state });
    } else if (this.isFromManualLeadAssign) {
      this.router.navigate(['/layout/presales/lead/assign/P'], { state });
    } else if (this.isAllLeads) {
      this.router.navigate(['/layout/sales/all/leads'], { state });
    } else if (this.isExpiringPage) {
      const targetRoute = this.isSalesTeamFollowUp
        ? '/layout/sales/expiringleads/ST'
        : '/layout/sales/expiringleads/PST';
      this.router.navigate([targetRoute], {
        state,
      });
    } else if (this.digitalLeads) {
      this.router.navigate(['/layout/presales/digitalleads'], { state });
    } else if (this.isUniqueLeadsMenu) {
      const targetRoute = this.isSalesTeamFollowUp
        ? '/layout/sales/unique/leads/ST'
        : '/layout/presales/unique/leads/PST';
      this.router.navigate([targetRoute], {
        state,
      });
    } else if (history.state.isSearchLead === true) {
      const targetRoute = '/layout/search/lead';
      this.router.navigate([targetRoute], {
        state,
      });
    } else {
      const targetRoute = this.isSalesTeamFollowUp
        ? '/layout/sales/leads/ST'
        : '/layout/presales/leads/PST';
      this.router.navigate([targetRoute], {
        state,
      });
    }
  }

  clearForm(): void {
    this.followupForm.reset();
    if (this.followup) {
      this.followupForm.patchValue(this.followup);
    }
  }
  getUserFromLocalStorage(): User | null {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }

  fetchFollowups(): void {
    this.showLoading();
    if (this.isFromDashBoard === undefined) {
      this.isFromDashBoard = false;
    }
    this.followupService
      .fetchCpFollowups(
        // searchText,
        '',
        this.pageIndex,
        this.pageSize,
        this.user.userId,
        this.user.roleId,
        this.leadId,
        '',
        this.statusId,
        this.customStartDate,
        this.customEndDate,
        0,
        '',
        false
      )

      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.totalItems = response.totalRecords;
          this.followups = response.records;
          this.hideLoading();
        },
        error: (error) => {
          console.error(error);
          this.hideLoading();
        },
      });
  }

  formatDateTime(date: Date): string {
    return formatDate(date, 'yyyy-MM-ddTHH:mm:ss.SSSSSS', 'en-IN');
  }

  fetchLostStatusList(statusId: number) {
    const selectedStatus = this.followupStatusList.find(
      (status) => status.id === statusId
    );
    if (selectedStatus) {
      const status = selectedStatus.commonRefValue.toLocaleLowerCase();
      this.selectedFollowupStatus = status;
      if (status === 'site visit done' || status === 'revisit done') {
        const selectedDate = this.followupForm.get('followupDate')?.value;
        const today = new Date();

        if (selectedDate && new Date(selectedDate) > today) {
          this.followupForm
            .get('followupDate')
            ?.setErrors({ futureDate: true });
        }
      } else {
        const errors = this.followupForm.get('followupDate')?.errors;
        if (errors) {
          delete errors['futureDate'];
          this.followupForm
            .get('followupDate')
            ?.setErrors(Object.keys(errors).length ? errors : null);
        }
      }
      if (['lost', 'non-contactable'].some((s) => status.includes(s))) {
        this.isLostStatus = true;
        let statusType = '';
        if (status.includes('lost')) {
          statusType = 'Lost_Status';
        } else if (status.includes('non-contactable')) {
          statusType = 'NC_status';
        }
        this.followupService.fetchFollowupTypes(statusType).subscribe({
          next: (types) => {
            this.lostStatusList = types;
          },
          error: (error) => {
            console.error('Error fetching lead types:', error);
          },
        });
      } else {
        this.isLostStatus = false;
      }
      // if (
      //   selectedStatus.commonRefValue.toLocaleLowerCase().includes('booked')
      // ) {
      //   this.isModelView = true;
      // }
    }
  }

  displayReasonForOthers(statusId: number) {
    const selectedStatus = this.lostStatusList.find(
      (status) => status.id === statusId
    );
    if (selectedStatus) {
      if (
        selectedStatus.commonRefValue.toLocaleLowerCase().includes('others')
      ) {
        this.isReasonOthers = true;
      } else {
        this.isReasonOthers = false;
      }
    }
  }
  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.fetchFollowups();
  }

  timeValidator(currentTime: string, currentDate: Date): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (!control.value) return null;

      const selectedDate = control.parent?.get('followupDate')?.value;
      const selectedTime = control.value;

      // If selected date is greater than current date, allow any time
      if (new Date(selectedDate) > currentDate) {
        return null;
      }

      // Extract time parts
      const currentTimeParts = currentTime.match(/(\d+):(\d+) (AM|PM)/);
      const selectedTimeParts = selectedTime.match(/(\d+):(\d+) (AM|PM)/);

      if (!currentTimeParts || !selectedTimeParts) return null;

      const currentHours =
        (+currentTimeParts[1] % 12) + (currentTimeParts[3] === 'PM' ? 12 : 0);
      const currentMinutes = +currentTimeParts[2];

      const selectedHours =
        (+selectedTimeParts[1] % 12) + (selectedTimeParts[3] === 'PM' ? 12 : 0);
      const selectedMinutes = +selectedTimeParts[2];

      // Validate the time only if the selected date is the same as the current date
      if (
        new Date(selectedDate).toDateString() === currentDate.toDateString()
      ) {
        if (
          selectedHours < currentHours ||
          (selectedHours === currentHours && selectedMinutes < currentMinutes)
        ) {
          return { timeInvalid: true };
        }
      }

      return null;
    };
  }

  onChange() {
    const timeControl = this.followupForm.get('followupTime');
    const dateControl = this.followupForm.get('followupDate');
    const selectedDate = dateControl?.value;

    if (
      this.selectedFollowupStatus === 'site visit done' ||
      this.selectedFollowupStatus === 'revisit done'
    ) {
      const today = new Date();

      if (selectedDate && new Date(selectedDate) > today) {
        this.followupForm.get('followupDate')?.setErrors({ futureDate: true });
      } else {
        this.followupForm.get('followupDate')?.setErrors({ futureDate: null });

        this.followupForm.get('followupDate')?.removeValidators;
      }
    }

    if (timeControl) {
      timeControl.updateValueAndValidity();
    } else if (dateControl) {
      dateControl.updateValueAndValidity();
    }
  }

  isDisplayBackButton(): boolean {
    if (this.user.roleName.toLowerCase() === 'sales head') {
      return false;
    }
    if (
      this.lead?.assignedToSales > 0 &&
      this.user.roleName.toLowerCase().includes('presales member') &&
      this.disableActionButton
    ) {
      return true;
    } else if (
      this.user.roleName.toLocaleLowerCase().includes('channel') ||
      this.user.roleName.toLocaleLowerCase().includes('cp')
    ) {
      // console.log('else if');
      return true;
    } else {
      if (
        this.user.roleName.toLocaleLowerCase().includes('presales member') ||
        this.user.roleName.toLocaleLowerCase().includes('sales member') ||
        this.user.roleName.toLowerCase().includes('presales manager')
      ) {
        return false;
      } else {
        return true;
      }
    }
  }
  goToBooking(formData: any, isSalesTeamFollowUp: boolean) {
    this.router.navigate(['/layout/project/addbooking'], {
      state: {
        leadId: this.lead.id,
        data: formData,
        isSalesTeamFollowUp: isSalesTeamFollowUp,
      },
    });
  }

  updateDisplayColumns() {
    if (this.user.roleName.toLocaleLowerCase().includes('channel partner')) {
      this.displayedColumns = this.displayedColumns.filter(
        (column) => column !== 'remarks'
      );
    }
  }

  getProjectsByLeadPhoneNumber() {
    // Ensure the phone number is available
    if (!this.lead || !this.lead.phoneNumber) {
      console.error('Phone number is not available for this lead.');
      return;
    }
    // Call the lead service and subscribe to the result
    const phoneNumber = encodeURIComponent(this.lead.phoneNumber);
    this.leadService
      .fetchLeadByPhoneNumber(
        phoneNumber,
        this.user.userId,
        this.isSalesTeamFollowUp
      )
      .subscribe({
        next: (response) => {
          this.allLeads = response;
          this.filteredLeads = this.allLeads;
        },
        error: (error) => {
          // Handle the error if the API call fails
          console.error('Error fetching projects by phone number:', error);
        },
        complete: () => {
          console.log('Fetching projects by phone number completed.');
        },
      });
  }

  onProjectChange(event: Event, projectId: number): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      // Add the projectId if checked
      this.projectIds.push(projectId);
    } else {
      // Remove the projectId if unchecked
      this.projectIds = this.projectIds.filter((id) => id !== projectId);
    }
  }

  displayUser(user: User): string {
    return user && user.userName ? user.userName : '';
  }

  fetchPresaleUsers(userName: string) {
    if (userName.length > 2) {
      this.presalesUserSerachText = userName;
      this.userService
        .getUserByManagerId(this.user.userId, this.presalesUserSerachText, true)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (resp) => {
            // const userData = resp.filter((u) => u.userId != this.user.userId);
            const userData = resp;
            const allowedRoles = ['presales member', 'presales manager'];

            this.userData = userData.filter((user) =>
              allowedRoles.includes(user.roleName.toLowerCase())
            );

            // this.userData = userData;
            //this.targetUserList = userData;
          },
          error: (error) => {
            console.error(error);
          },
        });
    } else if (userName.length == 0) {
      this.userService
        .getUserByManagerId(this.user.userId, '', true)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (resp) => {
            const userData = resp;
            const allowedRoles = ['presales member', 'presales manager'];
            this.userData = userData;
            this.userData = userData.filter((user) =>
              allowedRoles.includes(user.roleName.toLowerCase())
            );
            //console.log(this.userData)
            //this.targetUserList = userData;
          },
          error: (error) => {
            console.error(error);
          },
        });
    }
  }

  onUserSelect(event: any) {
    this.presaleMemeberId = event.option.value.userId;
    this.isDisableAssignment = false;
  }

  updatePresale() {
    const selectedPresaleLeadId: any = [this.lead.id];
    this.leadService
      .updateManualLeadAssign(
        selectedPresaleLeadId,
        this.presaleMemeberId,
        'PST',
        this.user.userId
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.leadCommonService.handleSuccessResponse(res);
          this.isDisableAssignment = true;
        },
        error: (err) => {
          console.error('Error updating Menu', err);
          //this.handleErrorResponse(err);
        },
      });
  }

  fetchSaleUsers(userName: string) {
    if (userName.length > 2) {
      console.log('method executed for search sales');
      this.salesUserSerachText = userName;
      this.userService
        .getUserByManagerId(this.user.userId, this.salesUserSerachText, true)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (resp) => {
            const userData = resp.filter(
              (u) =>
                u.userId != this.user.userId &&
                u.userId != this.lead.assignedToPresales
            );
            this.salesUserData = userData;
            this.salesUserData = userData.filter(
              (user) =>
                user.roleName.toLowerCase() === 'sales member' &&
                user.userName.toLowerCase() !== 'sbr group'
            );

            //this.targetUserList = userData;
          },
          error: (error) => {
            console.error(error);
          },
        });
    } else if (userName.length == 0) {
      console.log('method executed for search clear sales');
      this.userService
        .getUserByManagerId(this.user.userId, '', true)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (resp) => {
            const userData = resp.filter(
              (u) =>
                u.userId != this.user.userId &&
                u.userId != this.lead?.assignedToPresales
            );
            this.salesUserData = userData;
            this.salesUserData = userData.filter(
              (user) => 'sales member' === user.roleName.toLowerCase()
            );
            //console.log(this.userData)
            //this.targetUserList = userData;
          },
          error: (error) => {
            console.error(error);
          },
        });
    }
  }

  onSaleUserSelect(event: any) {
    // console.log(event.option.value.userId);
    this.saleMemeberId = event.option.value.userId;
    console.log(this.saleMemeberId);
  }

  updateSale() {
    const selectedsaleLeadId: any = [this.lead.id];
    this.leadService
      .updateManualLeadAssign(
        selectedsaleLeadId,
        this.saleMemeberId,
        'ST',
        this.user.userId
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          //this.goToAddFollow()
          this.leadCommonService.handleSuccessResponse(res);
        },
        error: (err) => {
          console.error('Error updating Menu', err);
          //this.handleErrorResponse(err);
        },
      });
  }

  private setTeamType(params: any) {
    this.isSalesTeam = params['ST'] === 'ST';
    this.isSalesTeamFollowUs = this.isSalesTeam;
  }

  goToAddFollow() {
    const route = this.isSalesTeamFollowUs
      ? '/layout/sales/followups/save/ST'
      : '/layout/presales/followups/save/PST';
    this.router.navigate([route], {
      state: {
        leadId: this.leadId,
        isSalesTeamFollowUs: this.isSalesTeamFollowUs,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        handleFollowups: false,
        isFromDashBoard: false,
        //disableActionButton: this.isChannelPartner,
        statusId: this.statusId,
        // sourceIds: this.sourceId,
        phoneNumber: this.phoneNumber,
        //custName: this.userName,
        opportunityId: this.opportunityId,
        subSourcesIds: this.subSourcesIds,
        dateRange: this.dateRange,
        isMenuLeads: this.isMenuLeads,
        customStartDate: this.customStartDate,
        customEndDate: this.customEndDate,
        projectId: this.projectId,
        //leadType: this.leadType,
        assignedTo: this.assignedTo,
        currentStatusDashboard: this.currentStatusDashboard,
        dashboard: this.dashboard,
      },
    });
  }

  filterProjects(value: string) {
    const filterValue = value.toLowerCase();
    return this.allLeads.filter((lead: any) =>
      lead.projectName.toLowerCase().includes(filterValue)
    );
  }

  isProjectSelected(leadId: number | null | undefined): boolean {
    // if (leadId != null && this.lead.id === leadId) {
    //   this.selectedLeadIds.push(leadId);
    // }
    return leadId != null && this.lead.id === leadId;
  }

  removeLead(leadId: number) {
    this.selectedLeads = this.selectedLeads.filter(
      (lead: any) => lead.id !== leadId
    );
    this.selectedLeadIds = this.selectedLeadIds.filter((id) => id !== leadId);
  }

  onCheckboxChange(event: MatCheckboxChange, lead: any) {
    if (event.checked) {
      this.selectedLeadIds.push(lead.id);
      this.selectedLeads.push(lead);
    } else {
      this.removeLead(lead.id);
    }
    console.log(`Checked: ${this.selectedLeadIds}`);
    if (this.selectedLeads.length === 0) {
      this.displayErrorMessage();
    }
  }

  get selectedProjectsText(): string {
    return this.selectedLeads.map((p: any) => p.projectName).join(', ');
  }

  displayErrorMessage() {
    Swal.fire({
      icon: 'error',
      title: 'No Projects Selected',
      text: 'Please select at least one project.',
      confirmButtonText: 'OK',
    });
  }

  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }
  onEditClick(id: number) {
    this.showLoading();
    this.leadFollowupService.fetchFollowup(id).subscribe({
      next: (followup) => {
        this.hideLoading();
        this.followup = followup;
        this.isAdding = false;
        this.patchFormWithFollowupData();
        this.isDisplayLeadTypeSelection();
        this.followupForm.get('statusId')?.disable();
      },
      error: (error) => {
        this.hideLoading();
        console.error('Error fetching followup:', error);
      },
    });
  }
  fetchLeadTypes(): void {
    this.commonService.getRefDetailsByType('Lead_Type').subscribe({
      next: (types) => {
        this.leadTypes = types;
      },
      error: (error) => {
        console.error('Error fetching lead types:', error);
      },
    });
  }

  shouldShowFormDiv(): boolean {
    const role = this.user?.roleName?.toLowerCase() || '';
    const isPresalesUnassigned =
      (this.lead?.assignedToSales === null ||
        this.lead?.assignedToSales === 0) &&
      role.includes('presales') &&
      this.disableActionButton;

    const isSalesMember = role === 'sales member';
    const isSalesManager = role === 'sales manager';
    const isSalesHead = role.includes('sales head');

    return (
      isPresalesUnassigned || isSalesMember || isSalesManager || isSalesHead
    );
  }

  isDisplayLeadTypeSelection() {
    const statusId: number = this.followup.statusId;
    const followupStatus = this.followupStatusList.find(
      (e) => e.id === statusId
    );
    const isSVD = followupStatus?.commonRefKey.toLowerCase() === 'svd';
    if (
      this.user.roleName.toLowerCase().includes('sales') &&
      !this.isAdding &&
      isSVD
    ) {
      this.isDisplayLeadTypes = true;
    } else {
      this.isDisplayLeadTypes = false;
    }
  }
}
