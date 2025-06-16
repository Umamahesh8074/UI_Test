import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';

import {
  PAGE_INDEX,
  PAGE_SIZE,
  pageSizeOptions,
  searchTextLength,
  searchTextZero,
  TOTAL_ITEMS,
} from 'src/app/Constants/CommanConstants/Comman';

import { HttpErrorResponse } from '@angular/common/http';
import { NAVIGATE_TO_ADD_ACCOUNT_ENTRY } from 'src/app/Constants/Account/AccountEntry';
import {
  AccountEntry,
  AccountEntryDto,
  Amounts,
  FileProcessingResult,
  transactionType,
} from 'src/app/Models/Account/account-entry';
import { User } from 'src/app/Models/User/User';
import { AccountEntryService } from 'src/app/Services/Account/account-entry/account-entry.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-display-account-entry',
  templateUrl: './display-account-entry.component.html',
  styleUrls: ['./display-account-entry.component.css'],
})
export class DisplayAccountEntryComponent implements OnInit {
  private destroy$ = new Subject<void>();
  quotationName: string = '';
  accountEntryData: String[] = [] as String[];
  accountEntryDto: AccountEntryDto[] = [] as AccountEntryDto[];
  isBetween: boolean = false;
  isRemaining: boolean = false;
  displayedColumns: string[] = [
    'rowNumber',
    'date',
    'remiterName',
    'remiterBankName',
    'beneficiaryName',
    'beneficiaryBankName',
    'chequeNo',
    'transactionType',
    'formattedCreditAmount',
    'formattedDebitAmount',
    'actions',
  ];

  transactionTypes: transactionType[] = [
    {
      id: 1,
      traType: 'Payment',
    },

    {
      id: 2,
      traType: 'Receipt',
    },
    {
      id: 2,
      traType: 'All',
    },
  ];

  amountFilters: Amounts[] = [
    {
      id: '=',
      value: 'Equals',
    },

    {
      id: '>',
      value: 'Greater Than',
    },
    {
      id: '<',
      value: 'Less Than',
    },
    {
      id: 'Between',
      value: 'Between',
    },
  ];
  //pagination fields
  pageSizeOptions = pageSizeOptions;
  totalItems: number = TOTAL_ITEMS;
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;

