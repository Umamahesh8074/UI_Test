import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import {
  IInvoiceReportDto,
  InvoiceReportDto,
} from 'src/app/Models/Invoice/invoice';
import { InvoiceService } from 'src/app/Services/Invoice/invoice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',

  styleUrls: ['./invoice.component.css'],
})
export class AddInvoiceComponent implements OnInit {
  formData!: FormGroup;
  isAdding: boolean = true;
  isView: boolean = false;
  statuses: any[] = []; // Add your status options here
  building: any[] = []; // Add your building options here
  invoice: IInvoiceReportDto = new InvoiceReportDto();

  invoiceData: IInvoiceReportDto[] = [];

  private destroy$ = new Subject<void>();
  expanded: boolean[] = [false, false, false, false];
  showRemainingConsumption: boolean = false;

  constructor(
    private router: Router,
    private invoiceService: InvoiceService,
    private builder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.invoice = history.state.invoice;

    this.initial();

    this.getdata();
    this.checkConsumptionType();

    if (history.state.invoice != null) {
      console.log('invoice');
      this.isAdding = false;
      this.patchFormData();
    }

    // Subscribe to the value changes of the consumptionType form control
    // this.formData.get('consumptionType')?.valueChanges.subscribe(value => {
    //   console.log("sdff......................");
    //   if(value=='Rent'){
    //     console.log(value);
    //     this.showRemainingConsumption=true;
    //   }
    // this.showRemainingConsumption = value !== 'Rent';
    // If the field is hidden, you might want to clear its value
    //   if (!this.showRemainingConsumption) {
    //     this.formData.get('remainingConsumption')?.reset();
    //   }
    // });
  }

  isElectricity: boolean = false;
  checkConsumptionType() {
    if (this.invoice.consumptionType === 'Electricity') {
      this.isElectricity = true;
    } else {
      this.isElectricity = false;
    }
  }
  getdata() {
    if (this.invoice.consumptionType == 'Rent') {
      console.log('entered into get data method');
      this.showRemainingConsumption = true;
    }
  }

  initial() {
    this.formData = this.builder.group({
      // Organization Fields
      reportId: [0],
      organizationName: ['', Validators.required],
      organizationContact: [''],
      orgEmail: [''],
      orgAddress1: [''],
      orgAddress2: [''],
      orgCity: [''],
      orgPincode: [''],
      orgGstinUin: [''],
      orgState: [''],
      orgStateCode: [''],
      orgPan: [''],

      // Customer Fields
      customerName: ['', Validators.required],
      customerPhoneNumber: [''],
      customerAddress1: [''],
      customerAddress2: [''],
      customerCity: [''],
      customerCityPinCode: [''],
      customergstinUin: [''],
      customerState: [''],
      customerStateCode: [''],
      customerPan: [''],
      unitId: [0],
      customerResidentType: [''],
      blockId: [0],
      levelId: [0],
      projectId: [0],

      // Invoice Fields
      invoiceNumber: [''],
      invoiceDate: [''],
      invoicePeriod: [''],

      // Resource Consumption Fields

      consumptionType: [''],
      currentConsumption: [0],
      previousConsumption: [0],
      roundOff: [0],
      totalValue: [0],
      cgst: [0],
      sgst: [0],
      charge: [0],
      presentConsumption: [0],
      remainingConsumption: [0],
      cgstAmount: [0],
      sgstAmount: [0],
      consumptionMonth: [0],
      consumptionYear: [0],
      area: [0],
      tlDl: [0],
      tlDlAmount: [0],
      tc: [0],
      tcAmount: [0],
      fac: [0],
      facAmount: [0],
      tod: [0],
      todAmount: [0],
      toe: [0],
      toeAmount: [0],
      revenueArr: [0],
      revenueArrAmount: [0],
      demandCharges: [0],
      totalSumTlAndDlCharge: [0],
      totalAmount: [0],
      sumOfTotalAmountAndTod: [0],
      sumTodAndTcCharge: [0],
    });
    this.formData
      .get('previousConsumption')
      ?.valueChanges.subscribe(() => this.updateCalculations());

    this.formData
      .get('currentConsumption')
      ?.valueChanges.subscribe(() => this.updateCalculations());
    this.formData
      .get('charge')
      ?.valueChanges.subscribe(() => this.updateCalculations());
    this.formData
      .get('sgst')
      ?.valueChanges.subscribe(() => this.updateCalculations());
    this.formData
      .get('cgst')
      ?.valueChanges.subscribe(() => this.updateCalculations());

    this.formData
      .get('tlDl')
      ?.valueChanges.subscribe(() => this.updateCalculations());



    this.formData
      .get('fac')
      ?.valueChanges.subscribe(() => this.updateCalculations());

    this.formData
      .get('tod')
      ?.valueChanges.subscribe(() => this.updateCalculations());

    this.formData
      .get('demandCharges')
      ?.valueChanges.subscribe(() => this.updateCalculations());
    this.formData
      .get('tc')
      ?.valueChanges.subscribe(() => this.updateCalculations());
  }

