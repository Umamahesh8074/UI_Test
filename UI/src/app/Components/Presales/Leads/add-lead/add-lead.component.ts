import { OverlayContainer } from '@angular/cdk/overlay';
import { formatDate } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import Chart from 'chart.js/auto';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  takeUntil,
} from 'rxjs';
import { ChannelpatnerRegistrationDailougeComponent } from 'src/app/Comman-Components/Dialog/channelpatner-registration/channelpatner-registration.component';
import { CommonReferenceType } from 'src/app/Models/CommanModel/menuDto';
import { ILead, Lead } from 'src/app/Models/Presales/lead';
import { LeadSource } from 'src/app/Models/Presales/leadsource';
import { LeadSubSource } from 'src/app/Models/Presales/leadsubsource';
import { IProject, Project } from 'src/app/Models/Project/project';
import { UnitType } from 'src/app/Models/Project/unit';
import { User } from 'src/app/Models/User/User';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { ChannelPartnerRegisterService } from 'src/app/Services/Presales/CPRegisterService/channel-partner-register.service';
import { LeadService } from 'src/app/Services/Presales/Leads/lead.service';
import { LeadSubsourceService } from 'src/app/Services/Presales/LeadSubSource/lead-subsource.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { CommonreferencedetailsService } from 'src/app/Services/UserService/commonreferencedetails.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-lead',
  templateUrl: './add-lead.component.html',
  styleUrls: ['./add-lead.component.css'],
})
export class AddLeadComponent implements OnInit {
  formData!: FormGroup;
  sources: LeadSource[] = [];
  subSources: LeadSubSource[] = [];
  isAdding: boolean = true;
  lead: ILead = new Lead();
  leadTypes: CommonReferenceType[] = [];
  leadTypeId: string = 'Lead_Type';
  leadStatusList: CommonReferenceType[] = [];
  leadType: string = 'Lead_Type';
  leadStatus: string = 'Lead_Status';
  lostStatus: string = 'Lost_Status';
  budgetType: string = 'Budget_Type';
  languageType: string = 'Languages';
  isLostStatus: boolean = false;
  isReasonOthers: boolean = false;
  lostStatusList: CommonReferenceType[] = [];
  filteredBudgets: CommonReferenceType[] = [];
  totalBudgets: CommonReferenceType[] = [];
  allLanguages: CommonReferenceType[] = [];
  filteredLanguage: CommonReferenceType[] = [];
  projects: Project[] = [];
  projectId: number = 0;
  destroy$ = new Subject<void>();
  project: any = new FormControl([] as IProject[]);
  // budget: any = new FormControl([] as CommonReferenceType[]);
  unitType: any = new FormControl([] as UnitType[]);
  isSalesTeamLead: boolean = false;
  chart: Chart | any;

  filteredUnitTypes: UnitType[] = [];
  totalUnitTypes: UnitType[] = [];
  countryCodeType: string = 'Country_Code';
  selectedProject?: IProject = new Project();
  selectedUnitType: UnitType = new UnitType();
  countryCodes: CommonReferenceType[] = [];
  moduleNames: string[] = [];
  filteredCountries: CommonReferenceType[] = [];

  selectedCountry: string = '';
  projectName: string = '';
  user: User = new User();
  isChannelPartner: boolean = false;
  source: any;
  subSource: any;
  isView: boolean = false;
  navigationData: any;
  showAdditionalFields: boolean = false;
  showEmployeeReferenceFields: boolean = false;
  form: any;
  subSourceId: number = 0;
  subSourceName: string = '';
  selectedSubSource: LeadSubSource = new LeadSubSource(0, '', 0, '', '');
  subSourceDetails: any = new FormControl([] as LeadSubSource[]);
  sourceId: number = 0;
  @ViewChild('homeTextarea') homeTextarea!: ElementRef;
  @ViewChild('workTextarea') workTextarea!: ElementRef;
  @ViewChild('remarksTextarea') remarksTextarea!: ElementRef;
  filteredSubSources: any;
  leadId: any;
  address: [] = [];
  filteredAddresses: any;
  pincode: string = '';
  projectDisable: any;
  @ViewChild('homeLocationInput') homeLocationInput!: ElementRef;
  private dialogRef: MatDialogRef<ChannelpatnerRegistrationDailougeComponent> | null =
    null;
  errorMessage: string = '';
  errorMessages: { [key: string]: string } = {};
  title: string = 'Enter Channel Partner Details';
  pageSize: number = 20;
  pageIndex: number = 0;
  totalItems: number = 0;
  dbLeadSubSourceId: any;
  dbLeadSourceId: any;
  isSubSourceRequired: boolean = false;
  countryValidationRules: {
    [key: string]: { startDigit: string; length: number };
  } = {};
  countries: any;
  isMemberDashBoard: boolean = false;
  isManagerDashBoard: boolean = false;
  isSalesHeadDashBoard: boolean = false;
  sourceIds: [] = [];
  isMenuLeads: boolean = false;
  custName: string = '';
  opportunityId: string = '';
  selectedSubSourcesIds: [] = [];
  phoneNumber: string = '';
  dateRange: any = 999;
  statusId: any;
  isAllLeads: boolean = false;
  countryCode: string = '';
  @ViewChild('projectInput', { static: false }) projectInput!: ElementRef;
  customerProjects: any[] = [];
  openDialog: boolean = false;
  leadSubSourceIds: number[] = [];
  leadSourceIds: number[] = [];
  dialogSubSources: LeadSubSource[] = [];
  dialogSources: LeadSource[] = [];
  leadSubSources: LeadSubSource[] = [];
  allLeads: any[] = [];
  uniqueLead: any;
  leadSourceId: number = 0;
  leadSubSourceId: any;
  isDisplayDialog: boolean = false;
  cpWalkInSubSource: LeadSubSource = new LeadSubSource(0, '', 0, '', '');
  subSourceControl = new FormControl<number | null>(null, [
    Validators.required,
  ]);
  presalesUserIds: number[] = [];
  salesUserIds: number[] = [];
  selectedUsers: any;
  stateDate: any;
  isCTODashboard: any;
  followUpType: any;
  stateLeadType: any;
   isExpried='N'
  constructor(
    private leadService: LeadService,
    private commonService: CommanService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private commonRefDetailService: CommonreferencedetailsService,
    private leadSubsourceService: LeadSubsourceService,
    private dialog: MatDialog,
    private cpService: ChannelPartnerRegisterService,
    private overlayContainer: OverlayContainer,
    private loaderService: LoaderService
  ) {}

