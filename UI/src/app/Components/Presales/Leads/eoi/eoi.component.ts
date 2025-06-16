import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LOGIN } from 'src/app/Apis/UserApis/User';
import { CommonReferenceType } from 'src/app/Models/CommanModel/menuDto';
import { LeadSource } from 'src/app/Models/Presales/leadsource';
import { LeadSubSource } from 'src/app/Models/Presales/leadsubsource';
import { ISalesTeamDto } from 'src/app/Models/Presales/salesteam';
import { IProject, Project } from 'src/app/Models/Project/project';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { EoiService } from 'src/app/Services/Presales/eoi.service';
import { LeadService } from 'src/app/Services/Presales/Leads/lead.service';
import { LeadSourceService } from 'src/app/Services/Presales/LeadSource/lead-source.service';
import { LeadSubsourceService } from 'src/app/Services/Presales/LeadSubSource/lead-subsource.service';
import { SaleteamService } from 'src/app/Services/Presales/SalesTeam/saleteam.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { CommonreferencedetailsService } from 'src/app/Services/UserService/commonreferencedetails.service';

@Component({
  selector: 'app-eoi',
  templateUrl: './eoi.component.html',
  styleUrls: ['./eoi.component.css'],
})
export class EoiComponent implements OnInit {
  formData!: FormGroup;
  isAdding: boolean = true;
  UnitTypes: string = 'Unit';
  UnitName: string = '2 BHK';
  unitTypeData: CommonReferenceType[] = [];
  unitDetails: any;
  leadSourceData: LeadSource[] = [];
  subSource: LeadSubSource[] = [];
  cpId: any;
  subSourceName: any;
  sourceId: number = 8;
  organizationId: number = 0;
  private destroy$ = new Subject<void>();
  salesTeam: ISalesTeamDto[] = [];
  projectName: string = '';
  floorPreference: string = 'Floor_Preference';
  floorData: CommonReferenceType[] = [];
  projectsData: Project[] = [];
  projectId: number = 0;
  selectedProject: IProject = new Project();
  selectedSubSource: LeadSubSource = new LeadSubSource(0, '', 0, '', '');