  toggleQuotation(index: number) {
    this.expanded[index] = !this.expanded[index];
  }
  toggleOrganizationDetails: boolean = false;
  toggleCustomerDetails: boolean = false;
  toggleInvoiceDetails: boolean = false;
  toggleResourceConsumption: boolean = false;
  // formData = this.builder.group({
  //   // Organization Fields
  //   organizationName: this.invoice.organizationName || '',
  //   organizationContact: this.invoice.organizationContact || '',
  //   orgEmail: this.invoice.orgEmail || '',
  //   orgAddress1: this.invoice.orgAddress1 || '',
  //   orgAddress2: this.invoice.orgAddress2 || '',
  //   orgCity: this.invoice.orgCity || '',
  //   orgPincode: this.invoice.orgPincode || '',
  //   orgGstinUin: this.invoice.orgGstinUin || '',
  //   orgState: this.invoice.orgState || '',
  //   orgStateCode: this.invoice.orgStateCode || '',
  //   orgPan: this.invoice.orgPan || '',

  //   // Customer Fields
  //   customerName: this.invoice.customerName || '',
  //   customerPhoneNumber: this.invoice.customerPhoneNumber || '',
  //   customerAddress1: this.invoice.customerAddress1 || '',
  //   customerAddress2: this.invoice.customerAddress2 || '',
  //   customerCity: this.invoice.customerCity || '',
  //   customerCityPinCode: this.invoice.customerCityPinCode || '',
  //   customergstinUin: this.invoice.customergstinUin || '',
  //   customerState: this.invoice.customerState || '',
  //   customerStateCode: this.invoice.customerStateCode || '',
  //   customerPan: this.invoice.customerPan || '',
  //   unitId: this.invoice.unitId || 0,
  //   customerResidentType: this.invoice.customerResidentType || '',
  //   blockId: this.invoice.blockId || 0,
  //   levelId: this.invoice.levelId || 0,
  //   projectId: this.invoice.projectId || 0,

  //   // Invoice Fields
  //   invoiceNumber: this.invoice.invoiceNumber || '',
  //   invoiceDate: this.invoice.invoiceDate || '',
  //   invoicePeriod: this.invoice.invoicePeriod || '',

  //   // Resource Consumption Fields
  //   currentConsumption: this.invoice.currentConsumption || 0,
  //   consumptionType: this.invoice.consumptionType || '',

  //   // Common Fields
  //   id: this.invoice.id || 0,
  //   commonRefValue: this.invoice.commonRefValue || ''
  // });

