import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  debounceTime,
  map,
  Subject,
  switchMap,
  take,
  takeUntil,
  throwError,
} from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import {
  BANKNAMES,
  GENDER,
  MARITAL_STATUS,
  NATIONALITY,
  PAGE_INDEX,
  RELATION_TO_GUARDIAN,
  SALUTATION,
  searchPhoneNumberLength,
  searchTextZero,
  TIME_OUT,
} from 'src/app/Constants/CommanConstants/Comman';
import {
  NAVIGATE_TO_BOOKING_OVERVIEW,
  PAYMENT_SOURCE,
  ROLL_NAME,
  TYPE_COMMON_REFERENCE_DETAILS_ID,
} from 'src/app/Constants/Crm/CrmConstants';
import { Address } from 'src/app/Models/Address/address';
import { Block, IBlock } from 'src/app/Models/Block/block';
import {
  ApplicantInfo,
  IApplicantInfo,
  salesMembers,
} from 'src/app/Models/Crm/ApplicantInfo';
import { IProjectChargeDto } from 'src/app/Models/Crm/ProjectCharge';
import { ISalesTeamDto } from 'src/app/Models/Presales/salesteam';
import { PaymentPlan } from 'src/app/Models/Project/PaymentPlan';
import {
  CustomerStagesDtoWithAmount,
  ICustomerStagesDto,
} from 'src/app/Models/Project/customerStages';
import { ILevel, Level } from 'src/app/Models/Project/level';
import { IProject, Project } from 'src/app/Models/Project/project';
import {
  AvailableUnitsDto,
  IUnitType,
  UnitType,
} from 'src/app/Models/Project/unit';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';
import { CommonReferenceType } from 'src/app/Models/User/CommonReferenceType';
import { IUser, User } from 'src/app/Models/User/User';
import { IUserDto, UserDto } from 'src/app/Models/User/UserDto';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { ApplicationInfoService } from 'src/app/Services/CrmServices/applicant-info.service';
import { CustomerStageService } from 'src/app/Services/CrmServices/customer-stages.service';
import { SaleteamService } from 'src/app/Services/Presales/SalesTeam/saleteam.service';
import { BlockService } from 'src/app/Services/ProjectService/Block/block.service';
import { BookingService } from 'src/app/Services/ProjectService/Booking/booking.service';
import { LevelService } from 'src/app/Services/ProjectService/Level/level.service';
import { PaymentPlanService } from 'src/app/Services/ProjectService/PaymentPlan/paymentPlan.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { StageService } from 'src/app/Services/ProjectService/Stage/stage.service';
import { UnitService } from 'src/app/Services/ProjectService/Unit/unit.service';
import { UnitTypeService } from 'src/app/Services/ProjectService/UnitType/unittype.service';
import { CommonreferencedetailsService } from 'src/app/Services/UserService/commonreferencedetails.service';
import { UserService } from 'src/app/Services/UserService/userservice.service';
import { SaveBookingChargeComponent } from '../save-booking-charge/save-booking-charge.component';

