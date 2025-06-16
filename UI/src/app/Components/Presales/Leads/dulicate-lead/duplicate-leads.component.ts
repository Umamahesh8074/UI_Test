import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import {
  DIGITAL_PARTNER,
  leadPageSizeOptions,
} from 'src/app/Constants/CommanConstants/Comman';
import { ILeadFilterDto, Lead } from 'src/app/Models/Presales/lead';
import { LeadSource } from 'src/app/Models/Presales/leadsource';
import { LeadSubSource } from 'src/app/Models/Presales/leadsubsource';
import { IProject, Project } from 'src/app/Models/Project/project';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';
import { User } from 'src/app/Models/User/User';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LeadsCommonService } from 'src/app/Services/CommanService/leads-common.service';
import { FacebookLeadService } from 'src/app/Services/Presales/Facebook Leads/facebook-leadservice.service';
import { LeadService } from 'src/app/Services/Presales/Leads/lead.service';
import { LeadSubsourceService } from 'src/app/Services/Presales/LeadSubSource/lead-subsource.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';

@Component({
  selector: 'app-duplicate-leads',
  templateUrl: './duplicate-leads.component.html',
  styleUrls: ['./duplicate-leads.component.css'],
})
export class DuplicateLeadsComponent implements OnInit, OnDestroy {
  count: any;
  starCount: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  selectedprojectIds: any;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private leadService: LeadService,
    private formBuilder: FormBuilder,
    private leadsCommonService: LeadsCommonService,
    private commonService: CommanService,
    private leadSubSource: LeadSubsourceService,
    private projectService: ProjectService,
    private facebookLeadService: FacebookLeadService
  ) {}

  phoneNumber: string = '';
  lead: Lead = new Lead();
  leads: any[] = [];
  user: User = new User();
  destroy$ = new Subject<void>();
  pageSizeOptions = leadPageSizeOptions;
  isView: boolean = true;
  isSalesTeamFollowUs = false;
  displayedColumns: string[] = [
    'rowNumber',
    'name',
    'createdDate',
    'phoneNumber',
    'email',
    'projectName',
    'sourceName',
    'subSourceName',
    'actions',
  ];
  subSourceControl = new FormControl<string>('');
  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;

  subSources: LeadSubSource[] = [];
  subSourceId: number[] = [];
  stateData: any;
  // Pagination
  totalItems: number = 0;
  pageSize: number = 25;
  pageIndex: number = 0;
  isMenuLeads = true;
  dateRange: any = '7';
  leadStatus: any[] = [];
  customStartDate: any;
  customEndDate: any;
  showDateRangePicker: boolean = false;
  formData!: FormGroup;
  days: CommonReferenceDetails[] = [];
  selectedDay: any;
  daysType: string = 'Filter_Days';
  projects: Project[] = [];
  projectId: any = [];
  projectName: string = '';
  project: any = new FormControl([] as IProject[]);
  sources: LeadSource[] = [];
  filteredSources: LeadSource[] = [];
  sourceId: number = 0;
  sourceIds: number[] = [];
  subSourceIds: number[] = [];
  source: any = new FormControl([] as LeadSource[]);
  selectedSubSourcesIds: number[] = [];
  filteredSubSources: LeadSubSource[] = [];
  campaginName: any = '';
  campaginNames: any = [];
  selectedProject: IProject = new Project();
  campagin: any;
  isExportExcel: any = false;
  @ViewChild('allProjectSelected') private allProjectSelected?: any;
  onPageChange(event: any) {
    this.isExportExcel = false;
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getDuplicateLeads();
  }
  sourceSubsourceMap: { [key: number]: number[] } = {};
  digitalPartner: any = [];
  digitalPartnerName: any = '';
  @ViewChild('allSelected') private allSelected?: MatOption;

  ngOnInit() {
    this.initForm();
    this.initializeState();
    this.getDigitalParter();
    const user: any = localStorage.getItem('user');
    this.user = JSON.parse(user);
    if (this.user.roleName == 'DIGITAL_PARTNER') {
      this.digitalPartnerName = 'FLUTCH';
    }
    this.fetchFilterDays();
    this.fetchLeadSources();
    this.fetchProjects();
    this.getFacebookCampaginNames();
    this.getDuplicateLeads();
  }
  private initializeState() {
    this.getFacebookCampaginNames();
    console.error(history.state);
    const state = history.state;
    this.stateData = history.state;
    if (state.pageSize != undefined) {
      this.pageSize = state.pageSize;
    }
    if (state.pageIndex != undefined) {
      this.pageIndex = state.pageIndex;
    }
    this.dateRange = state.dateRange || '';
    this.customStartDate = state.customStartDate;
    this.customEndDate = state.customEndDate;
    this.phoneNumber = state.phoneNumber;
    this.sourceIds = state.sourceIds ? state.sourceIds : [];
    this.formData.patchValue({ sourceIds: this.sourceIds });
    // this.sourceId = state.sourceIds;
    if (this.sourceIds.length > 0) {
      this.patchStateSubSourcesBySourceIds(this.sourceIds);
    }
    this.projectId = state.projectId;
    if (this.projectId?.length > 0) {
      this.patchStateProjectIds(this.projectId);
    }
    this.subSourceId = state.selectedSubSourcesIds;
    this.selectedSubSourcesIds = state.selectedSubSourcesIds;
  }
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

  getDuplicateLeads() {
    //const encodedCampaginName= encodeURIComponent(this.campaginName);
    const filterDto: ILeadFilterDto = {
      name: '',
      phoneNumber: this.phoneNumber ?? '',
      sourceId: this.sourceIds ?? '',
      subSourceId: this.selectedSubSourcesIds ?? [],
      dateRange: this.dateRange ?? 7,
      startDate: this.customStartDate ?? '', // Check if startDate exists
      endDate: this.customEndDate ?? '', // Check if endDate exists
      projectId: this.projectId?.length > 0 ? this.projectId : [],
      page: this.pageIndex ?? 0,
      size: this.pageSize ?? 10,
      digitalPartner: this.digitalPartnerName ?? '',
      campaginName: this.campaginName ?? '',
      isExportExcel:
        this.isExportExcel != undefined ? this.isExportExcel : false,
    };

    console.log(filterDto);
    this.leadService
      .getDuplicateLeads(filterDto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          if (this.isExportExcel) {
            this.downloadXLSFile(
              response,
              'Duplicate_Leads ' + Date.now().toString(),
              false
            );
          } else {
            this.leads = response.records;
            this.totalItems = response.totalRecords;
          }
        },
        error: (error: any) => {
          console.log(error);
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  isNotLastColumn(event: MouseEvent): boolean {
    const clickedElement = event.target as HTMLElement;
    const parentRow = clickedElement.parentElement; // it's the parent element
    if (parentRow && parentRow.children) {
      const lastCell = parentRow.children[parentRow.children.length - 1];
      return clickedElement !== lastCell;
    }
    return true; // Default to true if structure is unexpected
  }
  onLeadRowClick(phoneNumber: string, leadId: number, leadName: string) {
    this.isView = false;
    this.onHistoryBtnClick(phoneNumber, leadId, leadName);
  }
  onHistoryBtnClick(phoneNumber: string, leadId: number, leadName: string) {
    this.isView = false;
    this.handleFollowups(phoneNumber, leadId, leadName);
  }

  handleFollowups(phoneNumber: string, leadId: number, leadName: string) {
    if (!this.isView) {
      console.log('leadId' + leadId + 'leadName' + leadName + 'oppertunityid');
      const route = '/layout/presales/duplicatehistory/leads';
      this.router.navigate([route], {
        state: {
          phoneNumber: this.phoneNumber,
          leadId: leadId,
          leadName: leadName,
          sourceIds: this.sourceIds,
          selectedSubSourcesIds: this.selectedSubSourcesIds,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          dateRange: this.dateRange,
          customStartDate: this.customStartDate,
          customEndDate: this.customEndDate,
          projectId: this.projectId,
          // statusId: this.statusId,
        },
      });
    }
  }
  // onSearch(phoneNumber: any) {
  //   this.isExportExcel = false;
  //   if (phoneNumber.length >= 3) {
  //     console.log('phoneNumber' + phoneNumber);
  //     this.phoneNumber = phoneNumber;
  //     this.getDuplicateLeads();
  //   } else if (phoneNumber.length == 0) {
  //     console.log('phoneNumber' + phoneNumber);
  //     this.phoneNumber = phoneNumber;
  //     this.getDuplicateLeads();
  //   }
  // }
  onSearch(phoneNumber: any) {
    this.isExportExcel = false;
    this.phoneNumber = phoneNumber;
    // this.pageIndex = 0;
    // this.paginator.firstPage();
    // }
    if (this.phoneNumber.length === 0) {
      this.getDuplicateLeads();
    }
  }

  handleDaySelection(commonRefObject: CommonReferenceDetails | null) {
    this.isExportExcel = false;
    // If "All" option is selected
    if (!commonRefObject) {
      console.log('All selected');
      this.dateRange = 999;
      this.customStartDate = null;
      this.customEndDate = null;
      this.formData.patchValue({
        customStartDate: null,
        customEndDate: null,
      });
      this.showDateRangePicker = false;
      this.isMenuLeads = false;
      this.getDuplicateLeads();
    } else {
      this.dateRange = commonRefObject.commonRefKey;

      if (
        commonRefObject.commonRefValue &&
        commonRefObject.commonRefValue.includes('Custom')
      ) {
        console.log('Custom Date');
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
        this.getDuplicateLeads();
        this.showDateRangePicker = false;
      }
    }
  }

  private initForm(): void {
    this.formData = this.formBuilder.group({
      customStartDate: [],
      customEndDate: [],
      sourceIds: new FormControl(''),
    });
    this.formData.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((formDataValue) => {
        if (formDataValue.customStartDate && formDataValue.customEndDate) {
          const startDate = this.leadsCommonService.formatDateTime(
            formDataValue.customStartDate
          );
          const endDate = this.leadsCommonService.formatDateTime(
            formDataValue.customEndDate,
            true
          );
          this.customStartDate = startDate;
          this.customEndDate = endDate;
          this.isMenuLeads = false;
          this.getDuplicateLeads();
        }
      });
  }

  private handleDateRange(state: any) {
    if (state.customStartDate && state.customEndDate) {
      this.showDateRangePicker = true;
      this.formData.patchValue({
        customStartDate: state.customStartDate,
        customEndDate: state.customEndDate,
      });
      this.selectedDay = this.days.find((day) =>
        day.commonRefValue.includes('Custom')
      );
    } else {
      this.dateRange = state.dateRange;
      this.selectedDay = this.days.find(
        (day) => day.commonRefKey == this.dateRange
      );
    }
  }
  private fetchFilterDays() {
    this.commonService.getRefDetailsByType(this.daysType).subscribe({
      next: (response: CommonReferenceDetails[]) => {
        this.days = response;
        this.days = this.days.filter(
          (day) => !day.commonRefValue.toLowerCase().includes('next')
        );
        //Default Last 7 days
        this.selectedDay = this.days.find((day) => day.commonRefKey === '7');
        // this.handleDateRange(this.stateData);
        this.dateRange = this.selectedDay.commonRefKey;
        this.getDuplicateLeads();
      },
      error: (error) => console.error(error),
    });
  }
  // private fetchFilterDays() {
  //   this.commonService.getRefDetailsByType(this.daysType).subscribe({
  //     next: (response: CommonReferenceDetails[]) => {
  //       this.days = response.filter((day) => {
  //         const value = day.commonRefValue.toLowerCase();
  //         return !value.includes('tomo') && !value.includes('next');
  //       });
  //       // this.handleDateRange(this.stateData);
  //     },
  //     error: (error) => console.error(error),
  //   });
  // }

  searchProject(event: any) {
    this.isExportExcel = false;
    if (event.target.value.length >= 3) {
      this.projectName = event.target.value;
      this.fetchProjects();
    } else {
      this.projectName = '';
      this.fetchProjects();
    }
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
  displayProject(project: IProject): string {
    return project && project.projectName ? project.projectName : 'All';
  }

  selectedSources: LeadSource[] = [];

  onSelectionSourceChange(event: any) {
    this.isExportExcel = false;
    // console.log(event.value);
    const selectedIds = event.value;
    this.sourceId = selectedIds;
    this.sourceIds = selectedIds;
    // Handle deselection logic by comparing currently selected sources with previously selected ones
    const previouslySelectedSources = Object.keys(this.sourceSubsourceMap).map(
      Number
    );
    const deselectedSourceIds = previouslySelectedSources.filter(
      (sourceId) => !selectedIds.includes(sourceId)
    );
    // console.log(deselectedSourceIds);

    // Remove related sub-sources when source is deselected
    deselectedSourceIds.forEach((sourceId) => {
      if (this.sourceSubsourceMap[sourceId]) {
        const subsourceIds = this.sourceSubsourceMap[sourceId];

        // Remove each subSourceId from selectedSubSourcesIds
        subsourceIds.forEach((subSourceId) => {
          this.selectedSubSourcesIds = this.selectedSubSourcesIds?.filter(
            (id) => id !== subSourceId
          );
        });

        // Remove the entry from sourceSubsourceMap
        delete this.sourceSubsourceMap[sourceId];
      }
    });

    console.log(this.selectedSubSourcesIds); // Corrected log statement for selectedSubSourcesIds
    this.subSourceId = this.selectedSubSourcesIds;
    console.log(
      'Updated sourceSubsourceMap after deselection:',
      this.sourceSubsourceMap
    );
    console.log('Updated selectedSubSourcesIds:', this.selectedSubSourcesIds);

    // For newly selected sources, ensure the sourceSubsourceMap is initialized
    selectedIds.forEach((sourceId: number) => {
      // this.sourceId = sourceId; // Set the current sourceId
      // Initialize array if the sourceId doesn't exist in the map
      if (!this.sourceSubsourceMap[sourceId]) {
        this.sourceSubsourceMap[sourceId] = [];
      }
      console.log(
        `Map for sourceId ${sourceId}:`,
        this.sourceSubsourceMap[sourceId]
      );
    });

    // this.paginator.firstPage();
    console.log(selectedIds);
    this.fetchSubSourcesBySourceIds(selectedIds);
    this.sourceIds = selectedIds;
    this.getDuplicateLeads();
  }

  fetchSubSourcesBySourceIds(selectedIds: number[]): void {
    // console.log(selectedIds);
    this.leadSubSource
      .fetchBySourceIds(selectedIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (subSources: any) => {
          this.subSources = subSources;
          this.filteredSubSources = this.subSources;
          this.filteredSubSources = this.sortSubSources(this.subSources);
          this.selectedSubSourcesIds = this.selectedSubSourcesIds?.filter(
            (id) =>
              this.filteredSubSources.some(
                (subSource) => subSource.leadSubSourceId === id
              )
          );

          this.getDuplicateLeads();
        },
      });
  }

  sortSubSources(subSources: any[]): any[] {
    return subSources.sort((a, b) => {
      const aSelected = this.selectedSubSourcesIds?.includes(a.leadSubSourceId);
      const bSelected = this.selectedSubSourcesIds?.includes(b.leadSubSourceId);

      // Place selected items first, then unselected items
      return aSelected === bSelected ? 0 : aSelected ? -1 : 1;
    });
  }
  onSelectionSubSourceChange(subSource: any, event: any) {
    this.isExportExcel = false;
    const selectedSubSourceId = subSource.leadSubSourceId;

    // Get the sub-source ID
    // console.log(this.sourceSubsourceMap);
    const sourceId = subSource.sourceId; // Get the corresponding source ID
    if (event.checked) {
      if (this.sourceSubsourceMap[sourceId]) {
        this.sourceSubsourceMap[sourceId]?.push(selectedSubSourceId);
      }

      if (!this.selectedSubSourcesIds) {
        this.selectedSubSourcesIds = [];
      }
      this.selectedSubSourcesIds?.push(selectedSubSourceId);

      // alert(this.selectedSubSourcesIds); // Add to selected IDs
    } else {
      // Remove sub-source ID from selected IDs
      this.selectedSubSourcesIds = this.selectedSubSourcesIds?.filter(
        (id) => id !== selectedSubSourceId
      );

      // Remove sub-source ID from sourceSubsourceMap
      if (this.sourceSubsourceMap[sourceId]) {
        this.sourceSubsourceMap[sourceId] = this.sourceSubsourceMap[
          sourceId
        ].filter((id) => id !== selectedSubSourceId);

        // Optional: Remove the key from the map if the array is empty
        if (this.sourceSubsourceMap[sourceId].length === 0) {
          delete this.sourceSubsourceMap[sourceId];
        }
      }
    }

    console.log('Updated sourceSubsourceMap:', this.sourceSubsourceMap);
    // Additional processing
    this.filteredSubSources = this.sortSubSources(this.filteredSubSources);

    console.log('Selected SubSource IDs:', this.selectedSubSourcesIds);
    console.log('Selected Sources:', this.selectedSources);

    // this.paginator.firstPage();
    this.subSourceId = this.selectedSubSourcesIds;
    this.getDuplicateLeads();

    // Trigger any additional updates or API calls
  }
  isSelected(subSourceId: number): boolean {
    return this.selectedSubSourcesIds?.includes(subSourceId);
  }
  searchSubSource(event: any): void {
    const searchTerm = event.target.value.toLowerCase();
    if (!searchTerm) {
      this.filteredSubSources = [...this.subSources];
    } else {
      this.filteredSubSources = this.subSources.filter((source) =>
        source.name.toLowerCase()?.includes(searchTerm)
      );
    }
    this.filteredSubSources = this.filteredSubSources.sort((a, b) => {
      const aSelected = this.selectedSubSourcesIds?.includes(a.leadSubSourceId);
      const bSelected = this.selectedSubSourcesIds?.includes(b.leadSubSourceId);

      // Place selected items first, then unselected items
      return aSelected === bSelected ? 0 : aSelected ? -1 : 1;
    });
  }

  fetchLeadSources(): void {
    this.leadService.fetchLeadSources().subscribe({
      next: (sources: LeadSource[]) => {
        this.sources = sources;
        // console.log(this.sources);
        this.filteredSources = this.sources;
      },
      error: (error: any) => {
        console.error('Error fetching lead sources:', error);
      },
    });
  }

  getDigitalParter() {
    this.commonService.fetchCommonReferenceTypes(DIGITAL_PARTNER).subscribe({
      next: (data) => {
        this.digitalPartner = data.filter(
          (e) => e.commonRefKey == 'DIGITAL_PARTNER'
        );
        //this.setDefaultStatus();
      },
      error: (error) => {
        console.error(error?.message);
      },
    });
  }

  handleDigitalParterSelection(event: any) {
    this.isExportExcel = false;
    this.digitalPartnerName = event;
    this.getDuplicateLeads();
  }
  displayFn(campaginName: any): string {
    return campaginName && campaginName.campaginName
      ? campaginName.campaginName
      : 'All';
  }

  onCampaginSelect(event: any) {
    this.isExportExcel = false;
    // console.log(event.option.value.campaginName);
    this.campaginName = event.option.value.campaginName;
    this.campaginName = this.campaginName ? this.campaginName : '';
    this.getDuplicateLeads();
  }

  getFacebookCampaginNames() {
    const encodedCampaginName = encodeURIComponent(this.campaginName);
    this.facebookLeadService
      .getFacebookCamapaginNames(encodedCampaginName, this.digitalPartnerName)
      .subscribe({
        next: (data) => {
          this.campaginNames = data;
        },
        error: (error) => {
          console.error(error?.message);
        },
      });
  }

  onSearchCampaginName(input: any) {
    this.isExportExcel = false;
    if (input.length >= 3) {
      this.campaginName = input;
      this.getFacebookCampaginNames();
    } else if (input.length == 0) {
      this.campaginName = '';
      this.getFacebookCampaginNames();
    }
  }

  generateLeadsReport() {
    this.isExportExcel = true;
    this.getDuplicateLeads();
  }

  tosslePerOne(): void {
    this.isExportExcel = false;
    this.sourceIds = this.formData.value.sourceIds;

    if (this.allSelected?.selected) {
      this.allSelected.deselect();
      this.sourceIds = this.formData.value.sourceIds;
    }
    if (
      this.formData.controls['sourceIds'].value.length == this.sources.length
    ) {
      this.allSelected?.select();
      this.sourceIds = [];
    }
    // this.sourceIds = this.formData.value.sourceIds;
    // this.updateSubSourceIds();
    this.fetchSubSourcesBySourceIds(this.sourceIds);
    // this.getDuplicateLeads();
  }

  toggleAllSelection() {
    this.isExportExcel = false;
    if (this.allSelected?.selected) {
      // alert('all selected');
      this.selectedSubSourcesIds = [];
      this.subSourceId = [];

      this.formData.controls['sourceIds'].patchValue([
        ...this.sources.map((item) => item.leadSourceId),
        0,
      ]);

      // this.sourceIds = [];
    } else {
      // alert('elseeeeeeeeeeee');
      this.formData.controls['sourceIds'].patchValue([]);
      this.sourceIds = this.formData.value.sourceIds;
    }
    this.sourceIds = this.formData.value.sourceIds;
    // this.sourceIds = this.formData.value.sourceIds;
    // this.updateSubSourceIds();
    this.fetchSubSourcesBySourceIds(this.sourceIds);
  }

  updateSubSourceIds() {
    const selectedSourceIdsSet = new Set(this.sourceIds);
    if (!this.subSourceId) {
      this.subSourceId = [];
    }
    // else {
    this.subSourceId = this.subSourceId?.filter((subSourceId) =>
      this.subSources.some(
        (sub) =>
          sub.leadSubSourceId === subSourceId &&
          selectedSourceIdsSet.has(sub['leadSourceId'])
      )
    );
    // }
  }
  patchStateSubSourcesBySourceIds(selectedIds: number[]): void {
    console.log(selectedIds);
    this.leadSubSource
      .fetchBySourceIds(selectedIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (subSources: any) => {
          this.subSources = subSources;
          this.filteredSubSources = this.subSources;
          this.filteredSubSources = this.sortSubSources(this.subSources);
          // this.displaySelectedSubSource();
          const stateSubSources = this.subSources.filter((source: any) =>
            this.selectedSubSourcesIds.includes(source.leadSubSourceId)
          );

          const selectedNames = stateSubSources
            .map((source: any) => source.name)
            .join(', ');
          // console.log(selectedNames);
          console.log(this.subSourceControl);

          this.subSourceControl?.patchValue(selectedNames);
          this.selectedSubSourcesIds = this.selectedSubSourcesIds;
        },
      });
  }

  onClickSearchButton() {
    this.isExportExcel = false;
    if (this.phoneNumber.length > 0) {
      this.getDuplicateLeads();
    }
  }

  isSelectedProject(projectId?: number): boolean {
    return this.selectedprojectIds?.includes(projectId);
  }

  fetchProjectsByIds(selectedIds: any) {
    this.projectName = this.projectName || '';
    this.projectService
      .getProjectsByIds(
        this.projectName,
        this.user.organizationId,
        selectedIds,
        'Y'
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

  patchStateProjectIds(selectedIds: number[]): void {
    this.project.patchValue('');
    this.projectService
      .getProjectsByIds('', this.user.organizationId, selectedIds, 'Y')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (projects: any) => {
          console.log(projects);
          this.projects = this.sortProject(this.projects, selectedIds);
          const selectedNames = projects
            .map((project: any) => project.projectName)
            .join(', ');
          console.log(selectedNames);
          this.project.patchValue(selectedNames);
          this.selectedprojectIds = selectedIds;
          console.log(this.selectedprojectIds);
          this.projectId = this.selectedprojectIds;
          console.log(this.projectId);
          //  this.checkAllProjectSeleted(this.selectedprojectIds)
          //this.isSelectedProject();
          // this.selectedSubSourcesIds = this.selectedSubSourcesIds;
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
    this.isExportExcel = false;
    console.log(this.allProjectSelected.checked);
    // this.allProjectChecked=this.allProjectSelected.checked
    if (this.allProjectSelected.checked) {
      this.selectedprojectIds = this.projects.map((p: any) => p.projectId, 0);
    } else {
      this.selectedprojectIds = [];
    }
    console.log(this.projectId);
    //this.projectId = this.selectedprojectIds
    this.displayProjectNames();
    // if (this.isUnassignedLeads) {
    //   this.getDashBoardUnassignedLeadsDetails();
    // } else if (this.dashboard && !this.isCTODashboard) {
    //   this.getDashBoardLeadsDetailsV1();
    // } else if (this.isCTODashboard) {
    //   this.getDashBoardLeadsDetailsNew();
    // } else if (this.currentStatusDashboard) {
    //   this.getDashBoardLeadsCurrentStatusDetails();
    // } else {
    //   this.getDashBoardLeadsDetails();
    // }
  }

  displayProjectNames() {
    if (this.selectedprojectIds.length > 0) {
      this.projectService
        .getProjectsByIds(
          '',
          this.user.organizationId,
          this.selectedprojectIds,
          'Y'
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (projects: any) => {
            console.log(projects);
            this.projects = this.sortProject(
              this.projects,
              this.selectedprojectIds
            );
            const selectedNames = projects
              .map((project: any) => project.projectName)
              .join(', ');
            console.log(selectedNames);
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
      Array.isArray(this.selectedprojectIds) &&
      allProjectIds.length > 0 &&
      allProjectIds.every((id) => this.selectedprojectIds.includes(id))
    );
  }

  onProjectSelectButtonClick() {
    this.projectId = this.selectedprojectIds;
    this.isExportExcel = false;
    this.getDuplicateLeads();
  }

  fetchProjects() {
    this.projectName = this.projectName || '';
    this.projectService
      .getAllProjects(this.projectName, 0, 1000, 'Y', this.user.organizationId)
      .subscribe({
        next: (projects) => {
          this.projects = projects.records;
          if (this.selectedprojectIds?.length > 0) {
            this.sortProject(this.projects, this.selectedprojectIds);
            console.log(this.projects);
            // const projectId = this.projects.map(p => p.projectId)
            // console.log(this.projects)
            // if (projectId.length == this.selectedprojectIds.length) {
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
  onProjectSelect(project: any, event: any) {
    //this.allProjectChecked=false;
    this.project.patchValue('');
    console.log(event);

    const selectedProject = project.projectId;
    console.log('selected project id' + selectedProject);

    // Get the sub-source ID
    console.log(this.selectedprojectIds);
    if (event.checked) {
      if (!this.selectedprojectIds) {
        this.selectedprojectIds = [];
      }
      this.selectedprojectIds?.push(selectedProject);
      this.displayProjectNames();
      // alert(this.selectedSubSourcesIds); // Add to selected IDs
    } else {
      // Remove sub-source ID from selected IDs
      this.selectedprojectIds = this.selectedprojectIds?.filter(
        (id: any) => id !== selectedProject
      );
      console.log(this.selectedprojectIds);
      if (this.selectedprojectIds?.length > 0) {
        this.displayProjectNames();
      } else if (this.selectedprojectIds?.length == 0) {
        this.project.patchValue('');
      }
    }
    // this.projectId = this.selectedprojectIds
    console.log(this.projectId);
  }
}
