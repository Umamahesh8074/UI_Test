import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CommonReferenceType } from 'src/app/Models/CommanModel/menuDto';

import { Customer } from 'src/app/Models/Customer/customer';

import {
  Customerconsumption,
  CustomerconsumptionDto,
  CustomerconsumptionWithoutAreaDto,
  ICustomerconsumption,
} from 'src/app/Models/Customerconsumption/customerconsumption';
import { User } from 'src/app/Models/User/User';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { CustomerService } from 'src/app/Services/Customer/customer.service';
import { CustomerconsumptionService } from 'src/app/Services/Customerconsumption/customerconsumption.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customerconsumption',
  templateUrl: './customerconsumption.component.html',

  styleUrls: ['./customerconsumption.component.css'],
})
export class AddCustomerconsumptionComponent implements OnInit {
  customer: Customer[] = [];
  consumptionTypeList: CommonReferenceType[] = [];
  consumptionYearList: CommonReferenceType[] = [];
  consumption: CustomerconsumptionDto[] = [];

  isView = false;
  formData!:any;
  Consumption_Type: string = 'Consumption_Type';
  Consumption_Year: string = 'Consumption_Year';
  customerconsumption: ICustomerconsumption = new Customerconsumption();
  isAdding: boolean = true;
  private destroy$ = new Subject<void>();
  consumptionId: any;
  //customer:Customer[]=[];
  user: User = new User();
  organizationId = 0;
  isCurrentConsumptionDisabled: boolean = false;

  tenent: any;

  customerId: any;

  constructor(
    private router: Router,
    private customerconsumptionService: CustomerconsumptionService,
    private commonService: CommanService,
    private customerService: CustomerService,
    private builder: FormBuilder
  ) {}
  months: any[] = [
    {
      id: 1,
      value: 'January',
    },
    {
      id: 2,
      value: 'February',
    },
    {
      id: 3,
      value: 'March',
    },
    {
      id: 4,
      value: 'April',
    },
    {
      id: 5,
      value: 'May',
    },
    {
      id: 6,
      value: 'June',
    },

    {
      id: 7,
      value: 'July',
    },
    {
      id: 8,
      value: 'August',
    },
    {
      id: 9,
      value: 'September',
    },
    {
      id: 10,
      value: 'October',
    },
    {
      id: 11,
      value: 'November',
    },
    {
      id: 12,
      value: 'December',
    },
  ];
  ngOnInit(): void {
    this.customerconsumption = history.state.customerconsumption;
    this.initializeForm();
    this.loadCustomers();
    this.fetchConsumptionList();
    this.fetchConsumptionYear();
    if (history.state.customerconsumption != null) {
      console.log(history.state.customerconsumption);
      this.isAdding = false;
      this.patchFormdata();

    }
    // this.formData = this.builder.group({
    //   consumptionId: [this.customerconsumption.consumptionId, Validators.required],
    //  currentConsumption: [this.customerconsumption.currentConsumption, Validators.required],
    //   consumptionType: [this.customerconsumption.consumptionType, Validators.required],
    //   totalConsumption: [this.customerconsumption.currentConsumption, Validators.required],

    //   customerId: [this.customerconsumption.customerId, Validators.required],
    //   invoiceId: [this.customerconsumption.invoiceId, Validators.required]
    // });




  }
  onProjectSelect(event: any) {
    console.log(event.option.value);
    this.consumptionId = event.option.value.consumptionId;
    this.formData.patchValue({ projectId: this.consumptionId });
  }

  private initializeForm(): void {
    // this.qrgenerator.status='A'
    const currentDate = new Date();

    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    this.formData = this.builder.group({
      consumptionId: this.builder.control(0),
      currentConsumption: this.builder.control('', Validators.required),
      consumptionType: this.builder.control('', Validators.required),
      consumptionMonth: this.builder.control(currentMonth, Validators.required),
      consumptionYear: this.builder.control(currentYear, Validators.required),
      customerId: this.builder.control(0, Validators.required),
      name: this.builder.control('', Validators.required),
      reportId: this.builder.control(0),
      area: this.builder.control(0),
      tlDl: this.builder.control('', Validators.required),
      fac: this.builder.control('', Validators.required),
      tod: this.builder.control('', Validators.required),
      demandCharges: this.builder.control('', Validators.required)

    });
  }
patchFormdata(){
  console.log(this.customerconsumption)
  this.formData.patchValue(this.customerconsumption);
 // this.onConsumptionTypeChange(this.customerconsumption);
  console.log(this.formData)
}
  private loadCustomers(): void {
    this.customerService.getUserDetailsByCustomerId().subscribe({
      next: (resp) => {
        this.customer = resp;
      },
      error: (err) => {
        console.error('Error loading projects', err);
      },
    });
  }

