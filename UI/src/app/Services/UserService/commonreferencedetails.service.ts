import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { GET_TRANSACTION_TYPE } from 'src/app/Apis/CrmApis/PaymentDetailsApis';
import {
  DELETECOMMONREFERENCEDETAILS,
  FETCHALLCOMMONREFERENCEDETAILS,
  GET_BY_REF_VALUE,
  GET_COMMON_REF_DETAILS_BY_TYPENAME,
  GET_LEAD_STATUS_DETAILS_BY_REF_TYPE,
  GETCOMMONREFERENCEDETAILSBYID,
  SAVECOMMONREFERENCEDETAILS,
  UPDATECOMMONREFERENCEDETAILS,
} from 'src/app/Apis/UserApis/CommonReferenceDetails';
import {
  GETALLCOMMONREFERENCETYPEBYNAME,
  GETCOMMONREFERENCETYPEBYID,
} from 'src/app/Apis/UserApis/CommonReferenceType';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';
import { CommonReferenceDetailsDto } from 'src/app/Models/User/CommonReferenceDetailsDto';
import { Page } from 'src/app/Models/User/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommonreferencedetailsService {
  private _refreshRequired = new Subject<void>();

  get refreshRequired() {
    return this._refreshRequired;
  }
  constructor(private http: HttpClient) {}
  private _refresh = new Subject<void>();

  get refresh() {
    return this._refresh;
  }

  addCommonReferenceDetails(commonReferenceDetails: any): Observable<any> {
    console.log(commonReferenceDetails);
    return this.http.post<any>(
      `${environment.userBaseUrl}${SAVECOMMONREFERENCEDETAILS}`,
      commonReferenceDetails
    );
  }

  editCommonReferenceDetails(commonReferenceDetails: any): Observable<any> {
    return this.http.put(
      `${environment.userBaseUrl}${UPDATECOMMONREFERENCEDETAILS}`,
      commonReferenceDetails
    );
  }

  getWorkCommonReferenceDetailsById(
    id: number
  ): Observable<CommonReferenceDetails> {
    return this.http.get<CommonReferenceDetails>(
      `${environment.userBaseUrl}${GETCOMMONREFERENCETYPEBYID}/${id}`
    );
  }

  deleteCommonReferenceDetails(id: number): Observable<string> {
    console.log(id);
    return this.http
      .delete<string>(
        `${environment.userBaseUrl}${DELETECOMMONREFERENCEDETAILS}/${id}`
      )
      .pipe(
        tap(() => {
          this._refresh.next(); // Emit refresh event
        })
      );
  }

  getAllCommonReferenceDetailsByName(name: string, page: any, size: any) {
    console.log(name, page, size);
    return this.http.get<Page<CommonReferenceDetails>>(
      `${environment.userBaseUrl}${GETALLCOMMONREFERENCETYPEBYNAME}?name=${name}&page=${page}&size=${size}`
    );
  }

  fetchAllCommonReferenceDetails(commonRefValue: string, roleId:any,page: any, size: any) {
    console.log(name,roleId, page, size);
    return this.http.get<Page<CommonReferenceDetailsDto>>(
      `${environment.userBaseUrl}${FETCHALLCOMMONREFERENCEDETAILS}?name=${commonRefValue}&roleId=${roleId}&page=${page}&size=${size}`
    );
  }
  getById(id: number): Observable<CommonReferenceDetails> {
    return this.http.get<CommonReferenceDetails>(
      `${environment.userBaseUrl}${GETCOMMONREFERENCEDETAILSBYID}/${id}`
    );
  }
  fetchLeadStatusListByRole(
    typeName: string,
    moduleNames: string[]
  ): Observable<any> {
    return this.http.get<any[]>(
      `${environment.userBaseUrl}${GET_LEAD_STATUS_DETAILS_BY_REF_TYPE}?typeName=${typeName}&moduleNames=${moduleNames}`
    );
  }

  getByRefValue(refValue: string) {
    return this.http.get<any>(
      `${environment.userBaseUrl}${GET_BY_REF_VALUE}/${refValue}`
    );
  }
  getByRefDetails(refValue: string) {
    return this.http.get<CommonReferenceDetails>(
      `${environment.userBaseUrl}${GET_BY_REF_VALUE}?refvalue=${refValue}`
    );
  }
  getTransactionType(refType: string): Observable<Map<string, CommonReferenceDetails>> {
    return this.http.get<Map<string, CommonReferenceDetails>>(`${environment.projectBaseUrl}${GET_TRANSACTION_TYPE}?refType=${refType}`);
  }
  fetchCommomRefDetailsByType(
    typeName: string
  ): Observable<any> {
    return this.http.get<any[]>(
      `${environment.userBaseUrl}${GET_COMMON_REF_DETAILS_BY_TYPENAME}/${typeName}`
    );
  }

}
