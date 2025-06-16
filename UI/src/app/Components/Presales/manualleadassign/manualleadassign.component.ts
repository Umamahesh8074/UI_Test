import { formatDate } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { filter, Subject, takeUntil } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import { leadPageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { Lead } from 'src/app/Models/Presales/lead';
import { LeadSource } from 'src/app/Models/Presales/leadsource';
import { LeadSubSource } from 'src/app/Models/Presales/leadsubsource';
import { IProject, Project } from 'src/app/Models/Project/project';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';
import { IUser, User } from 'src/app/Models/User/User';
import { UserDto } from 'src/app/Models/User/UserDto';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LeadsCommonService } from 'src/app/Services/CommanService/leads-common.service';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { LeadService } from 'src/app/Services/Presales/Leads/lead.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { CommonreferencedetailsService } from 'src/app/Services/UserService/commonreferencedetails.service';
import { RoleService } from 'src/app/Services/UserService/role.service';
import { UserService } from 'src/app/Services/UserService/userservice.service';

@Component({
  selector: 'app-manualleadassign',
  templateUrl: './manualleadassign.component.html',
  styleUrls: ['./manualleadassign.component.css'],
})
export class ManualleadassignComponent {
  sourceId: any;
  subSourceId: any;
  referenceKey: any = 'P';
  targetUserId: any;
  sourceUserId: any;
  leads: Lead[] = [] as Lead[];
  selectedLeads: Lead[] = [] as Lead[];
  selectedLeadIds: any = [];
  targetUserList: any = [];
  private destroy$ = new Subject<void>();
  isView: boolean = true;
  lead: Lead = new Lead();
  isChannelPartner: boolean = false;
  selectedDay: CommonReferenceDetails | undefined;
  isManualassignMenu = true;
  constructor(
    private leadService: LeadService,
    private router: Router,
    private formBuilder: FormBuilder,
    private commonService: CommanService,
    private route: ActivatedRoute,
    private userService: UserService,
    private toastrService: ToastrService,
    private commonRefDetailService: CommonreferencedetailsService,
    private roleService: RoleService,
    private leadCommonService: LeadsCommonService,
    public dialog: MatDialog,
    private loaderService: LoaderService,
    private projectService: ProjectService
  ) {}

  public loginUser: User = new User();
  user = new FormControl<IUser | null>(null);

  clone = new FormControl<IUser | null>(null, Validators.required);
  targetUser: IUser = new User();
  sourceUser: IUser = new User();
  isAdding: boolean = true;
  sourceUserRoleId: any;
  targetUserRoleId: any;
  organizationId: any = '';
  userData: UserDto[] = [];
  selectedOrganizationId: any;
  formData!: FormGroup;
  organizations: any;
  dateRange: any;
  allCheck = 0;
  displayedColumns: string[] = [
    'assign',
    'rowNumber',
    'name',
    'email',
    'projectName',
    'presalesMember',
    'salesMember',
    'sourceName',
    'subSourceName',
    'status',
    'createdDate',
    'actions',
  ];
  daysType: string = 'Filter_Days';
  // Pagination
  totalItems: number = 0;
  pageSize: number = 20;
  pageIndex: number = 0;
  assignedTo?: number;
  name: string = '';
  statusId: any = '';
  title: any;
  // Identifiers
  isSalesTeam = false;
  isSalesTeamFollowUs = false;
  pageSizeOptions = leadPageSizeOptions;
  isMenuLeads = true;
  rangeOfDays: any;
  leadStatus: any[] = [];
  customStartDate: any;
  customEndDate: any;
  sources: LeadSource[] = [];
  subSources: LeadSubSource[] = [];
  startDate: any;
  endDate: any;
  days: CommonReferenceDetails[] = [];
  showDateRangePicker = false;
  selectedLeadBeforePageChange: any = [];
  targetUserName: string = '';
  sourceUserName: string = '';
  phoneNumber: any;
  leadName: any;
  moduleNames: string[] = [];
  assignedToSale: any;
  assignedToPresale: any;
  isSalesManualAssignment: any = 'Yes';
  roles = ['cto', 'sales head'];
  project: any = new FormControl([] as IProject[]);
  projectName: string = '';
  projects: Project[] = [];
  selectedProjectIds: any;
  projectIds: number[] = [];
  @ViewChild('allProjectSelected') private allProjectSelected?: any;
  isExpried='N'