  ngAfterViewInit() {
    this.autoResizeHome();
    this.autoResizeWork();
    this.autoResizeRemarks();
  }
  autoResizeHome() {
    const textarea = this.homeTextarea.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  autoResizeWork() {
    const textarea = this.workTextarea.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  autoResizeRemarks() {
    const textarea = this.remarksTextarea.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  ngOnInit(): void {
    this.fetchCountryCodes();
    this.initializeFilters();
    this.lead = history.state.lead;
    this.isAdding = !this.lead;
    this.pageSize = history.state.pageSize;
    this.pageIndex = history.state.pageIndex;
    this.totalItems = history.state.totalItems;

    if (history.state.isView != undefined) {
      this.isView = history.state.isView;
    }
    console.log('Is Menu Leads ', history.state.isMenuLeads);
    this.navigationData = history.state;
    this.route.params.subscribe((params) => {
      if (params['ST'] == 'ST') {
        console.log(params['ST']);
        this.isSalesTeamLead = true;
      } else {
        this.isSalesTeamLead = false;
      }
    });
    this.isMemberDashBoard = history.state.isMemberDashBoard;
    this.isManagerDashBoard = history.state.isManagerDashBoard;
    this.isSalesHeadDashBoard = history.state.isSalesHeadDashboard;
    this.isExpried=history.state.expried!=undefined?history.state.expried:this.isExpried
    this.initForm();
    this.getUserFormLocalStorage();
    this.fetchLeadTypes();
    this.fetchLeadSources();

    //this.fetchProjects();
    if (this.user.roleName.toLocaleLowerCase() == 'sales member') {
      this.getProjectForSalesMember();
      this.project?.setValidators(Validators.required);
      this.formData.get('projectId')?.setValidators(Validators.required);
    } else {
      this.fetchProjects();
    }

    this.fetchCustomerProjects();
    this.fetchBudgetTypes();
    this.fetchUnitTypes();
    this.setUpFilterUnitTypes();

    this.setUpFilterBudgets();
    this.fetchLanguages();
    //this.setDefaultCountryCode();
    if (!this.isAdding) {
      this.patchFormWithLeadData();

      if (this.lead.sourceId !== undefined && this.lead.sourceId !== null) {
        this.dbLeadSourceId = this.lead.sourceId;
        // alert('DB source id : ' + this.dbLeadSourceId);
        if (this.shouldDisableSource()) {
          this.formData.get('sourceId')?.disable({ emitEvent: false });
        }
        this.fetchSubSources(this.lead.sourceId);
      }
      if (
        this.lead.subSourceId !== undefined &&
        this.lead.subSourceId !== null
      ) {
        this.dbLeadSubSourceId = this.lead.subSourceId;
      }
      // if (this.lead.projectId !== undefined && this.lead.projectId !== null) {
      //   this.fetchProject(this.lead.projectId);
      // }
      if (
        this.lead.subSourceId !== undefined &&
        this.lead.subSourceId !== null
      ) {
        this.fetchSubSourceBySubSourceId(this.lead.subSourceId);
      }
    }

    // Subscribe to value changes of the phoneNumber form control
    this.formData.get('phoneNumber')?.valueChanges.subscribe((value) => {
      // Trim leading and trailing spaces
      const trimmedValue = value.trim();

      // Update the form control value without emitting an event to prevent recursion
      this.formData
        .get('phoneNumber')
        ?.setValue(trimmedValue, { emitEvent: false });
    });

    this.formData
      .get('phoneNumber')
      ?.valueChanges.pipe(
        debounceTime(500), // Wait for 500ms pause in typing
        distinctUntilChanged(), // Only emit when the current value is different from the last
        takeUntil(this.destroy$)
      )
      .subscribe((phoneNumber: string) => {
        // if (
        //   phoneNumber &&
        //   phoneNumber.length === 10 &&
        //   /^\d{10}$/.test(phoneNumber)
        // ) {

        // }

        const role = this.user.roleName.toLocaleLowerCase();
        if (
          role === 'sales member' &&
          this.projectId > 0 &&
          // this.isAdding &&
          phoneNumber.length >= 5
        ) {
          this.fetchLeadByPhoneNumberAndProject();
        }
      });
    // console.log(
    //   'OverlayContainer element:',
    //   this.overlayContainer.getContainerElement()
    // );
    this.overlayContainer.getContainerElement().classList.add('add-lead-main');
    this.formData.get('countryCode')?.valueChanges.subscribe(() => {
      this.validatePhoneNumber(); // Trigger phone number validation when country code changes
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
    this.isAllLeads = history.state.isAllLeads;
    this.presalesUserIds = history.state.presalesUserIds ?? [];
    this.salesUserIds = history.state.salesUserIds ?? [];
    this.selectedUsers = history.state.selectedUsers ?? [];
    this.isCTODashboard = history.state.isCTODashboard;
    this.followUpType = history.state.followUpType;
    //this.stateDate=history.state
    this.stateLeadType = history.state.leadType || '';
    console.log(history.state);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.overlayContainer
      .getContainerElement()
      .classList.remove('add-lead-main');
    if (this.chart) {
      this.chart.destroy();
    }
  }
  // filteredCountries = [
  //   { commonRefKey: '+91', commonRefValue: 'India' },
  //   // Add other countries here...
  // ];

  getUserFormLocalStorage() {
    const user = localStorage.getItem('user');

    if (user) {
      this.user = JSON.parse(user);
      if (
        this.user.roleName == 'Channel Partner' ||
        this.user.roleName == 'CP Users'
      ) {
        console.log('entered' + this.user.roleName);
        this.isChannelPartner = true;
        // this.getSource();
        // this.getSubSource();
      }
    }
    this.user.roleName.toLocaleLowerCase().includes('presales') ||
    this.user.roleName.toLocaleLowerCase().includes('sales head')
      ? this.moduleNames.push('P,PS')
      : this.moduleNames.push('S,PS');

    this.fetchLeadStatusList();

    if (
      this.user.roleName.toLocaleLowerCase().includes('sales head') ||
      this.user.roleName.toLocaleLowerCase().includes('cto') ||
      this.user.roleName.toLocaleLowerCase().includes('sales manager')
    ) {
      this.projectDisable = true;
    }
  }

  // setDefaultCountryCode(): void {
  //   console.log(this.countryCodes);
  //   const india = this.countryCodes.find(
  //     (country) => country.commonRefValue === 'India'
  //   );

  //   console.log(india);
  // onSubSourceSelect(event: any) {
  //   console.log("entered");
  //   console.log(event.option.value);
  //   this.subSourceId = event.option.value.subSourceId;
  //   console.log(this.subSourceId);

  //   this.formData.patchValue({ subSourceId: this.subSourceId });
  // }
  onSubSourceChange(subSourceId: number) {
    // Find the selected sub-source based on the provided ID
    const selectedSubSource = this.subSources.find(
      (source) => source.leadSubSourceId === subSourceId
    );
    // Check if the selected sub-source exists
    if (selectedSubSource) {
      // Reset the visibility flags
      // Set flags based on the name of the selected sub-source
      if (selectedSubSource?.name === 'Customer Reference') {
        this.showAdditionalFields = true;
        this.showEmployeeReferenceFields = false;
      } else if (selectedSubSource?.name === 'Employee Reference') {
        this.showAdditionalFields = false;
        this.showEmployeeReferenceFields = true;
      } else {
        this.showAdditionalFields = false;
        this.showEmployeeReferenceFields = false;
      }
    } else {
      // Handle case where selectedSubSource is not found
      console.warn('Selected sub-source not found');
    }
  }

  setDefaultCountryCode(): void {
    const india = this.countryCodes.find(
      (country) => country.commonRefValue === 'India'
    );

    if (india) {
      this.form.get('countryCode')?.setValue(india.commonRefKey);
    }
  }
  //get souce to display source for channel partner
  getSource() {
    // return this.user.roleName;
    this.leadService
      .getSource(this.user.roleName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.source = response;
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }

  //get sub souce to display source for channel partner
  getSubSource() {
    this.leadService
      .getLeadSubSource(this.user.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.subSource = response;
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }

  private initForm(): void {
    this.formData = this.formBuilder.group({
      id: [0],
      name: ['', Validators.required],
      // phoneNumber: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      phoneNumber: ['', Validators.required],
      sourceId: ['', Validators.required],
      alternatePhoneNumber: [''],
      email: ['', [Validators.email]],
      gender: [''],
      subSourceId: ['', Validators.required],
      pincode: [''],
      designation: [''],
      companyName: [''],
      typeId: [0],
      statusId: [0],
      budget: [''],
      preferredFlatType: [''],
      remarks: [''],
      projectId: [0],
      referredCustomerProjectId: [''],
      customerUnitName: [0],
      referredEmployeeId: [''],
      referredEmployeeName: [''],
      assignedToPreSales: [0],
      assignedToSales: [0],
      homeLocation: [''],
      workLocation: [''],
      countryCode: [''],
      language: [''],
      subStatusId: [0],
      unit: [''],
      siteVisitDate: [],
      otherLostReason: [],
      isExpired: [],
      expiryDate: [],
      starCount: [],
      isRegisteredWithAnotherProject: [],
      isSiteVisitDoneInAnotherProject: [],
      isAcquiredLead: [],
    });
  }

  private patchFormWithLeadData(): void {
    if (this.leadSubSourceId > 0 && this.leadSourceId > 0) {
      this.dbLeadSourceId = this.leadSourceId;
    }
    this.isAdding = false;
    this.projectId = this.formData.value.projectId;
    // this.isView = true;
    if (this.lead.referredCustomerProjectId) {
      this.showAdditionalFields = true;
    }
    if (this.lead.referredEmployeeId) {
      this.showEmployeeReferenceFields = true;
    }
    // alert(this.showEmployeeReferenceFields);
    if (this.lead.subStatusId) {
      this.isLostStatus = true;
      this.fetchLostStatusListForEdit();
    }
    if (this.lead.sourceId) {
      this.fetchSubSources(this.lead.sourceId);
    }
    if (this.lead.subSourceId) {
      this.subSourceControl.patchValue(this.lead.subSourceId);
      // const roles = ['presales member', 'sales member'];
      const userRole = this.user.roleName.toLowerCase();

      this.dbLeadSubSourceId = this.lead.subSourceId;
      if (this.shouldDisableSubSource()) {
        this.subSourceControl.disable();
      }
    }

    if (this.lead.otherLostReason?.length > 0) {
      this.isReasonOthers = true;
    }
    // this.formData.patchValue(this.lead);
    const phoneNumber = this.lead.phoneNumber?.trim() || '';
    if (phoneNumber) {
      const phoneParts = phoneNumber.match(/^(\+\d{1,3})\s*(\d+)$/);
      if (phoneParts) {
        const countryCode = phoneParts[1]?.trim();
        const phoneNumber = phoneParts[2].trim();
        this.onSubSourceSelect(this.lead.subSourceId);
        this.fetchProject(this.lead.projectId);
        this.onProjectSelect(this.lead.projectId);
        this.formData.patchValue({ projectId: this.projectId });
        this.countryCode = countryCode;
        this.formData.patchValue({
          ...this.lead,
          phoneNumber: phoneNumber ?? '',
          countryCode: countryCode ?? '',
        });
        console.log(this.formData.value);
      }
    }
    this.projectId = this.formData.value.projectId;
    this.updateSiteVisitDateValidation();
  }

  fetchLeadTypes(): void {
    this.commonService.getRefDetailsByType(this.leadType).subscribe({
      next: (types) => {
        this.leadTypes = types;
      },
      error: (error) => {
        console.error('Error fetching lead types:', error);
      },
    });
  }

  fetchLeadStatusList(): void {
    this.commonRefDetailService
      .fetchLeadStatusListByRole(this.leadStatus, this.moduleNames)
      .subscribe({
        next: (types) => {
          this.leadStatusList = types.filter(
            (status: any) =>
              !['follow-up', 'site visit confirm', 'revisit proposed'].some(
                (substring) =>
                  status.commonRefValue.toLocaleLowerCase().includes(substring)
              )
          );
        },
        error: (error) => {
          console.error('Error fetching lead types:', error);
        },
      });
  }

  fetchLeadSources(): void {
    this.leadService.fetchLeadSources().subscribe({
      next: (sources: LeadSource[]) => {
        this.sources = sources;
      },
      error: (error: any) => {
        console.error('Error fetching lead sources:', error);
      },
    });
  }

  onSelectSource(sourceId: number) {
    this.formData.patchValue({ subSourceId: 0 });
    this.subSourceControl.patchValue(null);
    const subSourceControl = this.formData.get('subSourceId');
    subSourceControl?.setValidators(Validators.required);
    subSourceControl?.updateValueAndValidity(); // Ensure validation updates
    subSourceControl?.markAllAsTouched();
    this.fetchSubSources(sourceId);
  }

  fetchSubSources(sourceId: number): void {
    // this.showAdditionalFields = false;
    // this.showEmployeeReferenceFields = false;
    this.selectedSubSource = new LeadSubSource(0, '', 0, '', '');

    this.displaySubSource('');
    this.sourceId = sourceId;
    this.leadService.fetchLeadSubSources(sourceId).subscribe({
      next: (subSources) => {
        this.sourceId = sourceId;
        this.subSources = subSources;
        this.filteredSubSources = subSources;
      },
      error: (error) => {
        console.error('Error fetching lead sub-sources:', error);
      },
    });
  }

  // save() {
  //   alert(this.formData.getRawValue().sourceId);
  //   console.log(this.formData.getRawValue());
  // }

  save(): void {
    if (this.user.roleName.toLowerCase() === 'sales member') {
      this.formData.patchValue({ isAcquiredLead: 'Y' });
    }
    const selectedSource = this.sources.find(
      (source) => source.leadSourceId === this.formData.value.sourceId
    );
    if (this.projectId > 0) {
      this.formData.patchValue({ projectId: this.projectId });
    } else {
      const formProjectId = this.formData.value.projectId;
      this.formData.patchValue({ projectId: formProjectId });
    }

    // if (selectedSource && selectedSource.name === 'Channel Partner') {
    //   this.isSubSourceRequired = true;
    //   this.formData.get('subSourceId')?.setValidators([Validators.required]);
    // } else {
    //   this.isSubSourceRequired = false;
    //   this.formData.get('subSourceId')?.clearValidators();
    // }
    // this.formData.get('subSourceId')?.updateValueAndValidity();

    if (this.subSourceControl.invalid) {
      this.subSourceControl.markAsTouched();
      this.subSourceControl.updateValueAndValidity();
    }
    this.showLoading();
    if (this.isChannelPartner) {
      this.formData.get('sourceId')?.clearValidators();
      this.formData.get('sourceId')?.setErrors(null);
      this.formData.get('sourceId')?.updateValueAndValidity();
      this.formData.get('subSourceId')?.clearValidators();
      this.formData.get('subSourceId')?.setErrors(null);
      this.formData.get('subSourceId')?.updateValueAndValidity();
      const formDataCopy = { ...this.formData.getRawValue() };
      formDataCopy.phoneNumber = `${formDataCopy.countryCode} ${formDataCopy.phoneNumber}`;
      console.log(formDataCopy);

      if (this.formData.valid) {
        const saveOrUpdate$ = this.isAdding
          ? this.leadService.saveCpLead(
              formDataCopy,
              this.user.userId,
              this.user.roleId,
              this.user.cpRegisterId
            )
          : this.leadService.updateLead(formDataCopy);

        saveOrUpdate$.subscribe({
          next: (response) => {
            this.hideLoading();
            if (response.message === 'Lead Already Exists') {
              Swal.fire({
                title: 'Error',
                text: response.message,
                icon: 'error',
                timer: 5000, // Automatically close after 5 seconds
                timerProgressBar: false, // Display a progress bar during the timeout
                showConfirmButton: true, // Hide the "OK" button
                allowOutsideClick: true,
              }).then(() => {});
            } else {
              this.handleSuccessResponse(response);
            }
          },
          error: (error) => {
            this.hideLoading();
            console.log(error.message);
            this.handleErrorResponse(error);
          },
        });
      } else {
        this.hideLoading();
        const invalidFields = Object.keys(this.formData.controls).filter(
          (field) => this.formData.controls[field].invalid
        );
        if (this.subSourceControl.invalid) {
          console.log('invalid sub source');
        }
        console.log('Invalid Fields:', invalidFields);
      }
    } else {
      const formDataCopy = { ...this.formData.getRawValue() };
      // console.log(formDataCopy);
      formDataCopy.phoneNumber = `${formDataCopy.countryCode} ${formDataCopy.phoneNumber}`;
      // console.log(formDataCopy);
      // if (formDataCopy.siteVisitDate) {
      //   const adjustedDate = new Date(formDataCopy.siteVisitDate);
      //   adjustedDate.setHours(12, 0, 0); // Set time to noon to prevent date shift
      //   formDataCopy.siteVisitDate = adjustedDate;
      // }
      // if (formDataCopy.siteVisitDate) {
      //   formDataCopy.siteVisitDate = this.formatDateTime(
      //     this.formData.value.siteVisitDate
      //   );
      // }

      if (formDataCopy.siteVisitDate) {
        const siteVisitDate = new Date(this.formData.value.siteVisitDate);
        const today = new Date(); // Get today's date

        // Remove time from both dates for accurate comparison
        const isToday =
          siteVisitDate.getFullYear() === today.getFullYear() &&
          siteVisitDate.getMonth() === today.getMonth() &&
          siteVisitDate.getDate() === today.getDate();

        if (isToday) {
          // If the selected date is today, update time to current time
          siteVisitDate.setHours(
            today.getHours(),
            today.getMinutes(),
            today.getSeconds(),
            today.getMilliseconds()
          );
        } else {
          // If the selected date is in the past or future, keep time as 00:00:00
          siteVisitDate.setHours(0, 0, 0, 0);
        }

        formDataCopy.siteVisitDate = this.formatDateTime(siteVisitDate);
      }

      this.subSourceControl.enable();

      if (this.formData.valid && this.subSourceControl.valid) {
        // this.subSourceControl.disable();
        if (
          formDataCopy.siteVisitDate &&
          (formDataCopy.assignedToSales == 0 ||
            formDataCopy.assignedToSales === undefined ||
            formDataCopy.assignedToSales === null)
        ) {
          formDataCopy.assignedToSales = this.user.userId;
        }

        let saveOrUpdate$;
        if (this.isAdding) {
          formDataCopy.id = 0;
          saveOrUpdate$ = this.leadService.saveLead(formDataCopy, false);
        } else {
          saveOrUpdate$ = this.leadService.updateLead(formDataCopy, false);
        }

        saveOrUpdate$.subscribe({
          next: (response) => {
            this.hideLoading();
            if (response.message === 'Lead Already Exists') {
              this.handleErrorLeadResponse(response);
            } else {
              this.hideLoading();
              this.handleSuccessResponse(response);
            }
          },
          error: (error) => {
            console.log(error.message);
            this.hideLoading();
            this.handleErrorResponse(error);
          },
        });
      } else {
        this.hideLoading();
        const invalidFields = Object.keys(this.formData.controls).filter(
          (field) => this.formData.controls[field].invalid
        );
        if (this.subSourceControl.invalid) {
          console.log('invalid sub source');
        }
        console.log('Invalid Fields:', invalidFields);
      }
    }
  }
  // handleErrorLeadResponse(response: any): void {
  //   Swal.fire({
  //     title: response.message,
  //     html: `
  //     <p><strong>Pre Sales Person:</strong> ${
  //       response.preSalesPerson || 'NA'
  //     }</p><br>
  //     <p><strong>Sales Person:</strong> ${response.salesPerson || 'NA'}</p><br>
  //   `,
  //     icon: 'error',
  //     confirmButtonText: 'OK',
  //     allowOutsideClick: true,
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       if (response.lead) {
  //         this.lead = response.lead;
  //         // this.project.disable();
  //         this.patchFormWithLeadData();

  //         if (
  //           this.user.roleName === 'sales member' &&
  //           this.lead.assignedToSales > 0 &&
  //           this.lead.assignedToSales !== this.user.userId
  //         ) {
  //           Swal.fire({
  //             title: 'Warning',
  //             text: 'This lead has been assigned to a different sales member.',
  //             icon: 'warning',
  //             confirmButtonText: 'OK',
  //             allowOutsideClick: false,
  //           });
  //         }
  //       }
  //     }
  //   });
  // }

  handleErrorLeadResponse(response: any): void {
    Swal.fire({
      title: response.message,
      html: `
      <p><strong>Pre Sales Person:</strong> ${
        response.preSalesPerson || 'NA'
      }</p><br>
      <p><strong>Sales Person:</strong> ${response.salesPerson || 'NA'}</p><br>
    `,
      icon: 'error',
      confirmButtonText: 'OK',
      allowOutsideClick: true,
    }).then((result) => {
      if (result.isConfirmed) {
      }
    });
  }
  patchSourceAndSubSource() {
    this.formData.patchValue({
      sourceId: this.subSource.sourceId,
      subSourceId: this.subSource.leadSubSourceId,
    });
  }

  private handleSuccessResponse(response: any): void {
    Swal.fire({
      title: 'Success',
      text: response.message, // Display the success message
      icon: 'success',
      showConfirmButton: true, // Show the "OK" button
      allowOutsideClick: false, // Prevent closing by clicking outside
    }).then((result) => {
      if (result.isConfirmed) {
        // Navigate to leads after clicking the "OK" button
        this.gotoLeads();
      }
    });
  }

  private handleErrorResponse(error: any): void {
    console.error('Error saving/updating lead:', error.error.message);

    Swal.fire({
      title: 'Error',
      text: error.error.message, // Display the error message
      icon: 'error',
      confirmButtonText: 'OK', // Label for the button
      allowOutsideClick: false, // Prevent closing by clicking outside
    }).then((result) => {
      if (result.isConfirmed) {
      }
    });
  }

  gotoLeads(): void {
    const commonState = {
      ...this.navigationData,
      pageSize: this.pageSize,
      pageIndex: this.pageIndex,
      totalItems: this.totalItems,
      isMemberDashBoard:
        this.isMemberDashBoard || history.state.isMemberDashBoard,
      isManagerDashBoard:
        this.isManagerDashBoard || history.state.isManagerDashBoard,
      isSalesHeadDashboard:
        this.isSalesHeadDashBoard || history.state.isSalesHeadDashboard,
      statusId: this.statusId,
      sourceIds: this.sourceIds,
      phoneNumber: this.phoneNumber,
      custName: this.custName,
      opportunityId: this.opportunityId,
      selectedSubSourcesIds: this.selectedSubSourcesIds,
      subSourceIds: this.selectedSubSourcesIds,
      isMenuLeads: this.isMenuLeads,
      dateRange: this.dateRange,
      presalesUserIds: this.presalesUserIds,
      salesUserIds: this.salesUserIds,
      projectId: history.state.projectId,
      selectedUsers: this.selectedUsers,
      isCTODashboard: this.isCTODashboard,
      followUpType: this.followUpType,
      leadType: this.stateLeadType,
      expried:this.isExpried
    };
    if (this.isAllLeads) {
      this.router.navigate(['/layout/sales/all/leads'], { state: commonState });
    } else {
      const route = this.isSalesTeamLead
        ? 'layout/sales/leads/ST'
        : 'layout/presales/leads/PST';

      // Navigate to the appropriate route with the state data
      this.router.navigate([route], { state: commonState });
    }
  }

  clearForm(isNotClearNum?: boolean): void {
    this.isAdding = true;

    this.selectedSubSource.name = '';
    if (isNotClearNum === true) {
      this.formData.reset({
        countryCode: this.formData.get('countryCode')?.value,
        phoneNumber: this.formData.get('phoneNumber')?.value,
      });
    } else {
      this.formData.reset({
        countryCode: this.formData.get('countryCode')?.value,
      });
      this.isDisplayDialog = false;
      this.project.reset();
      this.subSourceControl.enable();
    }
  }

  fetchProjects() {
    if (
      this.user.organizationId <= 0 ||
      this.user.organizationId === null ||
      this.user.organizationId === undefined ||
      this.user.organizationId
    ) {
      this.user.organizationId = 1;
    }
    this.projectService
      .getAllProjects(this.projectName, 0, 100, 'Y', this.user.organizationId)
      .subscribe({
        next: (projects) => {
          this.projects = projects.records.filter(
            (project: any) =>
              !project.projectName.toLowerCase().includes('sbr projects')
          );
        },
        error: (error) => {
          console.error('Error fetching projects:', error);
        },
      });
  }
  fetchCustomerProjects() {
    this.leadService
      .fetchProjects(this.projectName, this.user.organizationId)
      .subscribe({
        next: (projects) => {
          this.customerProjects = projects;
        },
        error: (error) => {
          console.error('Error fetching projects:', error);
        },
      });
  }

  fetchLostStatusList(statusId?: number) {
    const selectedStatus = this.leadStatusList.find(
      (status) => status.id === statusId
    );

    if (selectedStatus) {
      const status = selectedStatus.commonRefValue.toLocaleLowerCase();

      if (['lost', 'non-contactable'].some((s) => status.includes(s))) {
        this.isLostStatus = true;
        let statusType = '';
        if (status.includes('lost')) {
          statusType = 'Lost_Status';
        } else if (status.includes('non-contactable')) {
          statusType = 'NC_status';
        }
        this.isLostStatus = true;
        this.commonService.getRefDetailsByType(statusType).subscribe({
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

  fetchBudgetTypes() {
    this.commonService.getRefDetailsByType(this.budgetType).subscribe({
      next: (budgets) => {
        this.totalBudgets = budgets;
        this.filteredBudgets = budgets;
      },
      error: (error) => {
        console.error('Error fetching lead types:', error);
      },
    });
  }

  displayProject(project: IProject): string {
    return project && project?.projectName ? project?.projectName : 'Select';
  }
  onProjectSelect(event: any) {
    this.selectedProject = event.option?.value;
    this.projectId = event.option?.value.projectId;
    this.formData.patchValue({ projectId: this.projectId });
    // this.fetchProject(this.projectId);
    const role = this.user.roleName.toLocaleLowerCase();

    if (
      role === 'sales member' &&
      this.projectId > 0 &&
      this.formData.value.phoneNumber.length >= 6
      //  && this.isAdding
    ) {
      this.fetchLeadByPhoneNumberAndProject();
    }
  }

  fetchLeadByPhoneNumberAndProject(): void {
    this.showLoading();
    const countryCode = this.formData.get('countryCode')?.value;
    const phoneNumber = this.formData.get('phoneNumber')?.value;
    const fullPhoneNumber = `${countryCode} ${phoneNumber}`;
    const encodedPhoneNumber = encodeURIComponent(fullPhoneNumber);
    this.leadSourceIds = [];
    this.leadSubSourceIds = [];
    this.dialogSources = [];
    this.leadSubSources = [];
    this.leadService
      .getLeadByPhoneNumberAndProjectId(encodedPhoneNumber, this.projectId)
      .subscribe({
        next: (data: any) => {
          this.hideLoading();
          this.allLeads = data.leads;

          this.uniqueLead = this.allLeads.find(
            (lead: any) => lead?.isAcquiredLead?.toLowerCase() === 'y'
          );
          //If lead already site visit done
          if (this.uniqueLead !== undefined) {
            this.lead = this.uniqueLead;
            if (this.uniqueLead.subSourceId > 0) {
              this.dbLeadSubSourceId = this.uniqueLead.subSourceId;
              this.subSourceControl.patchValue(this.uniqueLead.subSourceId);
            }
            if (this.uniqueLead.sourceId > 0) {
              this.dbLeadSourceId = this.uniqueLead.sourceId;
              this.formData.get('sourceId')?.disable({ emitEvent: false });
              // disable source selection
            }

            if (data.salesPerson !== undefined) {
              Swal.fire({
                title: 'Error',
                text: `Lead Already Exists and is assigned to ${data.salesPerson}`,
                icon: 'error',
                confirmButtonText: 'OK',
                allowOutsideClick: false,
              }).then((result) => {
                if (result.isConfirmed) {
                  // Add any actions here if needed
                }
              });
            }
            this.patchFormWithLeadData();
          } else {
            this.formData.patchValue({
              sourceId: null,
              subSourceId: null,
            });
            this.subSourceControl.reset();
            this.subSourceControl.enable();
            this.dbLeadSourceId = 0;
            if (data.leads.length > 0) {
              this.openDialog = true;
              this.isDisplayDialog = true;
              data.leads.forEach((lead: any) => {
                this.leadSubSourceIds.push(lead.subSourceId);
              });

              data.leads.forEach((lead: any) => {
                this.leadSourceIds.push(lead.sourceId);
              });

              this.fetchExistSubSources();
              this.fetchExistSources();
            }
          }
          // this.handleErrorLeadResponse(data);
        },
        error: (error: any) => {
          this.hideLoading();
          this.handleErrorResponse(error);

          console.error('Error fetching lead data:', error);
          this.formData.patchValue({
            sourceId: null,
            subSourceId: null,
            countryCode: this.formData.get('countryCode')?.value,
          });
          this.dbLeadSourceId = 0;
          this.dbLeadSubSourceId = 0;
          this.isView = false;
          this.subSources = [];
          this.filteredSubSources = [];
          this.selectedSubSource = new LeadSubSource(0, '', 0, '', '');
          this.isDisplayDialog = false;
          this.isAdding = true;
          this.formData.patchValue({ assignedToSales: 0 });
          this.formData.patchValue({ remarks: '' });
          this.subSourceControl.enable();
          if (this.formData?.get('sourceId')) {
            this.formData.get('sourceId')!.enable();
          }
          // this.formData.reset({
          //   sourceId: this.formData.get('sourceId')?.value,
          //   phoneNumber: this.formData.get('phoneNumber')?.value,
          //   countryCode: this.formData.get('countryCode')?.value,
          // });
        },
        complete: () => {
          console.log('Lead data fetch completed.');
        },
      });
  }

  fetchUnitTypes() {
    this.leadService.fetchAllUnitTypes().subscribe({
      next: (unitTypes) => {
        this.totalUnitTypes = unitTypes;
        this.filteredUnitTypes = this.totalUnitTypes.slice(0, 1000);
      },
      error: (error) => {
        console.error('Error fetching unit types:', error);
      },
    });
  }

  fetchProject(projectId: number) {
    this.projectService.getProjectById(projectId).subscribe({
      next: (project) => {
        this.selectedProject = project;
        this.project.setValue(project);
      },
      error: (error) => {
        console.error('Error fetching project:', error);
      },
    });
  }
  searchProject(event: any) {
    this.projectName = event.target.value;
    if (this.projectName.length <= 0) {
      this.projectId = 0;
      this.fetchProjects();
    } else if (this.projectName.length >= 3) {
      this.fetchProjects();
    }
  }
  fetchSubSourcesName(subSourceName: string) {
    this.formData.patchValue({ subSourceId: null });
    this.selectedSubSource = new LeadSubSource(0, '', 0, '', '');
    this.leadSubsourceService.fetchSubSources(0, subSourceName).subscribe({
      next: (subSources) => {
        this.subSources = subSources;
        this.subSource?.map((res: { name: string }) => {
          res.name = '';
        });
      },
      error: (error) => {
        console.error('Error fetching projects:', error);
      },
    });
  }
  filterSubSources(event: any) {
    this.subSourceName = event.target.value;
    let filteredSubSources = [];
    // console.log(this.subSources);
    if (this.subSourceName.length === 0) {
      // Reset to the original subSources
      // this.fetchSubSources(this.lead.sourceId);
      filteredSubSources = [...this.subSources];
    } else {
      // Filter subSources based on the input
      filteredSubSources = this.subSources.filter((subSource) =>
        subSource.name.toLowerCase().includes(this.subSourceName.toLowerCase())
      );
    }
    this.filteredSubSources = filteredSubSources;
  }

  filterUnitTypes(value: string) {
    if (value.trim() === '') {
      return this.totalUnitTypes.slice(0, 100);
    }
    const filterValue = value.toLowerCase();
    return this.totalUnitTypes.filter((unitType) =>
      unitType.name.toLowerCase().includes(filterValue)
    );
  }
  setUpFilterUnitTypes() {
    this.formData
      .get('preferredFlatType')
      ?.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterUnitTypes(value || ''))
      )
      .subscribe((filtered) => (this.filteredUnitTypes = filtered));
  }

  setUpFilterBudgets() {
    this.formData
      .get('budget')
      ?.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterBudgets(value || ''))
      )
      .subscribe((filtered) => (this.filteredBudgets = filtered));
  }

  filterBudgets(value: string) {
    const filterValue = value.toLowerCase();
    return this.totalBudgets.filter((budget) =>
      budget.commonRefValue.toLowerCase().startsWith(filterValue)
    );
  }

  searchCountry(event: any) {
    const searchTerm = event.target.value.toLowerCase();

    // Filter countries based on the searchTerm
    const filteredCountries = this.countryCodes.filter(
      (country) =>
        country.commonRefValue.toLowerCase().includes(searchTerm) ||
        country.commonRefValue.toLowerCase().includes(searchTerm)
    );
    this.filteredCountries = filteredCountries;
  }

  fetchCountryCodes() {
    this.commonService.getRefDetailsByType(this.countryCodeType).subscribe({
      next: (countryCodes) => {
        this.countryCodes = countryCodes;
        // const india = this.countryCodes.find(
        //   (country) => country.commonRefValue === 'India'
        // );
        // if (india) {
        //   this.formData.get('countryCode')?.setValue(india.commonRefKey);
        // }
        this.setCountryCode();
        this.filteredCountries = countryCodes;
      },
      error: (error) => {
        console.error('Error fetching lead types:', error);
      },
    });
  }

  setCountryCode(countryCode?: string) {
    if (this.countryCode.length > 0) {
      const country = this.countryCodes.find(
        (country) => country.commonRefKey === this.countryCode
      );
      this.formData.get('countryCode')?.setValue(country?.commonRefKey);
    } else {
      const india = this.countryCodes.find(
        (country) => country.commonRefValue === 'India'
      );
      if (india) {
        this.formData.get('countryCode')?.setValue(india.commonRefKey);
      }
    }
  }
  onSubSourceSelect(event: any) {
    if (typeof event === 'object' && event?.option?.value) {
      this.subSourceId = event.option.value.leadSubSourceId;
      this.formData.patchValue({ subSourceId: this.subSourceId });
    } else {
      this.subSourceId = event;
      this.fetchSubSourceBySubSourceId(this.subSourceId);
    }

    const selectedSubSource = this.subSources.find(
      (source) => source.leadSubSourceId === this.subSourceId
    );
    this.selectedSubSource = selectedSubSource
      ? selectedSubSource
      : new LeadSubSource(0, '', 0, '', '');
    if (selectedSubSource) {
      if (selectedSubSource?.refName === 'Individual') {
        this.openModal();
      } else if (selectedSubSource?.name === 'Customer Reference') {
        this.showAdditionalFields = true;
        this.showEmployeeReferenceFields = false;
      } else if (selectedSubSource?.name === 'Employee Reference') {
        this.showAdditionalFields = false;
        this.showEmployeeReferenceFields = true;
      } else {
        // selectedSubSource.name = '';
        this.showAdditionalFields = false;
        this.showEmployeeReferenceFields = false;
      }
    } else {
      // Handle case where selectedSubSource is not found
      console.warn('Selected sub-source not found');
    }
  }
  // onSubSourceSelect(event: any) {
  //   console.log(event);
  //   if (typeof event === 'object' && event?.option?.value) {
  //     console.log(event.option.value);
  //     this.subSourceId = event.option.value.leadSubSourceId;
  //     console.log(this.subSourceId);
  //     this.formData.patchValue({ subSourceId: this.subSourceId });
  //     console.log(this.formData);
  //   } else {
  //     console.log('event is number' + event);
  //     this.subSourceId = event;
  //     console.log('subSourceId' + this.subSourceId);
  //     this.fetchSubSourceBySubSourceId(this.subSourceId);
  //   }

  //   const selectedSubSource = this.subSources.find(
  //     (source) => source.leadSubSourceId === this.subSourceId
  //   );
  //   console.log('Selected SubSource:', selectedSubSource?.name);

  //   if (selectedSubSource?.name === 'individual') {
  //     this.openDialog();
  //   } else if (selectedSubSource?.name === 'Customer Reference') {
  //     this.showAdditionalFields = true;
  //     this.showEmployeeReferenceFields = false;
  //   } else if (selectedSubSource?.name === 'Employee Reference') {
  //     console.log('entered');
  //     this.showAdditionalFields = false;
  //     this.showEmployeeReferenceFields = true;
  //     console.log(this.showEmployeeReferenceFields);
  //   } else {
  //     console.log('entered');
  //     console.log('Selected SubSource:', selectedSubSource?.name);
  //     selectedSubSource.name = '';

  //     this.showAdditionalFields = false;
  //     this.showEmployeeReferenceFields = false;
  //   }
  // }

  displaySubSource(subSource: any): string {
    return subSource && subSource.name ? subSource.name : '';
  }
  fetchSubSourceBySubSourceId(subSourceId: number) {
    this.leadSubsourceService
      .fetchSubSourceBySubSourceId(subSourceId)
      .subscribe({
        next: (subSource) => {
          this.selectedSubSource = subSource;
          this.subSourceDetails.setValue(subSource);
        },
        error: (error) => {
          console.error('Error fetching project:', error);
        },
      });
  }

  showAddressDropdown = false;
  onSearchPinCode(pincode: string) {
    if (pincode.length === 6) {
      this.pincode = pincode;
      this.filteredAddresses = []; // Reset the addresses
      this.formData.get('homeLocation')?.setValue('', { emitEvent: false });

      this.leadService.getAddressByPinCode(pincode, '').subscribe(
        (data: any) => {
          // Check if `data` is a plain object
          if (data && typeof data === 'object') {
            // Convert the object values to an array
            this.filteredAddresses = Object.values(data);
            if (this.filteredAddresses.length > 0) {
              setTimeout(() => {
                if (this.homeLocationInput) {
                  this.homeLocationInput.nativeElement.focus();
                }
              });
            }
          } else {
            console.error('Unexpected response format:', data);
          }
        },
        (error) => {
          console.error('Error fetching address by pincode:', error);
        }
      );
    }
  }

  onChangeAddress(event: any) {
    const location = event.target.value;

    if (location === '') {
      // If the address is cleared, show all addresses for the current pincode
      this.leadService.getAddressByPinCode(this.pincode, '').subscribe(
        (data: any) => {
          console.log('API Response:', data);

          // Check if data is a plain object
          if (data && typeof data === 'object') {
            // Convert the object values to an array
            this.filteredAddresses = Object.values(data);
          } else {
            console.error('Unexpected response format:', data);
          }
        },
        (error) => {
          console.error('Error fetching address by pincode:', error);
        }
      );
    } else if (
      this.pincode !== '' &&
      location.length > 3 &&
      location.length < 15
    ) {
      this.leadService.getAddressByPinCode(this.pincode, location).subscribe(
        (data: any) => {
          console.log('API Response:', data);

          // Check if data is a plain object
          if (data && typeof data === 'object') {
            // Convert the object values to an array
            this.filteredAddresses = Object.values(data);
          } else {
            console.error('Unexpected response format:', data);
          }

          console.log(this.filteredAddresses);
        },
        (error) => {
          console.error('Error fetching address by pincode:', error);
        }
      );
    }
  }

  fetchLostStatusListForEdit() {
    this.commonService.getRefDetailsByType(this.lostStatus).subscribe({
      next: (types) => {
        this.lostStatusList = types;
      },
      error: (error) => {
        console.error('Error fetching lead types:', error);
      },
    });
  }
  data = {
    name: '',
    contactNumber: '',
    email: '',
  };
  saveChannelPartner(result: any): void {
    const channelPartner = {
      name: result.name ? result.name.trim() : '',
      phoneNumber: result.contactNumber ? result.contactNumber.trim() : '',
      email: result.email ? result.email.trim() : '',
      sourceId: this.sourceId,
      companyName: result.companyName ? result.companyName.trim() : '',
      isFromNewChannelPartner: true,
      showAdditionalFields: false,
    };
    // this.showLoading();
    this.cpService
      .registerChannelPartner(channelPartner)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const subSources = [];
          subSources.push(response.data);
          this.fetchSubSources(response.data.source);
          if (response != null) {
            this.selectedSubSource = response.data;
            this.fetchSubSources(response.data.sourceId);
            this.formData.patchValue({
              subSourceId: response.data.leadSubSourceId,
            });
            console.log('Patched subSourceId:', response.data.leadSubSourceId);
          }
          console.log('Registration successful');
          this.isModalVisible = false;
          this.data = { name: '', contactNumber: '', email: '' }; // Reset data after successful save
          // this.hideLoading();
          this.formData.setValue;
        },
        error: (err) => {
          console.error('Error occurred:', err);
          this.handleError(err.error);

          console.log(err.err.message);

          // this.handleError(err.message); // Pass the error object to handleError method
          // this.hideLoading();
        },
      });
  }

  private handleError(error: any) {
    this.errorMessages = {};
    console.log(error);

    if (error && error.error) {
      const errorMessage = error.error.toLowerCase();
      console.log(errorMessage);

      if (errorMessage.includes('phone number')) {
        this.errorMessages['contactNumber'] = error.error;
      } else if (
        errorMessage.includes('Channel Partner with this name already exists')
      ) {
        this.errorMessages['name'] = error.error; // Show error under 'name'
      } else if (errorMessage.includes('email')) {
        this.errorMessages['email'] = error.error;
      } else {
        //  this.errorMessages['general'] = error.error; // General error if not field-specific
      }
    } else {
      this.errorMessages['general'] =
        'An unexpected error occurred. Please try again later.';
    }

    this.isModalVisible = true; // Keep the modal open
  }
  // private showLoading() {
  //   console.log('entered...');
  //   this.dialog.open(LoaderComponent, {
  //     disableClose: true,
  //   });
  // }
  isModalVisible = false;

  openModal(): void {
    console.log('open model');

    this.isModalVisible = true;
    console.log(this.isModalVisible);
  }

  onModalClose(): void {
    this.isModalVisible = false;
  }

  onModalSave(data: any): void {
    console.log('Data from modal:', data);

    this.saveChannelPartner(data);
  }
  closeModal() {
    this.isModalVisible = false;
    this.errorMessages = {};
  }

  formatDateTime(date: Date): string {
    return formatDate(date, 'yyyy-MM-ddTHH:mm:ss.SSSSSS', 'en-IN');
  }

  getProjectForSalesMember() {
    this.projectService
      .getAllProjectsForSalesMember(
        this.projectName,
        0,
        100,
        'Y',
        this.user.userId
      )
      .subscribe({
        next: (projects) => {
          this.projects = projects.records;
        },
        error: (error) => {
          console.error('Error fetching projects:', error);
        },
      });
  }

  updateSiteVisitDateValidation() {
    const assignedToSales = this.formData.get('assignedToSales')?.value;
    const roleName = this.user.roleName;

    // Check if the condition is true
    if (
      roleName === 'sales member' &&
      (assignedToSales === 0 ||
        assignedToSales === undefined ||
        assignedToSales === null)
    ) {
      // Add validation for siteVisitDate if the condition is true
      this.formData.get('siteVisitDate')?.setValidators([Validators.required]);
    } else {
      // Remove the validation if the condition is false
      this.formData.get('siteVisitDate')?.clearValidators();
    }

    // Update the form control's validity after adding/removing validators
    this.formData.get('siteVisitDate')?.updateValueAndValidity();
  }
  fetchLanguages() {
    this.commonService.getRefDetailsByType(this.languageType).subscribe({
      next: (languages) => {
        this.allLanguages = languages;
        this.filteredLanguage = languages;
      },
      error: (error) => {
        console.error('Error fetching lead types:', error);
      },
    });
  }
  searchLanguage(event: any) {
    const searchTerm = event.target.value.toLowerCase();

    // Filter countries based on the searchTerm
    const filteredLanguage = this.allLanguages.filter(
      (language) =>
        language.commonRefValue.toLowerCase().includes(searchTerm) ||
        language.commonRefValue.toLowerCase().includes(searchTerm)
    );
    this.filteredLanguage = filteredLanguage;
  }
  getPhoneNumberLengthFromPattern(pattern: string): number {
    let totalLength = 0;

    // Match direct digits, character classes, and quantifiers
    const regex = /(\[.*?\]|\d)(\{(\d+)\})?/g;
    let matches;

    while ((matches = regex.exec(pattern)) !== null) {
      if (matches[3]) {
        totalLength += parseInt(matches[3], 10);
      } else {
        totalLength += 1;
      }
    }
    return totalLength;
  }

  getPhoneNumberStartPattern(): string {
    const countryCode = this.formData.get('countryCode')?.value;
    const selectedCountry = this.countryCodes.find(
      (country) => country.commonRefKey === countryCode
    );

    if (selectedCountry && selectedCountry.phoneNumberPattren) {
      const listMatch =
        selectedCountry.phoneNumberPattren.match(/^\^\[([\d]+)\]/);
      if (listMatch) {
        return `: ${listMatch[1].split('').join(', ')}`;
      }
      const rangeMatch =
        selectedCountry.phoneNumberPattren.match(/^\^\[(\d-\d)\]/);
      if (rangeMatch) {
        return `${rangeMatch[1].charAt(0)} to ${rangeMatch[1].charAt(2)}`;
      }
      const specificStartMatch =
        selectedCountry.phoneNumberPattren.match(/^\^(\d)/);
      if (specificStartMatch) {
        return specificStartMatch[1];
      }
      const StartMatch = selectedCountry.phoneNumberPattren.match(/^\^?(\d)/);
      if (specificStartMatch) {
        return specificStartMatch[1]; // Return '4' for Australia
      }
    }
    return '';
  }
  validatePhoneNumber() {
    const phoneNumber = this.formData.get('phoneNumber')?.value;
    const countryCode = this.formData.get('countryCode')?.value;
    const selectedCountry = this.countryCodes.find(
      (country) => country.commonRefKey === countryCode
    );

    const expectedLength = this.getPhoneNumberLengthFromPattern(
      selectedCountry?.phoneNumberPattren || ''
    ); // Pattern to get length
    const actualLength = phoneNumber?.length || 0;

    // Validate the length of the phone number
    if (actualLength !== expectedLength) {
      this.formData.get('phoneNumber')?.setErrors({
        requiredLength: {
          expectedLength: expectedLength,
          actualLength: actualLength,
        },
      });
      return; // Exit early if the length is incorrect, no need to check pattern
    }

    // Clear any length errors if the length is correct
    this.formData.get('phoneNumber')?.setErrors(null);

    // Validate the start of the phone number pattern
    if (selectedCountry && selectedCountry.phoneNumberPattren) {
      const phonePattern = new RegExp(selectedCountry.phoneNumberPattren);
      const validStartPattern = this.getPhoneNumberStartPattern(); // Use the method here to get start pattern

      if (!phonePattern.test(this.formData.get('phoneNumber')?.value)) {
        // If the phone number doesn't match the pattern, set an error for the incorrect prefix
        this.formData.get('phoneNumber')?.setErrors({
          incorrectPrefix: {
            message: `Number should start with ${validStartPattern}`, // Display the start pattern here
          },
        });
      }
    }
  }
  onDialogClose() {
    this.openDialog = false;
  }

  fetchExistSources() {
    if (this.leadSourceIds.length > 0) {
      this.dialogSources = this.sources.filter((ele) => {
        return this.leadSourceIds.includes(ele.leadSourceId);
      });
    }
    console.log(this.dialogSources);
  }
  fetchExistSubSources() {
    let leadSubSources: any[] = []; // Declare it inside the function scope

    this.leadSubsourceService.fetchBySourceIds(this.leadSourceIds).subscribe({
      next: (subSources: any[]) => {
        leadSubSources = subSources; // Assign the response
        if (this.leadSubSourceIds.length > 0) {
          this.dialogSubSources = leadSubSources.filter((ele: any) =>
            this.leadSubSourceIds.includes(ele.leadSubSourceId)
          );
        }
        console.log(this.dialogSubSources);
      },
      error: (error: any) => {
        console.error('Error fetching lead sub sources:', error);
      },
    });
  }

  // onLeadSubSourceSelect(event: any) {
  //   console.log(event.value);
  //   this.leadSubSourceId = event.value;

  //   const lead = this.allLeads.find(
  //     (lead) =>
  //       lead.sourceId === this.leadSourceId &&
  //       lead.subSourceId === this.leadSubSourceId
  //   );
  //   console.log('Lead Data: ', lead);
  //   if (lead !== null && lead !== undefined) {
  //     this.lead = lead;
  //     this.patchFormWithLeadData();
  //   }
  // }

  onLeadSubSourceSelect(event: any) {
    this.projectId = this.formData.value.projectId;
    this.leadSubSourceId = event.value;
    this.subSourceControl.patchValue(event.value);
    this.subSourceControl.markAsTouched();
    this.subSourceControl.updateValueAndValidity();

    const lead = this.allLeads.find(
      (lead: any) =>
        lead.sourceId === this.leadSourceId &&
        lead.subSourceId === this.leadSubSourceId
    );
    if (lead !== null && lead !== undefined) {
      this.lead = lead;
      this.patchFormWithLeadData();
    } else if (event.value === this.cpWalkInSubSource.leadSubSourceId) {
      this.leadSubSourceId = this.cpWalkInSubSource.leadSubSourceId;
      this.lead = { ...this.allLeads[0] };
      this.lead.sourceId = this.leadSourceId;
      this.lead.subSourceId = this.leadSubSourceId;
      this.formData.patchValue({
        assignedToPreSales: this.lead.assignedToPreSales,
      });
      this.formData.patchValue({
        name: this.lead.name,
      });
      this.formData.patchValue({ sourceId: this.lead.sourceId });
      this.formData.patchValue({ subSourceId: this.lead.subSourceId });
      this.formData.patchValue({ id: '' });
      this.isAdding = true;
    }
    console.log(this.leadSubSources);
    this.patchSubSource(this.leadSubSources);
  }
  patchSubSource(subSources: any) {
    const selectedSubSource = subSources.find(
      (s: any) => s.leadSubSourceId === this.lead.subSourceId
    );
    this.subSourceControl.patchValue(selectedSubSource ?? null);
    this.subSourceControl.disable();
    // this.isSourceDisabled = true;
    // this.formData.get('sourceId')?.disable();
  }
  fetchLeadSubSources(sourceId: any) {
    console.log(sourceId);
    if (sourceId > 0) {
      this.formData.get('sourceId')?.disable({ emitEvent: false });
    }
    const selectedSource = this.dialogSources.find(
      (source) => source.leadSourceId === sourceId
    );

    if (selectedSource?.name.toLowerCase() === 'channel partner') {
      this.leadSubsourceService
        .fetchBySourceIdAndRefName(sourceId, 'CP-Walk-In')
        .subscribe((data) => {
          this.cpWalkInSubSource = data;
          if (data) {
            this.leadSubSources.push(data);
          }
        });
    }

    this.leadSourceId = sourceId;
    this.leadSubSources = this.dialogSubSources.filter(
      (ele: any) => ele.sourceId === sourceId
    );
  }
  addAsNewLead() {
    this.openDialog = false;
    this.clearForm(true);
  }

  openDialogOnClick() {
    this.openDialog = true;
  }

  shouldDisableSource(): boolean {
    const userRole = this.user.roleName.toLowerCase();

    // If user is a Presales Manager and lead is assigned to sales, disable source
    if (userRole === 'presales manager' && this.lead.assignedToSales > 0) {
      return true;
    }

    // If source is already set and not in "adding" mode, disable for sales & presales members
    const isRestrictedRole =
      userRole === 'sales member' || userRole === 'presales member';
    return this.dbLeadSourceId > 0 && !this.isAdding && isRestrictedRole;
  }

  shouldDisableSubSource(): boolean {
    const userRole = this.user.roleName.toLowerCase();
    if (userRole === 'presales manager' && this.lead.assignedToSales > 0) {
      return true;
    }
    const isRestrictedRole =
      userRole === 'sales member' || userRole === 'presales member';
    return this.dbLeadSubSourceId > 0 && !this.isAdding && isRestrictedRole;
  }
  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }
}
