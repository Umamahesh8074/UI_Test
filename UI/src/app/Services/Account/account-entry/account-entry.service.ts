import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { min, Observable, Subject, tap } from 'rxjs';
import { ControllerPaths } from 'src/app/Apis/ControllerPaths/ControllerPaths';
import {
  AccountEntry,
  AccountEntryDto,
  AmountsDto,
} from 'src/app/Models/Account/account-entry';

import { Page } from 'src/app/Models/User/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AccountEntryService {
  constructor(private http: HttpClient) {}

  // Define refreshRequired as a Subject
  private _refreshRequired = new Subject<void>();
  public refreshRequired = this._refreshRequired.asObservable();

  //adding accountEntry
  addaccountEntry(accountEntry: AccountEntry): Observable<AccountEntry> {
    console.log(accountEntry);
    return this.http.post<AccountEntry>(
      `${environment.accountBaseUrl}${ControllerPaths.ACCOUNTENTRY}/save`,
      accountEntry
    );
  }

  deleteaccountEntry(accountEntryId: number): Observable<string> {
    console.log(accountEntryId);
    return this.http
      .delete<string>(
        `${environment.accountBaseUrl}${ControllerPaths.ACCOUNTENTRY}/${accountEntryId}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next();
        })
      );
  }

  //update accountEntry
  updateaccountEntry(accountEntry: AccountEntry): Observable<AccountEntry> {
    console.log(accountEntry);
    return this.http.put<AccountEntry>(
      `${environment.accountBaseUrl}${ControllerPaths.ACCOUNTENTRY}/update`,
      accountEntry
    );
  }

  getAllaccountEntrys() {
    console.log();
    return this.http.get<string[]>(
      `${environment.accountBaseUrl}${ControllerPaths.ACCOUNTENTRY}/getAll/distinct`
    );
  }

  getAllaccountEntrysWithName(
    particulars?: string,
    remiterName?: string,
    beneficiaryName?: string,
    transactionType?: string,
    amount?: any,
    rangeOfDays?: any,
    startDate?: any,
    endDate?: any,
    page?: number,
    size?: number,
    selectedAmountType?: string,
    minAmount?: string,
    maxAmount?: string
  ) {
    console.log(
      particulars,
      beneficiaryName,
      transactionType,
      amount,
      page,
      size,
      maxAmount,
      minAmount,
      selectedAmountType
    );
    return this.http.get<Page<AccountEntryDto>>(
      `${environment.accountBaseUrl}${ControllerPaths.ACCOUNTENTRY}/fetchallWithPagination?particulars=${particulars}&beneficiaryName=${beneficiaryName}&remiterName=${remiterName}&transactionType=${transactionType}&amount=${amount}&rangeOfDays=${rangeOfDays}&startDate=${startDate}&endDate=${endDate}&page=${page}&size=${size}&minAmount=${minAmount}&maxAmount=${maxAmount}&selectedAmountType=${selectedAmountType}`
    );
  }

  getAllaccountEntrysById(id: number) {
    console.log(id);
    return this.http.get<AccountEntry>(
      `${environment.accountBaseUrl}${ControllerPaths.ACCOUNTENTRY}/${id}`
    );
  }
  uploadFiles(formData: FormData): Observable<any> {
    return this.http.post<any>(
      `${environment.accountBaseUrl}${ControllerPaths.ACCOUNTENTRY}/savethroughexcel`,
      formData
    );
  }

  downloadExcel(
    particulars: string,
    remiterName: string,
    beneficiaryName: string,
    transactionType: string,
    amount: any,
    rangeOfDays: any,
    startDate?: any,
    endDate?: any,
    selectedAmountType?: string,
    minAmount?: string,
    maxAmount?: string
  ): Observable<any> {
    return this.http.get<any>(
      `${environment.accountBaseUrl}${ControllerPaths.ACCOUNTENTRY}/generateAccountEntry?particulars=${particulars}&beneficiaryName=${beneficiaryName}&remiterName=${remiterName}&transactionType=${transactionType}&amount=${amount}&rangeOfDays=${rangeOfDays}&startDate=${startDate}&endDate=${endDate}&minAmount=${minAmount}&maxAmount=${maxAmount}&selectedAmountType=${selectedAmountType}`,
      { responseType: 'blob' as 'json' }
    );
  }

  downloadTemplate(): Observable<Blob> {
    return this.http.get<Blob>(
      `${environment.accountBaseUrl}${ControllerPaths.ACCOUNTENTRY}/download-template`,
      { responseType: 'blob' as 'json' }
    );
  }

  getAllaccountEntrysAmounts(
    particulars: string,
    remiterName: string,
    beneficiaryName: string,
    transactionType: string,
    amount: any,
    rangeOfDays: any,
    startDate?: any,
    endDate?: any,
    selectedAmountType?: string,
    minAmount?: string,
    maxAmount?: string
  ) {
    console.log(particulars, beneficiaryName, transactionType, amount);
    return this.http.get<AmountsDto>(
      `${environment.accountBaseUrl}${ControllerPaths.ACCOUNTENTRY}/fetchamounts?particulars=${particulars}&beneficiaryName=${beneficiaryName}&remiterName=${remiterName}&transactionType=${transactionType}&amount=${amount}&rangeOfDays=${rangeOfDays}&startDate=${startDate}&endDate=${endDate}&minAmount=${minAmount}&maxAmount=${maxAmount}&selectedAmountType=${selectedAmountType}`
    );
  }

  getNewDataById(reportId: number): Observable<AccountEntry> {
    return this.http.get<AccountEntry>(
      `${environment.accountBaseUrl}${ControllerPaths.ACCOUNTAUDITLOG}/unmatched/${reportId}`
    );
  }

  downloadUpdatedExcel(fileName: string): Observable<Blob> {
    return this.http.get<Blob>(
      `${environment.accountBaseUrl}${ControllerPaths.ACCOUNTENTRY}/download?filename=${fileName}`,
      { responseType: 'blob' as 'json' }
    );
  }
}
