import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { PresalesControllerPaths } from 'src/app/Apis/ControllerPaths/ControllerPaths';
import { Page } from 'src/app/Models/CommanModel/Page';

import { LeadSource } from 'src/app/Models/Presales/leadsource';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LeadSourceService {
  constructor(private http: HttpClient) {}

  private _refreshRequired = new Subject<void>();

  get refreshRequired() {
    return this._refreshRequired;
  }
  getAllLeadSource(leadSourceName?: string | '', page?: number, size?: number) {
    page = page !== undefined ? page : 0;
    size = size !== undefined ? size : 0;
    leadSourceName = leadSourceName ? leadSourceName : '';
    return this.http.get<Page<LeadSource>>(
      `${environment.leadBaseUrl}${PresalesControllerPaths.LEAD_SOURCE}/getall?leadSourceName=${leadSourceName}&page=${page}&size=${size}`
    );
  }

  fetchAllLeadSources(sourceName?: string): Observable<LeadSource[]> {
    sourceName = sourceName ? sourceName : '';
    return this.http.get<LeadSource[]>(
      `${environment.leadBaseUrl}${PresalesControllerPaths.LEAD_SOURCE}/fetchall?leadSourceName=${sourceName}`
    );
  }

  addLeadSource(leadSource: any): Observable<any> {
    console.log(leadSource);
    return this.http.post<any>(
      `${environment.leadBaseUrl}${PresalesControllerPaths.LEAD_SOURCE}/save`,
      leadSource
    );
  }

  deleteLeadSource(leadSourceId: number): Observable<string> {
    console.log(leadSourceId);
    return this.http
      .delete<string>(
        `${environment.leadBaseUrl}${PresalesControllerPaths.LEAD_SOURCE}/${leadSourceId}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next(); // Emit refresh event
        })
      );
  }

  //update menu
  updateLeadSource(leadSource: any): Observable<any> {
    console.log(leadSource);
    return this.http.put<any>(
      `${environment.leadBaseUrl}${PresalesControllerPaths.LEAD_SOURCE}/update`,
      leadSource
    );
  }

  fetchSourecByName(sourceName?: string): Observable<LeadSource> {
    sourceName = sourceName ? sourceName : '';
    return this.http.get<LeadSource>(
      `${environment.leadBaseUrl}${PresalesControllerPaths.LEAD_SOURCE}/source?name=${sourceName}`
    );
  }

  fetchById(leadSourceId: number): Observable<LeadSource> {
    return this.http.get<LeadSource>(
      `${environment.leadBaseUrl}${PresalesControllerPaths.LEAD_SOURCE}/${leadSourceId}`
    );
  }
}
