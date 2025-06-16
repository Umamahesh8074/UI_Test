import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { OrganizationApi } from 'src/app/Apis/UserApis/OrganizationApi';
import { Page } from 'src/app/Models/CommanModel/Page';
import { OrganizationBean } from 'src/app/Models/User/Organization';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  constructor(private http: HttpClient) { }
  private _refreshRequired = new Subject<void>();

  get refreshRequired() {
    return this._refreshRequired;
  }

  saveOrganization(organization: OrganizationBean): Observable<any> {
    console.log(organization);
    return this.http.post<any>(
      `${environment.userBaseUrl}/${OrganizationApi.SAVE}`,
      organization
    );
  }
  updateOrganization(organization: OrganizationBean): Observable<any> {
    return this.http.put<any>(
      `${environment.userBaseUrl}/${OrganizationApi.UPDATE}`,
      organization
    );
  }

  //retrieving all organizations beans with out pagination
  getAllOrganizations(): Observable<Page<OrganizationBean[]>> {
    console.log('retrieving all organization without pagination');
    return this.http.get<Page<OrganizationBean[]>>(
      `${environment.userBaseUrl}/${OrganizationApi.GET_ALL}/0/100`
    );
  }

  //retrieving all organizations beans with  pagination and filter with organization Name
  fetchAllOrganizations(
    organizationName: string | null,
    pageIndex: number,
    pageSize: number
  ): Observable<Page<OrganizationBean[]>> {
    console.log('retrieving all organization witpagination');
    return this.http.get<Page<OrganizationBean[]>>(
      `${environment.userBaseUrl}/${OrganizationApi.FETCH_ALL}?organizationName=${organizationName}&page=${pageIndex}&size=${pageSize}`
    );
  }

  deleteOrganization(organization: OrganizationBean): Observable<any> {
    return (
      this,
      this.http.put<any>(
        `${environment.userBaseUrl}/${OrganizationApi.CHANGE_STATUS}`,
        organization
      )
    );
  }

  getOrganizationById(organizationId: number): Observable<OrganizationBean> {
    return (
      this,
      this.http.get<any>(
        `${environment.userBaseUrl}/${OrganizationApi.GET_BY_ID}${organizationId}`,
      )
    );
  }
}
