import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Block } from 'src/app/Models/Block/block';
import { Level } from 'src/app/Models/Project/level';
import { IProject, Project } from 'src/app/Models/Project/project';
import { AvailableUnitsDto, UnitsDto } from 'src/app/Models/Project/unit';
import { BlockService } from 'src/app/Services/ProjectService/Block/block.service';
import { BookingService } from 'src/app/Services/ProjectService/Booking/booking.service';
import { LevelService } from 'src/app/Services/ProjectService/Level/level.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { UnitService } from 'src/app/Services/ProjectService/Unit/unit.service';
import { BookingLeadComponent } from '../booking-lead/booking-lead/booking-lead.component';
import { LeadService } from 'src/app/Services/Presales/Leads/lead.service';
import { ILead } from 'src/app/Models/Presales/lead';
import { LeadFollowupService } from 'src/app/Services/Presales/Leads/lead-followup.service';
import { UnitTypeService } from 'src/app/Services/ProjectService/UnitType/unittype.service';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { PAYMENT_STATUS, UNIT } from 'src/app/Constants/Crm/CrmConstants';
import { CommonReferenceType } from 'src/app/Models/CommanModel/menuDto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-booking',
  templateUrl: './add-booking.component.html',
  styleUrls: ['./add-booking.component.css'],
})
export class AddBookingComponent implements OnInit {
  private destroy$ = new Subject<void>();
  projects: Project[] = [];
  blocks: Block[] = [];
  levels: Level[] = [];
  units: any[] = [];
  unitTypes: any[] = [];
  status: string = 'Available';
  // salesPersons:any[] = [];
  salesPersons: any[] = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Smith' },
    { id: 3, name: 'Alexa' },
    { id: 4, name: 'Joe' },
  ];
  dialogRef: any;
  availableUnit: AvailableUnitsDto = new AvailableUnitsDto();
  private dialogClosedManually = false;
  formData!: FormGroup;
  infoForm!: FormGroup;
  openDialog = false;
  phoneNumber: string = '';
  name: string = '';
  email: string = '';
  selectedLeadId: number | null | undefined;
  leads: any[] = [];

  displayedColumns: string[] = [
    'opportunityId',
    'leadName',
    'contactNumber',
    'email',
  ];
  leadName?: string | null = '';
  leadId: number = 0;
  followUpData: any;
  isSalesTeamFollowUp: boolean = false;
  organizationId: number = 0;
  userId: number = 0;
  projectName: string = '';
  unitTypeName: string = '';
  unitTypeNames: UnitsDto[] = [];
  unitTypeId: number = 0;
  projectId: any;
  project: any = new FormControl([] as IProject[],Validators.required);
  unitType: any = new FormControl([] as UnitsDto[],Validators.required);
  blockId: number = 0;
  blockName: string = '';
  // selectedBlock:;
  blockFc: FormControl = new FormControl([] as Block[],Validators.required);
  levelId: any;
  levelName: string ='';
  levelFc:any=new FormControl([] as Level[],Validators.required);
  unitId: number=0;
  unitName: string='';
  unitFc:any=new FormControl([],Validators.required);
  constructor(
    private router: Router,
    private builder: FormBuilder,
    public dialog: MatDialog,
    public bookingService: BookingService,
    public projectService: ProjectService,
    public blockService: BlockService,
    public levelService: LevelService,
    public unitService: UnitService,
    private leadService: LeadService,
    private followupService: LeadFollowupService,
    private unitTypeService: UnitTypeService,
    private commonService: CommanService
  ) {
    this.formData = this.builder.group({
      bookingId: [0],
      projectId: this.builder.control('', [Validators.required]),
      blockId: this.builder.control('', [Validators.required]),
      levelId: this.builder.control('', [Validators.required]),
      unitId: this.builder.control('', [Validators.required]),
      leadId: this.builder.control('', [Validators.required]),
      bookedById: this.builder.control('', [Validators.required]),
      basicPrice: this.builder.control('', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
      ]),
      finalPrice: this.builder.control('', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
      ]),
      customerName: this.builder.control('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      customerPhoneNo: this.builder.control('', [
        Validators.required,
        Validators.pattern(/^[6789]\d*$/),
      ]),
    });
  }
  private initFormOfInfo() {
    this.infoForm = this.builder.group({
      customerName: ['', Validators.required],
      customerPhoneNo: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{10}$')],
      ],
      emailId: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      projectId: ['',Validators.required],
      blockId: [''],
      levelId: [''],
      unitId: [''],
      coApplicantName: [],
      coapplicantEmailid: [],
      coApplicantPhoneNumber: [
      ],
      basicPrice: [],
      finalPrice: [],
      leadId: [],
      coapplicantaddress: [],
      unitTypeId: [],
    });
  }

  ngOnInit(): void {
    this.setUserFromLocalStorage();
    this.initFormOfInfo();
    this.fetchProjects();
    this.getUnitAllUnitTypes();
    this.leadId = history.state.leadId;
    this.followUpData = history.state.data;
    this.isSalesTeamFollowUp = history.state.isSalesTeamFollowUp;
    console.log(this.leadId);
    console.log(this.followUpData);
    console.log(this.isSalesTeamFollowUp);
    
  }
  private setUserFromLocalStorage(): void {
    const user = this.commonService.getUserFromLocalStorage();
    if (user) {
      this.organizationId = user.organizationId;
      this.userId = user.userId;
    }
  }

  //pagination
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
  }
  getAllProjects() {
    this.projectService
      .getProjects(this.projectName, this.organizationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.projects = response;
          console.log(this.projects);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  getBlocksBasedOnProjectId(projectId: any) {
    console.log(projectId);
    this.blockService.getBlocks(this.projectId, this.blockName).subscribe({
      next: (data) => {
        console.log(data);
        this.blocks = data;
        console.log(this.blocks);
      },
      error: (error: any) => {
        console.error('Error fetching Project Charge Charge Ins :', error);
      },
    });
  }
  getLevelsBasedOnBlockId() {
    console.log(this.blockId);
    this.levelService.getLevels(this.blockId, this.levelName).subscribe({
      next: (data) => {
        console.log(data);
        this.levels = data;
        console.log(this.levels);
      },
      error: (error: any) => {
        console.error('Error fetching Project Charge Charge Ins :', error);
      },
    });
  }

  //get all units basedon levelId
  getUnitsBasedOnLevelId(levelId: any) {
    console.log(levelId);
    console.log(this.unitTypeId);
    this.unitService
      .getUnitsBasedOnLevelId(levelId, this.status, this.unitName,this.unitTypeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.units = response;
          console.log(this.units);
        },
        error: (error) => {
          if(error.status==404)
          this.handleErrorResponse(error);
          console.log(error);
        },
      });
  }
  getUnitAllUnitTypes() {
    this.commonService
      .getCommanReferanceDetailsWithFilters(UNIT, this.unitTypeName)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.unitTypeNames = data;
          console.log(this.unitTypeNames);
        },
        error: (error: any) => {
          console.error('Error fetching unitTypes:', error);
        },
      });
  }
  clearForm() {
    this.formData.reset();
  }
  ngOnDestroy(): void {
    console.log('Component is being destroyed');
    // Make sure no logic here is closing the dialog
  }

  // save() {
  //   console.log('Adding Booking Details');
  //   console.log(this.formData.value);
  //   if (this.infoForm.valid) {
  //     this.bookingService
  //       .addBooking(this.formData.value)
  //       .pipe(takeUntil(this.destroy$))
  //       .subscribe({
  //         next: (resp) => {
  //           console.log('Booking saved succesfully');
  //           // this.formData.reset();
  //           this.router.navigate(['/layout/sales/leads/ST']);
  //         },
  //         error: (err) => {
  //           console.error('Error adding vendor', err);
  //         },
  //       });
  //   }
  // }

  getAllLeads() {
    console.log('API call initiated');

    this.leadService
      .fetchAllLead(this.phoneNumber, this.email, this.name)
      .subscribe(
        (results) => {
          console.log('API call succeeded, updating leads');
          //this.dialogRef.disableClose=true;

          this.leads = results;

          console.log(this.leads);
        },
        (error) => {
          //this.dialogRef.disableClose = true;
          console.error('Error fetching leads:', error);
        }
      );
  }

  onPhoneNumberSearch(phoneNumberSearchText: string) {
    console.log(phoneNumberSearchText);
    this.phoneNumber = phoneNumberSearchText;
    if (this.phoneNumber.length >= 3) {
      this.getAllLeads();
    }
  }

  onNameSearch(nameSearchText: string) {
    console.log(nameSearchText);
    this.name = nameSearchText;

    if (this.name.length >= 3) {
      this.getAllLeads();
    }
  }

  onEmailSearch(emailSearchText: string) {
    console.log(emailSearchText);
    this.email = emailSearchText;
    if (this.email.length >= 3) {
      this.getAllLeads();
    }
  }

  onRowClicked(lead: ILead) {
    console.log(lead);

    if (lead !== undefined) {
      this.leadName = lead.name;
      this.selectedLeadId = lead.id;
      this.formData.get('leadId')?.setValue(this.selectedLeadId);
    }
  }

  saveInfo() {
    console.log('Adding Booking Details');
    console.log(this.leadId);
    if (this.infoForm.valid) {
    console.log(this.infoForm.value);
    
    this.infoForm.patchValue({ leadId: this.leadId });
    this.bookingService
      .addBooking(this.infoForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          console.log('Booking saved succesfully');
          // this.formData.reset();
          // this.savefollowUps();
          this.handleSuccessResponse(resp);
          this.router.navigate(['layout/project/availableunits']);
        },
        error: (err) => {
          console.error('Error adding vendor', err);
          this.handleErrorResponse(err);
        },
      });
    }
  }
  savefollowUps() {
    console.log('follow up info');
    this.followupService
      .saveFollowup(this.followUpData, this.isSalesTeamFollowUp)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          console.log('followup  saved succesfully');
        },
        error: (err) => {
          console.error('Error adding followup', err);
        },
      });
  }
  gotoLeads() {
    this.router.navigate(['layout/sales/leads/ST']);
  }

  getUnitTypes(projectId: number) {
    this.unitService
      .getAllUnitTypes(projectId, this.unitTypeName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log(response);

          this.unitTypeNames = response;
          console.log(this.units);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
  fetchProjects() {
    this.projectService
      .getProjectsByOrgIdWithProjectFilter(
        this.organizationId,
        this.projectName
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (projects) => {
          console.log(projects);
          this.projects = projects;
        },
        error: (error: Error) => {
          console.error('Error fetching projects:', error);
        },
      });
  }
  onProjectSelect(event: any) {
    this.projectName = event.option.value.projectName;
    this.projectId = event.option.value.projectId;
    this.infoForm.patchValue({ projectId: this.projectId });
    this.getBlocksBasedOnProjectId(this.projectId);
    this.getUnitTypes(this.projectId);
  }
  displayProject(project: Project): string {
    return project && project.projectName ? project.projectName : '';
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

  onUnitTypeSelect(event: any) {
    console.log(event.option.value);
    this.unitTypeName = event.option.value.unitTypeName;
    this.unitTypeId = event.option.value.unitTypeId;
    console.log(this.unitTypeId);
    this.infoForm.patchValue({ unitTypeId: this.unitTypeId });
    this.getUnitsBasedOnLevelId(this.levelId);
    
  }
  displayUnitType(unitType: UnitsDto): string {
    return unitType && unitType.unitTypeName ? unitType.unitTypeName : '';
  }
  searchUnitType(event: any): void {
    console.log(event.target.value);
    
    const query = event.target.value;
      this.unitTypeName = query;
      this.getUnitTypes(this.projectId);
  }
  onBlockSelect(event: any) {
    console.log('dfghjkertyuio');
    console.log(event);

    console.log(event.option.value);
    if (event?.option?.value) {
      this.blockId = event.option.value.id;
      console.log(this.blockId);
      this.infoForm.patchValue({ blockId: this.blockId });
      console.log(this.formData);
      this.getLevelsBasedOnBlockId();
    }
  }
  searchBlock(event: any): void {
    const query = event.target.value;
    this.blockName = query;
    this.getBlocksBasedOnProjectId(this.projectId);
  }
  displayBlock(block: Block): string {
    return block && block.name ? block.name : '';
  }
  displayLevel(level: Level): string {
    return level && level.name ? level.name : '';
  }

  onLevelSelect(event: any) {
    console.log('dfghjkertyuio');
    console.log(event);
    console.log(event.option.value);
    if (event?.option?.value) {
      this.levelId = event.option.value.levelId;
      console.log(this.levelId);

      this.infoForm.patchValue({ levelId: this.levelId });
      console.log(this.formData);
      this.getUnitsBasedOnLevelId(this.levelId)
    }
  }
  searchLevel(event: any): void {
    console.log(event.target.value);
    const query = event.target.value;
    this.levelName = query;
    this.getLevelsBasedOnBlockId();
  }
  onUnitSelect(event: any) {
    console.log('dfghjkertyuio');
    console.log(event);

    console.log(event.option.value);
    if (event?.option?.value) {
      this.unitId = event.option.value.id;
      console.log(this.unitId);

      this.infoForm.patchValue({ unitId: this.unitId });
      console.log(this.formData);
    }
  }
  displayUnit(unit: any): string {
    return unit && unit.unitName ? unit.unitName : '';
  }
  searchUnit(event: any): void {
    const query = event.target.value;
    this.unitName = query;
    this.getUnitsBasedOnLevelId(this.levelId)
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
      // console.error('Error saving/updating lead:', error.error.message);
      Swal.fire({
        title: 'Error',
        text: "No Units are avilable for this level", // Display the error message
        icon: 'error',
        confirmButtonText: 'OK', // Label for the button
        allowOutsideClick: false, // Prevent closing by clicking outside
      }).then((result) => {
        if (result.isConfirmed) {
        }
      });
    }
}
