import { DecimalPipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import {
  TIME_OUT,
  pageSizeOptions,
} from 'src/app/Constants/CommanConstants/Comman';
import { FLOAT_CHARGE_IN_CONSTANT } from 'src/app/Constants/Crm/CrmConstants';
import {
  ApplicantInfo,
  IApplicantInfo,
} from 'src/app/Models/Crm/ApplicantInfo';
import {
  IBookingCharges,
  IbookingChargesDto,
} from 'src/app/Models/Crm/BookingCharges';
import {
  ProjectBookingChargesDto,
  ProjectChargeDto,
} from 'src/app/Models/Crm/ProjectCharge';
import { IProject, Project } from 'src/app/Models/Project/project';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { ApplicationInfoService } from 'src/app/Services/CrmServices/applicant-info.service';
import { BookingChargesService } from 'src/app/Services/CrmServices/booking-charges.service';
import { ProjectChargeService } from 'src/app/Services/CrmServices/project-charge.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';

@Component({
  selector: 'save-booking-charge',
  templateUrl: './save-booking-charge.component.html',
  styleUrls: ['./save-booking-charge.component.css'],
})
export class SaveBookingChargeComponent
  implements OnInit, OnChanges, AfterViewInit
{
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('bookingChargesModal') bookingChargesModal: any;
  private destroy$ = new Subject<void>();
  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;
  formData!: FormGroup;
  bookingFormData!: FormGroup;

  pageSizeOptions = pageSizeOptions;

  pageSize: number = 10;
  pageIndex: number = 0;
  totalPages: number = 0;

  updateApplicantInfo!: FormGroup;

  bookingCharges: IBookingCharges[] = [];
  bookingChargesDto: IbookingChargesDto[] = [];
  projectChargesData: ProjectChargeDto[] = [];
  ProjectBookingChargesData: ProjectBookingChargesDto[] = [];
  // organizationId: number =0;
  projectName: string = '';
  projects: Project[] = [];
  // projectId: any;
  applicantInfoData: IApplicantInfo = new ApplicantInfo();
  project: any = new FormControl([] as IProject[]);
  @Input() bookingId: number | undefined;
  // @Input() basePrice: number | undefined;
  @Input() finalPrice: number | undefined;
  @Input() organizationId: number = 0;
  @Input() projectId: number = 0;
  @Input() levelId: number = 0;
  basePrice: number = 0;
  applicantInfo!: FormGroup;
  @Output() bookingChargeSaved = new EventEmitter<void>();
  @Output() updateApplicantInfoChange = new EventEmitter<any>();
  isAdding: boolean = true;
  chargeName: string = '';
  selectedChargesMap = new Map<number, ProjectBookingChargesDto>();

  @Input() superBuildUpArea: number = 1;

  displayedColumns: string[] = [
    'select',
    'chargeName',
    'chargeIn',
    'amountCalculated',
    'project',
    'floor',
    'phase',
    'chargeType',
    'amount',
    'discountPercentage',
    'discountAmount',
    'amountAfterDiscount',
  ];

  displayedColumns1: string[] = [
    'rowNumber',
    'chargeName',
    'chargeIn',
    'amountCalculated',
    'project',
    'floor',
    'phase',
    'chargeType',
    'amount',
    'discountPercentage',
    'discountAmount',
    'amountAfterDiscount',
    'status',
  ];

  ngAfterViewInit(): void {
    const modalElement = document.getElementById('bookingChargesModal');

    if (modalElement) {
      modalElement.addEventListener(
        'shown.bs.modal',
        this.onModalShown.bind(this)
      );
    }
  }

  onModalShown(): void {
    this.getAllProjectBookingCharges(this.projectId, this.levelId);
    console.log(this.projects);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['superBuildUpArea']) {
      const value = changes['superBuildUpArea'].currentValue;
      this.superBuildUpArea = value;
      console.log(this.superBuildUpArea);
      console.log(typeof this.superBuildUpArea);
    }

    if (changes['bookingId'] && this.bookingId) {
      console.log(this.bookingId);
      this.getBookingCharges();
      this.getAllProjectBookingCharges(this.projectId, this.levelId);
      this.fetchApplicantInfoById();
    }

    if (changes['projectId'] && this.projectId) {
      console.log(this.projectId);
      this.getAllProjectBookingCharges(this.projectId, this.levelId);
    }
    //   if(this.isAdding){
    //   if (changes['basePrice']) {
    //     console.log('Base Price changed:', changes['basePrice'].currentValue);
    //     this.bookingFormData?.patchValue({
    //       basePrice: changes['basePrice'].currentValue,
    //     });
    //   }
    // }
    // if (changes['finalPrice']) {
    //   console.log('FinalPrice  changed:', changes['finalPrice'].currentValue);
    //   this.bookingFormData?.patchValue({
    //     finalPrice: changes['finalPrice'].currentValue,
    //   });
    // }
    if (changes['applicantInfo'] && changes['applicantInfo'].currentValue) {
      this.bookingFormData.patchValue({ applicantInfo: this.applicantInfo });
    }
    // if (changes['organizationId'] && changes['organizationId'].currentValue) {
    //   this.fetchProjects();
    // }
  }
  private initForm(): void {
    this.formData = this._formBuilder.group({
      chargeName: [''],
      chargeIn: [''],
      amountCalculate: [''],
      amount: [0],
      description: [''],
      discountPercentage: [0],
      discountAmount: [0],
      amountAfterDiscount: [0],
      status: [''],
      chargeType: [''],
    });

    this.bookingFormData = this._formBuilder.group({
      totalCharges: [0],
      finalPrice: [],
      bookingId: [],
      projectId: [''],
      levelId: [''],
      bookedById: [''],
      paymentPlanId: [''],
      blockId: [''],
      unitId: [''],
      unitTypeName: [''],
      basePrice: [],
      basicPrice: [''],
      firstApplicantName: [''],
      firstApplicantDateOfBirth: [],
      firstApplicantEmail: [''],
      firstApplicantAlternateEmail: [''],
      firstApplicantPhoneNumber: [''],
      firstApplicantAlternatePhoneNumber: [''],
      firstApplicantAadharNumber: [''],
      firstApplicantPanNumber: [''],
      firstApplicantSalutation: [''],
      firstApplicantGuardianName: [''],
      firstApplicantMaritalStatus: [''],
      firstApplicantNationality: [''],
      firstApplicantPassportNumber: [''],
      firstApplicantProfession: [''],
      firstApplicantDesignation: [''],
      secondApplicantName: [''],
      secondApplicantGender: [''],
      secondApplicantDateOfBirth: [''],
      secondApplicantEmail: [''],
      secondApplicantAlternateEmail: [''],
      secondApplicantPhoneNumber: [''],
      secondApplicantAlternatePhoneNumber: [''],
      secondApplicantAadharNumber: [''],
      secondApplicantPanNumber: [''],
      secondApplicantSalutation: [''],
      secondApplicantGuardianName: [''],
      secondApplicantMaritalStatus: [''],
      secondApplicantNationality: [''],
      secondApplicantPassportNumber: [''],
      secondApplicantProfession: [''],
      secondApplicantDesignation: [''],
      status: 'A',
      firstApplicantAddress1: [''],
      firstApplicantAddress2: [''],
      firstApplicantCity: [''],
      firstApplicantPincode: [''],
      firstApplicantState: [''],
      secondApplicantAddress1: [''],
      secondApplicantAddress2: [''],
      secondApplicantCity: [''],
      secondApplicantPincode: [''],
      secondApplicantState: [''],
      crmUserId: [''],
      gst: [0],
      isMailSent: [''],
      receivedAmount: [],
      pendingAmount: [],
      firstApplicantRelationToParent: [''],
      secondApplicantRelationToParent: [''],
      firstApplicantAnniversaryDate: [],
      secondApplicantAnniversaryDate: [],
      userId: [''],
      sourceName: [],
      subSourceName: [],
      firstApplicantParentOrSpouse: [],
      secondApplicantParentOrSpouse: [],
      firstApplicantParentOrSpouseSalutation: [],
      secondApplicantParentOrSpouseSalutation: [],
      preSalesId: [],
      firstApplicantGender: [],
    });
    console.log(
      'Initial Base Price:',
      this.bookingFormData.get('basePrice')?.value
    );
  }

  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    private projectChargeService: ProjectChargeService,
    public dialog: MatDialog,
    private toastrService: ToastrService,
    private bookingChargesService: BookingChargesService,
    private applicationInfoService: ApplicationInfoService,
    private commanService: CommanService,
    private projectService: ProjectService,
    private decimalPipe: DecimalPipe
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getBookingCharges();
    this.setUserFromLocalStorage();
    this.fetchProjects();
    this.getDataFromState();


    const modalElement = document.getElementById('bookingChargesModal');

    if (modalElement) {
      modalElement.addEventListener('shown.bs.modal', () => {
        this.getAllProjectBookingCharges(this.projectId, this.levelId);
        this.projects;
        console.log(this.projects);
      });
    }
  }

  onPageChange(event: any) {
    this.getAllProjectBookingCharges(this.projectId, this.levelId);
  }

  getBookingCharges() {
    this.fetchProjects();
    this.bookingChargesService
      .getBookingCharges('A', this.pageIndex, this.pageSize, this.bookingId!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (bookingChargesDto) => {
          console.log(bookingChargesDto);
          this.bookingChargesDto = bookingChargesDto.records;
          console.log(bookingChargesDto);
          this.totalPages = bookingChargesDto.totalRecords;
          // this.fetchProjects();
        },
        error: (error) => {
          console.log(error.error);
        },
      });
  }

  getAllProjectBookingCharges(projectId: number, levelId: number) {
    let chargeName = this.chargeName;

    // Check if chargeName is not empty and wrap it in double quotes
    // if (chargeName && chargeName !== '') {
    //   chargeName = `"${chargeName}"`;
    // }

    this.projectChargeService
      .getProjectBookingCharges(this.bookingId!, chargeName, projectId, levelId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (charges: ProjectBookingChargesDto[]) => {
          console.log('Fetched charges:', charges);
          this.ProjectBookingChargesData = charges;
          this.selectedCharges = new Set(
            charges.filter((charge) => charge.bookingChargeId !== null)
          );

          this.selectedChargesArray = Array.from(this.selectedCharges);
          // this.syncSelectionAfterSearch();
          // this.calculateTotalCharges();
        },
        error: (error) => {
          console.error('Error fetching charges:', error);
        },
      });
  }
  handleSuccessResponse(response: any): void {
    console.log(response.message);
    this.toastrService.success('', response.message, {
      timeOut: TIME_OUT,
    });
    // this.gotoBookingDetails();
  }
  handleErrorResponse(error: any): void {
    this.toastrService.error('', error.error.message, {
      timeOut: TIME_OUT,
    });
    // this.gotoBookingDetails();
  }
  // onSearchChargeName(chargeName: string) {
  //   if (
  //     chargeName.length >= searchTextLength ||
  //     chargeName.length === searchTextZero
  //   ) {
  //     this.chargeName = chargeName;
  //     this.pageIndex = PAGE_INDEX;
  //     this.paginator.firstPage();
  //     console.log(this.selectedChargesMap)
  //     this.getAllProjectBookingCharges();
  //     console.log(this.selectedChargesMap)
  //     console.log(this.selectedChargesArray1)
  //     // this.selectedChargesMap.set();
  //     this.selectedChargesArray1.forEach(charge=>{
  //       this.selectedChargesMap.set(charge.chargeId,charge);
  //       // this.(charge)
  //     })

  //     this.selectedChargesArray1.forEach(charge=>{
  //       // this.selectedChargesMap.set(charge.chargeId,charge);
  //       this.isSelected(charge)
  //     })

  //     // this.isSelected()

  //   }
  // }
  // async onSearchChargeName(chargeName: string) {
  //   if (
  //     chargeName.length >= searchTextLength ||
  //     chargeName.length === searchTextZero
  //   ) {
  //     this.chargeName = chargeName;
  //     this.pageIndex = PAGE_INDEX;
  //     this.paginator.firstPage();

  //     console.log(this.selectedChargesMap);
  //     this.getAllProjectBookingCharges();
  //     console.log(this.selectedChargesMap);
  //     console.log(this.selectedChargesArray1);

  //     // First loop: Populate selectedChargesMap
  //     this.selectedChargesArray1.forEach(charge => {
  //       console.log(charge.chargeId)
  //       this.selectedChargesMap.set(charge.chargeId, charge);
  //     });
  //     console.log(this.selectedChargesMap)

  //     // Second loop: Call isSelected() for each charge
  //     for (const charge of this.selectedChargesArray1) {
  //       await this.isSelected(charge); // Await if isSelected is async
  //     }
  //   }
  // }

  // mergeBookingDataToApplicantInfo(): void {
  //   const bookingFormGroup = this.bookingFormData;
  //   if (bookingFormGroup) {
  //     const finalPrice = bookingFormGroup.get('finalPrice')?.value;
  //     const totalCharges = bookingFormGroup.get('totalCharges')?.value;
  //     if (finalPrice !== undefined && totalCharges !== undefined) {
  //       bookingFormGroup.get('finalPrice')?.setValue(finalPrice);
  //       bookingFormGroup.get('totalCharges')?.setValue(totalCharges);
  //       this.saveBookingCharges();
  //     }
  //   } else {
  //     console.error('bookingFormData form group not found.');
  //   }
  // }

  private setUserFromLocalStorage(): void {
    const user = this.commanService.getUserFromLocalStorage();
    if (user) {
      console.log(user.organizationId);
      this.organizationId = user.organizationId;
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
        next: (projects) => {
          this.projects = projects;
        },
        error: (error: Error) => {
          console.error('Error fetching projects:', error);
        },
      });
  }
  // onProjectSelect(event: any): void {
  //   const selectedProjectId = event.target.value;
  //   console.log(selectedProjectId);
  //   console.log(this.projects);
  //   if (!selectedProjectId) {

  //     this.projectName = '';
  //     this.projectId = null;
  //     console.log('Fetching all projects (no filter)');
  //     this.getAllProjectBookingCharges();
  //   } else {
  //     const selectedProject = this.projects.find(
  //       (project) => project.projectId == selectedProjectId
  //     );
  //     if (selectedProject) {
  //       this.projectName = selectedProject.projectName;
  //       this.projectId = selectedProject.projectId;
  //       console.log('Selected Project:', selectedProject);
  //       this.getAllProjectBookingCharges(); // Fetch data for the selected project
  //     }
  //   }
  // }

  // displayProject(project: IProject): string {
  //   return project && project.projectName ? project.projectName : '';
  // }

  // searchProject(event: any): void {
  //   const query = event.target.value;
  //   if (query.length >= 3) {
  //     this.projectName = query;
  //     this.getAllProjectBookingCharges();
  //   } else if (query.length == 0) {
  //     this.projectName = '';
  //     this.getAllProjectBookingCharges();
  //   }
  // }

