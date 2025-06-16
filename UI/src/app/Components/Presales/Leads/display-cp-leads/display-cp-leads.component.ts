import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { Subject, takeUntil } from 'rxjs';
import {
  PAGE_INDEX,
  PAGE_SIZE,
  pageSizeOptions,
  TOTAL_ITEMS,
} from 'src/app/Constants/CommanConstants/Comman';
import { LeadDto } from 'src/app/Models/Presales/lead';
import { LeadSource } from 'src/app/Models/Presales/leadsource';
import { LeadSubSource } from 'src/app/Models/Presales/leadsubsource';
import { IProject, Project } from 'src/app/Models/Project/project';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';
import { User } from 'src/app/Models/User/User';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LeadService } from 'src/app/Services/Presales/Leads/lead.service';
import { LeadSubsourceService } from 'src/app/Services/Presales/LeadSubSource/lead-subsource.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { CommonreferencedetailsService } from 'src/app/Services/UserService/commonreferencedetails.service';

@Component({
  selector: 'app-display-cp-leads',
  templateUrl: './display-cp-leads.component.html',
  styleUrls: ['./display-cp-leads.component.css'],
})
export class DisplayCpLeadsComponent implements OnInit {
  totalItems: number = TOTAL_ITEMS;
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  pageSizeOptions = pageSizeOptions;
  protected destroy$ = new Subject<void>();
  leads: LeadDto[] = [];
  user: User = new User();
  userId: number = 0;
  roleId: number = 0;
  organizationId: number = 0;
  displayedColumns: string[] = [
    'rowNumber',
    'opportunityId',
    'name',
    'projectName',
    'sourceName',
    'subSource',
    'createdDate',
    'status',
    'currentFollowUpDate',
    'prevStatus',
    'followUpDate',
    'assignedToSaleDate',
    'remarks',
    'actions',
  ];
  sources: LeadSource[] = [];
  selectedSource: any;
  sourceId: any;
  phoneNumber: string = '';
  projectId: number = 0;
  projectName: string = '';
  projects: Project[] = [];
  project: any = new FormControl([] as IProject[]);
  formData!: FormGroup;
  moduleNames: string[] = [];
  leadStatus: any[] = [];
  statusId: any;
  dropdownPosition: any = {};
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;
  opportunityId: string = '';
  userName: string = '';
  subSources: LeadSubSource[] = [];
  selectedSubSourcesIds: number[] = [];
  subSourceControl: any;
  filteredSubSources: any[] = [];
  paginator: any;
  subSourceId: number[] = [];
  customStartDate: any;
  customEndDate: any;
  showDateRangePicker: boolean=false;
  dateRange: any;
  daysType: string = 'Filter_Days';
  days: CommonReferenceDetails[] = [];
  selectedDay:string= "";
  
  constructor(
    private leadService: LeadService,
    private projectServie: ProjectService,
    private commonRefDetailService: CommonreferencedetailsService,
    private leadSubSource: LeadSubsourceService,
    private commonService: CommanService,
  ) {}

