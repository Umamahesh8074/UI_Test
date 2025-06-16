import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { PresalesControllerPaths } from 'src/app/Apis/ControllerPaths/ControllerPaths';
import {
  LeadSubSource,
  LeadSubSourceDto,
} from 'src/app/Models/Presales/leadsubsource';

import { Page } from 'src/app/Models/CommanModel/Page';
import { LeadSourceService } from '../LeadSource/lead-source.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LeadSubsourceService {
  constructor(
    private http: HttpClient,
    private leadSourceService: LeadSourceService
  ) {}

  private _refreshRequired = new Subject<void>();

  get refreshRequired() {
    return this._refreshRequired;
  }

  getAllLeadSubSource(
    leadSubSourceName: string,
    page: any,
    size: any,
    sourceId: any
  ) {
    console.log(leadSubSourceName, page, size);
    sourceId = sourceId || '';
    return this.http.get<Page<LeadSubSourceDto>>(
      `${environment.leadBaseUrl}${PresalesControllerPaths.LEADSUBSOURCE}/getall?page=${page}&size=${size}&name=${leadSubSourceName}&sourceId=${sourceId}`
    );
  }

  addLeadSubSource(leadSource: any): Observable<any> {
    console.log(leadSource);
    return this.http.post<any>(
      `${environment.leadBaseUrl}${PresalesControllerPaths.LEADSUBSOURCE}/save`,
      leadSource
    );
  }

  deleteLeadSubSource(leadSourceId: number): Observable<string> {
    console.log(leadSourceId);
    return this.http
      .delete<string>(
        `${environment.leadBaseUrl}${PresalesControllerPaths.LEADSUBSOURCE}/${leadSourceId}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next(); // Emit refresh event
        })
      );
  }

  //update menu
  updateLeadSubSource(leadSource: any): Observable<any> {
    console.log(leadSource);
    return this.http.put<any>(
      `${environment.leadBaseUrl}${PresalesControllerPaths.LEADSUBSOURCE}/update`,
      leadSource
    );
  }

  // fetchLeadSources() {
  //   return this.leadSourceService.getAllLeadSource();
  // }

  fetchSubSources(
    sourceId: number,
    subSourceName?: string
  ): Observable<LeadSubSource[]> {
    if (subSourceName == undefined) subSourceName = '';
    return this.http.get<LeadSubSource[]>(
      `${environment.leadBaseUrl}${PresalesControllerPaths.LEADSUBSOURCE}/fetchall?sourceId=${sourceId}&subSourceName=${subSourceName}`
    );
  }
  fetchSubSourceBySubSourceId(subSourceId: number): Observable<LeadSubSource> {
    return this.http.get<LeadSubSource>(
      `${environment.leadBaseUrl}${PresalesControllerPaths.LEADSUBSOURCE}/subsourceby/sbusourceid?subSourceId=${subSourceId}`
    );
  }

  //added by shiv
  fetchBySourceIds(souceIds: number[]): Observable<LeadSubSource[]> {
    return this.http.get<LeadSubSource[]>(
      `${environment.leadBaseUrl}${PresalesControllerPaths.LEADSUBSOURCE}/subsourcesbyids?souceIds=${souceIds}`
    );
  }

  //added by shiv
  fetchBySubSourceByName(subSourceName: any): Observable<LeadSubSource> {
    return this.http.get<LeadSubSource>(
      `${environment.leadBaseUrl}${PresalesControllerPaths.LEADSUBSOURCE}/leadsubsource?subSourceName=${subSourceName}`
    );
  }

  fetchBySourceIdAndRefName(
    sourceId: string,
    refName: string
  ): Observable<LeadSubSource> {
    return this.http.get<LeadSubSource>(
      `${environment.leadBaseUrl}${PresalesControllerPaths.LEADSUBSOURCE}/sourceid/refname?sourceId=${sourceId}&refName=${refName}`
    );
  }
}
