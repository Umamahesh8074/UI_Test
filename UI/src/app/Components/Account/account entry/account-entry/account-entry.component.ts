import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import {
  ACCOUNT_ENTRY_TYPE,
  NAVIGATE_TO_DISPLAY_ACCOUNT_ENTRY,
} from 'src/app/Constants/Account/AccountEntry';
import {
  TIME_OUT
} from 'src/app/Constants/CommanConstants/Comman';
import {
  AccountEntry,
  IAccountEntry,
  transactionType,
} from 'src/app/Models/Account/account-entry';

import { CommonReferenceDetailsDto } from 'src/app/Models/User/CommonReferenceDetailsDto';
import { AccountEntryService } from 'src/app/Services/Account/account-entry/account-entry.service';
import { CommanService } from 'src/app/Services/CommanService/comman.service';

@Component({
  selector: 'app-account-entry',
  templateUrl: './account-entry.component.html',
  styleUrls: ['./account-entry.component.css'],
})
export class AddAccountEntryComponent implements OnInit {
  accountEntry: IAccountEntry = new AccountEntry();
  isAdding: boolean = true;
  private destroy$ = new Subject<void>();
  transactionTypeData: string = '';
  isCreditType: boolean = true;
  // isCreditAmountValid: boolean = false;
  // isDebitAmountValid: boolean = false;

  formData!: FormGroup;
  statuses: any;
  selectedTransactionType: transactionType = new transactionType();
  transactionTypes: transactionType[] = [
    {
      id: 1,
      traType: 'Payment',
    },

    {
      id: 2,
      traType: 'Receipt',
    },
  ];
  transactionTypeControll: any = new FormControl([] as any[]);
  accountEntryTypes: CommonReferenceDetailsDto[] = [];
  accountEntryId: number = 0;

  ngOnInit(): void {
    this.initializeFormData();
    this.getDataFromState();
    this.getAllaccountEntryTypes();

    if (!this.isAdding) {
      this.getUnmatchedDataById(this.accountEntryId);
    }
  }
  pageSizeAccount: number = 10;
  pageIndexAccount: number = 0;
  constructor(
    private router: Router,
    private accountEntryService: AccountEntryService,
    private builder: FormBuilder,
    private toastrService: ToastrService,
    private commonService: CommanService
  ) {}
  private initializeFormData(): void {
    this.formData = this.builder.group({
      id: [0],
      date: ['', Validators.required],
      remiterName: ['', [Validators.required, Validators.minLength(3)]],
      remiterBankName: ['', Validators.required],
      beneficiaryName: ['', Validators.required],
      beneficiaryBankName: ['', Validators.required],
      creditAmount: [0.0],
      debitAmount: [0.0],
      chequeNo: ['', Validators.required],
      transactionType: ['', Validators.required],
      remarks: [''],
      status: ['A'],
    });
    const historyState = history.state;

    if (historyState.pageSize != undefined) {
      this.pageSizeAccount = historyState.pageSize;
    }
    if (historyState.pageIndex != undefined) {
      this.pageIndexAccount = historyState.pageIndex;
    }
    // Listen to changes in transactionType to dynamically apply validation
    this.formData
      .get('transactionType')
      ?.valueChanges.subscribe((transactionType: string) => {
        this.applyDynamicValidation(transactionType);
      });
  }
  // Getter to check if creditAmount is valid
  get isCreditAmountValid(): any {
    return (
      this.formData.get('creditAmount')?.hasError('required') &&
      this.formData.get('creditAmount')?.touched
    );
  }

  // Getter to check if debitAmount is valid
  get isDebitAmountValid(): any {
    return (
      this.formData.get('debitAmount')?.hasError('required') &&
      this.formData.get('debitAmount')?.touched
    );
  }

  // Listen to transactionType changes and toggle validation dynamically
  private applyDynamicValidation(transactionType: string): void {
    this.isCreditType = transactionType === 'Payment';

    const creditAmountControl = this.formData.get('creditAmount');
    const debitAmountControl = this.formData.get('debitAmount');

    // Clear existing validators
    creditAmountControl?.clearValidators();
    debitAmountControl?.clearValidators();

    if (this.isCreditType) {
      // Set validators for creditAmount if transaction type is Payment
      creditAmountControl?.setValidators([Validators.required]);
    } else {
      // Set validators for debitAmount if transaction type is Receipt
      debitAmountControl?.setValidators([Validators.required]);
    }

    // Update validity
    creditAmountControl?.updateValueAndValidity();
    debitAmountControl?.updateValueAndValidity();
  }

