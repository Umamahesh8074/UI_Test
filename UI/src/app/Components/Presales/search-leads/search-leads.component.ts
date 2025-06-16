import { DatePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { OverlayContainer } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { leadPageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { CommonReferenceType } from 'src/app/Models/CommanModel/menuDto';
import {
  ILeadTransfer,
  Lead,
  LeadDto,
  LeadMcubeAudio,
} from 'src/app/Models/Presales/lead';
import { LeadSubSource } from 'src/app/Models/Presales/leadsubsource';
import { IProject, Project } from 'src/app/Models/Project/project';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';
import { User } from 'src/app/Models/User/User';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LeadsCommonService } from 'src/app/Services/CommanService/leads-common.service';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { LeadService } from 'src/app/Services/Presales/Leads/lead.service';
import { LeadSourceService } from 'src/app/Services/Presales/LeadSource/lead-source.service';
import { LeadSubsourceService } from 'src/app/Services/Presales/LeadSubSource/lead-subsource.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { UsermanageService } from 'src/app/Services/UserManageService/usermanage.service';
import { CommonreferencedetailsService } from 'src/app/Services/UserService/commonreferencedetails.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-search-leads',
  templateUrl: './search-leads.component.html',
  styleUrls: ['./search-leads.component.css'],
})
export class SearchLeadsComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort) sort!: MatSort;

  phoneNumber: string = '';
  lead: Lead = new Lead();
  leads: LeadDto[] = [];
  user: User = new User();
  mainUser: User = new User();

  destroy$ = new Subject<void>();
  days: CommonReferenceDetails[] = [];
  isExportExcel: boolean = false;
  daysType: string = 'Filter_Days';
  selectedFile: File | null = null;
  selectedFileName: string | null = null;
  projectName: any;
  // List of filtered users
  isCP: boolean = false;
  displayedColumns: string[] = [
    'rowNumber',
    'opportunityId',
    'name',
    'phoneNumber',
    'projectName',
    'sourceName',
    'subSource',
    'createdDate',
    'status',
    'presalesMember',
    'salesMember',
    'assignedToSaleDate',
    'remarks',
    'actions',
  ];

  dialogRef: any;

  // Pagination
  totalItems: number = 0;
  pageSize: number = 25;
  pageIndex: number = 0;
  pageSizeOptions = leadPageSizeOptions;
  dateRange: any;
  leadStatus: any[] = [];

  formData!: FormGroup;
  datePipe: DatePipe = new DatePipe('en-IN');
  selectedDay: any;
  fileTypeError: boolean = false;
  userId: number = 0;
  roleName: string = '';

  dataSource!: any;
  projectId: number = 0;
  UserRoleName: string | undefined;
  organizationId: number = 0;

  roleId: number = 0;
  projects: Project[] = [];

  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // project: any = new FormControl('');
  project = new FormControl<IProject | null>(null, Validators.required);
  audio: LeadMcubeAudio[] = [];
  openAudioDialog: boolean = false;
  currentAudio: HTMLAudioElement | null = null;
  currentlyPlayingAudio: any = null;
  isDisplayExcelUpload: boolean = true;
  selectedProject: IProject = new Project();

  @ViewChild('allSelected') private allSelected?: MatOption;
  followUpType: any;
  leadTeam: any = [];
  allLeads: any[] = [];
  uniqueLead: any;
  filteredCountries: CommonReferenceType[] = [];
  countryCodes: CommonReferenceType[] = [];
  countryCodeType: string = 'Country_Code';
  countryCode: string = '';
  selectedCountry: any;
  isLeadsFound: boolean = true;
  isAddAsCpWalkIn: boolean = false;
  isAddNewLead: boolean = false;
  isDisplayAddCpWalkIn: boolean = false;
  cpWalkInButton: any = false;
  openDialog: boolean = false;

  sources: any[] = [];
  subSources: any[] = [];
  sourceId: number = 0;
  subSourceId: number = 0;
  subSourceControl = new FormControl<LeadSubSource | null>(null, [
    Validators.required,
  ]);
  leadId: number = 0;
  transferLead: Lead = new Lead();
  subSourceName: string = '';
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private leadService: LeadService,
    private commonService: CommanService,
    private formBuilder: FormBuilder,
    private overlayContainer: OverlayContainer,
    private projectService: ProjectService,
    private loaderService: LoaderService,
    private userManageService: UsermanageService,
    private leadSourceService: LeadSourceService,
    private leadSubSourceService: LeadSubsourceService,
    private commonReferenceDetailsService: CommonreferencedetailsService,
    private leadCommonService: LeadsCommonService
  ) {}
  digitalPartner: any;
  ngOnInit() {
    this.fetchCountryCodes();
    this.getSources();
    this.initForm();
    this.loadUserAndFetchLeads();
    this.initializeState();
    this.getUserFormLocalStorage();
  }

  private initForm(): void {
    this.isExportExcel = false;
    this.formData = this.formBuilder.group({
      phoneNumber: ['', Validators.required],
      countryCode: [''],
    });
  }
  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.overlayContainer
      .getContainerElement()
      .classList.remove('leads-dropdown');
  }

  private initializeState() {
    console.error(history.state);
    const state = history.state;
    this.projectId = state.projectId;
    this.phoneNumber = state.phoneNumber;
    this.countryCode = state.countryCode;
    this.formData.patchValue({ countryCode: state.countryCode });
    if (this.projectId > 0) {
      this.fetchProject(this.projectId);
    }
    if (this.phoneNumber.length > 0) {
      this.formData.patchValue({ phoneNumber: this.phoneNumber });
    }

    if (this.phoneNumber.length > 0 && this.projectId > 0) {
      this.fetchLeadByPhoneNumberAndProject();
    }
  }

  private loadUserAndFetchLeads() {
    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
      this.fetchProjects();
      // this.getUserManageByUserId();
    }
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    history.state.pageIndex = this.pageIndex;
    history.state.pageSize = this.pageSize;
  }

  onSearch(phoneNumber: any) {
    this.isExportExcel = false;
    // if (phoneNumber.length >= 6 || phoneNumber.length == 0) {
    this.phoneNumber = phoneNumber;

    // this.pageIndex = 0;
    // this.paginator.firstPage();
    // }
    // if (this.phoneNumber.length === 0) {
    //   this.fetchLeadByPhoneNumberAndProject()
    // }
  }

  onClickSearchButton() {
    this.project.markAllAsTouched();
    this.formData.markAllAsTouched();
    this.isExportExcel = false;
    if (this.projectId == 0 || this.projectId == null) {
      Swal.fire({
        title: 'Error',
        text: `Please select a project`,
        icon: 'error',
        confirmButtonText: 'OK',
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
        }
      });
    }
    if (this.projectId > 0 && this.phoneNumber.length > 0) {
      this.fetchLeadByPhoneNumberAndProject();
    }
  }

  goToGreForm(leadId?: number) {
    if (this.uniqueLead !== undefined) {
      this.displayErrorMessage();
      return;
    }

    const route = '/layout/gre/siteform';

    this.router.navigate([route], {
      state: {
        leadId: leadId,
        phoneNumber: this.phoneNumber,
        projectId: this.projectId,
        isAddAsCpWalkIn: this.isAddAsCpWalkIn,
        isAddNewLead: this.isAddNewLead,
        isLeadsFound: this.isLeadsFound,
        countryCode: this.countryCode,
      },
    });
  }

  // Drag logic for modal
  // onModalHeaderMouseDown(event: MouseEvent) {
  //   event.preventDefault();
  //   this.isDragging = true;
  //   const modal = document.querySelector('.modal-dialog') as HTMLElement;
  //   if (!modal) return;
  //   // Store initial position for restoring after drag
  //   this.initialModalPosition = {
  //     top: modal.offsetTop,
  //     left: modal.offsetLeft
  //   };
  //   const rect = modal.getBoundingClientRect();
  //   this.dragOffset = {
  //     x: event.clientX - rect.left,
  //     y: event.clientY - rect.top
  //   };
  //   this._boundMouseMove = (e: MouseEvent) => this.onModalMouseMove(e);
  //   this._boundMouseUp = () => this.onModalMouseUp();
  //   document.addEventListener('mousemove', this._boundMouseMove);
  //   document.addEventListener('mouseup', this._boundMouseUp);
  // }
  // initialModalPosition: { top: number; left: number } = { top: 0, left: 0 };
  // _boundMouseMove: any;
  // _boundMouseUp: any;
  // onModalMouseMove(event: MouseEvent) {
  //   if (!this.isDragging) return;
  //   this.modalPosition = {
  //     top: event.clientY - this.dragOffset.y,
  //     left: event.clientX - this.dragOffset.x
  //   };
  //   const modal = document.querySelector('.modal-dialog') as HTMLElement;
  //   if (modal) {
  //     modal.style.position = 'fixed';
  //     modal.style.top = this.modalPosition.top + 'px';
  //     modal.style.left = this.modalPosition.left + 'px';
  //     modal.style.margin = '0';
  //     modal.style.zIndex = '2000';
  //   }
  // }
  // onModalMouseUp() {
  //   this.isDragging = false;
  //   // Save the final position so it stays after drag
  //   const modal = document.querySelector('.modal-dialog') as HTMLElement;
  //   if (modal) {
  //     this.modalPosition = {
  //       top: modal.offsetTop,
  //       left: modal.offsetLeft
  //     };
  //   }
  //   document.removeEventListener('mousemove', this._boundMouseMove);
  //   document.removeEventListener('mouseup', this._boundMouseUp);
  // };

  // Drag logic for modal
  // onModalHeaderMouseDown(event: MouseEvent) {
  //   event.preventDefault();
  //   this.isDragging = true;
  //   const modal = document.querySelector('.modal-dialog') as HTMLElement;
  //   if (!modal) return;
  //   // Store initial position for restoring after drag
  //   this.initialModalPosition = {
  //     top: modal.offsetTop,
  //     left: modal.offsetLeft
  //   };
  //   const rect = modal.getBoundingClientRect();
  //   this.dragOffset = {
  //     x: event.clientX - rect.left,
  //     y: event.clientY - rect.top
  //   };
  //   this._boundMouseMove = (e: MouseEvent) => this.onModalMouseMove(e);
  //   this._boundMouseUp = () => this.onModalMouseUp();
  //   document.addEventListener('mousemove', this._boundMouseMove);
  //   document.addEventListener('mouseup', this._boundMouseUp);
  // }
  // initialModalPosition: { top: number; left: number } = { top: 0, left: 0 };
  // _boundMouseMove: any;
  // _boundMouseUp: any;
  // onModalMouseMove(event: MouseEvent) {
  //   if (!this.isDragging) return;
  //   this.modalPosition = {
  //     top: event.clientY - this.dragOffset.y,
  //     left: event.clientX - this.dragOffset.x
  //   };
  //   const modal = document.querySelector('.modal-dialog') as HTMLElement;
  //   if (modal) {
  //     modal.style.position = 'fixed';
  //     modal.style.top = this.modalPosition.top + 'px';
  //     modal.style.left = this.modalPosition.left + 'px';
  //     modal.style.margin = '0';
  //     modal.style.zIndex = '2000';
  //   }
  // }
  // onModalMouseUp() {
  //   this.isDragging = false;
  //   // Save the final position so it stays after drag
  //   const modal = document.querySelector('.modal-dialog') as HTMLElement;
  //   if (modal) {
  //     this.modalPosition = {
  //       top: modal.offsetTop,
  //       left: modal.offsetLeft
  //     };
  //   }
  //   document.removeEventListener('mousemove', this._boundMouseMove);
  //   document.removeEventListener('mouseup', this._boundMouseUp);
  // };

  generateLeadsReport() {
    this.isExportExcel = true;
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      const fileName: string = file.name;
      const fileParts: string[] = fileName.split('.');
      let fileExtension: string = '';

      if (fileParts.length > 1) {
        fileExtension = fileParts.pop()!.toLowerCase(); // Non-null assertion operator
      }

      if (fileExtension === 'xls' || fileExtension === 'xlsx') {
        this.selectedFile = file;
        this.selectedFileName = fileName; // Update the displayed file name
        this.fileTypeError = false;
      } else {
        this.selectedFile = null;
        this.selectedFileName = null; // Reset the displayed file name
        this.fileTypeError = true;
      }
    } else {
      this.selectedFile = null;
      this.selectedFileName = null; // Reset the displayed file name
      this.fileTypeError = false;
    }
  }

  private resetFileInput(): void {
    this.selectedFile = null;
    this.fileInput.nativeElement.value = '';
    this.selectedFileName = null;
  }

  // private downloadFile(
  //   data: Blob,
  //   filename: string,
  //   needTime: boolean = true
  // ): void {
  //   const now = new Date();
  //   const timestamp = now.toLocaleDateString() + '_' + now.toLocaleTimeString();
  //   if (filename.endsWith('.xls')) {
  //     const blob = new Blob([data], {
  //       type: 'application/vnd.ms-excel',
  //     });
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement('a');
  //     a.href = url;
  //     needTime
  //       ? (a.download = filename + '_' + timestamp + '.xls')
  //       : (a.download = filename + '.xls');

  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);
  //     window.URL.revokeObjectURL(url);
  //   } else {
  //     const blob = new Blob([data], {
  //       type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //     });
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement('a');
  //     a.href = url;
  //     needTime
  //       ? (a.download = filename + '_' + timestamp + '.xlsx')
  //       : (a.download = filename + '.xlsx');

  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);
  //     window.URL.revokeObjectURL(url);
  //   }
  // }
  private downloadXLSFile(
    data: Blob,
    filename: string,
    needTime: boolean = true
  ) {
    const now = new Date();
    const timestamp = now.toLocaleDateString() + '_' + now.toLocaleTimeString();
    const blob = new Blob([data], {
      type: 'application/vnd.ms-excel',
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    needTime
      ? (a.download = filename + '_' + timestamp + '.xls')
      : (a.download = filename + '.xls');

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  private downloadXLSXFile(
    data: Blob,
    filename: string,
    needTime: boolean = true
  ) {
    const now = new Date();
    const timestamp = now.toLocaleDateString() + '_' + now.toLocaleTimeString();

    const blob = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    needTime
      ? (a.download = filename + '_' + timestamp + '.xlsx')
      : (a.download = filename + '.xlsx');

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
  private excelDownload(fileName: string) {
    this.leadService.downloadUpdatedExcel(fileName).subscribe({
      next: (response: Blob) => {
        console.log('File downloaded successfully', response);
        this.fileInput.nativeElement.value = '';
        if (fileName.endsWith('.xlsx')) {
          this.downloadXLSXFile(response, 'UpdatedLeads');
        }
        if (fileName.endsWith('.xls')) {
          this.downloadXLSFile(response, 'UpdatedLeads');
        }
      },
      error: (error) => {
        console.error('File download failed : ', error);
        Swal.fire({
          icon: 'error',
          text: 'Error Occurred',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      },
    });
  }

  // downloadTemplate() {
  //   this.leadService.downloadTemplate(!this.isChannelPartner).subscribe({
  //     next: (response: Blob) => {
  //       this.downloadXLSXFile(response, 'Leads_upload_template', false);
  //       Swal.fire({
  //         icon: 'success',
  //         text: 'Template downloaded successfully',
  //         timer: 2000,
  //         timerProgressBar: true,
  //         showConfirmButton: false,
  //       });
  //     },
  //     error: (error) => {
  //       console.error('File download failed : ', error);
  //       Swal.fire({
  //         icon: 'error',
  //         text: 'Error Occurred',
  //         timer: 2000,
  //         timerProgressBar: true,
  //         showConfirmButton: false,
  //       });
  //     },
  //   });
  // }

  isNotLastColumn(event: MouseEvent): boolean {
    const clickedElement = event.target as HTMLElement;
    const cellElement = clickedElement.closest('td'); // Find closest <td>
    const rowElement = clickedElement.closest('tr'); // Find closest <tr>

    if (rowElement && cellElement) {
      const cells = Array.from(rowElement.children); // Get all <td> elements
      const lastCell = cells[cells.length - 1]; // Last column

      return cellElement !== lastCell;
    }
    return false; // Default fallback
  }

  getUserFormLocalStorage() {
    const user = localStorage.getItem('user');
    const mainUser = localStorage.getItem('Mainuser');
    if (mainUser) {
      this.mainUser = JSON.parse(mainUser);
    }
    if (user) {
      this.user = JSON.parse(user);
      this.userId = this.user.userId;
      this.roleName = this.user.roleName;
      this.UserRoleName = this.user.roleName
        ? this.user.roleName.toLowerCase()
        : undefined;
      this.organizationId = this.user.organizationId;
      this.roleId = this.user.roleId;
    }
  }

  getStarCount(lead: any): number {
    let starCount = 0;
    if (lead.isRegisteredWithAnotherProject === 1) {
      starCount += 1;
    }
    // if (lead.isSiteVisitDoneInAnotherProject === 2) {
    //   starCount += 1;
    // }

    return starCount;
  }

  getStarColor(projectName: string): string {
    const projectColors: { [key: string]: string } = {
      'SBR MINARA': 'green',
      'SBR FLORENSO': 'gray',
      'SBR EARTH&SKY': 'blue',
    };
    return projectColors[projectName] || 'gray';
  }

  displayProject(project: IProject): string {
    return project && project.projectName ? project.projectName : '';
  }

  onProjectSelect(event: any) {
    this.isExportExcel = false;
    this.projectId = event?.option.value?.projectId;
    if (this.projectId > 0 && this.phoneNumber?.length > 0) {
      this.fetchLeadByPhoneNumberAndProject();
    }
  }

  fetchProjects() {
    this.projectName = this.projectName || '';
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
      console.log(event.target.value);
      this.projectName = event.target.value;
      this.fetchProjects();
    } else if (event.target.value.length == 0) {
      this.projectName = '';
      this.projectId = 0;
      // if (this.dashboard) {
      //   this.getDashBoardLeadsDetailsV1();
      // } else {
      //   this.getDashBoardLeadsDetails();
      // }
      this.fetchProjects();
    }
  }

  onAudioDialogClose() {
    this.openAudioDialog = false;
    this.currentAudio?.pause();
  }

  // Method to format time in mm:ss
  formatTime(seconds: any): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  }

  // Change audio time when clicking on progress bar

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

  // Options for the dropdown menu

  // @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger | undefined;
  //  menuOptions = ['Search By Sourse', 'Search By Name', 'Search By Opportunity Id','Assigned To'];

  //  // Method to handle the selection
  //  onMenuItemClick(option: string) {
  //    console.log('Selected Option:', option);
  //    // You can handle the action for each option here
  //    if (this.trigger) {
  //     this.trigger.closeMenu();
  //   }
  //  }
  // Options for the dropdown menu
  dropdownPosition: any = {};
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;
  onMenuClick(event: MouseEvent) {
    console.log('Menu clicked', event);
    // Additional logic can be added here if needed
  }
  menuOpen: boolean = false; // This controls the visibility of the menu
  // This will be bound to the input field

  // Toggle the visibility of the menu
  toggleMenu(event: MouseEvent) {
    this.menuOpen = !this.menuOpen;
    if (this.menuOpen) {
      this.setDropdownPosition(event);
    }
  }

  // Method to set the dropdown menu position
  setDropdownPosition(event: MouseEvent) {
    const button = event.target as HTMLElement;
    const rect = button.getBoundingClientRect();
    this.dropdownPosition = {
      top: `${rect.bottom + window.scrollY}px`, // Position the dropdown below the button
      //left: `${rect.left + window.scrollX}px`,  // Align with the left edge of the button
    };
  }

  // Method to close the menu
  closeMenu() {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && typeof activeElement.blur === 'function') {
      activeElement.blur();
    }
    this.menuOpen = false;
  }

  isDisplayStars(): boolean {
    return (
      this.user.roleName.toLowerCase() !== 'channel partner' &&
      this.user.roleName.toLowerCase() !== 'cp users'
    );
  }

  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }

  fetchLeadByPhoneNumberAndProject(): void {
    this.showLoading();
    const countryCode = this.countryCode;
    const phoneNumber = this.phoneNumber;
    const fullPhoneNumber = `${countryCode} ${phoneNumber}`.trim();
    const encodedPhoneNumber = encodeURIComponent(fullPhoneNumber);

    this.leadService.searchLead(encodedPhoneNumber, this.projectId).subscribe({
      next: (data: any) => {
        this.hideLoading();
        this.allLeads = data;
        this.totalItems = data.length;
        if (this.allLeads.length == 0) {
          this.isLeadsFound = false;
          this.isDisplayAddCpWalkIn = false;
          Swal.fire({
            title: 'Error',
            text: `Lead not found. Please create a lead to continue`,
            icon: 'info',
            cancelButtonText: 'Cancel',
            confirmButtonText: 'OK',
            showCancelButton: true,
            allowOutsideClick: false,
          }).then((result) => {
            if (result.isConfirmed) {
              this.isAddNewLead = true;
              this.goToGreForm();
            } else if (result.isDismissed) {
              console.log('User cancelled');
            }
          });
        } else {
          this.isLeadsFound = true;
          this.isDisplayAddCpWalkIn = true;
        }
        // console.log(this.isLeadsFound);
        this.uniqueLead = this.allLeads.find(
          (lead: any) => lead?.isAcquiredLead?.toLowerCase() === 'y'
        );
        // console.log(this.uniqueLead);
        // console.log(this.allLeads);
        //
        this.isDisplayAddCpWalkIn =
          this.allLeads?.map((e) => e.sourceId).filter((d) => d == 8).length >
          0;
        //If lead already site visit done
        if (this.uniqueLead !== undefined) {
          this.isDisplayAddCpWalkIn = false;
          this.lead = this.uniqueLead;
          // this.allLeads = [];
        }
      },
      error: (error: any) => {
        this.hideLoading();
        console.error('Error fetching lead data:', error);
        this.formData.patchValue({
          countryCode: this.formData.get('countryCode')?.value,
        });
      },
      complete: () => {
        console.log('Lead data fetch completed.');
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
    if (searchTerm.length === 0) {
      this.countryCode = '';
      this.selectedCountry = null;
    }
  }

  fetchCountryCodes() {
    this.commonService.getRefDetailsByType(this.countryCodeType).subscribe({
      next: (countryCodes) => {
        this.countryCodes = countryCodes;

        this.filteredCountries = countryCodes;
        this.setCountryCode();
      },
      error: (error) => {
        console.error('Error fetching lead types:', error);
      },
    });
  }

  setCountryCode(countryCode?: string) {
    if (this.countryCode?.length > 0) {
      const country = this.countryCodes.find(
        (country) => country.commonRefKey === this.countryCode
      );
      // this.formData.get('countryCode')?.setValue(country?.commonRefKey);
      this.selectedCountry = country;
    } else {
      const india = this.countryCodes.find(
        (country) => country.commonRefValue === 'India'
      );
      if (india) {
        this.selectedCountry = india;
        this.countryCode = india.commonRefKey;
        // this.formData.get('countryCode')?.setValue(india.commonRefKey);
      }
    }
  }

  onCountrySelect(event: any) {
    this.countryCode = event?.option.value?.commonRefKey;
  }
  displayCountryFn(country: any): string {
    return country?.commonRefKey || '';
  }

  onCpWalkInButtonClick() {
    this.isAddAsCpWalkIn = true;
    this.goToGreForm();
  }

  onAddNewLeadButtonClick() {
    this.isAddNewLead = true;
    this.goToGreForm();
  }

  // onDialogOpen(phoneNumber: string) {
  //   const countryCodePattern = /^\+\d{1,4}\s*/;
  //   const formatedPhoneNumber = phoneNumber.replace(countryCodePattern, '');

  //   this.leadService
  //     .getDuplicateLeadHistories(formatedPhoneNumber, 0, 20)
  //     .subscribe({
  //       next: (response) => {
  //         this.leadHistories = response.records;
  //         // this.totalItems = response.totalRecords;
  //         this.openDialog = true;
  //       },
  //       error: (error: any) => {
  //         console.error(error);
  //       },
  //     });
  // }

  displayErrorMessage() {
    if (this.uniqueLead.assignedSalesUserName !== undefined) {
      Swal.fire({
        title: 'Error',
        text: `Lead Already assigned to ${this.uniqueLead.assignedSalesUserName}`,
        icon: 'error',
        confirmButtonText: 'OK',
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
        }
      });
    }
  }
  resetInput() {
    // this.projectId = 0;
    // this.project = '';
    this.phoneNumber = '';
    // this.displayProject(new Project());
    this.formData.patchValue({ phoneNumber: '' });
    // this.project.reset('');
    this.allLeads = [];
    this.isAddAsCpWalkIn = false;
    this.isAddNewLead = false;
    this.isDisplayAddCpWalkIn = false;
  }
  getUserManageByUserId() {
    this.userManageService
      .fetchProjectsBasedOnUserId(this.user.userId, 0, 'A')
      .subscribe({
        next: (userManage) => {
          if (userManage) {
            this.projectId = userManage[0]?.projectId;

            if (this.projectId > 0)
              this.projectService
                .getProjectById(userManage[0]?.projectId)
                .subscribe({
                  next: (project) => {
                    //this.getUsers(this.organizationId);
                    this.project.patchValue(project);
                    this.formData
                      .get('projectId')
                      ?.patchValue(project.projectId);
                    this.project.disable();
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

  getSources(isDisplayWalkin?: boolean) {
    this.leadSourceService
      .fetchAllLeadSources()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.sources = response.filter((source) => source.name=='Channel Partner');

          // this.filteredSources = this.sources;
        },
      });
  }

  openLeadTransferDialog(leadId: number) {
    this.leadId = leadId;
    // Reset source and sub source selection for a fresh dialog
    this.sourceId = 0;
    this.subSourceId = 0;
    this.subSourceControl.setValue(null);
    // Optionally, fetch sources again if needed
    // this.getSources();
    if (leadId > 0) {
      this.fetchLeadById(leadId);
    }
    setTimeout(() => {
      const modal = document.querySelector('.modal-dialog') as HTMLElement;
      if (modal) {
        modal.style.position = '';
        modal.style.top = '';
        modal.style.left = '';
        modal.style.margin = '';
        modal.style.zIndex = '';
      }
    }, 0);
  }

  onDialogClose() {
    this.openDialog = false;
  }
  sendToApproval() {
    // alert(this.sourceId + ' ' + this.subSourceId);
    const payload: ILeadTransfer = {
      id: 0,
      leadId: this.leadId,
      requestedSourceId: this.sourceId,
      requestedSubSourceId: this.subSourceId,
      projectId: this.transferLead.projectId,
    };

    this.leadService.sendLeadTransferRequest(payload).subscribe({
      next: (response) => {
        this.leadCommonService.handleSuccessResponse(response);
        // Optionally, you can reset the form or perform other actions
        // this.sourceId = 0;
        // this.subSourceId = 0;
        // this.subSourceControl.setValue(null);
      },
      error: (error) => {
        console.error('Lead transfer request failed', error);
      },
    });
    this.openDialog = false;
  }
  onSelectSource(sourceId: number, subSourceName?: string) {
    this.sourceId = sourceId;
    this.displaySubSource('');
    this.subSourceControl.setValue(null);
    if (this.sourceId > 0) {
      this.fetchSbSources(this.sourceId);
    }
  }

  fetchSbSources(sourceId: number) {
    this.leadSubSourceService
      .fetchSubSources(sourceId, this.subSourceName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.subSources = response;
        },
        error: (error) => {
          console.error('Error fetching sub-sources:', error);
        },
      });
  }

  searchSubSource(event: any) {
    this.subSourceName = event.target.value;
    if (this.subSourceName.length >= 3) {
      this.fetchSbSources(this.sourceId);
    } else if (this.subSourceName.length == 0) {
      this.fetchSbSources(this.sourceId);
    }
  }

  onSubSourceSelect(event: any) {
    this.subSourceId = event.option.value.leadSubSourceId;
  }

  displaySubSource(source: any): string {
    return source && source?.name ? source.name : '';
  }

  fetchLeadById(leadId: number) {
    this.leadService.fetchLead(leadId).subscribe({
      next: (data: Lead) => {
        this.transferLead = data;
        this.commonReferenceDetailsService.getById(data.statusId).subscribe({
          next: (status) => {
            // alert(
            //   `Lead Status: ${status.commonRefValue} (${status.commonRefKey})`
            // );
            if (['VP', 'SVD', 'SVC', 'B'].includes(status.commonRefKey)) {
              Swal.fire({
                icon: 'warning',
                title: 'Transfer Blocked',
                text: 'Lead cannot be transferred.',
                confirmButtonText: 'OK',
              });
            } else {
              this.openDialog = true;
            }
          },
          error: (error) => {
            console.error('Error fetching lead status:', error);
          },
        });
      },
      error: (error: any) => {
        console.error('Error fetching lead data:', error);
      },
      complete: () => {
        console.log('Lead data fetch completed.');
      },
    });
  }
}
