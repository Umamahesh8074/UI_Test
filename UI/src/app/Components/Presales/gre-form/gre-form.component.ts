import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { CommonReferenceType } from 'src/app/Models/CommanModel/menuDto';
import { LeadSource } from 'src/app/Models/Presales/leadsource';
import { LeadSubSource } from 'src/app/Models/Presales/leadsubsource';
import { ISiteVisit, SiteVisit } from 'src/app/Models/Presales/siteVisit';
import { IProject } from 'src/app/Models/Project/project';
import { User } from 'src/app/Models/User/User';
import { IUserDto } from 'src/app/Models/User/UserDto';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LeadsCommonService } from 'src/app/Services/CommanService/leads-common.service';
import { LeadService } from 'src/app/Services/Presales/Leads/lead.service';
import { LeadSourceService } from 'src/app/Services/Presales/LeadSource/lead-source.service';
import { LeadSubsourceService } from 'src/app/Services/Presales/LeadSubSource/lead-subsource.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { UsermanageService } from 'src/app/Services/UserManageService/usermanage.service';
import { CommonreferencedetailsService } from 'src/app/Services/UserService/commonreferencedetails.service';
import { UserService } from 'src/app/Services/UserService/userservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gre-form',
  templateUrl: './gre-form.component.html',
  styleUrls: ['./gre-form.component.css'],
})
export class GreFormComponent {
  @ViewChild(MatDatepicker) datepicker!: MatDatepicker<any>;
  isAdding: boolean = true;
  formData!: FormGroup;
  destroy$ = new Subject<void>();
  flatTypes: any[] = [];
  sources: any[] = [];
  subSources: LeadSubSource[] = [];
  users: User[] = [];
  siteVisit: ISiteVisit = new SiteVisit();
  user: User = new User();
  organizationId: number = 0;
  filteredBudgets: CommonReferenceType[] = [];
  totalBudgets: CommonReferenceType[] = [];
  budgetType: string = 'Budget_Type';
  countryCodes: CommonReferenceType[] = [];
  filteredCountries: CommonReferenceType[] = this.countryCodes;
  isView: boolean = false;
  countryCodeType: string = 'Country_Code';
  lead: any;
  uniqueLead: any;
  isSiteVisit = true;
  assignedTo: any;
  projectName: string = '';
  projectId: any;
  projects: any;
  project: any = new FormControl({} as IProject);
  walkInSourceId: any;
  unitTypes: any;
  sourceDisable = true;
  leadStatus: string = 'Lead_Status';
  moduleNames: string[] = [];
  leadStatusList: any;
  isLostStatus: boolean = false;
  lostStatusList: CommonReferenceType[] = [];
  lostStatus: string = 'Lost_Status';
  isReasonOthers: boolean = false;
  filteredAddresses: any;
  pincode: string = '';
  dbLeadSubSourceId: number = 0;
  leadSubSourceIds: number[] = [];
  @ViewChild('homeLocationInput') homeLocationInput!: ElementRef;
  saleMember = new FormControl<IUserDto | null | any>(
    null,
    Validators.required
  );
  saleMemberSearchText: string | any = '';
  allLeads: any;
  filteredSources: LeadSource[] = [];
  leadSourceIds: number[] = [];
  dialogSubSources: LeadSubSource[] = [];
  dialogSources: LeadSource[] = [];
  leadSubSources: LeadSubSource[] = [];
  leadSourceId: number = 0;
  leadSubSourceId: any;
  phoneNumber: any;
  isDisplayDialog: boolean = false;
  subSourceControl = new FormControl<LeadSubSource | null>(null, [
    Validators.required,
  ]);
  filteredSubSources: any = [];
  cpWalkInSubSource: LeadSubSource = new LeadSubSource(0, '', 0, '', '');
  isLeadExists: boolean = false;
  isAddAsCpWalkIn: boolean = false;
  isAddNewLead: boolean = false;
  isDisablePhoneNum: boolean = false;
  isDisableProject: boolean = false;
  isDisableCountryCode: boolean = false;
  countryCode: string = '';
  leadTypes: CommonReferenceType[] = [];
  leadType: string = 'Lead_Type';
  constructor(
    private formBuilder: FormBuilder,
    private route: Router,
    private commanService: CommanService,
    private leadSource: LeadSourceService,
    private leadService: LeadService,
    private userService: UserService,
    private commonService: CommanService,
    private projectService: ProjectService,
    private userManageService: UsermanageService,
    private leadSourceService: LeadSourceService,
    private commonRefDetailService: CommonreferencedetailsService,
    private leadSubsourceService: LeadSubsourceService,
    private leadCommonService: LeadsCommonService
  ) {
    this.getFlatTypes();
  }