  ngOnInit(): void {
    this.getUserFormLocalStorage();
    this.fetchLeadSources();
    this.fetchProjects();
    this.getAllLeadStatus();
    this.fetchFilterDays();
  }
  getUserFormLocalStorage() {
    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
      this.userId = this.user.userId;
      this.organizationId = this.user.organizationId;
      this.roleId = this.user.roleId;
    }
  }
  getCpLeadsData() {
    this.leadService
      .getDashBoardLeadsDetails(
        this.userId,
        this.roleId,
        '',
        this.pageIndex,
        this.pageSize,
        false,
        this.dateRange,
        this.customStartDate,
        this.customStartDate,
        this.projectId,
        this.sourceId,
        this.subSourceId,
        this.statusId,
        '',
        0,
        this.phoneNumber,
        this.userName,
        0,
        this.opportunityId
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.leads = response.records;
          this.totalItems = response.totalRecords;
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }
  fetchLeadSources(): void {
    this.leadService.fetchLeadSources().subscribe({
      next: (sources: LeadSource[]) => {
        this.sources = sources;
        this.patchSelectedSource();
      },
      error: (error: any) => {
        console.error('Error fetching lead sources:', error);
      },
    });
  }
  patchSelectedSource() {
    console.log(this.sources);
    this.selectedSource = this.sources.find(
      (source: { name: string | string[] }) =>
        source.name.includes('Channel Partner')
    );
    console.log(this.selectedSource);

    this.sourceId = this.selectedSource.leadSourceId;
    console.log(this.sourceId);
    this.fetchSubSourcesBySourceIds(this.sourceId);
    this.getCpLeadsData();
  }
  onPageChange(event: any) {  
     this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getCpLeadsData();
  }
  onSearch(phoneNumber: any) {
    if (phoneNumber.length >= 6 || phoneNumber.length == 0) {
      this.phoneNumber = phoneNumber;
      this.getCpLeadsData();
    }
  }
  onProjectSelect(event: any) {
    this.projectId = event.option.value.projectId;
    this.getCpLeadsData();
  }

  displayProject(project: any) {
    if (typeof project === 'number' && project != undefined) {
      const pro = this.projects.find((p) => p.projectId === project);
      return pro && pro.projectName;
    } else if (project != undefined) {
      return project && project.projectName ? project.projectName : '';
    }
  }

  searchProject(event: any): void {
    const query = event.target.value;
    if (query.length >= 3) {
      this.projectName = query;
      this.fetchProjects();
    } else if (query.length == 0) {
      this.projectName = '';
      this.fetchProjects();
    }
  }
  fetchProjects = (): void => {
    this.projectServie
      .getProjectsByOrgIdWithProjectFilter(
        this.organizationId,
        this.projectName
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (projects: Project[]) => {
          this.projects = projects;
          console.log(this.projects);
        },
        error: (error: Error) => {
          console.error('Error fetching projects:', error);
        },
      });
  };
  getAllLeadStatus() {
    this.moduleNames = ['S', 'P', 'PS'];
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
  onStatusSelectionChange(event: any) {
    this.statusId = event.value;
    if (this.statusId === 'all') {
      this.statusId = '';
    }
    this.getCpLeadsData();
  }

  onMenuClick(event: MouseEvent) {
    console.log('Menu clicked', event);
  }
  menuOpen: boolean = false;

  toggleMenu(event: MouseEvent) {
    this.menuOpen = !this.menuOpen;
    if (this.menuOpen) {
      this.setDropdownPosition(event);
    }
  }
  setDropdownPosition(event: MouseEvent) {
    const button = event.target as HTMLElement;
    const rect = button.getBoundingClientRect();
    this.dropdownPosition = {
      top: `${rect.bottom + window.scrollY}px`,
    };
  }
  closeMenu() {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && typeof activeElement.blur === 'function') {
      activeElement.blur();
    }
    this.menuOpen = false;
  }
  onSearchOpportunityId(opportunityId: string) {
    if (opportunityId.length >= 3 || opportunityId.length == 0) {
      this.opportunityId = opportunityId;
      this.getCpLeadsData();
    }
  }
  onSearchUserName(userName: string) {
    if (userName.length >= 3 || userName.length == 0) {
      this.userName = userName;
      this.getCpLeadsData();
    }
  }
  sourceSubsourceMap: { [key: number]: number[] } = {};

  onSelectionSubSourceChange(subSource: any, event: any) {
    const selectedSubSourceId = subSource.leadSubSourceId;
    // Get the sub-source ID
    const sourceId = subSource.sourceId; // Get the corresponding source ID
    if (event.checked) {
      if (this.sourceSubsourceMap[sourceId]) {
        this.sourceSubsourceMap[sourceId]?.push(selectedSubSourceId);
      }
      this.selectedSubSourcesIds?.push(selectedSubSourceId); // Add to selected IDs
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
    this.subSourceId = this.selectedSubSourcesIds;
    // Trigger any additional updates or API calls
    this.getCpLeadsData();
  }

  sortSubSources(subSources: any[]): any[] {
    return subSources.sort((a, b) => {
      const aSelected = this.selectedSubSourcesIds?.includes(a.leadSubSourceId);
      const bSelected = this.selectedSubSourcesIds?.includes(b.leadSubSourceId);

      // Place selected items first, then unselected items
      return aSelected === bSelected ? 0 : aSelected ? -1 : 1;
    });
  }

  isAllSelected() {
    return this.subSources.length === this.selectedSubSourcesIds.length;
  }
  filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    const selected = this.subSources.filter((subSource) =>
      this.isSelected(subSource.leadSubSourceId)
    );
    const unselected = this.subSources.filter(
      (subSource) =>
        !this.isSelected(subSource.leadSubSourceId) &&
        subSource.name.toLowerCase().includes(filterValue)
    );

    // Combine selected users at the top
    return [...selected, ...unselected];
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

  displaySubSource(SubSource: LeadSubSource): string {
    return SubSource && SubSource.name ? SubSource.name : '';
  }
  isSelected(subSourceId: number): boolean {
    return this.selectedSubSourcesIds?.includes(subSourceId);
  }

  selectedSources: LeadSource[] = [];

  fetchSubSourcesBySourceIds(selectedIds: number[]): void {
    console.log(selectedIds);
    this.leadSubSource
      .fetchBySourceIds(selectedIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (subSources: any) => {
          this.subSources = subSources;
          this.filteredSubSources = this.subSources;
          this.filteredSubSources = this.sortSubSources(this.subSources);
        },
      });
  }
   handleDaySelection(commonRefObject: CommonReferenceDetails | null) {
      // If "All" option is selected
      if (!commonRefObject) {
        this.dateRange = 999;
        this.customStartDate = null;
        this.customEndDate = null;
        this.showDateRangePicker = false;
        this.getCpLeadsData();
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
          // this.formData.patchValue({
          //   customStartDate: null,
          //   customEndDate: null,
          // });
          this.showDateRangePicker = false;
        }
        this.getCpLeadsData();
      }
    }
    private fetchFilterDays() {
      this.commonService.getRefDetailsByType(this.daysType).subscribe({
        next: (response: CommonReferenceDetails[]) => {
          this.days = response.filter((day) => {
            const value = day.commonRefValue.toLowerCase();
            return !value.includes('tomo') && !value.includes('next');
          });
          // this.handleDateRange(this.stateData);
        },
        error: (error) => console.error(error),
      });
    }
}