  save() {
    //adding invoice
    if (this.isAdding) {
      this.invoiceService
        .addInvoice(this.formData.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (resp) => {
            this.router.navigate(['layout/invoice']);
          },
          error: (err) => {
            console.error('Error adding Invoice', err);
          },
        });
    } else {
      //updating invoice
      this.invoiceService
        .updateInvoice(this.formData.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            // this.onClickGenerateExcel()
            this.router.navigate(['layout/invoice']);
          },
          error: (err) => {
            console.error('Error updating Invoice', err);
          },
        });
    }
  }
  patchFormData() {
    console.log(this.invoice.totalValue);
    this.formData.patchValue(this.invoice);
    if (
      this.invoice.consumptionType == 'Rent' ||
          this.invoice.consumptionType == 'Cam'
    ) {
      this.formData.patchValue({
        totalValue: [this.invoice.totalValue],
      });
    }
  }
  clearForm() {
    this.formData.reset();
  }

  gotoInvoices() {
    this.router.navigate(['layout/invoice']);
  }

  public isRecordsShown: boolean = false;
  onClickGenerateExcel() {
    // if (this.startDate != null || this.endDate != null) {
    //   //alert('Both date fields are mandatory!');
    // }

    this.invoiceService
      .generateExcel(this.invoice.reportId)
      .subscribe((response: Blob) => {
        // Create a blob from the response data
        const blob = new Blob([response], {
          type: 'application/vnd.ms-excel',
        });

        // For other browsers
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'report.xls';
        document.body.appendChild(a);
        a.click();

        // Cleanup
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        Swal.fire({
          position: 'center',
          icon: 'success',
          text: 'Report Downloded Successfully',
          showConfirmButton: false,
          timer: 2000,
        });
      });
  }
  updateCalculations(): void {
    const previousConsumption = this.formData.get('previousConsumption')?.value;
    const currentConsumption = this.formData.get('currentConsumption')?.value;

    const area = this.formData.get('area')?.value;

    const charge = this.formData.get('charge')?.value;
    const sgst = this.formData.get('sgst')?.value;
    const cgst = this.formData.get('cgst')?.value;

    const tlDl = this.formData.get('tlDl')?.value;

    const tc = this.formData.get('tc')?.value;

    const fac = this.formData.get('fac')?.value;
    const tod = this.formData.get('tod')?.value;
    const demandCharges = this.formData.get('demandCharges')?.value;

    const revenueArr = this.formData.get('revenueArr')?.value;

    const toe = this.formData.get('toe')?.value;

    if (
      this.invoice.consumptionType === 'Rent' || this.invoice.consumptionType === 'BTU' ||
      this.invoice.consumptionType === 'Cam'
    ) {
      //  this.formData.patchValue({
      //     currentConsumption: this.invoice.currentConsumption,

      //   });
      if (currentConsumption && charge) {
        console.log(currentConsumption);
        console.log(this.invoice.currentConsumption);

        this.formData
          .get('currentConsumption')
          ?.setValue(currentConsumption, { emitEvent: false });

          let remainingConsumption = currentConsumption;

          this.formData
            .get('remainingConsumption')
            ?.setValue(remainingConsumption, { emitEvent: false });


        let presentConsumption = currentConsumption * charge;

        this.formData
          .get('presentConsumption')
          ?.setValue(presentConsumption, { emitEvent: false });

        const cgstAmount = (presentConsumption * cgst) / 100; // Example CGST rate
        this.formData
          .get('cgstAmount')
          ?.setValue(cgstAmount, { emitEvent: false });

        const sgstAmount = (presentConsumption * sgst) / 100; // Example SGST rate
        this.formData
          .get('sgstAmount')
          ?.setValue(sgstAmount, { emitEvent: false });

        const totalValue = presentConsumption + cgstAmount + sgstAmount;
        this.formData
          .get('totalValue')
          ?.setValue(totalValue, { emitEvent: false });
      } else {
        this.formData
          .get('presentConsumption')
          ?.setValue(0, { emitEvent: false });
        this.formData.get('cgstAmount')?.setValue(0, { emitEvent: false });
        this.formData.get('sgstAmount')?.setValue(0, { emitEvent: false });
        this.formData.get('totalValue')?.setValue(0, { emitEvent: false });
      }
    } else if (this.invoice.consumptionType === 'Electricity') {
      if (currentConsumption && charge && previousConsumption && tc) {
        console.log(currentConsumption);
        console.log(this.invoice.currentConsumption);

        const remainingConsumption = currentConsumption - previousConsumption;
        this.formData
          .get('remainingConsumption')
          ?.setValue(remainingConsumption, { emitEvent: false });

        // let presentConsumption = remainingConsumption * charge;

        // this.formData
        //   .get('presentConsumption')
        //   ?.setValue(presentConsumption, { emitEvent: false });

        const tlDlAmount = remainingConsumption * tlDl; // Example CGST rate
        this.formData
          .get('tlDlAmount')
          ?.setValue(tlDlAmount, { emitEvent: false });

        const totalSumTlAndDlCharge = tlDlAmount + remainingConsumption;

        const tcAmount = totalSumTlAndDlCharge * tc; // Example SGST rate
        this.formData.get('tcAmount')?.setValue(tcAmount, { emitEvent: false });

        const facAmount = totalSumTlAndDlCharge * fac; // Example SGST rate
        this.formData
          .get('facAmount')
          ?.setValue(facAmount, { emitEvent: false });

        const todAmount = totalSumTlAndDlCharge * tod; // Example SGST rate
        this.formData
          .get('todAmount')
          ?.setValue(todAmount, { emitEvent: false });

        const totalAmount = facAmount + tcAmount; // Example SGST rate
        this.formData
          .get('totalAmount')
          ?.setValue(totalAmount, { emitEvent: false });

        const sumOfTotalAmountAndTod = todAmount + totalAmount; // Example SGST rate
        this.formData
          .get('sumOfTotalAmountAndTod')
          ?.setValue(sumOfTotalAmountAndTod, { emitEvent: false });

        const sumOfTodAndTcCharge = todAmount + tcAmount; // Example SGST rate
        this.formData
          .get('sumOfTodAndTcCharge')
          ?.setValue(sumOfTodAndTcCharge, { emitEvent: false });

        const toeAmount = sumOfTodAndTcCharge * (toe/100); // Example SGST rate
        this.formData
          .get('toeAmount')
          ?.setValue(toeAmount, { emitEvent: false });

        const revenueArrAmount = totalSumTlAndDlCharge * revenueArr; // Example SGST rate
        this.formData
          .get('revenueArrAmount')
          ?.setValue(revenueArrAmount, { emitEvent: false });
          const demandChargesNum = Number(demandCharges);
            const totalValue = demandChargesNum + revenueArrAmount + toeAmount + sumOfTotalAmountAndTod;
            console.log('Total Value:', totalValue);

        this.formData
          .get('totalValue')
          ?.setValue(totalValue, { emitEvent: false });
      } else {
        this.formData
          .get('presentConsumption')
          ?.setValue(0, { emitEvent: false });
        this.formData.get('totalAmount')?.setValue(0, { emitEvent: false });
        this.formData.get('facAmount')?.setValue(0, { emitEvent: false });
        this.formData.get('totalValue')?.setValue(0, { emitEvent: false });
      }
    } else {
      if (currentConsumption && charge && previousConsumption) {
        const remainingConsumption = currentConsumption - previousConsumption;
        this.formData
          .get('remainingConsumption')
          ?.setValue(remainingConsumption, { emitEvent: false });

        let presentConsumption = remainingConsumption * charge;

        this.formData
          .get('presentConsumption')
          ?.setValue(presentConsumption, { emitEvent: false });
        this.formData
          .get('presentConsumption')
          ?.setValue(presentConsumption, { emitEvent: false });

        const cgstAmount = (presentConsumption * cgst) / 100; // Example CGST rate
        this.formData
          .get('cgstAmount')
          ?.setValue(cgstAmount, { emitEvent: false });

        const sgstAmount = (presentConsumption * sgst) / 100; // Example SGST rate
        this.formData
          .get('sgstAmount')
          ?.setValue(sgstAmount, { emitEvent: false });

        const totalValue = presentConsumption + cgstAmount + sgstAmount;
        this.formData
          .get('totalValue')
          ?.setValue(totalValue, { emitEvent: false });
      } else {
        this.formData
          .get('presentConsumption')
          ?.setValue(0, { emitEvent: false });
        this.formData.get('cgstAmount')?.setValue(0, { emitEvent: false });
        this.formData.get('sgstAmount')?.setValue(0, { emitEvent: false });
        this.formData.get('totalValue')?.setValue(0, { emitEvent: false });
      }
    }
  }

  gotoInvoice() {
    this.router.navigate(['layout/facility/management/taxinvoice']);
  }
}