  save() {
    //adding customerconsumption
    if (this.isAdding) {
      this.customerconsumptionService
        .addCustomerconsumption(this.formData.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.router.navigate([
              'layout/facility/management/displayconsumption',
            ]);
          },
          error: (err) => {
            if(err.status=409){
              Swal.fire('Failed', err.error.message, 'error');
            }else{
              console.error('Error fetching lead types:', err);
            }
          },
        });
    } else {
      //updating customerconsumption
      this.customerconsumptionService
        .updateCustomerconsumption(this.formData.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.router.navigate([
              'layout/facility/management/displayconsumption',
            ]);
          },
          error: (err) => {
            console.error('Error updating Customerconsumption', err);
          },
        });
    }
  }
  fetchConsumptionList(): void {
    this.commonService.getRefDetailsByType(this.Consumption_Type).subscribe({
      next: (types) => {
        this.consumptionTypeList = types;
      },
      error: (error: any) => {
        console.error('Error fetching lead types:', error);
      },
    });
  }

  fetchConsumptionYear(): void {
    console.log(this.Consumption_Year);

    this.commonService.getRefDetailsByType(this.Consumption_Year).subscribe({
      next: (types) => {
        this.consumptionYearList = types;
      },
      error: (error: any) => {
        console.error('Error fetching lead types:', error);
      },
    });
  }

  // fetchLostStatusList(consumptionId: number) {
  //   const selectedStatus = this.consumptionTypeList.find(
  //     (consumption) => consumption.id === consumptionId
  //   );
  //   if (selectedStatus) {
  //     console.log(selectedStatus);
  //     if (selectedStatus.commonRefValue.toLocaleLowerCase().includes('lost')) {
  //       this.isConsumption = true;

  //       this.commonService.getRefDetailsByType(this.lostStatus).subscribe({
  //         next: (types) => {
  //           this.consumptionTypeList = types;
  //         },
  //         error: (error) => {
  //           console.error('Error fetching lead types:', error);
  //         },
  //       });
  //     } else {
  //       this.isConsumption = false;
  //     }
  //   }
  // }
  clearForm() {
    this.formData.reset();
  }

  gotoCustomerconsumptions() {
    this.router.navigate(['layout/facility/management/displayconsumption']);
  }

  onCustomerChange(id: any) {
    console.log(id.value);
    this.customerId = id.value;
  }
  showElectricityFields:boolean=false;
  onConsumptionTypeChange(event: any): void {
    console.log(event);
    const selectedType = event.value;
    console.log(selectedType);

    // Reset the fields first
    this.formData.get('currentConsumption')?.setValue('');

    if (selectedType === 'Rent'  || selectedType === 'Cam') {
      console.log('entered area');
      this.customerconsumptionService
        .getArea(this.customerId)
        .pipe(takeUntil(this.destroy$))
        .subscribe((response: any) => {
          console.log(response[0]);
          this.tenent = response[0];
          this.formData.patchValue({
            currentConsumption: this.tenent.area,
          });
        });
    } else if (selectedType === 'Electricity') {
      this.showElectricityFields = true;
      this.customerconsumptionService
        .getElectricityConsumption(this.customerId)
        .pipe(takeUntil(this.destroy$))
        .subscribe((response: CustomerconsumptionWithoutAreaDto[]) => {
          // Assuming the response is an array of records
          if (response && response.length > 0) {
            const lastRecord = response[response.length - 1];
            console.log('Last Record:', lastRecord);
            console.log('tlDl:', lastRecord.tlDl);
            console.log('fac:', lastRecord.fac);
            console.log('tod:', lastRecord.tod);
            console.log('demandCharges:', lastRecord.demandCharges);

            this.formData.patchValue({
              tlDl: lastRecord.tlDl,
              fac: lastRecord.fac,
              tod: lastRecord.tod,
              demandCharges: lastRecord.demandCharges || '' // if demandCharges is also fetched
            });
          }
        });
    } else {
      this.showElectricityFields = false;
      this.formData.patchValue({
        tlDl: '',
        fac: '',
        tod: '',
        demandCharges: ''
      });
    }
  }
}
