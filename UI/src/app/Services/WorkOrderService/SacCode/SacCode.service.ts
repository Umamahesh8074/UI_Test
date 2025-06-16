import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, tap } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import {
  GET_SAC_CODE_BY_ID,
  GETALL_SAC_CODE_SPEC,
  GETALL_SAC_CODES,
  SAVE_SAC_CODE,
  UPDATE_SAC_CODE,
} from 'src/app/Apis/WorkOrderApis/SacCode';

import { Page } from 'src/app/Models/CommanModel/Page';
import { ISacCode, SacCode } from 'src/app/Models/WorkOrder/SacCode';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SacCodeService {
  constructor(private http: HttpClient) {}

  // Define refreshRequired as a Subject
  private _refreshRequired = new Subject<void>();
  public refreshRequired = this._refreshRequired.asObservable();

  getSacCodes(sacCode: string): Observable<SacCode[]> {
    sacCode = sacCode === undefined ? '' : sacCode;
    return this.http.get<SacCode[]>(
      `${environment.procurementBaseUrl}${GETALL_SAC_CODES}?sacCode=${sacCode}`
    );
  }

  getSacCodeById(id: number): Observable<ISacCode> {
    return this.http.get<ISacCode>(
      `${environment.procurementBaseUrl}${GET_SAC_CODE_BY_ID}/${id}`
    );
  }

  getAllSacCodes(
    sacCode: string,
    sacCodeDescription: string,
    page: number,
    size: number
  ): Observable<Page<SacCode>> {
    return this.http.get<Page<SacCode>>(
      `${environment.procurementBaseUrl}${GETALL_SAC_CODE_SPEC}?sacCode=${sacCode}&page=${page}&size=${size}&sacCodeDescription=${sacCodeDescription}`
    );
  }

  addSacCode(sacCode: SacCode): Observable<string> {
    console.log(sacCode);
    return this.http.post<string>(
      `${environment.procurementBaseUrl}${SAVE_SAC_CODE}`,
      sacCode
    );
  }

  updateSacCode(sacCode: SacCode): Observable<string> {
    return this.http.put<string>(
      `${environment.procurementBaseUrl}${UPDATE_SAC_CODE}`,
      sacCode
    );
  }

  inActivateSacCode(sacCodeId: number): Observable<string> {
    return this.http
      .delete<string>(
        `${environment.procurementBaseUrl}${GET_SAC_CODE_BY_ID}/${sacCodeId}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next();
        })
      );
  }
}
