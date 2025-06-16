import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { Page } from 'src/app/Models/User/User';
import { environment } from 'src/environments/environment';

import {
  IPrimeActivityCode,
  IPrimeActivityCodeDto,
} from 'src/app/Models/WorkOrder/PrimeActivityCode';
import {
  GETALL_PRIME_ACTIVITY_CODE,
  GETALL_PRIME_ACTIVITY_CODE_SPEC,
  PRIME_ACTIVITY_CODE_BY_ID,
  SAVE_PRIME_ACTIVITY_CODE,
  UPDATE_PRIME_ACTIVITY_CODE,
} from 'src/app/Apis/WorkOrderApis/PrimeActivityCode';

@Injectable({
  providedIn: 'root',
})
export class PrimeActivityCodeService {
  constructor(private http: HttpClient) {}

  // Define refreshRequired as a Subject
  private _refreshRequired = new Subject<void>();
  public refreshRequired = this._refreshRequired.asObservable();

  getAllPrimeActivityCodes(
    primeActivityCodeNumber: string,
    primeActivityCodeDescription: any,
    primeActivityCodeDescrptionCode: any,
    page: number,
    size: number
  ): Observable<Page<IPrimeActivityCodeDto>> {
    primeActivityCodeDescription=primeActivityCodeDescription||"";
    primeActivityCodeDescrptionCode=  primeActivityCodeDescrptionCode||""
    console.log(primeActivityCodeNumber, page, size);
    return this.http.get<Page<IPrimeActivityCodeDto>>(
      `${environment.procurementBaseUrl}${GETALL_PRIME_ACTIVITY_CODE_SPEC}?primeActivityCodeNumber=${primeActivityCodeNumber}&page=${page}&size=${size}&primeActivityDescription=${primeActivityCodeDescription}&primeActivityUom=${primeActivityCodeDescrptionCode}`
    );
  }

  addPrimeActivity(PrimeActivityCode: IPrimeActivityCode): Observable<string> {
    console.log(PrimeActivityCode);
    return this.http.post<string>(
      `${environment.procurementBaseUrl}${SAVE_PRIME_ACTIVITY_CODE}`,
      PrimeActivityCode
    );
  }

  getPrimeActivityCodeById(
    primeActivityId: number
  ): Observable<IPrimeActivityCode> {
    return this.http.get<IPrimeActivityCode>(
      `${environment.procurementBaseUrl}${PRIME_ACTIVITY_CODE_BY_ID}/${primeActivityId}`
    );
  }

  updatePrimeActivity(
    PrimeActivityCode: IPrimeActivityCode
  ): Observable<string> {
    return this.http.put<string>(
      `${environment.procurementBaseUrl}${UPDATE_PRIME_ACTIVITY_CODE}`,
      PrimeActivityCode
    );
  }

  inActivatePrimeActivityCode(primeActivityCodeId: number): Observable<string> {
    return this.http
      .delete<string>(
        `${environment.procurementBaseUrl}${PRIME_ACTIVITY_CODE_BY_ID}/${primeActivityCodeId}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next();
        })
      );
  }

  getAllPrimeActivityCodeWithOutPage(
    primeActivityNumber?: string
  ): Observable<IPrimeActivityCodeDto[]> {
    primeActivityNumber =
      primeActivityNumber === undefined ? '' : primeActivityNumber;
    return this.http.get<IPrimeActivityCodeDto[]>(
      `${environment.procurementBaseUrl}${GETALL_PRIME_ACTIVITY_CODE}?primeActivityNumber=${primeActivityNumber}`
    );
  }
}
