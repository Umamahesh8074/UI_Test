import { formatDate } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DIGITAL_PARTNER } from 'src/app/Constants/CommanConstants/Comman';
import { ILeadSource } from 'src/app/Models/Presales/leadsource';
import { ILeadSubSourceDto } from 'src/app/Models/Presales/leadsubsource';
import { IProject, Project } from 'src/app/Models/Project/project';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { LeadService } from 'src/app/Services/Presales/Leads/lead.service';
import { LeadSourceService } from 'src/app/Services/Presales/LeadSource/lead-source.service';
import { LeadSubsourceService } from 'src/app/Services/Presales/LeadSubSource/lead-subsource.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { CommonreferencedetailsService } from 'src/app/Services/UserService/commonreferencedetails.service';

export interface FoodNode {
  name: string;
  children?: FoodNode[];
  lost?: number;
  siteVisitConfirm?: number;
  siteVisitDone?: number;
  booked?: number;
  junk?: number;
  nonContactable?: number;
  revisitConfirm?: number;
  reVisitDone?: number;
  newLeads?: any;
  visitProspect?: any;
  followup?: any;
  qualified?: any;
  totalLead?: any;
}

@Component({
  selector: 'app-leadreportpage',
  templateUrl: './leadreportpage.component.html',
  styleUrls: ['./leadreportpage.component.css'],
})
export class LeadreportpageComponent {
  treeData: any;
  private destroy$ = new Subject<void>();
  public leadSources: any = [];
  public leadSubSources: any = [];
  private leadSourceName: string = '';
  private leadSubSourceName: string = '';
  private leadSourceId: any;
  private leadSubSourceId: any;
  daysType: string = 'Filter_Days';
  dateRange: any = 0;
  formData!: FormGroup;
  leadSource: any = new FormControl([] as ILeadSource[]);
  leadSubSource: any = new FormControl([] as ILeadSubSourceDto[]);
  showDateRangePicker = false;
  startDate: any;
  endDate: any;
  days: CommonReferenceDetails[] = [];
  user: any;
  digitalPartner: any;
  digitalPartnerName: any;
  selectedDay: any;
  selectedprojectIds: any;
  projectName: any;
  
  projects: Project[]=[];
  project: any = new FormControl([] as IProject[]);
  projectId: any;
   @ViewChild('allProjectSelected') private allProjectSelected?: any;

  ngOnInit() {
   
    const user = localStorage.getItem('user');
    if (user != null) {
      this.user = JSON.parse(user);
      this.fetchProjects()
      this.getLeadReport();
    }
    this.fetchFilterDays();
    this.initForm();
    // this.getLeadReport();
    this.getLeadSource(this.leadSourceName);
    this.getDigitalPartner();
  }

  constructor(
    private leadService: LeadService,
    private leadSourceService: LeadSourceService,
    private leadSubSourceService: LeadSubsourceService,
    private formBuilder: FormBuilder,
    private commonService: CommanService,
    private loaderService: LoaderService,
    private projectService: ProjectService,
  ) {}

  expandedNodes: { [key: string]: boolean } = {};
  activeNodes = new Set<string>();

  toggle(nodeId: string): void {
    this.expandedNodes[nodeId] = !this.expandedNodes[nodeId];

    if (this.activeNodes.has(nodeId)) {
      this.activeNodes.delete(nodeId); // Deselect row
    } else {
      this.activeNodes.add(nodeId); // Select new row
    }
  }

  isExpanded(nodeId: string): boolean {
    return !!this.expandedNodes[nodeId];
  }

  getUniqueId(node: FoodNode, ...indices: number[]): string {
    return [node.name, ...indices].join('-');
  }

  isActive(nodeId: string): boolean {
    return this.activeNodes.has(nodeId);
  }