  displayedTopColumns: string[] = ['creditTotal', 'debitTotal', 'grandTotal'];
  userId: number = 0;
  status: string = '';
  selectedDate: Date | null = null;
  accountEntry: AccountEntryDto = new AccountEntryDto();
  totalCredit: string = '';
  totalDebit: string = '';
  GrossTotal: string = '';
  particulars: string = '';
  showDateRangePicker: boolean = true;
  formData!: FormGroup;
  dateRange: any = '';
  customStartDate: any = '';
  customEndDate: any = '';
  errorMessage: string | null = null;
  selectedFiles: File[] = [];
  fileSizeDisplay: string = 'No file chosen';
  user: User = new User();
  //serach filters
  beneficiaryName: string = '';
  transactionType: string = '';
  amountValue: string = '';
  remitterName: string = '';
  minAmount: string = '';
  maxAmount: string = '';
  fileTypeError: boolean = false;
  amount: any = '';
  selectedFilter: string = 'select';
  selectedAmountType: string = '';
  title: string = '';
  editButtonDisplay: boolean = false;
  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      console.log('user');
      this.user = JSON.parse(user);
      this.title = this.user.title;
      // if (this.title == 'Accounts Head') {
      //   this.editButtonDisplay = true;
      //   this.displayedColumns.push('actions');
      // }
    }
    this.getAccountEntryService();
    this.getAccountEntryAmounts();
    this.accountEntryService.refreshRequired.subscribe(() => {
      this.getAccountEntryService();
    });
    this.accountEntryService.refreshRequired.subscribe(() => {
      this.getAccountEntryAmounts();
    });
    // this.fetchaccountEntrysDistinct();
    this.initForm();

    const state = history.state;
    if (state.pageSize != undefined) {
      this.pageSize = state.pageSize;
      //  this.paginator.pageSize = state.pageSize;
    }
    if (state.pageIndex != undefined) {
      this.pageIndex = state.pageIndex;
      //   this.paginator.pageIndex = state.pageIndex;
    }
  }

  constructor(
    private accountEntryService: AccountEntryService,
    private router: Router,
    public dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {}

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
          console.log(startDate);
          console.log(endDate);
          this.customStartDate = startDate;
          this.customEndDate = endDate;
          this.getAccountEntryService();
          this.getAccountEntryAmounts();
        }
      });
  }

  formatDateTime(date: Date, isEndDate: boolean = false): string {
    if (isEndDate) {
      date.setHours(23, 59, 59, 999);
    }
    return formatDate(date, 'yyyy-MM-ddTHH:mm:ss.SSSSSS', 'en-IN');
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  onSearch(particulars: any) {
    this.particulars = particulars;
    this.getAccountEntryService();
    this.getAccountEntryAmounts();
  }
  onDateChange() {
    //this.pageIndex=0;
    this.paginator.firstPage();
    const startDate = this.formData.get('customStartDate')?.value;
    const endDate = this.formData.get('customEndDate')?.value;
    if (startDate !== null && endDate !== null) {
      this.dateRange = '';
      this.getAccountEntryAmounts();
    } else {
      this.dateRange = 0;
    }
  }
  clearDateRange() {
    this.formData.get('customStartDate')?.reset();
    this.formData.get('customEndDate')?.reset();
    this.dateRange = '';
    this.customEndDate = '';
    this.customStartDate = '';
    this.getAccountEntryService();
    this.getAccountEntryAmounts();
  }

  fetchaccountEntrysDistinct() {
    this.accountEntryService
      .getAllaccountEntrys()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (accountEntryData) => {
          this.accountEntryData = this.addAllOption(accountEntryData);
          console.log(this.accountEntryData);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  private addAllOption(data: any[]): any[] {
    const allOption = 'All';
    return [allOption, ...data];
  }

  onselectBenificiaryName(event: any) {
    //this.pageIndex=0;
    this.paginator.firstPage();
    const selectedBenificiaryName = event.option.value;
    this.beneficiaryName = selectedBenificiaryName;
    console.log('Selected BenificiaryName:', selectedBenificiaryName);
    this.getAccountEntryService();
    this.getAccountEntryAmounts();
  }
  searchAmount(event: any) {
    //  this.pageIndex=0;
    this.paginator.firstPage();
    this.amount = event.target.value;
  }

  onSubmit() {
    if (this.selectedAmountType === 'Between') {
      console.log(this.minAmount, ',', this.maxAmount);
    } else {
      console.log(this.amount);
    }
    this.getAccountEntryService();
    this.getAccountEntryAmounts();
  }

  onClear() {
    this.minAmount = '';
    this.maxAmount = '';
    this.amount = '';
    this.getAccountEntryService();
    this.getAccountEntryAmounts();
  }
  displayAccountEntryBenificiaryName(benificiaryName: any) {
    console.log(benificiaryName);
    return benificiaryName;
  }

  searchBenificiaryName(event: any) {
    //this.pageIndex=0;
    this.paginator.firstPage();
    console.log(event.target.value);
    const query = event.target.value;
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.beneficiaryName = query;
      this.getAccountEntryService();
      this.getAccountEntryAmounts();
    }
  }
  searchremiterName(event: any) {
    //this.pageIndex=0;
    this.paginator.firstPage();
    console.log(event.target.value);
    const query = event.target.value;
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.remitterName = query;
      this.getAccountEntryService();
      this.getAccountEntryAmounts();
    }
  }
  searchTransactionType(event: any) {
    const enteredTransactionType = event.target.value;
    console.log(enteredTransactionType);
  }

  searchAmountType(event: any) {
    const enteredAmountType = event.target.value.toLowerCase(); // Convert input to lowercase for case-insensitive comparison
    console.log(enteredAmountType);
  }
  onselectTransactionType(event: any) {
    //this.pageIndex=0;
    this.paginator.firstPage();
    console.log(event.option.value.traType);
    this.transactionType = event.option.value.traType;
    this.getAccountEntryService();
    this.getAccountEntryAmounts();
  }
  onselectAmountType(event: any) {
    this.onClear();
    // this.pageIndex=0;
    this.paginator.firstPage();
    console.log(event.option.value.value);
    const val = event.option.value.value;
    const id = event.option.value.id;
    if (val == 'Between') {
      this.isBetween = true;
      this.amount = '';
    } else {
      this.isBetween = false;
      this.isRemaining = true;
    }
    this.selectedAmountType = id;
    console.log(this.selectedAmountType);
  }

  displayAccountEntryTransationType(transactionType: any) {
    return transactionType && transactionType.traType
      ? transactionType.traType
      : '';
  }
  displayAccountEntryAmount(Amounts: any) {
    return Amounts && Amounts.value ? Amounts.value : '';
  }
  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    history.state.pageIndex = this.pageIndex;
    history.state.pageSize = this.pageSize;

    this.getAccountEntryService();
    // this.getAccountEntryAmounts();
  }

  getAccountEntryService() {
    this.accountEntryService
      .getAllaccountEntrysWithName(
        this.particulars,
        this.remitterName,
        this.beneficiaryName,
        this.transactionType,
        this.amount,
        this.dateRange,
        this.customStartDate,
        this.customEndDate,
        history.state.pageIndex === undefined
          ? this.pageIndex
          : history.state.pageIndex,
        history.state.pageSize === undefined
          ? this.pageSize
          : history.state.pageSize,
        this.selectedAmountType,
        this.minAmount,
        this.maxAmount
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (accountEntrys) => {
          this.accountEntryDto = accountEntrys.records;
          this.totalItems = accountEntrys.totalRecords;

          this.paginator.pageIndex = this.pageIndex;
          this.paginator.pageSize = this.pageSize;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
  getAccountEntryAmounts() {
    this.accountEntryService
      .getAllaccountEntrysAmounts(
        this.particulars,
        this.remitterName,
        this.beneficiaryName,
        this.transactionType,
        this.amount,
        this.dateRange,
        this.customStartDate,
        this.customEndDate,
        this.selectedAmountType,
        this.minAmount,
        this.maxAmount
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (accountEntryAmounts) => {
          this.totalCredit = accountEntryAmounts.formattedCreditTotal;
          this.totalDebit = accountEntryAmounts.formattedDebitTotal;
          this.GrossTotal = accountEntryAmounts.formattedGrandTotal;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
  addaccountEntry() {
    this.router.navigate([NAVIGATE_TO_ADD_ACCOUNT_ENTRY], {
      state: {
        isAdding: true,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
      },
    });
  }
  editAccountEntry(accountEntryData: AccountEntry) {
    this.fetchaccountEntryById(accountEntryData.id);
  }

  fetchaccountEntryById(accountEntryId: number) {
    this.accountEntryService
      .getAllaccountEntrysById(accountEntryId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (accountEntryData) => {
          this.router.navigate([NAVIGATE_TO_ADD_ACCOUNT_ENTRY], {
            state: {
              accountEntry: accountEntryData,
              isAdding: false,
              pageSize: this.pageSize,
              pageIndex: this.pageIndex,
            },
          });
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  openConfirmDialog(accountEntryId: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: ' delete accountEntry' },
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.inActivateAccountEntry(accountEntryId);
        }
      }
    );
  }

  inActivateAccountEntry(accountEntryId: number) {
    this.accountEntryService
      .deleteaccountEntry(accountEntryId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          console.log('accountEntry deleted succesfully');
          this.fetchaccountEntrysDistinct();
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
  //upload files

  onFileChange(event: any): void {
    const files = event.target.files;
    this.selectedFiles = [];
    this.fileTypeError = false;

    if (files.length > 10) {
      this.fileSizeDisplay = 'Max 10 files allowed at once';
      return;
    }
    for (let i = 0; i < files.length; i++) {
      const file: File = files[i];
      const fileName: string = file.name;
      const fileParts: string[] = fileName.split('.');
      let fileExtension: string = '';

      if (fileParts.length > 1) {
        fileExtension = fileParts.pop()!.toLowerCase();
      }

      if (fileExtension === 'xls' || fileExtension === 'xlsx') {
        this.selectedFiles.push(file);
      } else {
        this.fileTypeError = true;
        break;
      }
    }

    if (this.fileTypeError) {
      this.selectedFiles = [];
      this.fileSizeDisplay = 'Invalid file type';
    } else {
      this.updateFileSize();
    }
  }

  uploadFiles(): void {
    if (this.selectedFiles.length === 0) {
      this.errorMessage = 'No files selected for upload.';
      return;
    }

    const formData = new FormData();
    this.selectedFiles.forEach((file) => {
      formData.append('files', file);
    });

    this.accountEntryService.uploadFiles(formData).subscribe(
      (response: FileProcessingResult[]) => {
        console.log('Files processing results:', response);
        this.clearFileInput();
        this.selectedFiles = [];
        this.fileSizeDisplay = 'No file chosen';
        this.getAccountEntryService();
        this.getAccountEntryAmounts();
        const successFiles = response.filter((res) => res.success);
        const failedFiles = response.filter((res) => !res.success);

        Swal.fire({
          icon: failedFiles.length > 0 ? 'error' : 'success',
          title:
            failedFiles.length > 0
              ? 'File Processing Issues'
              : 'All Files Processed Successfully',
          html: `
            <p style="font-size: 14px;">${
              successFiles.length
            } file(s) processed successfully.</p>
            ${
              failedFiles.length > 0
                ? `
              <p style="font-size: 14px;">${
                failedFiles.length
              } file(s) failed to process:</p>
              <ul style="font-size: 12px;">${failedFiles
                .map(
                  (res) => `
                <li>
                  <strong>${res.fileName}</strong><br />
                </li>
              `
                )
                .join('')}</ul>
            `
                : ''
            }
          `,
          // timer: 10000,
          // timerProgressBar: true,
          showConfirmButton: true,
          confirmButtonText: 'Download Updated Files',
          showCancelButton: true,
          cancelButtonText: 'OK',
          width: '400px', // Set the width to make it compact
        }).then((file) => {
          if (file.isConfirmed) {
            this.excelDownload(response[0].filePath);
          }
        });
      },
      (error: HttpErrorResponse) => {
        console.error('Error uploading files:', error);
        Swal.fire({
          icon: 'error',
          text: 'An error occurred while uploading files.',
          showConfirmButton: true,
        });
      }
    );
  }

  clearFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  updateFileSize(): void {
    this.fileSizeDisplay = this.selectedFiles.length
      ? `${this.selectedFiles.length} file(s) selected`
      : 'No file chosen';
  }

  downloadExcel() {
    this.accountEntryService
      .downloadExcel(
        this.particulars,
        this.remitterName,
        this.beneficiaryName,
        this.transactionType,
        this.amount,
        this.dateRange,
        this.customStartDate,
        this.customEndDate,
        this.selectedAmountType,
        this.minAmount,
        this.maxAmount
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.downloadFile(response, 'AccountEntry');
          console.log('Excel downloaded successfully');
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  private downloadFile(
    data: Blob,
    filename: string,
    needTime: boolean = true
  ): void {
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  private downloadXLSXFile(
    data: Blob,
    filename: string,
    needTime: boolean = true
  ) {
    const now = new Date();
    const timestamp = now.toLocaleDateString() + '_' + now.toLocaleTimeString();

    const blob = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    needTime
      ? (a.download = filename + '_' + timestamp + '.xlsx')
      : (a.download = filename + '.xlsx');

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
  downloadTemplate() {
    this.accountEntryService.downloadTemplate().subscribe({
      next: (response: Blob) => {
        console.log('Template downloaded successfully', response);
        console.log(JSON.stringify(response));
        this.downloadXLSXFile(response, 'Accounts_template', false);
        Swal.fire({
          icon: 'success',
          text: 'Template downloaded successfully',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      },
      error: (error) => {
        console.error('File download failed : ', error);
        Swal.fire({
          icon: 'error',
          text: 'Error Occurred',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      },
    });
  }

  toggleFilter(): void {
    // This method can be used to perform actions when filter selection changes
    console.log('Selected Filter:', this.selectedFilter);
  }

  searchMinAmount(event: any) {
    this.minAmount = event.target.value;
  }

  searchMaxAmount(event: any) {
    this.maxAmount = event.target.value;
  }

  private excelDownload(fileName: string) {
    const extractedFileName =
      fileName.split('/').pop()?.split('.').shift() || fileName;
    this.accountEntryService.downloadUpdatedExcel(fileName).subscribe({
      next: (response: Blob) => {
        console.log('File downloaded successfully', response);
        console.log(JSON.stringify(response));
        if (fileName.endsWith('.xlsx')) {
          this.downloadXLSXFile(response, 'Updated_' + extractedFileName);
        }
        if (fileName.endsWith('.xls')) {
          this.downloadXLSFile(response, 'Updated_' + extractedFileName);
        }
      },
      error: (error) => {
        console.error('File download failed : ', error);
        Swal.fire({
          icon: 'error',
          text: 'Error Occurred',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      },
    });
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
}
