import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, tap } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { GET_SAC_CODE_BY_ID } from 'src/app/Apis/WorkOrderApis/SacCode';
import { DELETE_WORK_ORDER_TERMS_AND_CONDITIONS } from 'src/app/Apis/WorkOrderApis/WorkOrderCreation';
import {
  GET_WO_TERMS_AND_CONDITIONS,
  GET_WORK_ORDER_HEADER_BY_ID,
  GET_WORK_ORDER_IERMS_AND_CONDITIONS_BY_ID,
  GETALL_WORK_ORDER_HEADERS,
  GETALL_WORK_ORDER_HEADERS_SPEC,
  SAVE_WORK_ORDER_HEADER,
  UPDATE_WORK_ORDER_HEADER,
  VALIDATE_WORK_ORDER_TERMS_AND_CONDITIONS,
} from 'src/app/Apis/WorkOrderApis/WorkOrderHeader';

import { Page } from 'src/app/Models/CommanModel/Page';
import { IWorkOrderHeader } from 'src/app/Models/WorkOrder/WorkOrderHeader';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WorkOrderHeaderService {
  constructor(private http: HttpClient) {}

  // Define refreshRequired as a Subject
  private _refreshRequired = new Subject<void>();
  public refreshRequired = this._refreshRequired.asObservable();

  getWorkOrderHeaders(headerName: string): Observable<IWorkOrderHeader[]> {
    headerName = headerName === undefined ? '' : headerName;
    return this.http.get<IWorkOrderHeader[]>(
      `${environment.procurementBaseUrl}${GETALL_WORK_ORDER_HEADERS}?headerName=${headerName}`
    );
  }

  getWorkOrderHeaderById(id: number): Observable<IWorkOrderHeader> {
    return this.http.get<IWorkOrderHeader>(
      `${environment.procurementBaseUrl}${GET_WORK_ORDER_HEADER_BY_ID}/${id}`
    );
  }

  getAllWorkOrderHeaders(
    headerName: string,
    page: number,
    size: number
  ): Observable<Page<IWorkOrderHeader>> {
    return this.http.get<Page<IWorkOrderHeader>>(
      `${environment.procurementBaseUrl}${GETALL_WORK_ORDER_HEADERS_SPEC}?headerName=${headerName}&page=${page}&size=${size}`
    );
  }

  addWorkOrder(workOrderHeader: IWorkOrderHeader): Observable<string> {
    console.log(workOrderHeader);
    return this.http.post<string>(
      `${environment.procurementBaseUrl}${SAVE_WORK_ORDER_HEADER}`,
      workOrderHeader
    );
  }

  updateWorkOrder(workOrderHeader: IWorkOrderHeader): Observable<string> {
    return this.http.put<string>(
      `${environment.procurementBaseUrl}${UPDATE_WORK_ORDER_HEADER}`,
      workOrderHeader
    );
  }

  inActivateWorkOrder(workOrderHeaderId: number): Observable<string> {
    return this.http
      .delete<string>(
        `${environment.procurementBaseUrl}${GET_SAC_CODE_BY_ID}/${workOrderHeaderId}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next();
        })
      );
  }

  deleteWorkOrderTermsAndConditions(id: number) {
    return this.http
      .delete<string>(
        `${environment.procurementBaseUrl}${DELETE_WORK_ORDER_TERMS_AND_CONDITIONS}?id=${id}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next();
        })
      );
  }

  //get workorder terms and conditions

  getWorkOrderTermsAndConditionsByWorkOrderId(
    workOrderId: number,
    page: number,
    size: number,
    headerId: number,
    tcId: number
  ) {
    return this.http.get<any>(
      `${environment.procurementBaseUrl}${GET_WORK_ORDER_IERMS_AND_CONDITIONS_BY_ID}?workOrderId=${workOrderId}&page=${page}&size=${size}&headerId=${headerId}&tcId=${tcId}`
    );
  }

  getWorkOrderTermsAndConditionsWithOutPagination(
    workOrderId: number,
    headerName: string
  ) {
    return this.http.get<any>(
      `${environment.procurementBaseUrl}${GET_WO_TERMS_AND_CONDITIONS}?workOrderId=${workOrderId}&headerName=${headerName}`
    );
  }

  validatHeader(
    workOrderId: number,
    headerId: number,
    tcId: number
  ): Observable<any> {
    return this.http.get<any>(
      `${environment.procurementBaseUrl}${VALIDATE_WORK_ORDER_TERMS_AND_CONDITIONS}?workOrderId=${workOrderId}&id=${headerId}&tcId=${tcId}`
    );
  }
}