  onPageChange(event: any) {
    this.selectedLeadIds = [...new Set(this.selectedLeadIds)];
    this.selectedLeadBeforePageChange = this.selectedLeadIds;
    console.log(this.selectedLeadIds);
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getLeads();
  }

  getLeads() {
    //previous
    this.showLoading();
    this.leadService
      .getDashBoardLeadsDetails(
        this.loginUser.userId,
        this.loginUser.roleId,
        '',
        this.pageIndex,
        this.pageSize,
        this.isMenuLeads,
        this.dateRange,
        this.startDate,
        this.endDate,
        this.projectIds,
        this.sourceId,
        this.subSourceId,
        this.statusId,
        this.assignedToPresale ? this.assignedToPresale : '',
        this.assignedToSale ? this.assignedToSale : '',
        this.phoneNumber,
        this.leadName,
        '',
        '',
        '',
        '',
        this.isSalesManualAssignment,
        this.isExpried
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.leads = response.records;
          //var lead: Lead[] = [] as Lead[];
          console.log(this.allCheck);
          if (this.leads?.length == 0 && this.allCheck == 1) {
            this.allCheck = 0;
          }
          if (this.allCheck == 1) {
            this.leads.forEach((l) => {
              this.selectedLeadIds.push(l.id);
            });
            this.selectedLeadIds = [...new Set(this.selectedLeadIds)];
          }

          this.leads.forEach(
            (l) => (l.isAssigned = this.selectedLeadIds.includes(l.id) ? 1 : 0)
          );

          this.totalItems = response.totalRecords;
          this.hideLoading();
        },
        error: (error) => {
          console.error(error);
          this.hideLoading();
        },
      });
  }

  ngOnInit(): void {
    // this.route.queryParams.subscribe((params) => {
    //   if (params && params['Type'] !== undefined && params['Type'] === 'P') {
    //     this.isSalesManualAssignment = false;
    //   } else {
    //     this.isSalesManualAssignment = true;
    //   }
    // });

    this.initForm();
    this.getAllLeadStatus();
    const user = localStorage.getItem('user');
    if (user != null) {
      this.loginUser = JSON.parse(user);
      console.log(this.loginUser.organizationId);
      this.organizationId = this.loginUser.organizationId;
      this.fetchProjects();
    }
    this.initializeState();
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.resetState();
        this.route.params.subscribe((params) => {
          this.handleRouteParams(params);
        });
      });
    this.route.params.subscribe((params) => {
      this.handleRouteParams(params);
      this.fetchUsers('');
      this.fetchTargetUsers('');
    });
    this.fetchLeadSources();
    this.fetchFilterDays();
  }
  resetState() {
    this.leads = [];
    this.userData = [];
  }

  fetchUsers(userName: any) {
    // this.userManageService
    //   .getUsers(this.referenceKey, this.organizationId)
    //   .subscribe({
    //     next: (userData) => {
    //       console.log(userData);
    //       this.userData = userData;
    //     },
    //     error: (error) => {
    //       console.error(error);
    //     },
    //   });
    this.userService
      .getUserByManagerId(this.loginUser.userId, userName, true)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          const userData = resp.filter(
            (u) => u.userId != this.loginUser.userId
          );
          this.userData = userData;

          if (this.roles.includes(this.loginUser.roleName.toLowerCase())) {
            this.userData = userData.filter((user: any) =>
              ['presales member', 'sales member', 'nocallsupport'].includes(
                user.roleName.toLowerCase()
              )
            );
          }
          //this.targetUserList = userData;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  // displayUser(user: User): string {
  //   return user && user.userName ? user.userName : '';
  // }
  displayUser(user: any): string {
    // If explicitly selected the "Select" option
    if (user === '') {
      return 'Select';
    }

    // If cleared manually or null
    if (!user) {
      return '';
    }

    return user.userName || '';
  }

  onTargetSelect = (event: any) => {
    this.targetUserId = event?.option.value?.userId;
    this.targetUserRoleId = event?.option.value?.roleId;
  };

  onSourceSelete = (event: any) => {
    this.assignedToPresale = '';
    this.assignedToSale = '';
    this.targetUserId = '';
    this.clone.patchValue({});
    this.allCheck = 0;
    this.selectedLeadIds = [];
    this.selectedLeadBeforePageChange = [];
    if (event?.option.value?.userId) {
      this.userService
        .getUserById(event?.option.value?.userId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            this.sourceUserId = event?.option.value?.userId;
            this.sourceUserRoleId = res.roleId;

            this.roleService
              .fetchUserRole(this.sourceUserRoleId)
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: (res) => {
                  // if (
                  //   res.roleName.toLocaleLowerCase() == 'presales member' ||
                  //   res.roleName.toLocaleLowerCase() == 'presales manager'
                  // ) {
                  //   this.assignedToSale = '';
                  //   this.assignedToPresale = this.sourceUserId;
                  // }
                  // if (
                  //   res.roleName.toLocaleLowerCase() == 'sales member' ||
                  //   res.roleName.toLocaleLowerCase() == 'sales manager'
                  // ) {
                  //   this.assignedToPresale = '';
                  //   this.assignedToSale = this.sourceUserId;
                  // }
                  this.assignedToPresale = this.sourceUserId;
                  this.assignedToSale = this.sourceUserId;
                  this.getLeads();
                },
                error: (err) => {
                  console.error('Error updating Menu', err);
                },
              });
          },
          error: (err) => {
            console.error('Error updating Menu', err);
          },
        });
      this.targetUserList = this.targetUserList.filter(
        (e: any) => e.userId !== event.option.value.userId
      );
      if (this.roles.includes(this.loginUser.roleName.toLowerCase())) {
        this.targetUserList = this.targetUserList.filter((user: any) =>
          ['presales member', 'sales member'].includes(
            user.roleName.toLowerCase()
          )
        );
      }
    } else {
      this.sourceUserRoleId = '';
      this.sourceUserId = '';
      this.assignedToPresale = '';
      this.assignedToSale = '';
      this.fetchTargetUsers('');
      this.getLeads();
    }
  };

  private handleErrorResponse(error: any): void {
    console.error('Error saving/updating lead:', error.error.message);
    this.toastrService.error('Failed', error.error.message, {
      timeOut: 3000, // Set success timeout
    });
    this.goToLeadAssign();
  }
  private handleSuccessResponse(response: any): void {
    this.toastrService.success('', response.message, {
      timeOut: 2000, // Set success timeout
    });
    this.goToLeadAssign();
  }
  goToLeadAssign() {
    this.getLeads();
  }
  onUserSerach = (searchText: any) => {};

  updateManualLead() {
    console.log(this.selectedLeadIds);
    this.leadCommonService.showLoading();
    this.leadService
      .updateManualLeadAssign(
        this.selectedLeadIds,
        this.targetUserId,
        this.referenceKey,
        this.loginUser.userId
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.leadCommonService.hideLoading();
          this.handleSuccessResponse(res);
        },
        error: (err) => {
          console.error('Error updating Menu', err);
          this.leadCommonService.hideLoading();
          this.handleErrorResponse(err);
        },
      });
  }

  updateAllCheckManualLead() {
    console.log(this.selectedLeadIds);
    this.leadService
      .manualLeadAssign(
        this.loginUser.userId,
        this.loginUser.roleId,
        '',
        '',
        this.statusId,
        this.dateRange,
        this.startDate,
        this.endDate,
        this.sourceId,
        this.subSourceId,
        this.referenceKey,
        this.selectedLeadIds,
        this.targetUserId,
        this.isMenuLeads,
        this.assignedToPresale ? this.assignedToPresale : '',
        this.assignedToSale ? this.assignedToSale : ''
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.handleSuccessResponse(res);
        },
        error: (err) => {
          console.error('Error updating Menu', err);
          this.handleErrorResponse(err);
        },
      });
  }

  openConfirmDialog() {
    if (this.allCheck === 0 && this.selectedLeadIds.length === 0) {
      this.leadCommonService.handleErrorMessage(
        'Please select at least one lead'
      );
      return;
    }

    this.clone.updateValueAndValidity();
    if (this.targetUserId === undefined || this.targetUserId <= 0) {
      this.clone.setErrors({ invalidTargetUserId: true });
      this.clone.markAsTouched();
      // this.leadCommonService.handleErrorMessage(
      //   'Please select the target user'
      // );
      return;
    }
    console.log(this.clone);

    // Open the dialog to confirm the manual assignment
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: {
        displayedData:
          'assign ' +
          this.selectedLeadIds?.length +
          ' Leads to ' +
          this.clone.value?.userName,
        title: 'Confirmation',
      },
    });
    dialogRef.componentInstance.isConfirmDelete
      .pipe(takeUntil(this.destroy$))
      .subscribe((isDelete: boolean) => {
        if (isDelete) {
          this.onSubmit1();
        }
      });
  }

  onSubmit1() {
    // Update the validity of the field
    if (this.user.valid && this.clone.valid) {
      this.updateManualLead();
      this.selectedLeadIds = [];
      this.selectedLeadBeforePageChange = [];
      this.allCheck = 0;
      this.router.navigate([
        'layout/presales/lead/assign/' + this.referenceKey,
      ]);
    }
  }

  onSubmit2() {
    if (this.user.valid && this.clone.valid) {
      console.log('submit 2');
      this.updateAllCheckManualLead();
      this.router.navigate([
        'layout/presales/lead/assign/' + this.referenceKey,
      ]);
    }
  }

  onOptionChecked(option: any) {
    this.allCheck = 0;

    this.leads.map((lead) => {
      if (lead.id == option.id) {
        console.log(lead.id + '=' + option.id);
        lead.isAssigned = lead.isAssigned == 1 ? 0 : 1;
        console.log(lead.isAssigned);
      }
      if (lead.isAssigned == 0) {
        this.selectedLeadBeforePageChange =
          this.selectedLeadBeforePageChange.filter(
            (item: any) => item !== lead.id
          );
      }
    });
    console.log(this.selectedLeadBeforePageChange);
    this.selectedLeads = this.leads.filter((lead) => lead.isAssigned == 1);
    this.selectedLeadIds = this.selectedLeads.map((e) => e.id);
    this.selectedLeadBeforePageChange.forEach((i: any) =>
      this.selectedLeadIds.push(i)
    );
    this.selectedLeadIds = [...new Set(this.selectedLeadIds)];
    console.log(this.selectedLeadIds);
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

  fetchSubSources(sourceId: number): void {
    this.leadService.fetchLeadSubSources(sourceId).subscribe({
      next: (subSources) => {
        this.subSources = subSources;
      },
      error: (error) => {
        console.error('Error fetching lead sub-sources:', error);
      },
    });
  }
  onLeadSourceSelect(value: any) {
    this.sourceId = value > 0 ? value : '';
    console.log(this.sourceId);
    this.subSourceId = '';
    this.formData.patchValue({ subSourceId: '' });
    this.allCheck = 0;
    this.selectedLeadIds = [];
    this.selectedLeadBeforePageChange = [];

    if (this.sourceId > 0) {
      this.fetchSubSources(this.sourceId);
      this.getLeads();
    } else if (value == '') {
      this.subSources = [];
      this.getLeads();
    } else {
      if (
        (this.sourceUserId,
        this.subSourceId,
        this.leadName,
        this.phoneNumber,
        this.statusId)
      ) {
        this.getLeads();
      } else if (value === '') {
        this.leads = [];
      }
    }
  }

  onLeadSubSourceSelete(value: any) {
    this.subSourceId = value > 0 ? value : '';
    this.allCheck = 0;
    this.selectedLeadIds = [];
    this.selectedLeadBeforePageChange = [];
    if (this.subSourceId) {
      this.getLeads();
    } else if (value == '') {
      this.getLeads();
    } else {
      if (
        (this.sourceUserId,
        this.sourceId,
        this.leadName,
        this.phoneNumber,
        this.statusId)
      ) {
        this.getLeads();
      }
    }
  }
  private initForm(): void {
    this.formData = this.formBuilder.group({
      customStartDate: [],
      customEndDate: [],
      sourceId: [],
      subSourceId: [],
      leadName: [],
      phoneNumber: [],
      statusId: [],
      targetUserId: [],
      daySelector: [],
    });
    this.allCheck = 0;
    this.selectedLeadIds = [];
    this.selectedLeadBeforePageChange = [];
    this.formData.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((formDataValue) => {
        if (formDataValue.customStartDate && formDataValue.customEndDate) {
          const startDate = this.formatDateTime(formDataValue.customStartDate);
          const endDate = this.formatDateTime(
            formDataValue.customEndDate,
            true
          );
          console.log(startDate);
          console.log(endDate);
          this.startDate = startDate;
          this.endDate = endDate;
          this.getLeads();
          // this.fetchLeadsData(this.user.userId);
          // this.fetchDashboardFollowupsData();
          // this.fetchTeamLeadsData();
        }
      });
  }

  formatDateTime(date: Date, isEndDate: boolean = false): string {
    if (isEndDate) {
      date.setHours(23, 59, 59, 999);
    }
    return formatDate(date, 'yyyy-MM-ddTHH:mm:ss.SSSSSS', 'en-IN');
  }
  private fetchFilterDays() {
    this.commonService.getRefDetailsByType(this.daysType).subscribe({
      next: (response: CommonReferenceDetails[]) => {
        this.days = response;
        this.handleDateRange(history.state);
      },
      error: (error) => console.error(error),
    });
  }

  private handleDateRange(state: any) {
    this.selectedLeadIds = [];
    this.selectedLeadBeforePageChange = [];
    if (state.customStartDate && state.customEndDate) {
      this.showDateRangePicker = true;
      this.formData.patchValue({
        customStartDate: state.customStartDate,
        customEndDate: state.customEndDate,
      });
      this.selectedDay = this.days.find((day) =>
        day.commonRefValue.includes('Custom')
      );
      this.startDate = state.customStartDate;
      this.endDate = state.customEndDate;
    } else if (state.dateRange) {
      this.dateRange = state.dateRange;
      this.selectedDay = this.days.find(
        (day) => day.commonRefKey == this.dateRange
      );
    } else {
      this.selectedDay = this.days.find((day) => day.commonRefKey === '0');
    }
  }

  // handleDaySelection(commonRefObject: CommonReferenceDetails) {
  //   console.log(commonRefObject);

  //   this.dateRange = commonRefObject.commonRefKey;
  //   this.allCheck = 0;
  //   this.selectedLeadIds = [];
  //   this.selectedLeadBeforePageChange = [];
  //   if (commonRefObject.commonRefValue.includes('Custom')) {
  //     console.log('Custom Date');
  //     this.dateRange = '';
  //     this.showDateRangePicker = true;
  //     this.isMenuLeads = false;
  //   } else {
  //     this.startDate = null;
  //     this.endDate = null;
  //     this.formData.patchValue({
  //       customStartDate: null,
  //       customEndDate: null,
  //     });
  //     this.isMenuLeads = false;
  //     this.getLeads();
  //     this.showDateRangePicker = false;
  //   }
  //   console.log(this.isMenuLeads);
  // }

  handleDaySelection(commonRefObject: CommonReferenceDetails | null) {
    //this.isExportExcel=false
    // If "All" option is selected
    if (!commonRefObject) {
      this.dateRange = 999;
      this.customStartDate = null;
      this.customEndDate = null;
      this.formData.patchValue({
        customStartDate: null,
        customEndDate: null,
      });
      this.showDateRangePicker = false;
      this.isMenuLeads = false;
      this.getLeads();
    } else {
      this.dateRange = commonRefObject.commonRefKey;

      if (
        commonRefObject.commonRefValue &&
        commonRefObject.commonRefValue.includes('Custom')
      ) {
        this.showDateRangePicker = true;
        this.dateRange = '';
      } else {
        this.customStartDate = null;
        this.customEndDate = null;
        this.formData.patchValue({
          customStartDate: null,
          customEndDate: null,
        });
        this.isMenuLeads = false;

        this.getLeads();
        this.showDateRangePicker = false;
      }
    }
  }

  // fetchFilterDays() {
  //   this.commonService.getRefDetailsByType(this.daysType).subscribe({
  //     next: (response: CommonReferenceDetails[]) => {
  //       this.days = response;
  //     },
  //     error: (error) => console.error(error),
  //   });
  // }
  private handleRouteParams(params: any): void {
    this.referenceKey = params['Type'];
    //const param2 = params['param2'];
    if (params['Team'] == 'P') {
      this.title = 'Pre Sale Team Manual Assignment';
    } else if (params['Team'] == 'S') {
      this.title = 'Sale Team Manual Assignment';
    }
  }

  checkedAll() {
    // console.log(this.leads);
    this.allCheck = this.allCheck == 1 ? 0 : 1;
    console.log(this.allCheck);
    var leads: Lead[] = [] as Lead[];

    this.leads.forEach((l) => {
      l.isAssigned = this.allCheck;
      leads.push(l);
    });

    this.leads = leads;
    // this.selectedLeads = this.leads.filter((lead) => lead.isAssigned == 1);
    // this.selectedLeadIds = this.selectedLeads.map((e) => e.id);
    if (this.allCheck == 1) {
      this.getLeadsForCheckAll();
    }
    this.selectedLeadBeforePageChange.forEach((i: any) =>
      this.selectedLeadIds.push(i)
    );

    console.log(this.allCheck);
    if (this.allCheck == 0) {
      this.selectedLeadIds = [];
      this.selectedLeadBeforePageChange = [];
    }
  }

  onTargetUserSearch(searchText: string) {
    // this.allCheck=0;
    // this.selectedLeadIds=[]
    // this.selectedLeadBeforePageChange=[]
    this.targetUserName = searchText;
    this.allCheck = 0;
    this.selectedLeadIds = [];
    this.selectedLeadBeforePageChange = [];
    if (this.targetUserName?.length >= 3) {
      this.fetchTargetUsers(this.targetUserName);
    }
  }
  onSourceUserSearch(searchText: string) {
    this.sourceUserName = searchText;
    if (this.sourceUserName?.length >= 3) {
      this.fetchUsers(this.sourceUserName);
    }
    if (!this.sourceUserName) {
      this.fetchUsers('');
    }
    if (searchText.length === 0) {
      this.sourceUserId = 0;
    }
  }

  fetchTargetUsers(userName: any) {
    if (userName.length === 0) {
      this.targetUserId = 0;
    }

    console.log(this.sourceUserId);
    if (userName == '') {
      this.clone.setValue(null);
    }
    if (this.sourceUserId) {
      this.userService
        .getUserByManagerId(this.loginUser.userId, userName)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (resp) => {
            const userData = resp.filter(
              (u) =>
                u.userId != this.loginUser.userId &&
                u.userId != this.sourceUserId
            );

            this.targetUserList = userData;
            if (this.roles.includes(this.loginUser.roleName.toLowerCase())) {
              this.targetUserList = userData.filter((user: any) =>
                ['presales member', 'sales member'].includes(
                  user.roleName.toLowerCase()
                )
              );
            }
          },
          error: (error) => {
            console.error(error);
          },
        });
    } else {
      this.userService
        .getUserByManagerId(this.loginUser.userId, userName)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (resp) => {
            const userData = resp.filter(
              (u) => u.userId != this.loginUser.userId
            );
            //this.userData = userData;
            this.targetUserList = userData;
            if (this.roles.includes(this.loginUser.roleName.toLowerCase())) {
              this.targetUserList = userData.filter((user: any) =>
                ['presales member', 'sales member'].includes(
                  user.roleName.toLowerCase()
                )
              );
            }
          },
          error: (error) => {
            console.error(error);
          },
        });
    }
  }

  onSearch(phoneNumber: any) {
    this.phoneNumber = phoneNumber;
    this.pageIndex = 0;
    // console.log(this.loginUser.roleId);
    // console.log(this.phoneNumber);
    this.allCheck = 0;
    this.selectedLeadIds = [];
    this.selectedLeadBeforePageChange = [];
    if (this.phoneNumber.length >= 6) {
      this.getLeads();
    } else if (this.phoneNumber.length <= 0) {
      // if ((this.sourceUserId, this.sourceId, this.leadName, this.subSourceId)) {
      this.getLeads();
      // }
    }
  }

  onLeadNameSearch(searchText: any) {
    this.leadName = searchText;
    this.pageIndex = 0;
    this.allCheck = 0;
    this.selectedLeadIds = [];
    this.selectedLeadBeforePageChange = [];
    // if (this.leadName) {
    //   this.getLeads();
    // } else {
    //   if (
    //     (this.sourceUserId, this.sourceId, this.phoneNumber, this.subSourceId)
    //   ) {
    //     this.getLeads();
    //   }
    // }
    if (searchText.length > 2) {
      this.getLeads();
    }
    if (searchText.length <= 0) {
      this.leadName = '';
      this.getLeads();
    }
  }
  handleFollowups(leadId: number) {
    if (this.isView) {
      console.log(this.isSalesTeamFollowUs);
      const route = this.isSalesTeamFollowUs
        ? '/layout/sales/followups/save/ST'
        : '/layout/presales/followups/save/PST';
      this.router.navigate([route], {
        state: {
          leadId: leadId,
          isSalesTeamFollowUs: this.isSalesTeamFollowUs,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          handleFollowups: false,
          isFromDashBoard: false,
          isFromManualLeadAssign: true,
          sourceId: this.sourceId,
          subSourceId: this.subSourceId,
          phoneNumber: this.phoneNumber,
          sourceUserId: this.sourceUserId,
          targetUserId: this.targetUserId,
          custName: this.leadName,
          sourceIds: this.sourceId,
          selectedSubSourcesIds: this.subSourceId,
          dateRange: this.dateRange,
          customStartDate: this.startDate,
          customEndDate: this.endDate,
          statusId: this.statusId,
          presalesUserIds: [this.assignedToPresale],
        },
      });
    }
  }
  handleScheduleVisits(leadId: any) {
    this.router.navigate(['layout/presales/schedule/visit'], {
      state: {
        leadId,
        isView: this.isView,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isFromManualLeadAssign: true,
      },
    });
  }
  viewLeadHistories(leadId: any) {
    this.leadService.fetchLead(leadId).subscribe({
      next: (response) => {
        this.lead = response;
        const route = '/layout/presales/history';
        this.router.navigate([route], {
          state: {
            leadId: leadId,
            team: this.isSalesTeam,
            lead: response,
            pageSize: this.pageSize,
            pageIndex: this.pageIndex,
            isFromManualLeadAssign: true,
            subSourceId: this.subSourceId,
            phoneNumber: this.phoneNumber,
            sourceUserId: this.sourceUserId,
            targetUserId: this.targetUserId,
            custName: this.leadName,
            sourceIds: this.sourceId,
            selectedSubSourcesIds: this.subSourceId,
            dateRange: this.dateRange,
          },
        });
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  onStatusSelectionChange(event: any) {
    this.statusId = event.value;
    this.allCheck = 0;
    this.selectedLeadIds = [];
    this.selectedLeadBeforePageChange = [];
    if (this.statusId === 'all') {
      this.statusId = '';
    }
    this.getLeads();
  }
  private getAllLeadStatus() {
    const role = this.loginUser.roleName.toLocaleLowerCase();
    this.moduleNames.push('P,PS,S');
    // role.includes('presale')
    //   ? this.moduleNames.push('P,PS')
    //   : this.moduleNames.push('S,PS');
    // if (
    //   role.includes('sales head') ||
    //   role.includes('cto') ||
    //   role.includes('channel')
    // ) {
    //   this.moduleNames.push('P');
    // }
    const refType = 'Lead_Status';

    this.commonRefDetailService
      .fetchLeadStatusListByRole(refType, this.moduleNames)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.leadStatus = response;
        },
        error: (error: any) => {
          console.error(error);
        },
      });
  }

  getLeadsForCheckAll() {
    //previous
    this.leadService
      .getDashBoardLeadsDetails(
        this.loginUser.userId,
        this.loginUser.roleId,
        '',
        0,
        this.totalItems,
        this.isMenuLeads,
        this.dateRange,
        this.startDate,
        this.endDate,
        this.projectIds,
        this.sourceId,
        this.subSourceId,
        this.statusId,
        this.assignedToPresale ? this.assignedToPresale : '',
        this.assignedToSale ? this.assignedToSale : '',
        this.phoneNumber,
        this.leadName,
        '',
        '',
        '',
        '',
        'Yes',
        this.isExpried
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const leads = response.records;
          this.selectedLeadIds = response.records.map((e: any) => e.id);
          this.selectedLeadBeforePageChange = leads.map((e: any) => e.id);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  initializeState() {
    const state = history.state;
    console.log(state);
    this.phoneNumber = state.phoneNumber;
    this.leadName = state.custName;
    this.targetUserId = state.targetUserId ?? '';
    this.sourceUserId = state.sourceUserId ?? '';
    this.sourceId = state.sourceIds || '';
    this.subSourceId = state.selectedSubSourcesIds || '';
    this.dateRange = state.dateRange || '';
    this.statusId = state.statusId || '';
    // alert(state.sourceIds);
    this.fetchSubSources(this.sourceId);
    this.formData.patchValue({ sourceId: this.sourceId || '' });
    this.formData.patchValue({ subSourceId: this.subSourceId || '' });
    this.formData.patchValue({ leadName: this.leadName || '' });
    this.formData.patchValue({ phoneNumber: this.phoneNumber || '' });
    this.isMenuLeads = false;
    this.startDate = state.customStartDate;
    this.endDate = state.customEndDate;
    this.assignedToPresale = state.presalesUserIds || '';
    this.targetUserId = state.targetUserId;
    console.log(state.presalesUserIds);
    console.log(this.assignedToPresale[0]);
    if (this.assignedToPresale) {
      this.userService
        .getUserById(this.assignedToPresale[0])
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response: any) => {
            this.user.patchValue(response);
          },
          error: (error: any) => {
            console.error(error);
          },
        });
    }
    if (this.targetUserId) {
      this.userService
        .getUserById(this.targetUserId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response: any) => {
            this.clone.patchValue(response);
          },
          error: (error: any) => {
            console.error(error);
          },
        });
    }
    this.getLeads();
  }
  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }

  searchProject(event: any) {
    if (event.target.value.length >= 3) {
      this.projectName = event.target.value;
      this.fetchProjects();
    } else if (event.target.value.length == 0) {
      this.projectName = '';
      this.projectIds = this.selectedProjectIds;
      this.fetchProjects();
    }
  }

  fetchProjects() {
    this.projectName = this.projectName || '';
    this.projectService
      .getAllProjects(
        this.projectName,
        0,
        1000,
        'Y',
        this.loginUser.organizationId
      )
      .subscribe({
        next: (projects) => {
          this.projects = projects.records;
          if (this.selectedProjectIds?.length > 0) {
            this.sortProject(this.projects, this.selectedProjectIds);
            // const projectId = this.projects.map(p => p.projectId)
            // console.log(this.projects)
            // if (projectId.length == this.  selectedProjectIds.length) {
            //   console.log(this.projectId)
            //   this.projectId.push(0)
            // }
          }
        },
        error: (error) => {
          console.error('Error fetching projects:', error);
        },
      });
  }

  sortProject(projects: any[], selectedprojectIds: any): any[] {
    return projects.sort((a, b) => {
      const aSelected = selectedprojectIds.includes(a.projectId);
      const bSelected = selectedprojectIds.includes(b.projectId);
      // Place selected items first, then unselected items
      return aSelected === bSelected ? 0 : aSelected ? -1 : 1;
    });
  }

  onAllSelectProject() {
    // this.allProjectChecked=this.allProjectSelected.checked
    if (this.allProjectSelected.checked) {
      this.selectedProjectIds = this.projects.map((p: any) => p.projectId, 0);
    } else {
      this.selectedProjectIds = [];
    }
    console.log(this.projectIds);
    //this.projectId = this.selectedprojectIds
    this.displayProjectNames();
  }
  displayProjectNames() {
    if (this.selectedProjectIds.length > 0) {
      this.projectService
        .getProjectsByIds(
          '',
          this.loginUser.organizationId,
          this.selectedProjectIds,
          'Y'
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (projects: any) => {
            this.projects = this.sortProject(
              this.projects,
              this.selectedProjectIds
            );
            const selectedNames = projects
              .map((project: any) => project.projectName)
              .join(', ');
            this.project.patchValue(selectedNames);
          },
        });
    } else {
      this.project.patchValue('');
    }
  }

  isProjectAllSelected(): boolean {
    const allProjectIds = this.projects.map((p) => p.projectId);
    return (
      Array.isArray(this.selectedProjectIds) &&
      allProjectIds.length > 0 &&
      allProjectIds.every((id) => this.selectedProjectIds.includes(id))
    );
  }
  onProjectSelectButtonClick() {
    this.projectIds = this.selectedProjectIds;
    // alert(this.projectIds);
    this.getLeads();
  }
  isSelectedProject(projectId?: number): boolean {
    return this.selectedProjectIds?.includes(projectId);
  }

  onProjectSelect(project: any, event: any) {
    //this.allProjectChecked=false;
    this.project.patchValue('');
    const selectedProject = project.projectId;
    // console.log('selected project id ' + selectedProject);

    if (event.checked) {
      if (!this.selectedProjectIds) {
        this.selectedProjectIds = [];
      }
      this.selectedProjectIds?.push(selectedProject);
      this.displayProjectNames();
      // alert(this.selectedSubSourcesIds); // Add to selected IDs
    } else {
      // Remove project ID from selected IDs
      this.selectedProjectIds = this.selectedProjectIds?.filter(
        (id: any) => id !== selectedProject
      );
      if (this.selectedProjectIds?.length > 0) {
        this.displayProjectNames();
      } else if (this.selectedProjectIds?.length == 0) {
        this.project.patchValue('');
      }
    }
    // this.projectId = this.selectedprojectIds

    console.log(this.selectedProjectIds);
  }
}