  ngOnInit(): void {
    this.getSources();
    this.initializeForm();
    this.getWalkInSourceId();
    this.fetchUnitTypes();
    this.fetchLeadTypes();

    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
      this.organizationId = this.user.organizationId;

      // this.getUserManageByUserId();

      this.fetchProjects();
      this.moduleNames = ['S', 'PS'];
      this.fetchLeadStatusList();
    }
    console.log(history.state);

    this.fetchBudgetTypes();
    this.fetchCountryCodes();
    this.initializeState();
    // Subscribe to value changes of the phoneNumber form control
    this.formData.get('phoneNumber')?.valueChanges.subscribe((value) => {
      // Trim leading and trailing spaces
      const trimmedValue = value?.trim();

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
        const role = this.user.roleName.toLocaleLowerCase();
        this.phoneNumber = phoneNumber;
        if (this.projectId > 0 && phoneNumber.length >= 5) {
          // this.fetchLeadByPhoneNumberAndProject();
        }
      });
    // this.formData.get('pincode')?.valueChanges.subscribe((pincode: string) => {
    //   this.onSearchPinCode(pincode);
    // });

    // // Listen for changes to the homeLocation field
    // this.formData.get('homeLocation')?.valueChanges.subscribe((location: string) => {
    //   if (this.pincode) {
    //     this.onChangeAddress(location);
    //   }
    // });
  }

  initializeState() {
    const state = history.state;
    if (history.state.leadId > 0) {
      this.fetchLead(history.state.leadId);
    } else if (this.user.userId > 0) {
      this.fetchSalesUserAndPatch(this.user.userId);
    }
    if (state.phoneNumber.length > 0 && state.projectId > 0) {
      this.formData.patchValue({
        phoneNumber: state.phoneNumber,
      });
      this.isDisablePhoneNum = true;
      this.project.disable();

      this.fetchProjectById(state.projectId);
    }
    if (state.isAddAsCpWalkIn === true) {
      this.isAddAsCpWalkIn = state.isAddAsCpWalkIn;
    } else if (state.isAddNewLead === true) {
      // add walk-in and direct default
      this.isAddNewLead = state.isAddNewLead;
    }
    this.fetchSourcesAndPatch();
    // if (state.countryCode.length > 0) {
    this.formData.patchValue({ countryCode: state.countryCode });
    this.isDisableCountryCode = true;
    // }
  }

  initializeForm() {
    this.formData = this.formBuilder.group({
      id: [0],
      name: ['', Validators.required],
      // phoneNumber: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      phoneNumber: ['', [Validators.required]],
      alternatePhoneNumber: ['', [Validators.pattern('[0-9]{10}')]],
      email: ['', [Validators.email]],
      gender: [''],
      sourceId: ['', Validators.required],
      subSourceId: ['', Validators.required],
      pincode: ['', Validators.required],
      designation: [''],
      companyName: [''],
      typeId: [null],
      statusId: [0],
      budget: [''],
      preferredFlatType: [''],
      remarks: [''],
      projectId: [],
      referredCustomerProjectId: [''],
      customerUnitName: [0],
      referredEmployeeId: [''],
      referredEmployeeName: [''],
      assignedToPreSales: [0],
      assignedToSales: [, Validators.required],
      homeLocation: [''],
      workLocation: [''],
      countryCode: [''],
      language: [''],
      subStatusId: [0],
      unit: [''],
      followupDate: [],
      isExpired: [],
      expiryDate: [],
      starCount: [],
      isRegisteredWithAnotherProject: [],
      isSiteVisitDoneInAnotherProject: [],
      isAcquiredLead: [''],
    });

    // console.log('Form Data ', this.formData.value);
  }

  save() {
    this.formData.patchValue({ projectId: this.projectId });
    this.formData.patchValue({ isAcquiredLead: 'Y' });
    console.log(this.formData.value);
    if (
      this.formData.valid &&
      this.formData.value.assignedToSales > 0 &&
      this.formData.value.sourceId > 0 &&
      this.formData.value.subSourceId
    ) {
      this.leadCommonService.showLoading();
      const formDataCopy = { ...this.formData.value };
      // console.log(formDataCopy);
      formDataCopy.phoneNumber = `${formDataCopy.countryCode} ${formDataCopy.phoneNumber}`;

      if (this.isAdding) {
        formDataCopy.id = '';
        this.leadService
          .saveLead(formDataCopy, this.isSiteVisit)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              this.leadCommonService.hideLoading();
              this.handleSuccessResponse(response);
              this.clearForm();
            },
            error: (err) => {
              this.leadCommonService.hideLoading();
              console.error('Error saving lead:', err);
              this.handleErrorResponse(err);
            },
          });
      } else {
        this.leadService
          .updateLead(formDataCopy, this.isSiteVisit)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              this.leadCommonService.hideLoading();
              this.handleSuccessResponse(response);
              this.clearForm();
              this.goToLeads();
            },
          });
      }
    } else {
      Object.keys(this.formData.controls).forEach((key: string) => {
        const control = this.formData.get(key); // Use get() for safer access

        if (control) {
          control.markAsTouched();

          if (control.errors) {
            console.error(`Field: ${key}, Errors:`, control.errors);
          }
        }
      });
      console.error('Invalid form');
    }
    this.subSourceControl.markAsTouched();
  }

  getFlatTypes() {
    const refType = 'Flat_Type';
    this.commanService
      .getRefDetailsByType(refType)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.flatTypes = response;
        },
      });
  }

  getSources(isDisplayWalkin?: boolean) {
    // alert(isDisplayWalkin);
    this.leadSource
      .fetchAllLeadSources()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.sources = response;
          this.filteredSources = this.sources;
        },
      });
  }

  goToLeads() {
    const state = {
      phoneNumber: history.state.phoneNumber,
      projectId: history.state.projectId,
      countryCode: history.state.countryCode,
    };
    this.route.navigate(['layout/search/lead'], { state });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSelectSource(sourceId: number) {
    this.subSourceControl.setValue(null);
    this.formData.patchValue({ subSourceId: 0 });
    this.fetchSubSources(sourceId);
  }
  fetchSubSources(sourceId: number, isWalkIn?: boolean): Promise<void> {
    return new Promise((resolve, reject) => {
      this.leadService.fetchLeadSubSources(sourceId).subscribe({
        next: (subSources) => {
          this.subSources = subSources;
          this.filteredSubSources = this.subSources;
          // TO PATCH DIRECT SUB SOURCE
          // if (this.subSources && isWalkIn) {
          //   const directSubSource = this.subSources.find(
          //     (sub) => sub.name === 'Direct'
          //   );
          //   console.log(directSubSource);
          //   const directSubSourceId = directSubSource?.leadSubSourceId;
          //   alert(directSubSourceId);
          //   if (directSubSourceId && directSubSourceId > 0) {
          //     this.formData.get('subSourceId')?.patchValue(directSubSourceId);
          //   }
          // }
          resolve(); // Resolves when data is assigned
        },
        error: (error) => {
          console.error('Error fetching lead sub-sources:', error);
          reject(error);
        },
      });
    });
  }

  getUsers(organizationId: number) {
    this.userManageService
      .getUsers('S', organizationId, this.projectId, this.saleMemberSearchText)
      .subscribe({
        next: (users) => {
          this.users = users;
        },
        error: (error) => {
          console.error('Error fetching lead sub-sources:', error);
        },
      });
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
    //this.initForm();
    this.commonService.getRefDetailsByType(this.countryCodeType).subscribe({
      next: (countryCodes) => {
        this.countryCodes = countryCodes;
        // const india = this.countryCodes.find(
        //   (country) => country.commonRefValue === 'India'
        // );
        // if (india) {
        //   this.formData.get('countryCode')?.setValue(india.commonRefKey);
        // }

        this.filteredCountries = countryCodes;
      },
      error: (error) => {
        console.error('Error fetching lead types:', error);
      },
    });
  }

  // fetchLeadByPhoneNumberAndProject(): void {
  //   const countryCode = this.formData.get('countryCode')?.value;
  //   const phoneNumber = this.formData.get('phoneNumber')?.value;
  //   const fullPhoneNumber = `${countryCode} ${phoneNumber}`;
  //   const encodedPhoneNumber = encodeURIComponent(fullPhoneNumber);
  //   // this.subSourceControl.setValue(null);
  //   this.leadSourceIds = [];
  //   this.leadSubSourceIds = [];
  //   this.dialogSources = [];
  //   this.leadSubSources = [];
  //   this.leadService
  //     .getLeadByPhoneNumberAndProjectId(encodedPhoneNumber, this.projectId)
  //     .subscribe({
  //       next: (data: any) => {
  //         this.allLeads = data.leads;
  //         if (this.allLeads.length > 0) {
  //           this.isLeadExists = true;
  //         }

  //         this.uniqueLead = this.allLeads.find(
  //           (lead: any) => lead?.isAcquiredLead?.toLowerCase() === 'y'
  //         );

  //         if (this.uniqueLead !== undefined && this.uniqueLead !== null) {
  //           this.lead = this.uniqueLead;
  //           if (this.uniqueLead.subSourceId > 0) {
  //             this.dbLeadSubSourceId = this.uniqueLead.subSourceId;
  //           }
  //           if (data.salesPerson !== undefined) {
  //             Swal.fire({
  //               title: 'Error',
  //               text: `Lead Already Exists and assigned to sales ${data.salesPerson}`,
  //               icon: 'error',
  //               confirmButtonText: 'OK',
  //               allowOutsideClick: false,
  //             }).then((result) => {
  //               if (result.isConfirmed) {
  //                 // Add any actions here if needed
  //               }
  //             });
  //           }
  //           this.patchFormWithLeadData();
  //         } else {
  //           const selectedProjectLead = data.leads.find(
  //             (lead: any) => lead.projectId === this.projectId
  //           );
  //           // this.projectName = selectedProjectLead.assign;
  //           if (data.leads.length > 0) {
  //             this.isDisplayDialog = true;
  //             data.leads.forEach((lead: any) => {
  //               this.leadSubSourceIds.push(lead.subSourceId);
  //             });

  //             data.leads.forEach((lead: any) => {
  //               this.leadSourceIds.push(lead.sourceId);
  //             });

  //             this.fetchExistSubSources();
  //             this.fetchExistSources();
  //           }
  //         }
  //       },
  //       error: (error: any) => {
  //         console.error('Error fetching lead data:', error);
  //         this.formData.patchValue({
  //           sourceId: null,
  //           subSourceId: null,
  //           countryCode: this.formData.get('countryCode')?.value,
  //         });
  //         this.saleMember.reset();
  //         this.dbLeadSubSourceId = 0;
  //         this.formData.get('countryCode')?.value;
  //         this.isDisplayDialog = false;
  //         this.subSourceControl.reset();
  //         this.subSourceControl.enable();
  //         this.filteredSubSources = [];
  //         this.subSources = [];
  //         this.isSourceDisabled = false;
  //         this.isAdding = true;
  //         this.lead.assignedToSales = 0;
  //         this.lead.id = '';
  //         this.formData.patchValue({ assignedToSales: 0 });
  //         this.formData.patchValue({ remarks: '' });
  //         this.getWalkInSourceId();
  //         // this.formData.reset({
  //         //   // sourceId: this.formData.get('sourceId')?.value,
  //         //   phoneNumber: this.formData.get('phoneNumber')?.value,
  //         //   countryCode: this.formData.get('countryCode')?.value,
  //         // });
  //       },
  //       complete: () => {
  //         console.log('Lead data fetch completed.');
  //       },
  //     });
  // }

  private patchFormWithLeadData(): void {
    this.leadCommonService.showLoading();
    this.filteredSources = this.sources;
    console.log('Lead data', this.lead);
    if (!this.lead) {
      return;
    }

    this.isAdding = false;
    console.log('is Adding ', this.isAdding);
    const phoneNumber = this.lead.phoneNumber?.trim() || '';

    if (phoneNumber) {
      // Split the phone number into country code and actual number
      const phoneParts = phoneNumber.match(/^(\+\d{1,3})\s*(\d+)$/);
      if (phoneParts) {
        const countryCode = phoneParts[1]?.trim();
        const phoneNumber = phoneParts[2].trim();
        // Patch the form with all the data
        this.formData.patchValue({
          ...this.lead,
          phoneNumber: phoneNumber ?? '',
          countryCode: countryCode ?? '',
          remarks: '',
        });
        this.formData.patchValue({ sourceId: this.lead.sourceId });
        // if (this.lead.subSourceId > 0) {
        //   this.dbLeadSubSourceId = this.lead.subSourceId;
        // }

        this.projectService.getProjectById(this.lead.projectId).subscribe({
          next: (project) => {
            this.leadCommonService.hideLoading();
            this.projectId = this.lead.projectId;
            this.project.patchValue(project);
            this.getUsers(this.organizationId);
          },
          error: (error) => {
            this.leadCommonService.hideLoading();
            console.error('Error fetching projects:', error);
          },
        });
        if (this.user.userId > 0) {
          this.fetchSalesUserAndPatch(this.user.userId);
        }
        this.fetchDataSequentially();
      }
    }
  }

  async fetchDataSequentially() {
    await this.fetchSubSources(this.lead.sourceId);
    await this.patchSubSource(this.subSources);
  }

  isSourceDisabled: boolean = false;
  patchSubSource(subSources: any) {
    const selectedSubSource = subSources.find(
      (s: any) => s.leadSubSourceId === this.lead.subSourceId
    );
    this.subSourceControl.patchValue(selectedSubSource ?? null);
    // console.log(selectedSubSource);
    // console.log('Control Value:', this.subSourceControl.value);
    // alert('Is Valid: ' + this.subSourceControl.valid);
    if (selectedSubSource === undefined || selectedSubSource == null) {
      this.subSourceControl.enable();
    } else {
      this.subSourceControl.disable();
    }
    this.isSourceDisabled = true;
    // this.formData.get('sourceId')?.disable();
  }
  private handleSuccessResponse(response: any): void {
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: response.message,
      timerProgressBar: true,
      showConfirmButton: false,
    });

    this.goToLeads();
  }

  private handleErrorResponse(error: any): void {
    console.error('Error saving/updating lead:', error.error.message);

    Swal.fire({
      icon: 'error',
      title: 'Oops!',
      text: error.error.message,
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
    });

    // Optionally, navigate after delay
    // setTimeout(() => this.goToLeads(), 3000);
  }

  displayProject(project: IProject): string {
    return project && project.projectName ? project.projectName : '';
  }

  onProjectSelect(event: any) {
    this.projectId = event.option.value.projectId;
    if (this.projectId > 0) {
      this.getUsers(this.organizationId);
    }
    if (this.projectId > 0 && this.phoneNumber.length > 4) {
      this.formData.patchValue({ projectId: this.projectId });
      // this.fetchLeadByPhoneNumberAndProject();
    }
  }

  fetchProjects() {
    this.projectService
      .getAllProjects(this.projectName, 0, 100, 'Y', this.user.organizationId)
      .subscribe({
        next: (projects) => {
          this.projects = projects.records;
        },
        error: (error) => {
          console.error('Error fetching projects:', error);
        },
      });
  }

  searchProject(event: any) {
    if (event.target.value.length >= 3) {
      this.projectName = event.target.value;
      this.fetchProjects();
    } else {
      this.projectName = '';
      this.fetchProjects();
    }
  }

  getWalkInSourceId() {
    this.leadSourceService.fetchSourecByName('Walk-In').subscribe({
      next: (response: any) => {
        this.walkInSourceId = response.leadSourceId;
        this.formData.get('sourceId')?.patchValue(response.leadSourceId);
        this.fetchSubSources(response.leadSourceId, true);
      },
      error: (error) => console.error(error),
    });
  }

  fetchUnitTypes() {
    this.leadService.fetchAllUnitTypes().subscribe({
      next: (unitTypes) => {
        this.unitTypes = unitTypes;
      },
      error: (error) => {
        console.error('Error fetching unit types:', error);
      },
    });
  }

  // getUserManageByUserId() {
  //   this.userManageService.getUserManage(this.user.userId).subscribe({
  //     next: (userManage) => {
  //       if (userManage) {
  //         this.projectId = userManage[0].projectId;
  //         this.projectService
  //           .getProjectById(userManage[0].projectId)
  //           .subscribe({
  //             next: (project) => {
  //               this.getUsers(this.organizationId);
  //               this.project.patchValue(project);
  //               this.formData.get('projectId')?.patchValue(project.projectId);
  //             },
  //             error: (error) => {
  //               console.error('Error fetching projects:', error);
  //             },
  //           });
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Error fetching unit types:', error);
  //     },
  //   });
  // }
  fetchLeadStatusList(): void {
    this.commonRefDetailService
      .fetchLeadStatusListByRole(this.leadStatus, this.moduleNames)
      .subscribe({
        next: (types) => {
          this.leadStatusList = types;
          this.leadStatusList = types.filter(
            (status: any) => status.commonRefValue !== 'Booked'
          );
        },
        error: (error) => {
          console.error('Error fetching lead types:', error);
        },
      });
  }

  fetchLostStatusList(statusId: number) {
    const selectedStatus = this.leadStatusList.find(
      (status: any) => status.id === statusId
    );
    if (selectedStatus) {
      if (selectedStatus.commonRefValue.toLocaleLowerCase().includes('lost')) {
        this.isLostStatus = true;

        this.commonService.getRefDetailsByType(this.lostStatus).subscribe({
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
  onSearchPinCode(pincode: string) {
    if (pincode.length === 6) {
      this.pincode = pincode;
      this.filteredAddresses = []; // Reset the addresses

      // Reset the homeLocation field value
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
    if (this.pincode !== '' && location.length > 3 && location.length < 15) {
      this.leadService.getAddressByPinCode(this.pincode, location).subscribe(
        (data: any) => {
          // Check if `data` is a plain object
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
    }
  }
  displayUser(user: User): string {
    return user && user.userName ? user.userName : '';
  }
  onSaleMemberSelect(userDto: any) {
    this.formData
      .get('assignedToSales')
      ?.patchValue(userDto.option.value.userId);
  }

  onUserSearch(saleMemberSearchText: string) {
    this.saleMemberSearchText = saleMemberSearchText;
    if (this.saleMemberSearchText.length >= 3) {
      this.getUsers(this.organizationId);
    }
    if (!this.saleMemberSearchText) {
      this.getUsers(this.organizationId);
    }
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

  onSelectSubSource(event: any): void {
    const lead = this.allLeads.find(
      (lead: any) => lead.subSourceId === event.value
    );
    this.formData.patchValue({ id: lead.id });
    this.formData.value.subSourceId = lead.subSourceId;
    console.log(this.formData.value.id + ': Lead Id');
  }

  fetchExistSources() {
    if (this.leadSourceIds.length > 0) {
      this.dialogSources = this.sources.filter((ele) => {
        return this.leadSourceIds.includes(ele.leadSourceId);
      });
    }
    console.log('Existed lead sources', this.dialogSources);
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
      },
      error: (error: any) => {
        console.error('Error fetching lead sub sources:', error);
      },
    });
    console.log('Existed lead sub sources', this.dialogSubSources);
  }

  fetchLeadSubSources(sourceId: any) {
    const selectedSource = this.dialogSources.find(
      (source) => source.leadSourceId === sourceId
    );

    if (selectedSource?.name.toLowerCase() === 'channel partner') {
      this.leadSubsourceService
        .fetchBySourceIdAndRefName(sourceId, 'CP-Walk-In')
        .subscribe((data) => {
          this.cpWalkInSubSource = data;
          if (data) {
            this.leadSubSources.push(data); // Ensure data is correctly added
          }
        });
    }
    this.leadSourceId = sourceId;
    this.formData.patchValue({ sourceId: sourceId });
    this.leadSubSources = this.dialogSubSources.filter(
      (ele: any) => ele.sourceId === sourceId
    );
  }

  // resetForm(): void {
  //   this.subSources = [];

  //   this.formData.reset({
  //     countryCode: this.formData.get('countryCode')?.value,
  //     phoneNumber: this.formData.get('phoneNumber')?.value,
  //     sourceId: this.formData.get('sourceId')?.value,
  //     subSourceId: this.formData.get('subSourceId')?.value,
  //     id: this.formData.get('id')?.value,
  //     isExpired: this.formData.get('isExpired')?.value,
  //   });
  //   this.getSources(false);

  //   this.saleMember.reset();
  //   this.isDisplayDialog = false;
  //   this.lead.assignedToSales = 0;
  //   console.log(this.formData.value);
  // }

  resetForm(): void {
    // List of fields you want to reset
    const fieldsToReset = [
      'budget',
      'preferredFlatType',
      'pincode',
      'homeLocation',
      'assignedToSales',
    ];

    // Store current values of all fields
    const currentValues = this.formData.value;

    // Create a new object excluding fields to reset
    const retainedValues = Object.keys(currentValues)
      .filter((key) => !fieldsToReset.includes(key))
      .reduce((obj, key) => {
        obj[key] = currentValues[key];
        return obj;
      }, {} as any);

    // Reset the form completely
    this.formData.reset();

    // Patch back only the retained values
    this.formData.patchValue(retainedValues);

    // Additional cleanup
    this.subSources = [];
    this.getSources(false);
    this.saleMember.reset();
    this.isDisplayDialog = false;
    this.lead.assignedToSales = 0;

    console.log(this.formData.value);
  }

  searchSubSource(event: any) {
    const searchTerm = event.target.value.toLowerCase(); // Convert input to lowercase

    if (searchTerm.length >= 3) {
      this.filteredSubSources = this.subSources.filter(
        (s) => s.name.toLowerCase().includes(searchTerm) // Case-insensitive search
      );
    } else if (searchTerm.length === 0) {
      this.filteredSubSources = [...this.subSources]; // Reset to original list
    }
  }

  onSubSourceSelect(event: any) {
    const subSourceId = event.option.value.leadSubSourceId;
    if (subSourceId && subSourceId > 0) {
      this.formData.patchValue({ subSourceId: subSourceId });
    }
  }

  displaySubSource(source: any): string {
    return source && source?.name ? source.name : '';
  }

  fetchLead(leadId: number) {
    this.leadService.fetchLead(leadId).subscribe({
      next: (response) => {
        this.lead = response;
        this.patchFormWithLeadData();
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('Lead data fetch completed.');
      },
    });
  }

  fetchProjectById(projectId: number) {
    this.projectService.getProjectById(projectId).subscribe({
      next: (project) => {
        this.projectId = projectId;
        this.project.patchValue(project);
        this.getUsers(this.organizationId);
      },
      error: (error) => {
        console.error('Error fetching projects:', error);
      },
    });
  }

  fetchSourcesAndPatch(isDisplayWalkin?: boolean) {
    this.leadSource
      .fetchAllLeadSources()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.sources = response;
          this.filteredSources = this.sources;
          if (this.isAddAsCpWalkIn === true) {
            let source = this.sources.find((source) => {
              return source.name.toLowerCase() === 'channel partner';
            });
            this.formData.patchValue({ sourceId: source.leadSourceId });
            this.isSourceDisabled = true;

            this.fetchSubSOurceAndPatch('cp-walk-in');
          } else if (this.isAddNewLead === true) {
            let source = this.sources.find((source) => {
              return source.name.toLowerCase() === 'walk-in';
            });
            this.formData.patchValue({ sourceId: source.leadSourceId });
            // this.isSourceDisabled = true;
            this.fetchSubSOurceAndPatch('direct', false);
          }
        },
      });
  }

  async fetchSubSOurceAndPatch(
    checkSubSource: string,
    isDisableSubSource?: boolean
  ) {
    await this.fetchSubSources(this.formData.value.sourceId);

    const cpWalkInSubSource = this.subSources.find((subSource) => {
      const fundSubSource = subSource.refName?.toLowerCase();
      return fundSubSource === checkSubSource;
    });

    // alert(cpWalkInSubSource?.leadSubSourceId);

    if (cpWalkInSubSource) {
      this.formData.patchValue({
        subSourceId: cpWalkInSubSource.leadSubSourceId,
      });
      this.subSourceControl.patchValue(cpWalkInSubSource);
      this.subSourceControl.disable();
      if (isDisableSubSource === false) {
        this.subSourceControl.enable();
      }
    }
  }

  clearForm(isNotClearNum?: boolean): void {
    this.subSources = [];
    this.isAdding = true;

    if (isNotClearNum === true) {
      this.formData.reset({
        countryCode: this.formData.get('countryCode')?.value,
        phoneNumber: this.formData.get('phoneNumber')?.value,
      });
      this.getSources(false);
    } else {
      this.formData.reset({
        countryCode: this.formData.get('countryCode')?.value,
      });
      this.project.reset();
      this.project.setValue(null);
      this.project.patchValue(null);
      this.projectId = 0;
      this.saleMember.reset();
      this.isDisplayDialog = false;
      this.lead = null;
    }
    this.subSourceControl.reset();
    this.subSourceControl.enable();
    this.formData.get('sourceId')?.enable();
    this.isSourceDisabled = false;
    this.isAdding = true;
    this.lead.assignedToSales = '';
    console.log(this.formData.value);
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

  fetchSalesUserAndPatch(userId: number) {
    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        this.saleMember.patchValue(user);
        this.saleMember.disable();
        this.formData.patchValue({ assignedToSales: userId });
      },
      error: (error) => {
        console.error('Error fetching projects:', error);
      },
    });
  }
}