  private getDataFromState() {
    const { accountEntry, isAdding } = history.state;
    console.log(accountEntry);
    this.isAdding = isAdding;
    this.accountEntry = accountEntry || this.accountEntry;
    if (!this.isAdding) {
      this.patchFormDataWithAccountEntry();
    }
  }

  private patchFormDataWithAccountEntry(): void {
    console.log(this.accountEntry);
    const transactionType = this.accountEntry.transactionType;
    if (transactionType === 'Payment') {
      this.isCreditType = true;
      this.formData.patchValue({
        creditAmount: transactionType,
      });
    } else if (transactionType === 'Receipt') {
      this.isCreditType = false;
      this.formData.patchValue({
        debitAmount: transactionType,
      });
    }
    if (this.accountEntry.transactionType) {
      this.fectchTrasactionTypeById(this.accountEntry.transactionType);
    }
    this.formData.patchValue(this.accountEntry);
  }

  fectchTrasactionTypeById(transactionType: string) {
    const transactionData = this.transactionTypes.find(
      (ty) => ty.traType === transactionType
    );
    if (transactionData) {
      this.selectedTransactionType = transactionData;
    }
    this.transactionTypeControll.patchValue(this.selectedTransactionType);
    this.formData
      ?.get('transactionType')
      ?.patchValue(this.selectedTransactionType.traType);
  }

  getAllaccountEntryTypes() {
    this.commonService
      .getRefDetailsByType(ACCOUNT_ENTRY_TYPE)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.accountEntryTypes = resp;
          console.log(this.accountEntryTypes);
          console.log('accountEntry types fetched succesfully');
        },
        error: (err) => {
          console.error('Error adding Customer', err);
        },
      });
  }

  onTransactionTypeSelect(event: any) {
    this.transactionTypeData = event.option.value.traType;
    if (this.transactionTypeData === 'Payment') {
      this.isCreditType = true;
    } else {
      this.isCreditType = false;
    }

    this.formData.patchValue({ transactionType: this.transactionTypeData });
  }

  displayTransactionType(transactionType: any) {
    return transactionType.traType ? transactionType.traType : '';
  }

  searchTransactionType(event: any) {
    const query = event.target.value;
    this.transactionTypeData = query;
    const matchedTransactionObject = this.transactionTypes.filter((ty) =>
      ty.traType.toLowerCase().includes(this.transactionTypeData)
    );
    this.transactionTypes = matchedTransactionObject;
  }

  save() {
    const transactionType = this.formData.value.transactionType;
    this.formData.value.date = this.formatDateTime(this.formData.value.date);
    console.log(this.isCreditType);
    console.log(
      transactionType,
      this.formData.value.creditAmount,
      this.formData.value.debitAmount
    );

    if (
      this.formData.value.creditAmount == 0 &&
      this.formData.value.debitAmount == 0
    ) {
      transactionType === 'Payment'
        ? this.formData.controls['creditAmount'].setErrors({ required: true })
        : this.formData.controls['debitAmount'].setErrors({ required: true });
    }

    if (this.formData.valid) {
      const saveOrUpdate$ = this.isAdding
        ? this.accountEntryService.addaccountEntry(this.formData.value)
        : this.accountEntryService.updateaccountEntry(this.formData.value);
      saveOrUpdate$.subscribe({
        next: (response) => {
          console.log(response);
          this.handleSuccessResponse(response);
        },
        error: (error) => {
          this.handleErrorResponse(error);
        },
      });
    } else {
      Object.keys(this.formData.controls).forEach((key) => {
        this.formData.controls[key].markAsTouched();
      });
      console.error('Invalid form');
    }
  }

  clearForm() {
    this.formData.reset();
  }

  handleSuccessResponse(response: any): void {
    console.log(response.message);
    this.toastrService.success('', response.message, {
      timeOut: TIME_OUT,
    });
    this.gotoAccountEntry();
  }
  handleErrorResponse(error: any): void {
    this.toastrService.error('', error.error.message, {
      timeOut: TIME_OUT,
    });
    this.gotoAccountEntry();
  }

  gotoAccountEntry() {
    this.router.navigate([NAVIGATE_TO_DISPLAY_ACCOUNT_ENTRY], {
      state: {
        pageSize: this.pageSizeAccount,
        pageIndex: this.pageIndexAccount,
      },
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getUnmatchedDataById(accountEntryId: number) {
    this.accountEntryService
      .getNewDataById(accountEntryId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          const newData = resp;
          console.log(newData); // You can navigate or handle the data as needed
        },
        error: (error) => {
          console.error('Error fetching unmatched data:', error);
        },
      });
  }
  formatDateTime(date: Date): string {
    return formatDate(date, 'yyyy-MM-ddTHH:mm:ss.SSSSSS', 'en-IN');
  }
}