  projectFc: FormControl = new FormControl([] as Project[]);
  subSourceFc: FormControl = new FormControl([] as LeadSubSource[]);
  @ViewChild('checkFileInput') checkFileInput!: ElementRef;
  fileNames: any = {
    checkFile: null,
    
  };
  fileErrors: any = {
    ownerPanCard: null,
    rera: null,
    ownerAadhar: null,
    personAadhar: null,
    gst: null,
  };
  constructor(
    private router: Router,
    private builder: FormBuilder,
    private commonService: CommanService,
    private commonRefDetailsService: CommonreferencedetailsService,
    private leadSource: LeadSourceService,
    private leadservice: LeadService,
    private salesTeamService: SaleteamService,
    private eoiService: EoiService,
    private leadSubSource: LeadSubsourceService,
    private projectService: ProjectService
  ) {}
  ngOnInit(): void {
    this.initializeFormData();
    this.initializeFieldValidators(
      'secondApplPanNumber',
      '[A-Z]{5}[0-9]{4}[A-Z]{1}'
    );
    this.initializeFieldValidators('secondAppAadharNumber', '^[0-9]{12}$');
    this.getUnitTypes();
    //  this. getUnitSquareFtAndPriceDetails();
    this.getAllSources();
    this.fetchSubSources();
    this.getFloorPreferance();
    this.getProjects();
    this.fetchSalesTeam();
    const data = history.state.eoiData;

    if (data) {
      this.isAdding = false;
      this.patchFormData(data);
    }
  }
  private initializeFormData(): void {
    this.formData = this.builder.group({
      id: [0],
      firstApplName: ['', Validators.required],
      firstApplPhoneNumber: ['', Validators.required],
      firstApplEmail: [''],
      firstApplAddress: [],
      firstApplPanNumber: [
        '',
        [
          Validators.required,
          Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}'), // PAN Number format
        ],
      ],
      firstApplAadharNumber: [
        '',
        [
          Validators.required,
          Validators.pattern('[0-9]{12}'), // Aadhar Number should be 12 digits
        ],
      ],
      secondApplName: [''],
      secondApplPhoneNumber: [''],
      secondApplEmail: [''],
      secondApplPanNumber: [''],
      secondAppAadharNumber: [''],
      secondApplAddress: [''],
      unitTypeId: [],
      cpId: [],
      projectHeadId: [],
      panSubmitted: [false], // Initialize with false or whatever the backend returns
      aadharSubmitted: [false],
      floorReferanceId: [],
      leadSourceId: [],
      projectId: [],
      status: ['A'],
      chequeDdNumber:[]
    });
  }

  getUnitTypes() {
    this.commonService.fetchCommonReferenceTypes(this.UnitTypes).subscribe({
      next: (data) => {
        this.unitTypeData = data;
      },
      error: (error) => {
        console.error(error?.message);
      },
    });
  }
  onUnitTypeSelected(unitId: number): void {
    console.log(unitId);
    const selectedUnit = this.unitTypeData.find(
      (element) => element.id === unitId
    );
    console.log(selectedUnit);

    // const unitId = selectedUnit.id;
    // const unitName = selectedUnit.name;
    this.formData.patchValue({
      unitTypeId: unitId,
    });
    this.getUnitSquareFtAndPriceDetails(selectedUnit);
  }
  getUnitSquareFtAndPriceDetails(event: any) {
    console.log(event);

    const UnitName = event.commonRefValue;
    console.log(UnitName);

    this.commonService.fetchCommonReferenceTypes(UnitName).subscribe({
      next: (data) => {
        this.unitDetails = data;
        console.log(this.unitDetails);
      },
      error: (error) => {
        console.error(error?.message);
      },
    });
  }
  getAllSources() {
    this.leadSource.fetchAllLeadSources().subscribe({
      next: (data) => {
        this.leadSourceData = data;
        console.log(this.leadSourceData);
      },
      error: (error) => {
        console.error(error?.message);
      },
    });
  }
  fetchSubSources(): void {
    this.leadSubSource
      .fetchSubSources(this.sourceId, this.subSourceName)
      .subscribe({
        next: (subSources) => {
          this.subSource = subSources;
        },
        error: (error) => {
          console.error('Error fetching lead sub-sources:', error);
        },
      });
  }
  onSubSourceSelect(event: any) {
    console.log('dfghjkertyuio');
    console.log(event);
    console.log(event.option.value);
    if (event?.option?.value) {
      this.cpId = event.option.value.leadSubSourceId;
      console.log(this.cpId);

      this.formData.patchValue({ cpId: this.cpId });
      console.log(this.formData);
      // this.getFloors()
    }
  }
  displaySubSource(subSource: LeadSubSource): string {
    return subSource && subSource.name ? subSource.name : '';
  }
  searchSubSource(event: any): void {
    const query = event.target.value;
    this.subSourceName = query;
    this.fetchSubSources();
  }

  fetchSalesTeam() {
    console.log(this.projectId);
    
    this.salesTeamService
      .fetchAllSaleTeam('', 0, 10, this.projectId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (salesTeam) => {
          console.log(salesTeam);
          this.salesTeam = salesTeam.records;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  getFloorPreferance() {
    this.commonService
      .fetchCommonReferenceTypes(this.floorPreference)
      .subscribe({
        next: (data) => {
          this.floorData = data;
          console.log(this.unitDetails);
        },
        error: (error) => {
          console.error(error?.message);
        },
      });
  }
  clearForm(): void {
    this.formData.reset();
  }

  gotoEoi() {
    this.router.navigate(['layout/sales/eoi']);
  }
  save() {
    if (this.formData.valid) {
      const formData = { ...this.formData.value };
      const files = this.getFilesObject();
      console.log(files);
      
      const filesToSend: {
        checkFile: File | null;
      } = {
        checkFile: files['checkFile'],
      };
      console.log('Data to send:', this.formData.value);
      const saveOrUpdate$ = this.isAdding
        ? this.eoiService.addEoi(formData,filesToSend)
        : this.eoiService.updateEoiDetails(this.formData.value);
      saveOrUpdate$.subscribe({
        next: (response) => {
          console.log(response);
          this.router.navigate(['layout/sales/eoi']);
          // this.handleSuccessResponse(response);
        },
        error: (error) => {
          // this.handleErrorResponse(error);
        },
      });
    }
  }
  getFilesObject(): { [key: string]: File | null } {
    return {
      checkFile:
        this.checkFileInput?.nativeElement?.files?.length > 0
          ? this.checkFileInput.nativeElement.files[0]
          : null
    };
  }
  searchProject(event: any): void {
    const query = event.target.value;
    this.projectName = query;
    this.getProjects();
  }
  getProjects() {
    this.projectService
      .getProjects(this.projectName, this.organizationId)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.projectsData = data;
          console.log(this.projectsData);
        },
        error: (error: any) => {
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
  }

  displayProject(project: Project): string {
    return project && project.projectName ? project.projectName : '';
  }
  onProjectSelect(event: any) {
    console.log(event);

    console.log(event.option.value);
    if (event?.option?.value) {
      this.projectId = event.option.value.projectId;
      console.log(this.projectId);

      this.formData.patchValue({ projectId: this.projectId });
      console.log(this.formData);
      this.fetchSalesTeam();
    }
  }
  private patchFormData(data: any): void {
    console.log(data);
    const projectId = data.projectId;
    this.fetchProjectById(projectId);

    const subSourceId = data.cpId;
    this.fetchSubSourceById(subSourceId);
    console.log(data.toString + 'data for update');

    this.formData.patchValue(data);
  }
  private fetchProjectById(projectId: number) {
    this.projectService
      .getProjectById(projectId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.selectedProject = data;
          console.log(data);
          // this.formData.patchValue({ projectId: data.projectId });
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }

  private fetchSubSourceById(subSourceId: number) {
    this.leadSubSource
      .fetchSubSourceBySubSourceId(subSourceId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.selectedSubSource = data;
          console.log(data);
          // this.formData.patchValue({ projectId: data.projectId });
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }
  private initializeFieldValidators(
    controlName: string,
    pattern: string
  ): void {
    this.formData.get(controlName)?.valueChanges.subscribe((value) => {
      if (value) {
        this.formData
          .get(controlName)
          ?.setValidators([Validators.pattern(pattern)]);
      } else {
        this.formData.get(controlName)?.clearValidators();
      }
      this.formData.get(controlName)?.updateValueAndValidity();
    });
  }
  onOwnerPanCardFileChange(event: Event): void {
    this.handleFileChange(event, 'checkFile');
  }
  handleFileChange(event: Event, key: string): void {
    const input = event.target as HTMLInputElement;
    const file = input.files ? input.files[0] : null;

    if (file) {
      console.log(`File selected for ${key}:`, file);

      this.fileNames[key] = file.name;
      this.fileErrors[key] = null; 
     
    } else {
      this.fileNames[key] = null;
      this.fileErrors[key] = 'No file selected.';
    }

    console.log(`File errors for ${key}:`, this.fileErrors[key]);
  }

}
