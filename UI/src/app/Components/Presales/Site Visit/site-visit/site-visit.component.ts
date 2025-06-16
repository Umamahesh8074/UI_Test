import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
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
  selector: 'app-site-visit',
  templateUrl: './site-visit.component.html',
  styleUrls: ['./site-visit.component.css'],
})
export class SiteVisitComponent implements OnInit {
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
  project: FormControl<IProject | null | any> = new FormControl(
    null,
    Validators.required
  );

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
  openDialog: boolean = false;
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
    private toastrService: ToastrService,
    private projectService: ProjectService,
    private userManageService: UsermanageService,
    private leadSourceService: LeadSourceService,
    private commonRefDetailService: CommonreferencedetailsService,
    private leadSubsourceService: LeadSubsourceService,
    private leadCommonService: LeadsCommonService
  ) {
    this.getFlatTypes();
    this.getSources(true);
  }

  ngOnInit(): void {
    this.initializeForm();
    this.getWalkInSourceId();
    this.fetchUnitTypes();
    this.fetchLeadTypes();
    const user = localStorage.getItem('user');

    if (user) {
      this.user = JSON.parse(user);
      this.organizationId = this.user.organizationId;
      if (this.isAdding) {
        // this.getUserManageByUserId();
      }
      this.fetchProjects();
      this.moduleNames = ['S', 'PS'];
      this.fetchLeadStatusList();
    }

    this.siteVisit = history.state.lead;
    this.isAdding = !this.siteVisit;
    if (history.state.isView != undefined) {
      this.siteVisit = history.state.isView;
    }
    this.siteVisit = history.state.sitevisit;
    console.log(history.state.sitevisit);

    this.fetchBudgetTypes();
    this.fetchCountryCodes();
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
        const role = this.user.roleName.toLocaleLowerCase();
        this.phoneNumber = phoneNumber;
        if (this.projectId > 0 && phoneNumber.length >= 5) {
          this.fetchLeadByPhoneNumberAndProject();
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

  initializeForm() {
    this.formData = this.formBuilder.group({
      id: [0],
      name: ['', Validators.required],
      // phoneNumber: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern(/^[6789]\d{9}$/)],
      ],
      alternatePhoneNumber: ['', [Validators.pattern('[0-9]{10}')]],
      email: ['', [Validators.email]],
      gender: [''],
      sourceId: ['', Validators.required],
      subSourceId: ['', Validators.required],
      pincode: [''],
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
    });

    console.log('Form Data ', this.formData.value);
  }

  save() {
    this.formData.patchValue({ projectId: this.projectId });
    console.log(this.formData.value);
    this.formData.patchValue({ isAcquiredLead: 'Y' });
    if (
      this.formData.valid &&
      this.formData.value.assignedToSales > 0 &&
      this.formData.value.sourceId > 0 &&
      this.formData.value.subSourceId
    ) {
      this.leadCommonService.showLoading();
      const formDataCopy = { ...this.formData.value };
      console.log(formDataCopy);
      formDataCopy.phoneNumber = `${formDataCopy.countryCode} ${formDataCopy.phoneNumber}`;

      if (this.isAdding) {
        formDataCopy.id = '';
        this.leadService
          .saveLead(formDataCopy, this.isSiteVisit)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              this.leadCommonService.hideLoading();
              this.leadCommonService.handleSuccessResponse(response);
              this.clearForm();
              this.goToLeads();
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
              this.leadCommonService.handleSuccessResponse(response);
              this.clearForm();
              this.goToLeads();
            },
            error: (err) => {
              this.leadCommonService.hideLoading();
              console.error('Error saving lead:', err);
              this.handleErrorResponse(err);
            },
          });
      }
    } else {
      this.formData.markAllAsTouched();
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

  // clearForm() {
  //   this.formData.reset({
  //     countryCode: this.formData.get('countryCode')?.value,
  //   });
  //   this.project.reset();
  //   this.saleMember.reset();
  // }
  goToLeads() {
    this.route.navigate(['layout/walk_in/leads']);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  // fetchSubSources(sourceId: number): void {
  //   alert(sourceId);
  //   this.leadService.fetchLeadSubSources(sourceId).subscribe({
  //     next: (subSources) => {
  //       this.subSources = subSources;
  //       console.log(subSources);

  //       this.filteredSubSources = this.subSources;
  //       // if (this.leadSubSourceIds.length > 0) {
  //       //   this.subSources = this.subSources.filter((ele) => {
  //       //     return !this.leadSubSourceIds.includes(ele.leadSubSourceId);
  //       //   });
  //       // }
  //     },
  //     error: (error) => {
  //       console.error('Error fetching lead sub-sources:', error);
  //     },
  //   });
  // }

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
          if (this.subSources && isWalkIn) {
            const directSubSource = this.subSources.find(
              (sub) => sub.refName.toLowerCase() === 'direct'
            );
            console.log(directSubSource);
            const directSubSourceId = directSubSource?.leadSubSourceId;
            this.subSourceControl.patchValue(
              directSubSource ? directSubSource : null
            );
            this.subSourceControl.disable();
            this.isSourceDisabled = true;

            if (directSubSourceId && directSubSourceId > 0) {
              this.formData.get('subSourceId')?.patchValue(directSubSourceId);
            }
          }
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
        const india = this.countryCodes.find(
          (country) => country.commonRefValue === 'India'
        );
        if (india) {
          this.formData.get('countryCode')?.setValue(india.commonRefKey);
        }

        this.filteredCountries = countryCodes;
      },
      error: (error) => {
        console.error('Error fetching lead types:', error);
      },
    });
  }

  fetchLeadByPhoneNumberAndProject(): void {
    const countryCode = this.formData.get('countryCode')?.value;
    const phoneNumber = this.formData.get('phoneNumber')?.value;
    const fullPhoneNumber = `${countryCode} ${phoneNumber}`;
    const encodedPhoneNumber = encodeURIComponent(fullPhoneNumber);
    // this.subSourceControl.setValue(null);
    this.leadSourceIds = [];
    this.leadSubSourceIds = [];
    this.dialogSources = [];
    this.leadSubSources = [];
    this.leadService
      .getLeadByPhoneNumberAndProjectId(encodedPhoneNumber, this.projectId)
      .subscribe({
        next: (data: any) => {
          this.allLeads = data.leads;

          this.uniqueLead = this.allLeads.find(
            (lead: any) => lead?.isAcquiredLead?.toLowerCase() === 'y'
          );

          if (this.uniqueLead !== undefined && this.uniqueLead !== null) {
            this.lead = this.uniqueLead;
            if (this.uniqueLead.subSourceId > 0) {
              this.dbLeadSubSourceId = this.uniqueLead.subSourceId;
            }
            // if (this.uniqueLead.sourceId > 0) {
            //   this.dbLeadSourceId = this.uniqueLead.sourceId;
            // }
            if (data.salesPerson !== undefined) {
              Swal.fire({
                title: 'Error',
                text: `Lead Already Exists and assigned to sales ${data.salesPerson}`,
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
            const selectedProjectLead = data.leads.find(
              (lead: any) => lead.projectId === this.projectId
            );
            // this.projectName = selectedProjectLead.assign;
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
        },
        error: (error: any) => {
          // alert(error.error.message);
          console.error('Error fetching lead data:', error.error);
          this.formData.patchValue({
            sourceId: null,
            subSourceId: null,
            countryCode: this.formData.get('countryCode')?.value,
          });
          if (error.error.message.toLowerCase() === 'lead not found') {
            Swal.fire({
              title: 'Error!',
              text:
                error.error.message || 'An error occurred. Please try again.',
              icon: 'info',
              confirmButtonText: 'ok',
            });
          }
          this.saleMember.reset();
          this.dbLeadSubSourceId = 0;
          this.formData.get('countryCode')?.value;
          this.isDisplayDialog = false;
          this.subSourceControl.reset();
          this.subSourceControl.enable();
          this.filteredSubSources = [];
          this.subSources = [];
          this.isSourceDisabled = false;
          this.isAdding = true;
          this.formData.patchValue({ assignedToSales: 0 });
          this.formData.patchValue({ remarks: '' });
          this.getWalkInSourceId();
          this.lead.assignedToSales = 0;
          this.lead.id = '';
          // this.formData.reset({
          //   // sourceId: this.formData.get('sourceId')?.value,
          //   phoneNumber: this.formData.get('phoneNumber')?.value,
          //   countryCode: this.formData.get('countryCode')?.value,
          // });
        },
        complete: () => {
          console.log('Lead data fetch completed.');
        },
      });
  }

  private patchFormWithLeadData(): void {
    this.filteredSources = this.sources;
    console.log('Lead data', this.lead);
    if (!this.lead) {
      return;
    }

    this.isAdding = false;
    // this.isView = true;
    // console.log(this.isView + 'is view');
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
            this.projectId = this.lead.projectId;
            this.project.patchValue(project);
            this.getUsers(this.organizationId);
          },
          error: (error) => {
            console.error('Error fetching projects:', error);
          },
        });
        if (this.lead.assignedToSales > 0) {
          this.userService.getUserById(this.lead.assignedToSales).subscribe({
            next: (user) => {
              this.saleMember.patchValue(user);
            },
            error: (error) => {
              console.error('Error fetching projects:', error);
            },
          });
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
    console.log(selectedSubSource);
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
    this.toastrService.success('', response.message, {
      timeOut: 3000, // Set success timeout
    });
    // this.goToLeads();
  }

  private handleErrorResponse(error: any): void {
    console.error('Error saving/updating lead:', error.error.message);
    this.toastrService.error('', error.error.message, {
      timeOut: 3000, // Set error timeout
    });
    this.goToLeads();
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
      this.fetchLeadByPhoneNumberAndProject();
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

  getUserManageByUserId() {
    this.userManageService.getUserManage(this.user.userId).subscribe({
      next: (userManage) => {
        if (userManage) {
          this.projectId = userManage[0].projectId;
          this.projectService
            .getProjectById(userManage[0].projectId)
            .subscribe({
              next: (project) => {
                this.getUsers(this.organizationId);
                this.project.patchValue(project);
                this.formData.get('projectId')?.patchValue(project.projectId);
              },
              error: (error) => {
                console.error('Error fetching projects:', error);
              },
            });
        }
      },
      error: (error) => {
        console.error('Error fetching unit types:', error);
      },
    });
  }
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

  onUserSerach(saleMemberSearchText: string) {
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

  onDialogClose() {
    this.openDialog = false;
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

  onLeadSubSourceSelect(event: any) {
    console.log(this.formData.value);
    this.leadSubSourceId = event.value;
    // alert(this.leadSourceId);
    // alert(this.leadSubSourceId);

    // console.log(
    //   this.allLeads.forEach((lead: any) => {
    //     console.log(lead.subSourceId);
    //   })
    // );
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
    this.patchSubSource(this.leadSubSources);
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
  addAsNewLead() {
    this.openDialog = false;
    this.clearForm(true);
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
    this.lead.assignedToSales = 0;
    console.log(this.formData.value);
  }

  openDialogOnClick() {
    this.openDialog = true;
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
}
