import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject, tap } from 'rxjs';
import {
  GET_SERVICE_CODE_BY_ID,
  GETALL_SERVICE_CODE_SPEC,
  GETALL_SERVICE_CODE_WITH_FILTERS,
  GETALL_SERVICE_CODE_WITHOUTPAGE,
  GETALL_SERVICE_CODE_WITHOUTPAGE_SERVICEID,
  SAVE_SERVICE_CODE,
  UPDATE_SERVICE_CODE,
} from 'src/app/Apis/WorkOrderApis/ServiceCode';
import { Page } from 'src/app/Models/User/User';
import {
  IServiceCode,
  IServiceCodeDto,
  ServiceCode,
  ServiceCodeDto,
} from 'src/app/Models/WorkOrder/ServiceCode';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ServiceCodeService {
  constructor(private http: HttpClient) {}

  // Define refreshRequired as a Subject
  private _refreshRequired = new Subject<void>();
  public refreshRequired = this._refreshRequired.asObservable();

  addServiceCodeData(ServiceCode: any): Observable<string> {
    console.log(ServiceCode.serviceCode);
    return this.http.post<string>(
      `${environment.procurementBaseUrl}${SAVE_SERVICE_CODE}`,
      ServiceCode
    );
  }
  updateServiceCode(ServiceCode: any): Observable<string> {
    return this.http.put<string>(
      `${environment.procurementBaseUrl}/${UPDATE_SERVICE_CODE}`,
      ServiceCode
    );
  }

  getServiceCodeServiceById(serviceCodeId: number): Observable<IServiceCode> {
    return this.http.get<IServiceCode>(
      `${environment.procurementBaseUrl}${GET_SERVICE_CODE_BY_ID}/${serviceCodeId}`
    );
  }

  // This method is used to get service code by ID.
  // getServiceCodeServiceById(serviceCodeId: number): Observable<any> {
  //   var serviceCode = {
  //     id: 548,
  //     serviceGroupId: 108,
  //     serviceDescription: 'Joint Pin',
  //     serviceUomId: 271,
  //     sacCodeId: 34,
  //     primeActivityId: 101,
  //     serviceCode: 'CS00107DC101-NOS-SW-013',
  //     status: 'A',
  //     serviceCodeSequence: 13,
  //   };

  //   return of(serviceCode);
  // }

  getAllServiceCode(
    serviceCode: string,
    serviceCodeName: String,
    serviceGroupCode: String,
    sacCode: string,
    serviceUom: string,
    primeActivityCode: string,
    serviceCodeDescription: string,
    page: number,
    size: number
  ): Observable<Page<IServiceCodeDto>> {
    console.log(serviceCode, page, size);
    return this.http.get<Page<IServiceCodeDto>>(
      `${environment.procurementBaseUrl}${GETALL_SERVICE_CODE_SPEC}?serviceCode=${serviceCode}&page=${page}&size=${size}&serviceCodeName=${serviceCodeName}&serviceGroupCode=${serviceGroupCode}&sacCode=${sacCode}&serviceUom=${serviceUom}&primeActivityCode=${primeActivityCode}&serviceCodeDescription=${serviceCodeDescription}`
    );
  }
  getAllServiceCodesWithFilters(
    serviceCode: string,
    SCDescription: string,
    SCUom: String,
    SGCode: string,
    SGDescription: string,
    PACode: string,
    PADescription: string,
    page: number,
    size: number
  ): Observable<Page<IServiceCodeDto>> {
    console.log(serviceCode, page, size);
    return this.http.get<Page<IServiceCodeDto>>(
      `${environment.procurementBaseUrl}${GETALL_SERVICE_CODE_WITH_FILTERS}?serviceCode=${serviceCode}&serviceDescription=${SCDescription}&serviceCodeUom=${SCUom}&serviceGroupCode=${SGCode}&serviceGroupName=${SGDescription}&primeActivityNumber=${PACode}&primeActivityDescription=${PADescription}&page=${page}&size=${size}`
    );
  }

  inActivateServiceCode(serviceCodeId: number): Observable<string> {
    return this.http
      .delete<string>(
        `${environment.procurementBaseUrl}${GET_SERVICE_CODE_BY_ID}/${serviceCodeId}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next();
        })
      );
  }

  getServiceCodeDtosWithOutPage(
    serviceCode: string
  ): Observable<IServiceCodeDto[]> {
    serviceCode = serviceCode === undefined ? '' : serviceCode;
    return this.http.get<IServiceCodeDto[]>(
      `${environment.procurementBaseUrl}${GETALL_SERVICE_CODE_WITHOUTPAGE}?serviceCode=${serviceCode}`
    );
  }

  getServiceCodesByServiceCode(serviceCodeId: any): Observable<ServiceCodeDto> {
    return this.http.get<ServiceCodeDto>(
      `${environment.procurementBaseUrl}${GETALL_SERVICE_CODE_WITHOUTPAGE_SERVICEID}/${serviceCodeId}`
    );
  }
}