  getLeadReport() {
    console.log(this.user.userId);
    this.showLoading();
    this.leadService
      .getLeadReport(
        this.dateRange,
        this.startDate,
        this.endDate,
        this.leadSourceId,
        this.leadSubSourceId,
        this.user.userId,
        this.digitalPartnerName,
        this.projectId
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.treeData = [resp];
          this.hideLoading();
        },
        error: (err) => {
          this.hideLoading();
        },
      });
  }

  getLeadSource(leadSourceName: any) {
    this.leadSourceName = leadSourceName;
    this.leadSourceService
      .getAllLeadSource(leadSourceName, 0, 100)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (leadsource) => {
          this.leadSources = leadsource.records;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
  onLeadSourceSerach(serachText: string) {
    this.leadSourceName = serachText;
    this.getLeadSource(this.leadSourceName);
  }
  onLeadSubSourceSerach(serachText: string) {
    this.leadSubSourceName = serachText;
    this.getLeadSubSource(this.leadSubSourceName);
  }

  onLeadSourceSelect(event: any) {
    this.leadSubSource = new FormControl([] as ILeadSubSourceDto[]);
    console.log(event?.option.value);
    this.leadSourceId = event?.option.value?.leadSourceId;
    this.getLeadReport();
    this.getLeadSubSource(this.leadSubSourceName);
  }

  onLeadSubSourceSelect(event: any) {
    console.log(event?.option.value);
    this.leadSubSourceId = event?.option.value?.leadSubSourceId;
    this.getLeadReport();
    this.getLeadSubSource(this.leadSubSourceName);
  }

  displayLeadSource(leadSource: any): string {
    return leadSource && leadSource.name ? leadSource.name : 'All';
  }
  displayLeadSubSource(leadSubSource: any): string {
    return leadSubSource && leadSubSource.name ? leadSubSource.name : 'All';
  }
  getLeadSubSource(leadSourceName: any) {
    this.leadSubSourceName = leadSourceName;
    console.log(this.leadSubSourceName);
    this.leadSubSourceService
      .getAllLeadSubSource(this.leadSubSourceName, 0, 100, this.leadSourceId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (leadSubsource) => {
          this.leadSubSources = leadSubsource.records;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  formatDateTime(date: Date, isEndDate: boolean = false): string {
    if (isEndDate) {
      date.setHours(23, 59, 59, 999);
    }
    return formatDate(date, 'yyyy-MM-ddTHH:mm:ss.SSSSSS', 'en-IN');
  }
  private initForm(): void {
    this.formData = this.formBuilder.group({
      customStartDate: [],
      customEndDate: [],
    });
    this.formData.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((formDataValue) => {
        if (formDataValue.customStartDate && formDataValue.customEndDate) {
          const startDate = this.formatDateTime(formDataValue.customStartDate);
          const endDate = this.formatDateTime(
            formDataValue.customEndDate,
            true
          );
          this.startDate = startDate;
          this.endDate = endDate;
          this.getLeadReport();
        }
      });
  }

  fetchFilterDays() {
    this.commonService.getRefDetailsByType(this.daysType).subscribe({
      next: (response: CommonReferenceDetails[]) => {
        this.days = response;
        this.selectedDay = this.days.find((day) => day.commonRefKey === '0');
      },
      error: (error) => console.error(error),
    });
  }

  handleDaySelection(commonRefObject: CommonReferenceDetails) {
    this.dateRange = commonRefObject.commonRefKey;
    if (commonRefObject.commonRefValue.includes('Custom')) {
      console.log('Custom Date');
      this.showDateRangePicker = true;
      this.dateRange = '';
    } else {
      this.showDateRangePicker = false;
      this.startDate = null;
      this.endDate = null;
      this.formData.patchValue({
        customStartDate: null,
        customEndDate: null,
      });
      this.getLeadReport();
    }
  }

  getDigitalPartner() {
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
    console.log(event);
    this.digitalPartnerName = event;
    this.getLeadReport();
  }

  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }
  isSelectedProject(projectId?: number): boolean {
    return this.selectedprojectIds?.includes(projectId);
  }

  fetchProjectsByIds(selectedIds: any) {
    this.projectName = this.projectName || '';
    this.projectService
      .getProjectsByIds(this.projectName, this.user.organizationId, selectedIds, 'Y')
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
    this.project.patchValue('')
    this.projectService
      .getProjectsByIds('', this.user.organizationId, selectedIds, 'Y')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (projects: any) => {
          console.log(projects)
          this.projects = this.sortProject(this.projects, selectedIds)
          const selectedNames = projects
            .map((project: any) => project.projectName)
            .join(', ');
          console.log(selectedNames);
          this.project.patchValue(selectedNames);
          this.selectedprojectIds = selectedIds;
          console.log(this.selectedprojectIds)
          this.projectId = this.selectedprojectIds
          console.log(this.projectId)
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
    console.log(this.allProjectSelected.checked)
    // this.allProjectChecked=this.allProjectSelected.checked
    if (this.allProjectSelected.checked) {
      this.selectedprojectIds = this.projects.map((p: any) => p.projectId, 0)
    } else {
      this.selectedprojectIds = []
    }
    console.log(this.projectId)
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
    if(this.selectedprojectIds.length>0){
    this.projectService
      .getProjectsByIds('', this.user.organizationId, this.selectedprojectIds, 'Y')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (projects: any) => {
          console.log(projects)
          this.projects = this.sortProject(this.projects, this.selectedprojectIds)
          const selectedNames = projects
            .map((project: any) => project.projectName)
            .join(', ');
          console.log(selectedNames);
          this.project.patchValue(selectedNames);
        },
      });
    }
    else{
      this.project.patchValue('');
    }
  }

  isProjectAllSelected(): boolean {
    const allProjectIds = this.projects.map(p => p.projectId);
    return Array.isArray(this.selectedprojectIds) &&
           allProjectIds.length > 0 &&
           allProjectIds.every(id => this.selectedprojectIds.includes(id));
  }

  onProjectSelectButtonClick(){
    this.projectId=this.selectedprojectIds
   this.getLeadReport();
  }
 
  
  fetchProjects() {
    this.projectName = this.projectName || '';
    this.projectService
      .getAllProjects(this.projectName, 0, 1000, 'Y', this.user.organizationId)
      .subscribe({
        next: (projects) => {
          this.projects = projects.records;
          if (this.selectedprojectIds?.length > 0) {
            this.sortProject(this.projects, this.selectedprojectIds)
            console.log(this.projects)
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
    this.project.patchValue('')
    console.log(event);

    const selectedProject = project.projectId;
    console.log('selected project id' + selectedProject);

    // Get the sub-source ID
   console.log(this.selectedprojectIds)
    if (event.checked) {
      if (!this.selectedprojectIds) {
        this.selectedprojectIds = [];
      }
      this.selectedprojectIds?.push(selectedProject);
      this.displayProjectNames()
      // alert(this.selectedSubSourcesIds); // Add to selected IDs
    } else {
      // Remove sub-source ID from selected IDs
      this.selectedprojectIds = this.selectedprojectIds?.filter(
        (id: any) => id !== selectedProject
      );
      console.log(this.selectedprojectIds)
      if (this.selectedprojectIds?.length > 0) {
        this.displayProjectNames()
      }
      else if (this.selectedprojectIds?.length == 0) {
        this.project.patchValue('');
      }
}
   // this.projectId = this.selectedprojectIds
    console.log(this.projectId)
  }
  searchProject(event: any) {
    //this.isExportExcel = false;
    if (event.target.value.length >= 3) {
      this.projectName = event.target.value;
      this.fetchProjects();
    } else {
      this.projectName = '';
      this.fetchProjects();
    }
  }
}