import { MatPaginator } from '@angular/material/paginator';
import { IApplicantLeadDto } from 'src/app/Models/Presales/lead';
import { LeadService } from 'src/app/Services/Presales/Leads/lead.service';
import Swal from 'sweetalert2';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { BookingFormAddingPaymentComponent } from '../booking-form-adding-payment/booking-form-adding-payment';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css'],
})
export class BookingFormComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('textArea') textArea!: ElementRef;
  @ViewChild('stepper') stepper!: MatStepper;
  @ViewChild('firstApplicantCity') FirstApplicantCityInput!: ElementRef;
  @ViewChild('firstApplicantPanCard') firstApplicantPanCard!: ElementRef;
  @ViewChild('firstApplicantAadharCard') firstApplicantAadharCard!: ElementRef;
  @ViewChild('secondApplicantPanCard') secondApplicantPanCard!: ElementRef;
  @ViewChild('secondApplicantAadharCard')
  secondApplicantAadharCard!: ElementRef;
  @ViewChild(BookingFormAddingPaymentComponent)
  bookingFormComponent!: BookingFormAddingPaymentComponent;
  @ViewChild('thirdApplicantPanCard') thirdApplicantPanCard!: ElementRef;
  @ViewChild('thirdApplicantAadharCard') thirdApplicantAadharCard!: ElementRef;
  @ViewChild('anniversaryDatePicker')
  anniversaryDatePicker!: MatDatepicker<any>;
  @ViewChild('sanctionLetter') sanctionLetter!: ElementRef;

  isApplicantDetailsStepSaved: boolean = false;
  unitForm!: FormGroup;
  organizationId: number = 0;
  userId: number = 0;
  roleName: string = '';
  projectsData: Project[] = [];
  selectedProject: IProject = new Project();
  selectedUser: IUserDto = new UserDto();
  selectedUnit = new AvailableUnitsDto();
  projectFc: FormControl = new FormControl([] as Project[]);
  userFc: FormControl = new FormControl([] as User[]);
  unitFc: FormControl = new FormControl([] as AvailableUnitsDto[]);
  selectedLevelName: string = '';
  selectedBlockName: string = '';
  selectedUnitType: string = '';
  filteredAddresses: any;
  isDataLoaded: boolean = false;
  pdfUploadForm: FormGroup;
  paymentForm: FormGroup;

  shouldPatchForm: boolean = false;
  showDetails: boolean = false;
  isStepSaved: boolean = false;

  salesTeam: ISalesTeamDto[] = [];
  availableUnits: AvailableUnitsDto[] = [];
  paymentPlans: PaymentPlan[] = [];
  address: Address[] = [];
  chargeInData: CommonReferenceType[] = [];
  status: string = 'Available';
  projectName: string = '';
  planName: string = '';
  private destroy$ = new Subject<void>();
  lead: any;
  salutations: any;
  gender: any;
  maritalStatus: any;
  relationToGuardian: any;
  nationality: any;
  projectChargesData: any;
  projectCharges: IProjectChargeDto[] = [];
  applicantInfo: any;
  isCoApplicantChecked = false;
  isSecondCoApplicantChecked = false;
  isDescriptionChecked = false;
  isAddressChecked = false;
  unitName: string = '';
  applicantInfoData: IApplicantInfo = new ApplicantInfo();
  applicantLeadDto: IApplicantLeadDto[] = [];
  isAdding: boolean = true;
  isSubmitted: boolean = false;
  bookingId: number = 0;
  projectId: number = 0;
  updateApplicantInfo: any;
  selectedBlock: IBlock = new Block();
  selectedLevel: ILevel = new Level();
  selectedUnitTypeData: IUnitType = new UnitType();
  pageSize: number = 10;
  pageIndex: number = 0;
  bookingName: string = '';
  stageName: string = '';
  totalPages: number = 0;
  customerStagesDto: ICustomerStagesDto[] = [];
  customerStagesDtoWithAmount: CustomerStagesDtoWithAmount =
    new CustomerStagesDtoWithAmount();
  initiated: string = '';
  crmUserId: number = 0;
  userData: UserDto[] = [];
  userName: string = '';
  salesTeamMembers: salesMembers[] = [];
  superArea: any;
  balconyArea: number = 0;
  carpetArea: number = 0;
  phase: string = '';
  selectedPhase: CommonReferenceDetails = new CommonReferenceDetails();
  phoneNumber: string = '';
  coApplicantPhoneNumber: string = '';
  salesName: string = '';
  preSalesName: string = '';
  isThirdApplicantAddressChecked: boolean = false;
  pincode: string = '';
  errorMessage: string = '';
  blockId: number = 0;
  isLoading: boolean = false;
  bank = new FormControl<CommonReferenceType[]>([]);
  fileNames: any = {
    firstApplicantPanCard: null,
    firstApplicantAadharCard: null,
    secondApplicantPanCard: null,
    secondApplicantAadharCard: null,
    thirdApplicantPanCard: null,
    thirdApplicantAadharCard: null,
    sanctionletter: null,
  };

  fileErrors: any = {
    firstApplicantPanCard: null,
    firstApplicantAadharCard: null,
    secondApplicantPanCard: null,
    secondApplicantAadharCard: null,
    thirdApplicantPanCard: null,
    thirdApplicantAadharCard: null,
  };

  displayedColumns: string[] = [
    'stageOrder',
    'stageName',
    // 'description',
    'percentage',
    'expectedAmount',
    'tds',
    'netPayableAmount',
    // 'Actions',
  ];
  unitTypeName: string = '';
  bankNames: CommonReferenceDetails[] = [];
  bankName: string = '';
  applicantBankId: number = 0;
  firstApplicantName:string='';
 planId:number=0;
 typeId:number=0;
 unitId:number=0;
  constructor(
    public dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private blockService: BlockService,
    private levelService: LevelService,
    private unitService: UnitService,
    private projectService: ProjectService,
    public bookingService: BookingService,
    public stageService: StageService,
    public paymentPlanService: PaymentPlanService,
    private customerStageService: CustomerStageService,
    private commonService: CommanService,
    private applicationInfoService: ApplicationInfoService,
    private salesTeamService: SaleteamService,
    private unitTypeService: UnitTypeService,
    private router: Router,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private userService: UserService,
    private route: ActivatedRoute,
    private decimalPipe: DecimalPipe,
    private commonRefDetailsService: CommonreferencedetailsService,
    private leadService: LeadService,
    private loaderService: LoaderService,
    private cd: ChangeDetectorRef
  ) {
    this.personalInfoForm = this.fb.group({
      projectId: [null], // Add other controls as needed
    });
    this.pdfUploadForm = this.fb.group({
      pdfFile: [null, Validators.required], // Ensure file is required
    });
    this.paymentForm = this.fb.group({});
  }

  ngOnInit(): void {
    // this.route.queryParams.subscribe((params) => {
    //   this.isAdding = params['isAdding'] === 'true'; // Convert to boolean
    // });
    // this.superArea = parseFloat(this.availableUnits[0].superArea || '0');

    // Handle any logic if needed
    // if (!this.isAdding) {
    //   this.expandAllSteps();
    // }
    this.setUserFromLocalStorage();
    this.initForm();
    // this.setValidatorsForCoApplicantFields();
    // this.onFormChanges();
    this.onTotalFinalFormChanges();
    this.getSalutations();
    this.getMaritalStatus();
    this.getNationality();
    this.getRelationGuardian();
    this.fetchProjects();
    this.fetchUsers();
    this.getGender();
    this.getbankNames();
    this.setValidatorsBasedOnMode(this.personalInfoForm);

    // this.applicantInfoData = await this.getApplicantInfo();

    // this.getAllCustomerStages(this.applicantInfoData?.bookingId)

    this.getDataFromState();
  }
  personalInfoForm!: FormGroup;
  projectInfoForm!: FormGroup;

  StagesInfoForm!: FormGroup;

  addressControl = new FormControl();
  selectedBank: any;
  selectedAddress: string = '';
  private initForm(): void {
    this.unitForm = this._formBuilder.group({
      bookingId: [],
      basePrice: [0],
      finalPrice: [, [Validators.required, Validators.min(0.01)]],
      totalCharges: [0],
      projectId: [''],
      levelId: [''],
      bookedById: [''],
      paymentPlanId: ['', Validators.required],
      blockId: [''],
      unitId: [''],
      unitTypeName: [''],
      basicPrice: [, [Validators.required, Validators.min(0.01)]],
      crmUserId: [''],
      userId: [0],
      gst: [0],
      carpetArea: [''],
      balconyArea: [''],
      superArea: [''],
      east: [''],
      west: [''],
      north: [''],
      south: [''],
      phase: [''],
      udsArea: [0],
      sourceName: [''],
      subSourceName: [''],
      firstApplicantPhoneNumber: [''],
      secondApplicantPhoneNumber: [''],
      preSalesId: [],
      bookingDate: [, [Validators.required, this.noFutureDateValidator]],
    });
    this.personalInfoForm = this._formBuilder.group({
      // bookingId: [],
      firstApplicantName: ['', Validators.required],
      firstApplicantDateOfBirth: [
        ,
        [Validators.required, this.noFutureDateValidator],
      ],
      firstApplicantEmail: ['', [Validators.required, Validators.email]],
      firstApplicantAlternateEmail: [''],
      firstApplicantPhoneNumber: ['', [Validators.required]],
      firstApplicantAlternatePhoneNumber: [''],
      firstApplicantAadharNumber: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{12}$/)],
      ],
      firstApplicantPanNumber: [
        '',
        [Validators.required, Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]$/)],
      ],
      firstApplicantSalutation: ['', [Validators.required]],

      firstApplicantGuardianName: [''],
      firstApplicantMaritalStatus: [''],
      firstApplicantNationality: [''],
      firstApplicantPassportNumber: [''],
      firstApplicantProfession: [''],
      firstApplicantDesignation: [''],
      firstApplicantEmployedAt: [''],
      firstApplicantIndustry: [''],
      secondApplicantName: [''],
      firstApplicantGender: [''],
      secondApplicantGender: [''],
      secondApplicantDateOfBirth: [''],
      secondApplicantEmail: [''],
      secondApplicantAlternateEmail: [''],
      secondApplicantPhoneNumber: ['', Validators.pattern('^[0-9]{10}$')],
      secondApplicantAlternatePhoneNumber: [''],
      secondApplicantAadharNumber: ['', Validators.pattern(/^[0-9]{12}$/)],
      secondApplicantPanNumber: [
        '',
        Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]$/),
      ],
      secondApplicantSalutation: [''],
      secondApplicantGuardianName: [''],
      secondApplicantMaritalStatus: [''],
      secondApplicantNationality: [''],
      secondApplicantPassportNumber: [''],
      secondApplicantProfession: [''],
      secondApplicantDesignation: [''],
      secondApplicantEmployedAt: [''],
      secondApplicantIndustry: [''],
      status: 'A',
      firstApplicantAddress1: ['', Validators.required],
      firstApplicantAddress2: [''],
      firstApplicantCity: ['', Validators.required],
      firstApplicantPincode: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{6}$/), // Allows only 6-digit numbers
        ],
      ],

      firstApplicantState: ['', Validators.required],
      secondApplicantAddress1: [''],
      secondApplicantAddress2: [''],
      secondApplicantCity: [''],
      secondApplicantPincode: ['', Validators.pattern(/^[0-9]{6}$/)],
      secondApplicantState: [''],
      receivedAmount: [0],
      pendingAmount: [0],
      description: [''],
      firstApplicantRelationToParent: ['', Validators.required],
      secondApplicantRelationToParent: [''],

      firstApplicantAnniversaryDate: [],
      secondApplicantAnniversaryDate: [],
      firstApplicantParentOrSpouse: ['', [Validators.required]],
      secondApplicantParentOrSpouse: [''],
      firstApplicantParentOrSpouseSalutation: ['', [Validators.required]],

      secondApplicantParentOrSpouseSalutation: [],
      secondApplicantPanCard: [''],
      secondApplicantAadharCard: [''],
      firstApplicantPanCard: ['', [this.fileRequiredValidator()]],
      firstApplicantAadharCard: ['', [this.fileRequiredValidator()]],
      thirdApplicantName: [''],
      thirdApplicantGender: [''],
      thirdApplicantDateOfBirth: [''],
      thirdApplicantEmail: [''],
      thirdApplicantAlternateEmail: [''],
      thirdApplicantPhoneNumber: [''],
      thirdApplicantAlternatePhoneNumber: [''],
      thirdApplicantAadharNumber: [''],
      thirdApplicantPanNumber: [''],
      thirdApplicantSalutation: [''],
      thirdApplicantGuardianName: [''],
      thirdApplicantMaritalStatus: [''],
      thirdApplicantNationality: [''],
      thirdApplicantPassportNumber: [''],
      thirdApplicantProfession: [''],
      thirdApplicantDesignation: [''],
      thirdApplicantPanCard: [''],
      thirdApplicantAadharCard: [''],
      thirdApplicantParentOrSpouse: [''],
      thirdApplicantAnniversaryDate: [''],
      thirdApplicantRelationToParent: [''],
      thirdApplicantParentOrSpouseSalutation: [''],
      thirdApplicantAddress1: [''],
      thirdApplicantAddress2: [''],
      thirdApplicantCity: [''],
      thirdApplicantPincode: [''],
      thirdApplicantState: [''],
      receivedTds: [0],
      firstAndSecondApplicantBothResidingatSameAddress: [''],
      thirdApplicantEmployedAt: [''],
      thirdApplicantIndustry: [''],
      receivedPayment: [0],
      applicantBankId: [''],
      sanctionLetter: [''],
    });

    this.projectInfoForm = this._formBuilder.group({});

    this.StagesInfoForm = this._formBuilder.group({
      id: [''],
      tds: [],
      stageId: [],
      bookingId: [],
      stageName: [],
      stageOrder: [],
      description: [],
      percentage: [],
      days: [],
      initiated: [],
      expectedDate: [],
      actualDate: [],
      expectedAmount: [],
      planId: [],
      status: ['A'],
    });

    // if (this.personalInfoForm.valid) {
    //   console.log('Form Submitted:', this.personalInfoForm.value);
    // } else {
    //   this.personalInfoForm.markAllAsTouched(); // Mark all controls as touched to trigger error messages
    // }
  }

  noFutureDateValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    if (control.value) {
      const selectedDate = new Date(control.value);
      const today = new Date();
      if (selectedDate > today) {
        return { futureDate: true };
      }
    }
    return null;
  }
  private setUserFromLocalStorage(): void {
    const user = this.commonService.getUserFromLocalStorage();
    if (user) {
      this.organizationId = user.organizationId;
      this.userId = user.userId;
      this.roleName = user.roleName;
    }
  }

  fetchProjects() {
    this.projectService
      .getProjectsByOrgIdWithProjectFilter(
        this.organizationId,
        this.projectName
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.projectsData = data;
        },
        error: (error: Error) => {
          console.error('Error fetching projects:', error);
        },
      });
  }

  fetchUsers() {
    this.userService
      .fetchUsersByRolesAndOrganization(ROLL_NAME, this.organizationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.userData = data;
        },
        error: (error: Error) => {
          console.error('Error fetching projects:', error);
        },
      });
  }
  fileRequiredValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (
        value instanceof File ||
        (typeof value === 'string' && value.trim() !== '')
      ) {
        return null;
      }
      return { required: true };
      // Check if the value is a valid file object
      return control.value instanceof File ? null : { required: true };
    };
  }

  onUserSelect(event: any) {
    this.crmUserId = event.option.value.userId;
    this.userName = event.option.value.userName;
    this.unitForm.patchValue({ crmUserId: this.crmUserId });
  }

  displayUser(user: IUser): string {
    return user && user.userName ? user.userName : '';
  }

  searchUser(event: any): void {
    const query = event.target.value;
    if (query.length >= 3) {
      this.userName = query;
      this.fetchUsers();
    } else if (query.length == 0) {
      this.userName = '';
      this.fetchUsers();
    }
    // this.getAllStages();
  }

  onProjectSelect(event: any) {
    const selectedProject = event?.option?.value;
    if (!selectedProject) return;
    this.projectId = selectedProject.projectId;
    this.unitForm.reset();
    this.unitForm.patchValue({ projectId: this.projectId });
    this.unitFc.setValue(null);
    this.availableUnits = [];
    this.selectedBlockName = '';
    this.selectedLevelName = '';
    this.unitName = '';
    this.getAllAvailableUnits();
    this.getSalesTeamBasedOnProjectId(this.projectId);
    this.fetchSalesTeamMembers(this.projectId);
    this.shouldPatchForm = false;
    if (this.isAdding && this.projectId && this.unitName) {
      this.showDetails = true;
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

  onUnitSelect(event: any) {
    if (event?.option?.value) {
      this.unitName = event.option.value.unitName;
      this.shouldPatchForm = true;
      this.getAllAvailableUnits();
      // if (this.isAdding && this.projectId && this.unitName) {
      //   this.showDetails = true;
      // }
      console.log(this.blockId);

      // if (this.blockId) {
      //   this.getpaymentPlansBasedOnProjectId(this.projectId);
      // }
    }
  }
  searchUnit(event: any): void {
    const query = event.target.value;
    // if (query.length >= 3) {
    this.unitName = query;
    this.getAllAvailableUnits();
    // }
    // else if (query.length == 0) {
    //   this.unitName = '';
    // this.getAllAvailableUnits();
    // }
  }
  displayProject(project: Project): string {
    return project && project.projectName ? project.projectName : '';
  }
  displayUnit(unit: AvailableUnitsDto): string {
    return unit && unit.unitName ? unit.unitName : '';
  }
  // setValidatorsForCoApplicantFields() {
  //   const fieldsWithValidation = [
  //     'secondApplicantName',
  //     'secondApplicantDateOfBirth',
  //     'secondApplicantEmail',
  //     'secondApplicantPhoneNumber',
  //     'secondApplicantAadharNumber',
  //     'secondApplicantPanNumber',
  //     'secondApplicantSalutation',
  //     'secondApplicantAddress1',
  //     'secondApplicantCity',
  //     'secondApplicantPincode',
  //     'secondApplicantState',
  //     'secondApplicantParentOrSpouse',
  //     'secondApplicantRelationToParent',
  //     'secondApplicantParentOrSpouseSalutation',
  //     'secondApplicantPanCard',
  //     'secondApplicantAadharCard',
  //   ];

  //   const secondApplicantNameControl = this.personalInfoForm.get(
  //     'secondApplicantName'
  //   );

  //   if (secondApplicantNameControl) {
  //     secondApplicantNameControl.valueChanges.subscribe(() => {
  //       if (
  //         secondApplicantNameControl.touched &&
  //         secondApplicantNameControl.value
  //       ) {
  //         // ✅ Apply validators when secondApplicantName is touched & has value
  //         this.applyCoApplicantValidators(fieldsWithValidation);
  //       } else {
  //         // ❌ Clear validators if name is empty or untouched
  //         this.clearCoApplicantValidators(fieldsWithValidation);
  //       }
  //     });
  //   }
  // }

  // applyCoApplicantValidators(fields: string[]) {
  //   fields.forEach((field) => {
  //     const control = this.personalInfoForm.get(field);
  //     if (control) {
  //       let validators = [Validators.required];
  //       if (field === 'secondApplicantPhoneNumber') {
  //         validators.push(Validators.pattern('^[0-9]{10}$'));
  //       } else if (field === 'secondApplicantAadharNumber') {
  //         validators.push(Validators.pattern('^[0-9]{12}$'));
  //       } else if (field === 'secondApplicantPanNumber') {
  //         validators.push(Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}$'));
  //       } else if (field === 'secondApplicantEmail') {
  //         validators.push(Validators.email);
  //       } else if (
  //         field === 'secondApplicantPanCard' ||
  //         field === 'secondApplicantAadharCard'
  //       ) {
  //         validators.push(this.fileRequiredValidator());
  //       }
  //       control.setValidators(validators);
  //       control.updateValueAndValidity();
  //     }
  //   });
  // }

  // clearCoApplicantValidators(fields: string[]) {
  //   fields.forEach((field) => {
  //     const control = this.personalInfoForm.get(field);
  //     if (control) {
  //       control.clearValidators();
  //       control.reset();
  //       control.updateValueAndValidity();
  //     }
  //   });
  // }

  onCheckboxChange(event: any) {
    this.isCoApplicantChecked = event.checked;
    // this.setValidatorsForCoApplicantFields();
  }

  onSecondCoApplicantCheckboxChange(event: any) {
    this.isSecondCoApplicantChecked = event.checked;

    // Fields requiring validation
    const fieldsWithValidation = [
      'thirdApplicantName',
      'thirdApplicantDateOfBirth',
      'thirdApplicantEmail',
      'thirdApplicantPhoneNumber',
      'thirdApplicantAadharNumber',
      'thirdApplicantPanNumber',
      'thirdApplicantSalutation',
      'thirdApplicantAddress1',
      'thirdApplicantCity',
      'thirdApplicantPincode',
      'thirdApplicantState',
      'thirdApplicantParentOrSpouse',
      'thirdApplicantRelationToParent',
      'thirdApplicantParentOrSpouseSalutation',
      'thirdApplicantPanCard',
      'thirdApplicantAadharCard',
    ];

    // Fields that do not require validation
    const fieldsWithoutValidation = [
      'thirdApplicantGuardianName',
      'thirdApplicantMaritalStatus',
      'thirdApplicantNationality',
      'thirdApplicantPassportNumber',
      'thirdApplicantProfession',
      'thirdApplicantDesignation',
    ];

    // Handle fields with validation
    fieldsWithValidation.forEach((field) => {
      const control = this.personalInfoForm.get(field);
      if (control) {
        let validators = [Validators.required];
        if (field === 'thirdApplicantPhoneNumber') {
          validators.push(Validators.pattern('^[0-9]{10}$'));
        } else if (field === 'thirdApplicantAadharNumber') {
          validators.push(Validators.pattern('^[0-9]{12}$'));
        } else if (field === 'thirdApplicantPanNumber') {
          validators.push(Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}$'));
        } else if (field === 'thirdApplicantEmail') {
          validators.push(Validators.email);
        }

        if (this.isSecondCoApplicantChecked) {
          control.setValidators(validators);
        } else {
          control.clearValidators();
          control.reset(); // Clear values when unchecked
        }
        control.updateValueAndValidity();
      }
    });

    fieldsWithoutValidation.forEach((field) => {
      const control = this.personalInfoForm.get(field);
      if (control && !this.isSecondCoApplicantChecked) {
        control.reset(); // Clear values when unchecked
      }
    });
  }

  onDescriptionChange(event: any) {
    this.isDescriptionChecked = event.checked;
  }
  autoResize() {
    const textarea = this.textArea.nativeElement;
    textarea.style.height = 'auto'; // Reset height to auto to calculate new height
    textarea.style.height = `${textarea.scrollHeight}px`; // Set the height based on scrollHeight
  }

  // onAddressChange(event: any): void {
  //   this.isAddressChecked = event.checked;
  //   console.log('Checkbox checked:', this.isAddressChecked);

  //   if (this.isAddressChecked) {
  //     const addressFields = [
  //       'firstApplicantAddress1',
  //       'firstApplicantAddress2',
  //       'firstApplicantCity',
  //       'firstApplicantPincode',
  //       'firstApplicantState',
  //     ];

  //     const addressValues = addressFields.reduce((acc, field) => {
  //       const newField = field.replace('firstApplicant', 'secondApplicant');
  //       acc[newField] = this.personalInfoForm.get(field)?.value || '';
  //       return acc;
  //     }, {} as any);

  //     addressValues['firstAndSecondApplicantBothResidingatSameAddress'] = 'Yes';

  //     setTimeout(() => {
  //       this.personalInfoForm.setValue({
  //         ...this.personalInfoForm.value, // Preserve existing values
  //         ...addressValues, // Apply address values
  //       });

  //       this.cd.detectChanges(); // Force Angular to detect changes
  //       console.log('After checking:', this.personalInfoForm.value);
  //     });

  //     if (addressValues['secondApplicantPincode']) {
  //       this.onSearchPinCode(addressValues['secondApplicantPincode'], 'second');
  //     }
  //   } else {
  //     console.log('Unchecking: Resetting only specific fields');

  //     setTimeout(() => {
  //       this.personalInfoForm.setValue({
  //         ...this.personalInfoForm.value,
  //         secondApplicantAddress1: '',
  //         secondApplicantAddress2: '',
  //         secondApplicantCity: '', // Explicitly clearing city
  //         secondApplicantPincode: '',
  //         secondApplicantState: '', // Explicitly clearing state
  //         firstAndSecondApplicantBothResidingatSameAddress: 'No',
  //       });

  //       this.cd.detectChanges(); // Force UI update
  //       console.log('After unchecking:', this.personalInfoForm.value);
  //     });
  //   }
  // }

  onAddressChange(event: any): void {
    this.isAddressChecked = event.checked;

    const addressFields = [
      'firstApplicantAddress1',
      'firstApplicantAddress2',
      'firstApplicantCity',
      'firstApplicantPincode',
      'firstApplicantState',
    ];

    if (this.isAddressChecked) {
      this.updateSecondApplicantAddress(addressFields, 'firstApplicant');

      this.personalInfoForm.patchValue({
        firstAndSecondApplicantBothResidingatSameAddress: 'Yes',
      });

      // Trigger pincode lookup only if available
      const pincode = this.personalInfoForm.get(
        'secondApplicantPincode'
      )?.value;
      if (pincode) {
        this.onSearchPinCode(pincode, 'second');
      }
    } else {
      this.personalInfoForm.patchValue({
        secondApplicantAddress1: '',
        secondApplicantAddress2: '',
        secondApplicantCity: '',
        secondApplicantPincode: '',
        secondApplicantState: '',
        firstAndSecondApplicantBothResidingatSameAddress: 'No',
      });
    }
  }

  private updateSecondApplicantAddress(
    addressFields: string[],
    prefix: string
  ): void {
    const addressValues = addressFields.reduce((acc, field) => {
      acc[field.replace(prefix, 'secondApplicant')] =
        this.personalInfoForm.get(field)?.value || '';
      return acc;
    }, {} as any);

    this.personalInfoForm.patchValue(addressValues);
  }

  onProjectSelectionChange(event: any) {
    this.getpaymentPlansBasedOnProjectId(event);
    this.getSalesTeamBasedOnProjectId(event);
    this.fetchSalesTeamMembers(event);
  }

  getpaymentPlansBasedOnProjectId(projectId: number) {
    const blockId = this.blockId || this.applicantInfoData.blockId;
    this.paymentPlanService
      .getAllPaymentPlansByProjectId(projectId, blockId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (paymentPlans) => {
          this.paymentPlans = paymentPlans;
        },
        error: (error: Error) => {
          console.error('Error fetching payment Plans:', error);
        },
      });
  }

  getSalesTeamBasedOnProjectId(event: any) {
    let projectId;
    if (event && typeof event === 'object' && 'value' in event) {
      projectId = event.value;
    } else {
      projectId = event;
    }
    this.salesTeamService
      .getAllSaleTeam(projectId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (salesTeam) => {
          this.salesTeam = salesTeam;
        },
        error: (error: Error) => {
          console.error('Error fetching payment Plans:', error);
        },
      });
  }
  private fetchProjectById(projectId: number) {
    this.projectService
      .getProjectById(projectId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.selectedProject = data;
        },

        error: (error: Error) => {},
      });
  }
  private fetchBankById(applicantBankId: number) {
    this.commonRefDetailsService
      .getById(applicantBankId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.selectedBank = data;
          this.bank.setValue(this.selectedBank);
        },
        error: (error: Error) => {
          console.error(error);
        },
      });
  }

  fetchSalesTeamMembers(event: any) {
    let projectId;
    if (event && typeof event === 'object' && 'value' in event) {
      projectId = event.value;
    } else {
      projectId = event;
    }
    this.applicationInfoService
      .getSaleMembers(projectId, TYPE_COMMON_REFERENCE_DETAILS_ID)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.salesTeamMembers = data;
        },
        error: (error: Error) => {
          console.error('Error fetching projects:', error);
        },
      });
  }

  private fetchUserById(userId: number) {
    this.userService
      .getUserDtoByUserId(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.selectedUser = data;
        },
        error: (error: Error) => {},
      });
  }

  private fetchUserBySalesId(salesId: number) {
    this.userService
      .getUserDtoByUserId(salesId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.salesName = data.userName ? data.userName : '';
        },
        error: (error: Error) => {},
      });
  }

  private fetchUserByPreSalesId(preSalesId: number) {
    this.userService
      .getUserDtoByUserId(preSalesId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.preSalesName = data.userName ? data.userName : '';
        },
        error: (error: Error) => {},
      });
  }

  private fetchUnitById(unitId: number) {
    this.unitService
      .getUnitByUnitId(unitId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.selectedUnit = data;

          // Patch the form with the new values
          this.unitForm.patchValue({
            carpetArea: this.formatNumber(data.carpetArea || 0),
            balconyArea: this.formatNumber(data.balconyArea || 0),
            superArea: this.formatNumber(data.sbaArea || 0),
            east: data.east || '',
            west: data.west || '',
            north: data.north || '',
            south: data.south || '',
            udsArea: this.formatNumber(data.udsArea || 0),
          });
          if (data.unitFacingId) {
            this.fetchPhaseById(data.unitFacingId);
          }
        },
        error: (error: Error) => {},
      });
  }

  private fetchBlockById(blockId: number) {
    this.blockService
      .getBlockById(blockId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.selectedBlock = data;
          this.selectedBlockName = data.name;
        },
        error: (error: Error) => {},
      });
  }

  private fetchUnitTypeById(unitTypeId: number) {
    this.unitTypeService
      .getUnitTypeById(unitTypeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.selectedUnitTypeData = data;
          this.selectedUnitType = data.name;
        },
        error: (error: Error) => {},
      });
  }
  private fetchLevelById(levelId: number) {
    this.levelService
      .getLevelById(levelId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.selectedLevel = data;
          this.selectedLevelName = data.name;
        },
        error: (error: Error) => {},
      });
  }

  getAllAvailableUnits() {
    this.unitService
      .getAllAvailableUnits(this.projectId, this.unitName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.availableUnits = response;
          console.log(this.availableUnits);

          this.blockId = this.availableUnits[0].blockId;
          console.log(this.blockId);
          if (this.shouldPatchForm) {
            this.selectedBlockName = this.availableUnits[0].blockName;
            this.selectedLevelName = this.availableUnits[0].levelName;
            this.unitTypeName = this.availableUnits[0].unitTypeName;
            this.superArea = this.availableUnits[0].superArea;
            this.balconyArea = this.availableUnits[0].balconyArea;
            this.carpetArea = this.availableUnits[0].carpetArea;

            this.unitForm.patchValue({
              blockId: this.availableUnits[0].blockId,
              levelId: this.availableUnits[0].levelId,
              unitTypeName: this.availableUnits[0].unitTypeName,
              unitId: this.availableUnits[0].unitId,
              superArea: this.formatNumber(this.availableUnits[0].superArea),
              carpetArea: this.formatNumber(this.availableUnits[0].carpetArea),
              balconyArea: this.formatNumber(
                this.availableUnits[0].balconyArea
              ),
              phase: this.availableUnits[0].phase,
              east: this.availableUnits[0].east,
              west: this.availableUnits[0].west,
              north: this.availableUnits[0].north,
              south: this.availableUnits[0].south,
              udsArea: this.formatNumber(this.availableUnits[0].udsArea),
            });
            if (this.blockId) {
              this.getpaymentPlansBasedOnProjectId(this.projectId);
            }
            this.shouldPatchForm = false;
          }
        },
        error: (error) => {},
      });
  }
  formatRateForTds(event: any, stage: any): void {
    const value = event.target.value.replace(/,/g, '');
    if (!isNaN(Number(value))) {
      const formattedValue = this.decimalPipe.transform(value, '1.0-0');
      event.target.value = formattedValue;
      stage.tds = parseInt(value, 10);
    } else {
      stage.tds = null;
    }
  }

  formatRateForExpectedAmount(event: any, stage: any): void {
    const value = event.target.value.replace(/,/g, '');
    if (!isNaN(Number(value))) {
      const formattedValue = this.decimalPipe.transform(value, '1.0-0');
      event.target.value = formattedValue;
      stage.expectedAmount = parseInt(value, 10);
    } else {
      stage.expectedAmount = null;
    }
  }

  loading: boolean = false;

  update(): void {
    this.showLoading();
    const currentBookingId =
      this.applicantInfoData?.bookingId || this.bookingId;
    const basicPrice = this.formatRate(this.unitForm.get('basicPrice')?.value);
    const basePrice = this.parseIndianNumber(
      this.unitForm.get('basePrice')?.value
    );
    const files = this.getFilesObject();
    const firstApplicantPanCard = {
      firstApplicantPanCard: files['firstApplicantPanCard'],
    };
    const firstApplicantAadharCard = {
      firstApplicantAadharCard: files['firstApplicantAadharCard'],
    };
    const secondApplicantPanCard = {
      secondApplicantPanCard: files['secondApplicantPanCard'],
    };
    const secondApplicantAadharCard = {
      secondApplicantAadharCard: files['secondApplicantAadharCard'],
    };
    const thirdApplicantPanCard = {
      thirdApplicantPanCard: files['thirdApplicantPanCard'],
    };
    const thirdApplicantAadharCard = {
      thirdApplicantAadharCard: files['thirdApplicantAadharCard'],
    };
    const sanctionLetter = {
      sanctionLetter: files['sanctionLetter'],
    };
    let personalInfoValues = { ...this.personalInfoForm.value };
    const fieldsToRemove = [
      'secondApplicantPanCard',
      'secondApplicantAadharCard',
      'firstApplicantPanCard',
      'firstApplicantAadharCard',
      'thirdApplicantPanCard',
      'thirdApplicantAadharCard',
      'sanctionLetter',
    ];
    fieldsToRemove.forEach((field) => {
      delete personalInfoValues[field];
    });

    if (this.personalInfoForm.valid) {
      this.loading = true;
      this.applicationInfoService
        .getApplicantInfoById(currentBookingId)
        .pipe(
          takeUntil(this.destroy$),
          switchMap((latestInfo) => {
            this.unitForm.patchValue({ ...latestInfo });
            // Prepare update data
            const updateDetails = {
              bookingId: latestInfo.bookingId,
              basePrice: latestInfo.basePrice,
              finalPrice: this.parseIndianNumber(latestInfo.finalPrice),
              totalCharges: latestInfo.totalCharges,
              projectId: latestInfo.projectId,
              levelId: latestInfo.levelId,
              bookedById: latestInfo.bookedById,
              paymentPlanId: latestInfo.paymentPlanId,
              blockId: latestInfo.blockId,
              unitId: latestInfo.unitId,
              unitTypeName: latestInfo.unitTypeName,
              basicPrice: this.parseIndianNumber(latestInfo.basicPrice),
              crmUserId: latestInfo.crmUserId,
              userId: latestInfo.userId,
              gst: latestInfo.gst,
              sourceName: latestInfo.sourceName,
              subSourceName: latestInfo.subSourceName,
              firstApplicantPhoneNumber: latestInfo.firstApplicantPhoneNumber,
              receivedTds: latestInfo.receivedTds,
              bookingDate: latestInfo.bookingDate,
              ...personalInfoValues,
            };

            if (this.personalInfoForm.valid) {
              return this.applicationInfoService
                .updateApplicantInfo(
                  updateDetails,
                  firstApplicantPanCard,
                  firstApplicantAadharCard,
                  secondApplicantPanCard,
                  secondApplicantAadharCard,
                  thirdApplicantPanCard,
                  thirdApplicantAadharCard,
                  sanctionLetter,
                )
                .pipe(takeUntil(this.destroy$));
            } else {
              console.error('Form validation failed');
              return throwError(() => new Error('Form is not valid'));
            }
          })
        )
        .subscribe({
          next: (response) => {
            this.bookingId = response.applicantInfo.bookingId;
            this.getAllCustomerStages(
              this.unitForm.get('bookingId')?.value || ''
            );
            this.hideLoading();
            this.handleSuccessResponse(response);
            this.loading = false;
          },
          error: (error) => {
            console.error('Error during update:', error);
            this.hideLoading();
            this.handleErrorResponse(error);
            this.loading = false;
          },
        });
    }
  }

  openConfirmDialog(stepper: MatStepper, isUpdate: boolean): void {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: {
        displayedData: 'Save your changes before proceeding?',
        isUpdate: isUpdate,
      },
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isConfirmed: boolean) => {
        if (isConfirmed) {
          this.save();
        }
      }
    );
  }

  save() {
    this.showLoading();
    const basicPrice = this.parseIndianNumber(
      this.unitForm.get('basicPrice')?.value
    );
    const finalPrice = this.parseIndianNumber(
      this.unitForm.get('finalPrice')?.value
    );

    let personalInfoValues = { ...this.personalInfoForm.value };
    const fieldsToRemove = [
      'secondApplicantPanCard',
      'secondApplicantAadharCard',
      'firstApplicantPanCard',
      'firstApplicantAadharCard',
      'thirdApplicantPanCard',
      'thirdApplicantAadharCard',
      'sanctionLetter'
      
    ];
    fieldsToRemove.forEach((field) => {
      delete personalInfoValues[field];
    });

    if (this.unitForm.valid) {
      const formValues = {
        bookingId: this.unitForm.value.bookingId,
        totalCharges: this.unitForm.value.totalCharges,
        projectId: this.unitForm.value.projectId,
        levelId: this.unitForm.value.levelId,
        bookedById: this.unitForm.value.bookedById,
        paymentPlanId: this.unitForm.value.paymentPlanId,
        blockId: this.unitForm.value.blockId,
        unitId: this.unitForm.value.unitId,
        unitTypeName: this.unitForm.value.unitTypeName,
        crmUserId: this.unitForm.value.crmUserId,
        userId: this.unitForm.value.userId,
        gst: this.unitForm.value.gst,
        sourceName: this.unitForm.value.sourceName,
        subSourceName: this.unitForm.value.subSourceName,
        ...personalInfoValues,
        firstApplicantPhoneNumber:
          this.unitForm.value.firstApplicantPhoneNumber,
        finalPrice: finalPrice,
        basicPrice: basicPrice,
        basePrice: 0,
        bookingDate: this.unitForm.value.bookingDate,
      };

      let saveOrUpdate$;

      if (this.isAdding) {
        saveOrUpdate$ =
          this.applicationInfoService.addApplicantInfo(formValues);
      } else {
        const currentBookingId =
          this.applicantInfoData?.bookingId || this.bookingId;
        saveOrUpdate$ = this.applicationInfoService
          .getApplicantInfoById(currentBookingId)
          .pipe(
            takeUntil(this.destroy$),
            map((latestInfo: any) => {
              const mergedData = {
                ...latestInfo, // Backend data
                ...formValues,
              };
              console.log(mergedData);
              return mergedData;
            }),
            switchMap((mergedData) =>
              this.applicationInfoService.updateApplicantInfo(mergedData)
            )
          );
      }

      saveOrUpdate$.subscribe({
        next: (resp) => {
          const savedData = resp.applicantInfo;
          this.unitForm.patchValue(savedData);
          this.personalInfoForm.patchValue(savedData);
          this.bookingId = savedData.bookingId;
          const updatedBookingId =
            this.unitForm.get('bookingId')?.value || this.bookingId;
          if (updatedBookingId) {
            this.getAllCustomerStages(updatedBookingId);
          }
          this.handleNextClick();
          this.hideLoading();
          this.handleSuccessResponse(resp);
        },
        error: (err) => {
          console.error('Error during save operation:', err);
          this.hideLoading();
          this.handleErrorResponse(err);
        },
      });
    }
  }

  handleSuccessResponse(response: any): void {
    this.toastrService.success('', response.message, {
      timeOut: TIME_OUT,
    });
  }
  getSalutations() {
    this.commonService.fetchCommonReferenceTypes(SALUTATION).subscribe({
      next: (data) => {
        this.salutations = data;
      },
      error: (error) => {
        console.error(error?.message);
      },
    });
  }

  getGender() {
    this.commonService.fetchCommonReferenceTypes(GENDER).subscribe({
      next: (data) => {
        this.gender = data;
      },
      error: (error) => {
        console.error(error?.message);
      },
    });
  }

  getMaritalStatus() {
    this.commonService.fetchCommonReferenceTypes(MARITAL_STATUS).subscribe({
      next: (data) => {
        this.maritalStatus = data;
      },
      error: (error) => {
        console.error(error?.message);
      },
    });
  }

  getNationality() {
    this.commonService.fetchCommonReferenceTypes(NATIONALITY).subscribe({
      next: (data) => {
        this.nationality = data;
      },
      error: (error) => {
        console.error(error?.message);
      },
    });
  }

  getRelationGuardian() {
    this.commonService
      .fetchCommonReferenceTypes(RELATION_TO_GUARDIAN)
      .subscribe({
        next: (data) => {
          this.relationToGuardian = data;
        },
        error: (error) => {
          console.error(error?.message);
        },
      });
  }

  //     onFormChanges(): void {

  //   this.unitForm.get('basicPrice')?.valueChanges.subscribe((basicPrice) => {
  //     const numericBasicPrice = this.parseIndianNumber(basicPrice);
  //     if (numericBasicPrice && this.superArea) {
  //       const calculatedBasePrice = numericBasicPrice * this.superArea;
  //       const formattedBasePrice = this.formatRate(calculatedBasePrice);
  //       this.unitForm.get('basePrice')?.setValue(formattedBasePrice, { emitEvent: false });
  //     }
  //   });

  //   this.unitForm.get('basePrice')?.valueChanges.subscribe((basePrice) => {
  //     const numericBasePrice = this.parseIndianNumber(basePrice);

  //     if (numericBasePrice && this.superArea) {
  //       const calculatedBasicPrice = numericBasePrice / this.superArea;
  //       const formattedBasicPrice = this.formatRate(calculatedBasicPrice);

  //       // Update basicPrice without triggering valueChanges again
  //       this.unitForm.get('basicPrice')?.setValue(formattedBasicPrice, { emitEvent: false });
  //     }
  //   });
  // }

  // onFormChanges(): void {
  //   console.log(this.superArea)
  //   this.unitForm.get('basicPrice')?.valueChanges.subscribe((basicPrice) => {
  //     const numericBasicPrice = this.parseIndianNumber(basicPrice);

  //     // Check if the 'basicPrice' is cleared
  //     if (!basicPrice) {
  //       // Clear the 'basePrice' field
  //       this.unitForm.get('basePrice')?.setValue('', { emitEvent: false });
  //       return;
  //     }

  //     if (numericBasicPrice && this.superArea) {
  //       const calculatedBasePrice = numericBasicPrice * this.superArea;
  //       const formattedBasePrice = this.formatRate(calculatedBasePrice);
  //       this.unitForm.get('basePrice')?.setValue(formattedBasePrice, { emitEvent: false });
  //     }
  //   });
  //   this.unitForm.get('basePrice')?.valueChanges.subscribe((basePrice) => {
  //     const numericBasePrice = this.parseIndianNumber(basePrice);
  //     if (!basePrice) {
  //       this.unitForm.get('basicPrice')?.setValue('', { emitEvent: false });
  //       return;
  //     }

  //     if (numericBasePrice && this.superArea) {
  //       const calculatedBasicPrice = numericBasePrice / this.superArea;
  //       const formattedBasicPrice = this.formatRate(calculatedBasicPrice);
  //       this.unitForm.get('basicPrice')?.setValue(formattedBasicPrice, { emitEvent: false });
  //     }
  //   });
  // }

  private getDataFromState() {
    const { applicantInfoData, isAdding, activeStep, pageIndex, pageSize } =
      history.state;
    console.log(history.state.pageIndex, history.state.pageSize);
    if (history.state.pageSize != undefined) {
      this.pageSize = history.state.pageSize;
    }
    if (history.state.pageIndex != undefined) {
      this.pageIndex = history.state.pageIndex;
    }
    this.isAdding = isAdding !== undefined ? isAdding : this.isAdding;
    this.showDetails = !this.isAdding;
    this.applicantInfoData = applicantInfoData || this.applicantInfoData;
    if (history.state.firstApplicantName != undefined) {
      this.firstApplicantName = history.state.firstApplicantName;
      console.log(this.firstApplicantName);
     }
   if (history.state.blockId != undefined) {
      this.blockId = history.state.blockId;
      console.log(' blockId', this.blockId);
    }
    if (history.state.planId != undefined) {
      this.planId = history.state.planId;
      console.log('planId', this.planId);
    }
    if (history.state.projectId != undefined) {
      this.projectId = history.state.projectId;
      console.log('projectId', this.projectId);
    }
    if (history.state.unitName != undefined) {
      this.unitName = history.state.unitName;
      console.log('unitName', this.unitName);
    }
     if (history.state.unitId != undefined) {
      this.unitId = history.state.unitId;
      console.log('unitName', this.unitId);
    }
    if (history.state.typeId != undefined) {
      this.typeId = history.state.typeId;
      console.log('typeId', this.typeId);
    }
  //   
    if (!this.isAdding) {
      this.patchFormDataWithApplicantInfo();
      this.getAllCustomerStages(applicantInfoData.bookingId);
    }

    const stepIndex = this.getStepIndexByLabel(activeStep);

    if (stepIndex !== -1) {
      this.stepper.selectedIndex = stepIndex;
    } else {
      console.warn(`Step label "${activeStep}" not found in the stepper.`);
    }

    this.isDataLoaded = true;
  }

  getAllCustomerStages(bookingId: number) {
    this.customerStageService
      .getCustomerStages(bookingId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.customerStagesDtoWithAmount = response;
          this.customerStagesDto =
            this.customerStagesDtoWithAmount.customerStagesDto;
        },
        error: (error) => {},
      });
  }

  private fetchPhaseById(phaseId: number) {
    this.commonRefDetailsService
      .getById(phaseId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.selectedPhase = data;
          this.unitForm.patchValue({
            phase: data.commonRefValue || '',
          });
        },
        error: (error: Error) => {},
      });
  }

  clearForm(): void {
    this.personalInfoForm.reset();
  }

  gotoApplicantInfos(): void {
    this.router.navigate(['layout/crm/displayBookingOverview']);
  }

  ngAfterViewInit() {
    if (!this.isAdding) {
      this.getAllCustomerStages(this.applicantInfoData?.bookingId);
    }

    const { activeStep } = history.state;
    const stepIndex = this.getStepIndexByLabel(activeStep);

    if (stepIndex !== -1) {
      this.stepper.selectedIndex = stepIndex;
    } else {
      console.warn(`Step label "${activeStep}" not found.`);
    }
  }
  private getStepIndexByLabel(stepLabel: string): number {
    const stepLabels = [
      'Unit Details',
      'Charges Details',
      'Applicant Details',
      'Stage Details',
    ];
    return stepLabels.findIndex(
      (label) => label.toLowerCase() === stepLabel.toLowerCase()
    );
  }

  private patchFormDataWithApplicantInfo() {
    this.getpaymentPlansBasedOnProjectId(this.applicantInfoData.projectId);
    this.personalInfoForm.patchValue(this.applicantInfoData);
    this.unitForm.patchValue({
      ...this.applicantInfoData,
      basicPrice: this.formatRate(this.applicantInfoData.basicPrice || 0),
      finalPrice: this.formatNumber(this.applicantInfoData.finalPrice || 0),
    });
    const coApplicant1Fields = ['secondApplicantName'];
    const coApplicant2Fields = ['thirdApplicantName'];
    const description = ['description'];

    const isCoApplicant1Present = coApplicant1Fields.some(
      (field) =>
        (this.applicantInfoData as any)[field] &&
        (this.applicantInfoData as any)[field] !== null &&
        (this.applicantInfoData as any)[field] !== ''
    );
    const isCoApplicant2Present = coApplicant2Fields.some(
      (field) =>
        (this.applicantInfoData as any)[field] &&
        (this.applicantInfoData as any)[field] !== null &&
        (this.applicantInfoData as any)[field] !== ''
    );
    const isDescription = description.some(
      (field) =>
        (this.applicantInfoData as any)[field] &&
        (this.applicantInfoData as any)[field] !== null &&
        (this.applicantInfoData as any)[field] !== ''
    );
    this.isSecondCoApplicantChecked = isCoApplicant2Present;
    this.isCoApplicantChecked = isCoApplicant1Present;
    this.isDescriptionChecked = isDescription;
    this.onCheckboxChange({ checked: this.isCoApplicantChecked });
    this.onSecondCoApplicantCheckboxChange({
      checked: this.isSecondCoApplicantChecked,
    });
    this.onDescriptionChange({ checked: this.isDescriptionChecked });

    const firstApplicantName = this.applicantInfoData.firstApplicantName || '';
    const secondApplicantName =
      this.applicantInfoData.secondApplicantName || '';
    const thirdApplicantName = this.applicantInfoData.thirdApplicantName || '';
    this.applicantInfoData.firstApplicantAadharCard = this.renameFile(
      this.applicantInfoData.firstApplicantAadharCard,
      firstApplicantName,
      'AadharCard'
    );

    this.applicantInfoData.firstApplicantPanCard = this.renameFile(
      this.applicantInfoData.firstApplicantPanCard,
      firstApplicantName,
      'PanCard'
    );
    this.applicantInfoData.secondApplicantAadharCard = this.renameFile(
      this.applicantInfoData.secondApplicantAadharCard,
      secondApplicantName,
      'AadharCard'
    );
    this.applicantInfoData.secondApplicantPanCard = this.renameFile(
      this.applicantInfoData.secondApplicantPanCard,
      secondApplicantName,
      'PanCard'
    );
    this.applicantInfoData.thirdApplicantAadharCard = this.renameFile(
      this.applicantInfoData.thirdApplicantAadharCard,
      thirdApplicantName,
      'AadharCard'
    );
    this.applicantInfoData.thirdApplicantPanCard = this.renameFile(
      this.applicantInfoData.thirdApplicantPanCard,
      thirdApplicantName,
      'PanCard'
    );
    this.applicantInfoData.thirdApplicantPanCard = this.renameFile(
      this.applicantInfoData.thirdApplicantPanCard,
      thirdApplicantName,
      'PanCard'
    );
    this.applicantInfoData.sanctionLetter = this.renameFile(
      this.applicantInfoData.sanctionLetter,
      '',
      ''
    );
    this.isAddressChecked =
      this.applicantInfoData
        .firstAndSecondApplicantBothResidingatSameAddress === 'Yes';

    if (this.applicantInfoData.firstApplicantPincode != null) {
      this.onSearchPinCode(
        this.applicantInfoData.firstApplicantPincode,
        'first'
      );
    }
    if (this.applicantInfoData.secondApplicantPincode != null) {
      this.onSearchPinCode(
        this.applicantInfoData.secondApplicantPincode,
        'second'
      );
    }
    if (this.applicantInfoData.thirdApplicantPincode != null) {
      this.onSearchPinCode(
        this.applicantInfoData.thirdApplicantPincode,
        'third'
      );
    }

    this.personalInfoForm.patchValue(this.applicantInfoData);
    this.unitForm.patchValue({
      ...this.applicantInfoData,
      basicPrice: this.formatRate(this.applicantInfoData.basicPrice || 0),
      finalPrice: this.formatNumber(this.applicantInfoData.finalPrice || 0),
    });

    if (this.applicantInfoData.projectId != null) {
      this.fetchProjectById(this.applicantInfoData.projectId);
    }
    if (this.applicantInfoData.unitId != null) {
      this.fetchUnitById(this.applicantInfoData.unitId);
    }
    if (this.applicantInfoData.blockId != null) {
      this.fetchBlockById(this.applicantInfoData.blockId);
    }
    if (this.applicantInfoData.levelId != null) {
      this.fetchLevelById(this.applicantInfoData.levelId);
    }
    if (this.applicantInfoData.crmUserId != null) {
      this.fetchUserById(this.applicantInfoData.crmUserId);
    }
    if (this.applicantInfoData.bookedById != null) {
      this.fetchUserBySalesId(this.applicantInfoData.bookedById);
    }
    if (this.applicantInfoData.preSalesId != null) {
      this.fetchUserByPreSalesId(this.applicantInfoData.preSalesId);
    }
    if (this.applicantInfoData.applicantBankId != null) {
      this.fetchBankById(this.applicantInfoData.applicantBankId);
    }
  }
  renameFile(fileUrl: string, lastName: string, fileType: string): string {
    if (!fileUrl) return '';
    const fileNameWithExtension = fileUrl.split('/').pop()?.split('?')[0] || '';
    const match = fileNameWithExtension.match(/(\w+\.pdf)/);
    const fileExtension = fileNameWithExtension.split('.').pop();
    const originalFileName = fileNameWithExtension.replace(/\.\w+$/, '');
    const newFileName = `${fileType}_${lastName}_${originalFileName}.${fileExtension}`;
    return newFileName;
  }

  handleErrorResponse(error: any): void {
    const errorMessage = error?.message || 'An unknown error occurred';
    this.toastrService.error('', error.error.message, {
      timeOut: TIME_OUT,
    });
    // alert(errorMessage);
  }
  dirtyStageId: string | null = null;
  updateCustomerStage(stage: any) {
    this.StagesInfoForm.patchValue({
      id: stage.customerStages,
      bookingId: stage.bookingId,
      stageName: stage.stageName,
      stageOrder: stage.stageOrder,
      description: stage.description,
      percentage: stage.percentage,
      days: stage.days,
      initiated: stage.initiated,
      expectedDate: stage.expectedDate,
      actualDate: stage.actualDate,
      expectedAmount: stage.expectedAmount,
      planId: stage.planId,
      status: 'A',
      tds: stage.tds,
      stageId: stage.stageId,
    });
    const formDataArray = [this.StagesInfoForm.value];
    this.customerStageService.updateCustomerStage(formDataArray).subscribe({
      next: (response) => {
        this.handleSuccessResponse(response);
        this.getAllCustomerStages(stage.bookingId);
      },
      error: (error) => {
        this.handleErrorResponse(error);
      },
    });
  }

  formatNumber(value: string | number): string {
    const numericValue =
      typeof value === 'number'
        ? value
        : parseFloat(value.replace(/,/g, '') || '0');

    if (isNaN(numericValue)) {
      return '0';
    }

    return this.formatIndianCurrency(numericValue);
  }

  private formatIndianCurrency(value: number): string {
    const parts = value.toFixed(0).split('.');
    let integerPart = parts[0];
    let formatted = '';
    const lastThree = integerPart.slice(-3);
    const otherNumbers = integerPart.slice(0, -3);

    if (otherNumbers) {
      formatted =
        otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
    } else {
      formatted = lastThree;
    }

    return formatted;
  }

  formatRate(value: number | string): string {
    if (value == null || value === '') return ''; // Handle null or empty value
    const numericValue =
      typeof value === 'number' ? value : parseFloat(value.replace(/,/g, ''));
    if (isNaN(numericValue)) return '';
    const fixedValue = numericValue.toFixed(2);
    const [integerPart, fractionalPart] = fixedValue.split('.');
    const lastThree = integerPart.slice(-3);
    const otherNumbers = integerPart.slice(0, -3);
    const formattedInteger =
      otherNumbers !== ''
        ? otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree
        : lastThree;

    return `${formattedInteger}.${fractionalPart}`;
  }

  parseIndianNumber(value: string | number): number {
    if (typeof value === 'string') {
      return parseFloat(value.replace(/,/g, '') || '0');
    }
    return value || 0;
  }
  gotoBookingOverview() {
    this.router.navigate([NAVIGATE_TO_BOOKING_OVERVIEW], {
      state: {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        firstApplicantName :this.firstApplicantName,
        projectId:this.projectId,
        blockId:this.blockId,
        planId:this.planId,
        typeId:this.typeId,
        unitId:this.unitId,
        unitName:this.unitName,
      },
    });
  }

  // onFormChanges(): void {
  //   this.unitForm.get('basicPrice')?.valueChanges.subscribe((basicPrice) => {
  //     if (basicPrice === null || basicPrice === '') {
  //       this.unitForm.get('basePrice')?.setValue('', { emitEvent: false });
  //       return;
  //     }

  //     const numericBasicPrice = this.parseIndianNumber(basicPrice);
  //     if (numericBasicPrice && this.superArea) {
  //       const calculatedBasePrice = numericBasicPrice * this.superArea;
  //       const formattedBasePrice = this.formatNumber(calculatedBasePrice);
  //       this.unitForm
  //         .get('basePrice')
  //         ?.setValue(formattedBasePrice, { emitEvent: false });
  //     }
  //   });

  //   this.unitForm.get('basePrice')?.valueChanges.subscribe((basePrice) => {
  //     if (basePrice === null || basePrice === '') {
  //       this.unitForm.get('basicPrice')?.setValue('', { emitEvent: false });
  //       return;
  //     }

  //     const numericBasePrice = this.parseIndianNumber(basePrice);
  //     if (numericBasePrice && this.superArea) {
  //       const calculatedBasicPrice = numericBasePrice / this.superArea;
  //       const formattedBasicPrice = this.formatNumber(calculatedBasicPrice);
  //       this.unitForm
  //         .get('basicPrice')
  //         ?.setValue(formattedBasicPrice, { emitEvent: false });
  //     }
  //   });
  // }

  onTotalFinalFormChanges(): void {
    this.unitForm.get('basicPrice')?.valueChanges.subscribe((basicPrice) => {
      if (basicPrice === null || basicPrice === '') {
        this.unitForm.get('finalPrice')?.setValue('', { emitEvent: false });
        return;
      }

      const numericBasicPrice = this.parseIndianNumber(basicPrice);
      if (numericBasicPrice && this.superArea) {
        const calculatedFinalPrice = numericBasicPrice * this.superArea;
        const formattedFinalPrice = this.formatNumber(calculatedFinalPrice);
        this.unitForm
          .get('finalPrice')
          ?.setValue(formattedFinalPrice, { emitEvent: false });
      }
    });

    this.unitForm.get('finalPrice')?.valueChanges.subscribe((finalPrice) => {
      if (finalPrice === null || finalPrice === '') {
        this.unitForm.get('basicPrice')?.setValue('', { emitEvent: false });
        return;
      }

      const numericFinalPrice = this.parseIndianNumber(finalPrice);
      if (numericFinalPrice && this.superArea) {
        const calculatedBasicPrice = numericFinalPrice / this.superArea;
        const formattedBasicPrice = this.formatRate(calculatedBasicPrice);
        this.unitForm
          .get('basicPrice')
          ?.setValue(formattedBasicPrice, { emitEvent: false });
      }
    });
  }

  formatInputValue(fieldName: string, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (!inputElement) return;

    const value = inputElement.value.replace(/,/g, '');
    const formattedValue = this.formatNumber(value);

    this.unitForm
      .get(fieldName)
      ?.setValue(formattedValue, { emitEvent: false });
  }

  fileTypeError: boolean = false;
  selectedFiles: File[] = [];
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const selectedFile = input.files[0];
      const allowedExtensions = ['pdf']; // Only allow .pdf files
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();

      if (allowedExtensions.includes(fileExtension!)) {
        this.fileTypeError = false; // Reset error
        this.selectedFiles = [selectedFile]; // Store the selected file
      } else {
        this.fileTypeError = true; // Set error flag
        this.selectedFiles = []; // Clear selected files
      }
    } else {
      this.selectedFiles = []; // Clear selected files if no file is selected
    }
  }

  uploadBookingForm(): void {
    this.showLoading();
    if (!this.isAdding) {
      this.bookingId = history.state.applicantInfoData.bookingId;
    }

    if (this.pdfUploadForm.valid && !this.fileTypeError) {
      // Process the file upload here (e.g., call a service to upload the file)
      this.applicationInfoService
        .uploadBookingForm(this.bookingId, this.selectedFiles)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response: any) => {
            this.hideLoading();
            this.handleSuccessResponse(response);
            this.gotoBookingOverview();
          },
          error: (error: any) => {
            this.hideLoading();
            this.handleErrorResponse(error);
          },
        });
    } else {
      console.error('Form is invalid or file type error');
    }
  }

  sanitizeSuperBuildUpArea(value: string | null): number {
    if (value) {
      const sanitizedValue = value.replace(/,/g, '');
      return Number(sanitizedValue);
    }
    return 1; // Default value
  }

  getFilesObject(): { [key: string]: File | null } {
    const files = {
      firstApplicantPanCard:
        this.firstApplicantPanCard?.nativeElement?.files?.length > 0
          ? this.firstApplicantPanCard.nativeElement.files[0]
          : null,
      firstApplicantAadharCard:
        this.firstApplicantAadharCard?.nativeElement?.files?.length > 0
          ? this.firstApplicantAadharCard.nativeElement.files[0]
          : null,
      secondApplicantPanCard:
        this.secondApplicantPanCard?.nativeElement?.files?.length > 0
          ? this.secondApplicantPanCard.nativeElement.files[0]
          : null,
      secondApplicantAadharCard:
        this.secondApplicantAadharCard?.nativeElement?.files?.length > 0
          ? this.secondApplicantAadharCard.nativeElement.files[0]
          : null,
      thirdApplicantPanCard:
        this.thirdApplicantPanCard?.nativeElement?.files?.length > 0
          ? this.thirdApplicantPanCard.nativeElement.files[0]
          : null,
      thirdApplicantAadharCard:
        this.thirdApplicantAadharCard?.nativeElement?.files?.length > 0
          ? this.thirdApplicantAadharCard.nativeElement.files[0]
          : null,
          sanctionLetter:
        this.sanctionLetter?.nativeElement?.files?.length > 0
          ? this.sanctionLetter.nativeElement.files[0]
          : null,
    };
    return files;
  }
  onCheckFileChange(event: Event, documentType: string): void {
    this.handleFileChange(event, documentType);
  }
  handleFileChange(event: Event, key: string): void {
    const input = event.target as HTMLInputElement;
    const file = input.files ? input.files[0] : null;

    if (file) {
      this.fileNames[key] = file.name; // Update file name
      this.fileErrors[key] = null; // Clear file error if any
      this.personalInfoForm.get(key)?.setValue(file.name); // Update form control value
      this.personalInfoForm.get(key)?.setErrors(null); // Clear form control errors
      this.personalInfoForm.get(key)?.markAsTouched(); // Mark as touched
    } else {
      this.fileNames[key] = null;
      this.fileErrors[key] = 'No file selected.'; // Update error message
      this.personalInfoForm.get(key)?.setValue(null); // Clear form control value
      this.personalInfoForm.get(key)?.setErrors({ required: true }); // Set required error
    }
  }

  // getLeadsSourceAndSubSource(patchUnitForm: boolean) {
  //   const projectId = this.projectId || this.applicantInfoData.projectId;
  //   console.log('projectId---------------', projectId);
  //   const phoneNumber =
  //     this.phoneNumber?.replace(/^\+91/, '') ||
  //     this.applicantInfoData.firstApplicantPhoneNumber?.replace(/^\+91/, '');
  //        const coApplicantPhoneNumber =
  //          this.phoneNumber?.replace(/^\+91/, '') ||
  //          this.applicantInfoData.secondApplicantPhoneNumber?.replace(
  //            /^\+91/,
  //            ''
  //          );
  //   console.log('phoneNumber------------', phoneNumber);

  //   this.leadService
  //     .getLeadSourceSubSourceWithoutPagination(phoneNumber, projectId)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (applicantLeadDto) => {
  //         this.applicantLeadDto = applicantLeadDto;
  //         this.salesName = this.applicantLeadDto[0]?.salesName || '';
  //         this.preSalesName = this.applicantLeadDto[0]?.preSalesName || 'NA';
  //         const fullName = this.applicantLeadDto[0]?.name || '';
  //         const nameParts = fullName.trim().split(' ');

  //         if (patchUnitForm) {
  //           // Patch only unitForm when called from onSearchPhoneNumber
  //           this.unitForm.patchValue({
  //             sourceName: this.applicantLeadDto[0]?.leadSourceName || '',
  //             subSourceName: this.applicantLeadDto[0]?.leadSubSourceName || '',
  //             firstApplicantPhoneNumber:
  //               this.applicantLeadDto[0]?.phoneNumber || '',
  //             bookedById: this.applicantLeadDto[0]?.salesId || '',
  //             preSalesId: this.applicantLeadDto[0]?.preSalesId || '',
  //           });
  //         } else {
  //           const currentValues = this.personalInfoForm.value;
  //          if(phoneNumber){
  //           this.personalInfoForm.patchValue({
  //             firstApplicantName: currentValues.firstApplicantName || '',
  //             firstApplicantEmail:
  //               currentValues.firstApplicantEmail ||
  //               this.applicantLeadDto[0]?.email ||
  //               '',
  //             firstApplicantGender:
  //               currentValues.firstApplicantGender ||
  //               this.applicantLeadDto[0]?.gender ||
  //               '',
  //             // firstApplicantPhoneNumber:
  //             //   currentValues.firstApplicantPhoneNumber ||
  //             //   this.applicantLeadDto[0]?.phoneNumber ||
  //             //   '',
  //             firstApplicantPhoneNumber:
  //               this.applicantLeadDto[0]?.phoneNumber?.replace(/^\+91/, '') ||
  //               currentValues.firstApplicantPhoneNumber ||
  //               '',
  //           });
  //         }else if(coApplicantPhoneNumber){
  //           this.personalInfoForm.patchValue({
  //             secondApplicantName: currentValues.secondApplicantName || '',
  //             secondApplicantEmail:
  //               currentValues.secondApplicantEmail ||
  //               this.applicantLeadDto[0]?.email ||
  //               '',
  //             secondApplicantGender:
  //               currentValues.secondApplicantGender ||
  //               this.applicantLeadDto[0]?.gender ||
  //               '',
  //             // firstApplicantPhoneNumber:
  //             //   currentValues.firstApplicantPhoneNumber ||
  //             //   this.applicantLeadDto[0]?.phoneNumber ||
  //             //   '',
  //             secondApplicantPhoneNumber:
  //               this.applicantLeadDto[0]?.phoneNumber?.replace(/^\+91/, '') ||
  //               currentValues.secondApplicantPhoneNumber ||
  //               '',
  //           });

  //         }
  //         }
  //       },
  //       error: (error) => {
  //         console.log(error.error);
  //       },
  //     });
  // }

  getLeadsSourceAndSubSource(patchUnitForm: boolean) {
    const projectId = this.projectId || this.applicantInfoData?.projectId;

    const phoneNumber =
      this.phoneNumber?.replace(/^\+91/, '') ||
      this.applicantInfoData?.firstApplicantPhoneNumber?.replace(/^\+91/, '');

    const coApplicantPhoneNumber =
      this.coApplicantPhoneNumber?.replace(/^\+91/, '') ||
      this.applicantInfoData?.secondApplicantPhoneNumber?.replace(/^\+91/, '');

    if (!phoneNumber && !coApplicantPhoneNumber) {
      return;
    }
    const mainPhoneNumber = phoneNumber || coApplicantPhoneNumber;
    // ✅ Fetch details for applicants separately
    // if (phoneNumber) {
    //   this.fetchAndPatchLeadDetails(
    //     phoneNumber,
    //     projectId,
    //     patchUnitForm,
    //     'first'
    //   );
    // }

    // if (coApplicantPhoneNumber) {
    //   this.fetchAndPatchLeadDetails(
    //     coApplicantPhoneNumber,
    //     projectId,
    //     patchUnitForm,
    //     'second'
    //   );
    // }
    if (phoneNumber && coApplicantPhoneNumber) {
      this.fetchAndPatchLeadDetails(
        phoneNumber,
        projectId,
        patchUnitForm,
        'first'
      );
    } else if (phoneNumber) {
      this.fetchAndPatchLeadDetails(
        phoneNumber,
        projectId,
        patchUnitForm,
        'first'
      );
    } else if (coApplicantPhoneNumber) {
      this.fetchAndPatchLeadDetails(
        coApplicantPhoneNumber,
        projectId,
        patchUnitForm,
        'second'
      );
    }

    if (this.fileNames['firstApplicantAadharCard']) {
      this.personalInfoForm
        .get('firstApplicantAadharCard')
        ?.setValue(this.fileNames['firstApplicantAadharCard']);
    }
    if (this.fileNames['firstApplicantPanCard']) {
      this.personalInfoForm
        .get('firstApplicantPanCard')
        ?.setValue(this.fileNames['firstApplicantPanCard']);
    }
    if (this.fileNames['secondApplicantAadharCard']) {
      this.personalInfoForm
        .get('secondApplicantAadharCard')
        ?.setValue(this.fileNames['secondApplicantAadharCard']);
    }
    if (this.fileNames['secondApplicantPanCard']) {
      this.personalInfoForm
        .get('secondApplicantPanCard')
        ?.setValue(this.fileNames['secondApplicantPanCard']);
    }
    if (this.fileNames['thirdApplicantAadharCard']) {
      this.personalInfoForm
        .get('thirdApplicantAadharCard')
        ?.setValue(this.fileNames['thirdApplicantAadharCard']);
    }
    if (this.fileNames['thirdApplicantPanCard']) {
      this.personalInfoForm
        .get('thirdApplicantPanCard')
        ?.setValue(this.fileNames['thirdApplicantPanCard']);
    }
    if (this.fileNames['sanctionLetter']) {
      this.personalInfoForm
        .get('sanctionLetter')
        ?.setValue(this.fileNames['sanctionLetter']);
    }
    //   'secondApplicantPanCard') secondApplicantPanCard!: ElementRef;
    // @ViewChild('secondApplicantAadharCard')
    // secondApplicantAadharCard!: ElementRef;
    // @ViewChild('thirdApplicantPanCard') thirdApplicantPanCard!: ElementRef;
    // @ViewChild('thirdApplicantAadharCard')
  }

  fetchAndPatchLeadDetails(
    phoneNumber: string,
    projectId: number,
    patchUnitForm: boolean,
    applicantType: 'first' | 'second' | 'sales'
  ) {
    console.log(phoneNumber);
    phoneNumber = phoneNumber.replace(/\s+/g, ''); // removes all spaces
    this.showLoading();
    this.leadService
      .getLeadSourceSubSourceWithoutPagination(phoneNumber, projectId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (applicantLeadDto) => {
          this.hideLoading();
          if (!applicantLeadDto || applicantLeadDto.length === 0) return;
          const leadData = applicantLeadDto[0];
          if (patchUnitForm) {
            const unitFormPatchData: any = {};
            unitFormPatchData.sourceName = leadData?.leadSourceName || '';
            unitFormPatchData.subSourceName = leadData?.leadSubSourceName || '';
            unitFormPatchData.bookedById = leadData?.salesId || '';
            unitFormPatchData.preSalesId = leadData?.preSalesId || '';
            // unitFormPatchData.salesName = leadData?.salesName || '';
            this.salesName = leadData?.salesName || '';
            this.preSalesName = leadData?.preSalesName || 'NA';
            if (applicantType === 'first') {
              unitFormPatchData.firstApplicantPhoneNumber =
                leadData?.phoneNumber?.replace(/^\+91/, '') || '';
            } else if (applicantType === 'second') {
              unitFormPatchData.secondApplicantPhoneNumber =
                leadData?.phoneNumber?.replace(/^\+91/, '') || '';
            }
            this.unitForm.patchValue(unitFormPatchData);
          } else {
            const currentValues = this.personalInfoForm.value;
            if (applicantType === 'first') {
              this.personalInfoForm.patchValue({
                firstApplicantName:
                  currentValues.firstApplicantName || leadData?.name || '',
                firstApplicantEmail:
                  currentValues.firstApplicantEmail || leadData?.email || '',
                firstApplicantGender:
                  currentValues.firstApplicantGender || leadData?.gender || '',
                firstApplicantPhoneNumber:
                  leadData?.phoneNumber?.replace(/^\+91/, '') ||
                  currentValues.firstApplicantPhoneNumber ||
                  '',
              });
            } else if (applicantType === 'second') {
              this.personalInfoForm.patchValue({
                secondApplicantName:
                  currentValues.secondApplicantName || leadData?.name || '',
                secondApplicantEmail:
                  currentValues.secondApplicantEmail || leadData?.email || '',
                secondApplicantGender:
                  currentValues.secondApplicantGender || leadData?.gender || '',
                secondApplicantPhoneNumber:
                  leadData?.phoneNumber?.replace(/^\+91/, '') ||
                  currentValues.secondApplicantPhoneNumber ||
                  '',
              });
            }
          }
          this.hideLoading();
        },
        error: (error) => {
          this.showDetails = false;
          console.log(error);
          console.log(error.message);
          this.hideLoading();
          Swal.fire({
            icon: 'error',
            title: 'Failed!',
            text: error?.error || 'There was an error .',
          });
        },
      });
  }

  onSearchPhoneNumber(phoneNumber1: string) {
    const phoneNumber = phoneNumber1.replace(/\s+/g, ''); // removes all spaces
    if (
      phoneNumber.length >= searchPhoneNumberLength ||
      phoneNumber.length == searchTextZero
    ) {
      this.phoneNumber = phoneNumber;
      this.pageIndex = PAGE_INDEX;
      if (
        this.isAdding &&
        this.projectId &&
        this.unitName &&
        this.phoneNumber
      ) {
        this.showDetails = true;
      }
      this.getLeadsSourceAndSubSource(true);
    }
  }
  onSearchCoApplicantPhoneNumber(coApplicantPhoneNUmber1: string) {
    const coApplicantPhoneNUmber = coApplicantPhoneNUmber1.replace(/\s+/g, '');
    if (
      coApplicantPhoneNUmber.length >= searchPhoneNumberLength ||
      coApplicantPhoneNUmber.length === searchTextZero
    ) {
      this.coApplicantPhoneNumber = coApplicantPhoneNUmber;
      this.pageIndex = PAGE_INDEX;
      if (
        this.isAdding &&
        this.projectId &&
        this.unitName &&
        (this.phoneNumber || this.coApplicantPhoneNumber)
      ) {
        this.showDetails = true;
      }
      this.getLeadsSourceAndSubSource(true);
    }
  }

  handleNextClick(): void {
    this.getLeadsSourceAndSubSource(false);
    // this.setReadonlyBasedOnRole();
  }

  onPanNumberInput(controlName: string): void {
    const control = this.personalInfoForm.get(controlName);
    if (control) {
      const value = control.value?.toUpperCase() || '';
      control.setValue(value, { emitEvent: false });
    }
  }

  selectedAddressOption: string = '';

  onThirdApplicantAddressChange(event: any): void {
    // Set the flag based on the selected value
    this.isThirdApplicantAddressChecked = event.value === 'firstApplicant';

    // Define the fields for the first applicant
    const addressFields = [
      'firstApplicantAddress1',
      'firstApplicantAddress2',
      'firstApplicantCity',
      'firstApplicantPincode',
      'firstApplicantState',
    ];

    // Update the third applicant's address using the first applicant's fields
    this.updateThirdApplicantAddress(addressFields, 'firstApplicant');
  }

  onThirdApplicantPatchAddressToSecondApplicant(event: any): void {
    // Set the flag based on the selected value
    this.isThirdApplicantAddressChecked = event.value === 'secondApplicant';

    // Define the fields for the second applicant
    const addressFields = [
      'secondApplicantAddress1',
      'secondApplicantAddress2',
      'secondApplicantCity',
      'secondApplicantPincode',
      'secondApplicantState',
    ];

    // Update the third applicant's address using the second applicant's fields
    this.updateThirdApplicantAddress(addressFields, 'secondApplicant');
  }

  private updateThirdApplicantAddress(
    addressFields: string[],
    prefix: string
  ): void {
    const addressValues = addressFields.reduce((acc, field) => {
      // Map the first or second applicant's address fields to the third applicant
      acc[field.replace(prefix, 'thirdApplicant')] =
        this.personalInfoForm.get(field)?.value || ''; // Get the value from the form or default to empty
      return acc;
    }, {} as any);

    // If the flag is set (i.e., "Same as First/Second Applicant" is checked), patch the values into the third applicant's form
    if (this.isThirdApplicantAddressChecked) {
      this.personalInfoForm.patchValue(addressValues);

      // After patching, check if the pincode exists for third applicant and trigger the search for city/state
      if (addressValues['thirdApplicantPincode']) {
        // Call onSearchPinCode for the third applicant
        this.onSearchPinCode(addressValues['thirdApplicantPincode'], 'third');
      }
    } else {
      // Reset the third applicant's address fields if the radio button is not selected
      this.personalInfoForm.patchValue({
        thirdApplicantAddress1: '',
        thirdApplicantAddress2: '',
        thirdApplicantCity: '',
        thirdApplicantPincode: '',
        thirdApplicantState: '',
      });
    }
  }

  setValidatorsBasedOnMode(form: FormGroup) {
    const fieldsToValidate = [
      'firstApplicantPanCard',
      'firstApplicantAadharCard',
    ];

    fieldsToValidate.forEach((fieldName) => {
      const control = form.get(fieldName);
      if (control) {
        if (!control.value) {
          control.setValidators(this.fileRequiredValidator());
        } else {
          control.clearValidators();
        }
        control.updateValueAndValidity();
      }
    });
  }

  filteredCities: string[] = [];
  filteredStates: string[] = [];
  showCityDropdown = false;
  showStateDropdown = false;

  applicantAddressData: {
    [key: string]: { cities: string[]; states: string[]; districts: string[] };
  } = {};

  filteredData: {
    [key: string]: { cities: string[]; states: string[]; addresses: string[] };
  } = {};

  onSearchPinCode(pincode: string, applicant: 'first' | 'second' | 'third') {
    if (pincode.length !== 6) {
      this.filteredData[applicant] = { cities: [], states: [], addresses: [] };

      // Reset form fields for the respective applicant
      this.personalInfoForm.get(`${applicant}ApplicantCity`)?.setValue('');
      this.personalInfoForm.get(`${applicant}ApplicantState`)?.setValue('');
      this.personalInfoForm.get(`${applicant}ApplicantDistrict`)?.setValue('');
      return;
    }

    this.isLoading = true;

    this.applicationInfoService.getAddressByPinCode(pincode, '').subscribe(
      (data: any) => {
        this.isLoading = false;

        if (data && Array.isArray(data) && data.length > 0) {
          // Ensure the data is updated only for the respective applicant
          this.filteredData[applicant] = {
            cities: Array.from(new Set(data.map((item) => item.district))),
            states: Array.from(new Set(data.map((item) => item.state))),
            addresses: Array.from(new Set(data.map((item) => item.city))),
          };

          // Patch values for the respective applicant using patchValue() to handle partial updates
          const patchData: any = {};

          if (this.filteredData[applicant].cities.length > 0) {
            patchData[`${applicant}ApplicantCity`] =
              this.filteredData[applicant].cities[0];
          }

          if (this.filteredData[applicant].states.length > 0) {
            patchData[`${applicant}ApplicantState`] =
              this.filteredData[applicant].states[0];
          }

          if (this.filteredData[applicant].addresses.length > 0) {
            patchData[`${applicant}ApplicantDistrict`] =
              this.filteredData[applicant].addresses[0];
          }

          // Update the form controls for the respective applicant
          this.personalInfoForm.patchValue(patchData);

          this.errorMessage = '';
        } else {
          this.errorMessage = 'No data found for this pincode.';
        }
      },
      (error) => {
        console.error('Error fetching address by pincode:', error);

        if (error.status === 404) {
          Swal.fire({
            icon: 'error',
            title: 'Pincode Not Found',
            text: `The pincode ${pincode} is not available.`,
          });
        }
        this.errorMessage = 'Error fetching data. Please try again.';
      }
    );
  }
  initializeAddressControl(): void {
    // if(this.applicantInfoData.firstApplicantPincode!=null){
    //     this.onSearchPinCode(this.applicantInfoData.firstApplicantPincode, 'first');
    //   }

    this.addressControl.valueChanges
      .pipe(
        debounceTime(300), // Trigger after 300ms pause
        switchMap((selectedAddress: string) =>
          this.applicationInfoService.getAddresses(
            selectedAddress,
            this.applicantInfoData.firstApplicantPincode
          )
        ) // Use the service here
      )
      .subscribe((suggestions) => {
        this.filteredAddresses = suggestions; // Update filtered addresses
      });
  }

  // Function to handle address search manually (if needed)
  searchAddress(event: any): void {
    const query = event.target.value;
    if (query.length >= 3) {
      // Trigger search after 3 characters
      this.selectedAddress = query;

      this.initializeAddressControl();

      // No need to call fetchAddresses, it's handled by the service now
    } else if (query.length === 0) {
      this.selectedAddress = '';
      // Handle clearing the suggestions list
      this.filteredAddresses = [];
    }
  }

  // Function to handle address selection
  onAddressSelect(event: any): void {
    if (event?.option?.value) {
      this.selectedAddress = event.option.value;
      // You can patch your form or do further processing here if needed
    }
  }

  // Display selected address in input field
  displayAddress(address: string): string {
    return address || '';
  }

  onChangeAddress(event: any, field: 'city' | 'state') {
    const location = event.target.value;

    if (field === 'city' && location === '') {
      // Fetch all cities for the current pincode
      this.applicationInfoService
        .getAddressByPinCode(this.pincode, '')
        .subscribe(
          (data: any) => {
            if (data && Array.isArray(data)) {
              this.filteredCities = Array.from(
                new Set(data.map((item) => item.city))
              ); // Get unique cities
              this.showCityDropdown = this.filteredCities.length > 0;
            } else {
              console.error('Unexpected response format:', data);
            }
          },
          (error) => {
            console.error('Error fetching address by pincode:', error);
          }
        );
    } else if (field === 'state' && location === '') {
      // Fetch all states for the current pincode
      this.applicationInfoService
        .getAddressByPinCode(this.pincode, '')
        .subscribe(
          (data: any) => {
            if (data && Array.isArray(data)) {
              this.filteredStates = Array.from(
                new Set(data.map((item) => item.state))
              ); // Get unique states
              this.showStateDropdown = this.filteredStates.length > 0;
            } else {
              console.error('Unexpected response format:', data);
            }
          },
          (error) => {
            console.error('Error fetching address by pincode:', error);
          }
        );
    } else if (
      location.length > 3 &&
      location.length < 15 &&
      this.pincode !== ''
    ) {
      // Fetch filtered data for cities or states
      this.applicationInfoService
        .getAddressByPinCode(this.pincode, location)
        .subscribe(
          (data: any) => {
            if (data && Array.isArray(data)) {
              if (field === 'city') {
                this.filteredCities = Array.from(
                  new Set(data.map((item) => item.city))
                ); // Get filtered cities
                this.showCityDropdown = this.filteredCities.length > 0;
              } else if (field === 'state') {
                this.filteredStates = Array.from(
                  new Set(data.map((item) => item.state))
                ); // Get filtered states
                this.showStateDropdown = this.filteredStates.length > 0;
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

  handleNextClickUpdate() {
    this.personalInfoForm.markAsDirty(); // Ensure form is considered changed
  }

  onSubmit(stepper: MatStepper) {
    if (this.roleName.includes('Booking Form Approval')) {
      stepper.next();
    } else {
      if (this.personalInfoForm.valid) {
        console.log(this.personalInfoForm);

        this.update(); // Call update only if the form is valid
        stepper.next(); // Move to the next step
      } else {
        console.error('Form is not valid. Fix errors before proceeding.');
        this.personalInfoForm.markAllAsTouched(); // Highlight validation errors
      }
    }
  }

  getBookingId(): number {
    const bookingId =
      this.applicantInfoData.bookingId || this.unitForm.get('bookingId')?.value;
    return bookingId ? +bookingId : 0; // Converts to number, or returns null if no valid value
  }
  getbankNames() {
    this.commonService
      .getCommanReferanceDetailsWithFilters(BANKNAMES, this.bankName)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.bankNames = data;
          console.log(this.bankNames);
        },
        error: (error: any) => {
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
  }

  searchBank(event: any): void {
    const query = event.target.value;
    this.bankName = query;
    this.getbankNames();
  }
  onBankSelect(event: MatAutocompleteSelectedEvent) {
    console.log(event);

    this.applicantBankId = event.option.value.id;
    console.log(this.applicantBankId);

    this.personalInfoForm.patchValue({ applicantBankId: this.applicantBankId });
  }
  displayBanks(bankName: CommonReferenceDetails): string {
    return bankName && bankName.commonRefValue ? bankName.commonRefValue : '';
  }

  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }
}