/**
 * The `saveBookingCharges` function in TypeScript fetches applicant information, updates form data,
 * saves and updates booking charges, and handles success and error responses.
 */
  saveBookingCharges(): void {
    console.log(this.bookingFormData.value);
    console.log(this.bookingId!);

    this.applicationInfoService
      .getApplicantInfoById(this.bookingId!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (latestInfo) => {
          console.log('Fetched Applicant Info:', latestInfo);

          // Update form with fetched data
          const updatedData = {
            ...latestInfo,
            finalPrice: this.bookingFormData.get('finalPrice')?.value,
            totalCharges: this.bookingFormData.get('totalCharges')?.value,
            gst: this.bookingFormData.get('gst')?.value,
          };
          this.bookingFormData.patchValue(updatedData);
          const formData = this.bookingFormData.value;
          const payload = {
            ...formData,
            finalPrice: parseFloat(
              formData.finalPrice.toString().replace(/,/g, '')
            ),
            gst: parseFloat(formData.gst.toString().replace(/,/g, '')),
            totalCharges: parseFloat(
              formData.totalCharges.toString().replace(/,/g, '')
            ),
          };

          console.log('Updated Form Data:', this.bookingFormData.value);

          this.applicationInfoService
            .updateApplicantInfo(payload)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (response) => {
                console.log('Applicant info updated successfully:', response);
                this.bookingFormData.patchValue(response.applicantInfo);
                this.updateApplicantInfoChange.emit(response.applicantInfo);
                // this.handleSuccessResponse(response)
              },
              error: (error) => {
                console.error('Error updating applicant info:', error);
                this.handleErrorResponse(error)
              },
            });
        },
        error: (error) => {
          console.error('Error fetching Applicant Info:', error);
        },
      });

    // const payload = this.bookingFormData.get('applicantInfo')?.value;

    // const payload = this.applicantInfo.value;
    // this.applicationInfoService.updateApplicantInfo(payload).pipe(
    //   takeUntil(this.destroy$)
    // ).subscribe({
    //   next: (resp) => {
    //     this.updateApplicantInfo = this._formBuilder.group({
    //       bookingId: [resp.applicantInfo.bookingId || ''],
    //       basicPrice: [resp.applicantInfo.basicPrice || ''],
    //       finalPrice: [resp.applicantInfo.finalPrice || ''],
    //       projectId: [resp.applicantInfo.projectId || ''],
    //       levelId: [resp.applicantInfo.levelId || ''],
    //       bookedById: [resp.applicantInfo.bookedById || ''],
    //       paymentPlanId: [resp.applicantInfo.paymentPlanId || ''],
    //       blockId: [resp.applicantInfo.blockId || ''],
    //       unitId: [resp.applicantInfo.unitId || ''],
    //       residentType: [resp.applicantInfo.residentType || ''],
    //       status: [resp.applicantInfo.status || ''],
    //       basePrice: [resp.applicantInfo.basePrice || ''],
    //       totalCharges: [resp.applicantInfo.totalCharges || ''],
    //       unitTypeId: [resp.applicantInfo.unitTypeId || '']
    //     });
    //     console.log('Applicant info updated successfully:', resp);

    //     this.updateApplicantInfoChange.emit(this.updateApplicantInfo);

    //   },
    //   error: (error) => {
    //     console.error('Error updating applicant info:', error);
    //   }
    // });

    const bookingCharges = Array.from(this.selectedCharges.values()).map(
      (projectBookingCharge: ProjectBookingChargesDto) => ({
        id: projectBookingCharge.bookingChargeId,
        bookingId: this.bookingId!,
        chargeName: projectBookingCharge.name,
        chargeIn: projectBookingCharge.chargeIn,
        amountCalculate: projectBookingCharge.amountCalculate,
        amount: projectBookingCharge.amount,
        description: projectBookingCharge.description,
        discountPercentage: projectBookingCharge.discountPercentage || 0,
        discountAmount: projectBookingCharge.discountAmount || 0,
        amountAfterDiscount: projectBookingCharge.amountAfterDiscount || 0,
        status: 'A',
        chargeId: projectBookingCharge.chargeId,
        phaseId: projectBookingCharge.phaseId,
        chargeType: projectBookingCharge.chargeType,
      })
    );

    const save$ = this.bookingChargesService.addBookingCharges(bookingCharges);
    const update$ =
      this.bookingChargesService.updateBookingCharges(bookingCharges);

    if (save$) {
      save$.pipe(takeUntil(this.destroy$)).subscribe({
        next: (response) => {
          console.log('Booking charges saved successfully:', response);
          this.handleSuccessResponse(response);
          this.getAllProjectBookingCharges(this.projectId, this.levelId);
          this.getBookingCharges();
          this.bookingChargeSaved.emit();
        },
        error: (error) => {
          console.error('Error saving booking charges:', error);
          this.handleErrorResponse(error);
        },
      });
    }
    if (update$) {
      update$.pipe(takeUntil(this.destroy$)).subscribe({
        next: (response) => {
          console.log('Booking charges updated successfully:', response);
          // this.handleSuccessResponse(response);
          this.getAllProjectBookingCharges(this.projectId, this.levelId);
          this.getBookingCharges();
          this.bookingChargeSaved.emit();
        },
        error: (error) => {
          console.error('Error updating booking charges:', error);
          this.handleErrorResponse(error);
        },
      });
    }

    const deselectedCharges = this.selectedChargesArray.filter(
      (charge: ProjectBookingChargesDto) => !this.selectedCharges.has(charge)
    );

    console.log(deselectedCharges);

    deselectedCharges.forEach((charge, index) => {
      if (charge.bookingChargeId) {
        this.bookingChargesService
          .deleteBookingCharge(charge.bookingChargeId)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              console.log(
                `Booking charge ${charge.bookingChargeId} deleted successfully:`,
                response
              );
              deselectedCharges.splice(index, 1);
              this.getBookingCharges();
              this.getAllProjectBookingCharges(this.projectId, this.levelId);
            },
            error: (error) => {
              console.error('Error deleting booking charge:', error);
            },
          });
      }
    });
  }
  selectedCharges = new Set<ProjectBookingChargesDto>();
  consoleSelectedCharges() {
    const selectedChargesArray = Array.from(this.selectedCharges);
    console.log('Selected Charges:', selectedChargesArray);
  }

  get isAllSelected(): boolean {
    return (
      this.ProjectBookingChargesData.length > 0 &&
      this.ProjectBookingChargesData.every((charge) =>
        this.selectedCharges.has(charge)
      )
    );
  }

  toggleSelection(charge: ProjectBookingChargesDto, isSelected: boolean): void {
    // Add or remove charge from selectedCharges set
    if (isSelected) {
      this.calculateCharges(charge);
      this.selectedCharges.add(charge); 
    } else {
      this.selectedCharges.delete(charge);
      charge.discountPercentage = 0;
      charge.discountAmount = 0;
      charge.amountAfterDiscount = 0;
      charge.discountAmount = 0;
      charge.discountPercentage = 0;
    }
    this.calculateTotalCharges();
  }

  toggleSelectAll(isChecked: boolean): void {
    if (isChecked) {
      this.selectedCharges = new Set(this.ProjectBookingChargesData);
      this.ProjectBookingChargesData.forEach((charge) => {
        const amount = charge.amount ?? 0;
        const discountAmount = charge.discountAmount ?? 0;
        const superBuildUpArea = this.superBuildUpArea ?? 1; // Default to 1 if null or undefined

        if (amount && charge.strChargeIn === FLOAT_CHARGE_IN_CONSTANT) {
          charge.amountAfterDiscount =
            amount * superBuildUpArea - discountAmount;
        } else if (amount && charge.strChargeIn !== FLOAT_CHARGE_IN_CONSTANT) {
          charge.amountAfterDiscount = amount - discountAmount;
        } else {
          charge.amountAfterDiscount = 0;
        }
      });
    } else {
      this.selectedCharges.clear();
      this.ProjectBookingChargesData.forEach((charge) => {
        charge.discountPercentage = 0;
        charge.discountAmount = 0;
        charge.amountAfterDiscount = 0;
        charge.discountPercentage =0;
        charge.discountAmount =0;
      });
    }
    this.calculateTotalCharges();
  }

  isSelected(charge: ProjectBookingChargesDto): boolean {
    return this.selectedCharges.has(charge);
  }
  calculateTotalCharges() {
    const total = Array.from(this.selectedCharges.values()).reduce(
      (acc, charge) => {
        if (charge.chargeType !== 'Maintenance Charges') {
          return acc + (charge.amountAfterDiscount || 0);
        }
        return acc;
      },
      0
    );

    const basePrice = this.basePrice || 0;
    const gst = (basePrice + total) * 0.05; // Simplified GST calculation
    const finalPrice = basePrice + total + gst;

    // Format the values using decimalPipe
    const formattedTotal = this.decimalPipe.transform(total, '1.2-2') || '0.00';
    const formattedBasePrice =
      this.decimalPipe.transform(basePrice, '1.2-2') || '0.00';
    const formattedGst = this.decimalPipe.transform(gst, '1.2-2') || '0.00';
    const formattedFinalPrice =
      this.decimalPipe.transform(finalPrice, '1.2-2') || '0.00';

    console.log('Calculated Total Charges:', total);

    // Patch form values with formatted values
    this.bookingFormData.patchValue({
      totalCharges: formattedTotal,
      finalPrice: formattedFinalPrice,
      gst: formattedGst,
      basePrice: formattedBasePrice,
    });
  }

  // toggleSelection(charge: ProjectBookingChargesDto, isSelected: boolean) {
  //   if (isSelected) {
  //     // if (charge.projectStatus  === 'A') {
  //       this.selectedChargesMap.set(charge.chargeId, charge);
  //       this.selectedChargesArray1.push(charge)
  //       // console.log(this.selectedChargesMap)
  //       // console.log(this.selectedChargesArray1)
  //     // } else {
  //     //   console.warn(`Charge with ID ${charge.chargeId} cannot be selected as its status is "${charge.status}".`);
  //     // }
  //   } else {
  //     this.selectedChargesMap.delete(charge.chargeId);
  //     const index = this.selectedChargesArray1.findIndex(item => item === charge);
  //     if (index !== -1) {
  //       this.selectedChargesArray1.splice(index, 1); // Remove the charge at the found index
  //     }
  //     // console.log(this.selectedChargesArray1)
  //   }

  //   this.calculateTotalCharges();
  // }
  // toggleSelectAll(isChecked: boolean) {
  //   if (isChecked) {
  //     this.ProjectBookingChargesData.forEach((charge) => {
  //       this.selectedChargesMap.set(charge.chargeId, charge);
  //     });
  //   } else {
  //     this.ProjectBookingChargesData.forEach((charge) => {
  //       this.selectedChargesMap.delete(charge.chargeId);
  //     });

  //   }
  //   this.calculateTotalCharges();
  // }
  // isSelected(charge: ProjectBookingChargesDto): boolean {
  //   this.selectedChargesArray1.forEach(charge => {
  //     // console.log(charge.chargeId)
  //     this.selectedChargesMap.set(charge.chargeId, charge);
  //   });
  //   // console.log(this.selectedChargesMap)
  //   // console.log(charge)
  //   // console.log(this.selectedChargesMap)
  //   return this.selectedChargesMap.has(charge.chargeId);

  // }
  // calculateTotalCharges() {
  //   const total = Array.from(this.selectedCharges.values()).reduce((acc, charge) => {
  //     // Use charge.amount if charge.amountAfterDiscount is 0 or falsy
  //     const amountToAdd = charge.amountAfterDiscount
  //       ? charge.amountAfterDiscount
  //       : charge.amount;
  //     return acc + (amountToAdd || 0);
  //   }, 0);
  //   const basePrice = this.basePrice || 0;
  //   const gst = ((basePrice + total) * 5) / 100;

  //   const finalPrice = basePrice + total;

  //   console.log('Calculated Total Charges:', total);
  //   this.bookingFormData.patchValue({ totalCharges: total });
  //   this.bookingFormData.patchValue({ finalPrice: finalPrice });
  //   this.bookingFormData.patchValue({ gst: gst });
  // }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2,
    }).format(amount);
  }

  selectedChargesArray: ProjectBookingChargesDto[] = [];
  selectedChargesArray1: ProjectBookingChargesDto[] = [];

  updateSelectedCharges(): void {
    this.selectedChargesArray = Array.from(this.selectedCharges);
  }

  enforceMaxValue(event: Event, charge: any): void {
    const input = event.target as HTMLInputElement;
    const value = parseFloat(input.value);
    if (value > 100) {
      input.value = '100';
      charge.discountPercentage = 100;
    } else if (value < 0) {
      input.value = '0';
      charge.discountPercentage = 0;
    } else {
      charge.discountPercentage = value;
    }
  }

  enforceDiscountAmountValue(event: Event, charge: any): void {
    const input = event.target as HTMLInputElement;
    const value = parseFloat(input.value);
    if (charge.strChargeIn === FLOAT_CHARGE_IN_CONSTANT) {
      const superPrice = charge.amount * this.superBuildUpArea;
      if (value > superPrice) {
        input.value = superPrice.toFixed(2);
        charge.discountAmount = superPrice;
      }
    } else if (charge.strChargeIn !== FLOAT_CHARGE_IN_CONSTANT) {
      if (value > charge.amount) {
        input.value = charge.amount;
        charge.discountAmount = charge.amount;
      }
    }
  }

  onDiscountPercentageChange(charge: ProjectBookingChargesDto): void {
    if (charge.discountPercentage > 100) {
      charge.discountPercentage = 100;
    } else if (charge.discountPercentage < 0) {
      charge.discountPercentage = 0;
    }
    if (charge.discountPercentage && charge.discountPercentage > 0) {
      this.toggleSelection(charge, true);
    }
    // else {
    //   this.toggleSelection(charge, false);
    // }
    if (charge.amount && charge.strChargeIn === FLOAT_CHARGE_IN_CONSTANT) {
      const superPrice = charge.amount * this.superBuildUpArea;

      // Calculate the amount after discount (with fallback for null/undefined)
      charge.discountAmount = superPrice * (charge.discountPercentage / 100);
      charge.amountAfterDiscount = superPrice - charge.discountAmount;
    } else if (
      charge.amount &&
      charge.strChargeIn !== FLOAT_CHARGE_IN_CONSTANT
    ) {
      // For non-Float charges, apply discountAmount
      charge.discountAmount = charge.amount * (charge.discountPercentage / 100);
      charge.amountAfterDiscount = charge.amount - charge.discountAmount;
    }

    // this.calculateTotalCharges();
    // this.selectedChargesMap.set(charge.chargeId, { ...charge });
    this.calculateTotalCharges();
  }

  onDiscountAmountChange(charge: ProjectBookingChargesDto): void {
    console.log('Updated Discount Amount:', charge.discountAmount);
    if (
      charge.strChargeIn === FLOAT_CHARGE_IN_CONSTANT &&
      charge.amountAfterDiscount &&
      charge.discountAmount
    ) {
      const superAmount = charge.amount * this.superBuildUpArea;
      if (charge.discountAmount > superAmount) {
        charge.discountAmount = superAmount;
      }
      charge.discountAmount = parseFloat(charge.discountAmount.toFixed(2));
      charge.discountPercentage = parseFloat(
        ((charge.discountAmount / superAmount) * 100).toFixed(2)
      );
      charge.amountAfterDiscount = parseFloat(
        (superAmount - charge.discountAmount).toFixed(2)
      );
      console.log(FLOAT_CHARGE_IN_CONSTANT);
    } else if (
      charge.strChargeIn !== FLOAT_CHARGE_IN_CONSTANT &&
      charge.amount &&
      charge.discountAmount
    ) {
      if (charge.discountAmount > charge.amount) {
        charge.discountAmount = charge.amount;
      }
      charge.discountAmount = parseFloat(charge.discountAmount.toFixed(2));
      charge.discountPercentage = parseFloat(
        ((charge.discountAmount / charge.amount) * 100).toFixed(2)
      );
      charge.amountAfterDiscount = parseFloat(
        (charge.amount - charge.discountAmount).toFixed(2)
      );
      console.log(charge.discountAmount);
      console.log('Non-Float');
    } 
    else if (!charge.discountAmount) {
      // charge.discountPercentage = 0;
      // charge.discountAmount = 0;
      if (charge.strChargeIn === FLOAT_CHARGE_IN_CONSTANT) {
        charge.amountAfterDiscount = charge.amount * this.superBuildUpArea;
      } else if (charge.strChargeIn !== FLOAT_CHARGE_IN_CONSTANT) {
        charge.amountAfterDiscount = charge.amount;
      }
      console.log('Else-Non-Float');
    }
    if (charge.discountAmount && charge.discountAmount > 0) {
      this.toggleSelection(charge, true);
    }
    //  else {
    //   this.toggleSelection(charge, false);
    // }
    console.log('Calculated Discount Percentage:', charge.discountPercentage);
    this.calculateTotalCharges();
    // this.selectedChargesMap.set(charge.chargeId, { ...charge });
    // this.calculateTotalCharges();
  }

  formatRate(event: any): void {
    const value = event.target.value.replace(/,/g, '');
    if (!isNaN(Number(value))) {
      event.target.value = this.decimalPipe.transform(value, '1.0-0');
    }
  }
  restrictToNumbers(event: KeyboardEvent): boolean {
    const allowedKeys = [
      'Backspace',
      'ArrowLeft',
      'ArrowRight',
      'Delete',
      'Tab',
    ];
    const isNumber = /^[0-9]$/.test(event.key);
    return isNumber || allowedKeys.includes(event.key);
  }

  gotoBookingDetails(): void {
    this.router.navigate(['layout/crm/displayBookingOverview']);
  }

  fetchApplicantInfoById() {
    this.applicationInfoService
      .getApplicantInfoById(this.bookingId!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (applicantInfoData) => {
          console.log('Fetched Applicant Info Data:', applicantInfoData);

          this.applicantInfoData = applicantInfoData;
          this.basePrice = applicantInfoData?.basePrice || 0;
          console.log(this.basePrice);
          this.bookingFormData?.patchValue({
            basePrice: this.basePrice,
          });
          this.patchFormDataWithApplicantInfo();
        },
        error: (error) => {
          console.error('Error fetching applicant info by ID:', error);
        },
      });
  }

  private getDataFromState() {
    this.fetchApplicantInfoById();
  }
  private patchFormDataWithApplicantInfo() {
    if (!this.applicantInfoData) {
      console.warn('No applicant data available to patch.');
      return;
    }

    // Extract and patch specific fields
    const { finalPrice, totalCharges, basePrice, gst } = this.applicantInfoData;

    this.bookingFormData.patchValue({
      finalPrice: this.formatCurrency(finalPrice) || '',
      totalCharges: this.formatCurrency(totalCharges) || '',
      basePrice: this.formatCurrency(basePrice) || '',
      gst: this.formatCurrency(gst) || '',
    });
    

    console.log('Updated Form Data:', this.bookingFormData.value);
  }

  updateFormattedValue(event: Event, formControlName: string): void {
    const inputElement = event.target as HTMLInputElement;
    const rawValue = inputElement.value.replace(/,/g, '');
    const numericValue = rawValue ? parseFloat(rawValue) : 0;
    const formattedValue = this.formatToIndianCurrency(numericValue);
    inputElement.value = formattedValue;
    this.bookingFormData.get(formControlName)?.setValue(numericValue);
  }

  formatToIndianCurrency(value: number | string): string {
    const numStr =
      typeof value === 'number' ? value.toString() : value.replace(/,/g, '');
    const lastThree = numStr.slice(-3);
    const otherNumbers = numStr.slice(0, -3);
    const formatted =
      otherNumbers !== ''
        ? otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree
        : lastThree;
    return formatted;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    const modalElement = document.getElementById('bookingChargesModal');
    if (modalElement) {
      modalElement.removeEventListener(
        'shown.bs.modal',
        this.onModalShown.bind(this)
      );
    }
  }
  calculateCharges(charge: ProjectBookingChargesDto) {
    const amount = charge.amount ?? 0;
    const discountAmount = charge.discountAmount ?? 0;
    const superBuildUpArea = this.superBuildUpArea ?? 1;
  
    if (amount && charge.strChargeIn === FLOAT_CHARGE_IN_CONSTANT) {
      charge.amountAfterDiscount = amount * superBuildUpArea - discountAmount;
      console.log(charge.amountAfterDiscount);
    } else if (amount && charge.strChargeIn !== FLOAT_CHARGE_IN_CONSTANT) {
      charge.amountAfterDiscount = amount - discountAmount;
    } else {
      charge.amountAfterDiscount = 0;
    }

    this.selectedCharges.delete(charge); 
    this.selectedCharges.add(charge); 
    console.log(charge);
  }
  
}
