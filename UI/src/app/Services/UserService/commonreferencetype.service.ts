import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';

import {
  DELETECOMMONREFERENCETYPE,
  FETCHALLCOMMONREFERENCETYPE,
  GETALLCOMMONREFERENCETYPE,
  GETALLCOMMONREFERENCETYPEBYNAME,
  GETCOMMONREFERENCETYPEBYID,
  SAVECOMMONREFERENCETYPE,
  UPDATECOMMONREFERENCETYPE,
} from 'src/app/Apis/UserApis/CommonReferenceType';
import { CommonReferenceType, CommonReferenceTypeDto } from 'src/app/Models/User/CommonReferenceType';
import { Page } from 'src/app/Models/User/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommonreferencetypeService {
  private _refreshRequired = new Subject<void>();

  get refreshRequired() {
    return this._refreshRequired;
  }
  constructor(private http: HttpClient) {}
  private _refresh = new Subject<void>();

  get refresh() {
    return this._refresh;
  }

  addCommonReferenceType(workflowType: any): Observable<any> {
    console.log(workflowType);
    return this.http.post<any>(
      `${environment.userBaseUrl}${SAVECOMMONREFERENCETYPE}`,
      workflowType
    );
  }

  editCommonReferenceType(commonReferenceType: any): Observable<any> {
    return this.http.put(
      `${environment.userBaseUrl}${UPDATECOMMONREFERENCETYPE}`,
      commonReferenceType
    );
  }

  getWorkCommonReferenceTypeById(id: number): Observable<CommonReferenceType> {
    return this.http.get<CommonReferenceType>(
      `${environment.userBaseUrl}${GETCOMMONREFERENCETYPEBYID}/${id}`
    );
  }

  deleteCommonReferenceType(id: number): Observable<string> {
    console.log(id);
    return this.http
      .delete<string>(
        `${environment.userBaseUrl}${DELETECOMMONREFERENCETYPE}/${id}`
      )
      .pipe(
        tap(() => {
          this._refresh.next(); // Emit refresh event
        })
      );
  }

  getAllCommonReferenceTypeByName(name: string, page: any, size: any) {
    console.log(name, page, size);
    return this.http.get<Page<CommonReferenceType>>(
      `${environment.userBaseUrl}${GETALLCOMMONREFERENCETYPEBYNAME}?name=${name}&page=${page}&size=${size}`
    );
  }

  fetchAllCommonReferenceType(
    name?: string,
    roleId?:number
  ): Observable<CommonReferenceTypeDto[]> {
    name = name ? name : '';
    roleId = roleId ? roleId : 0;
    return this.http.get<CommonReferenceTypeDto[]>(
      `${environment.userBaseUrl}${FETCHALLCOMMONREFERENCETYPE}/dto?name=${name}&roleId=${roleId}`
    );
  }

  fetchAllCommonReferenceTypeForRole(
    name?: string
  ): Observable<CommonReferenceType[]> {
    name = name ? name : '';

    return this.http.get<CommonReferenceType[]>(
      `${environment.userBaseUrl}${FETCHALLCOMMONREFERENCETYPE}?name=${name}`
    );
  }
}
