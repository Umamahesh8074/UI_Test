import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, Subject, tap } from 'rxjs';

import { Page } from 'src/app/Models/CommanModel/Page';
import { SecurityReport } from 'src/app/Models/Facility Management/SecurityReport';
import { environment } from 'src/environments/environment';
import { ControllerPaths } from 'src/app/Apis/ControllerPaths/ControllerPaths';

@Injectable({
  providedIn: 'root',
})
export class SecurityReportService {


  constructor(private http: HttpClient) {}
  // url = '/api/facility-management/attendance';
  private _refreshRequired = new Subject<void>();

  get refreshRequired() {
    return this._refreshRequired;
  }


  getAllSecurityReport(
    organizationId: any,
    projectId: any,
    location: any,
    userId: any,
    status: any,
    rangeOfDays: any,
    startDate: any,
    endDate: any,
    page: number,
    size: number
  ) {
    console.log(rangeOfDays, "getting attendance");

    // Handle defaults for parameters
    rangeOfDays = rangeOfDays === undefined || rangeOfDays === '' ? 0 : rangeOfDays;
    startDate = startDate === undefined || startDate === '' ? '' : startDate;
    endDate = endDate === undefined || endDate === '' ? '' : endDate;
    organizationId = organizationId === undefined || organizationId === 0 ? '' : organizationId;
    projectId = projectId === undefined || projectId === 0 ? '' : projectId;
    location = location === undefined || location === 0 ? '' : location;
    userId = userId === undefined || userId === 0 ? '' : userId;
    status = status === undefined || status === '' ? '' : status;

    // Construct and send the HTTP request
    return this.http.get<Page<SecurityReport[]>>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.QRREPORT}/withpage/getallschedulewithreports?organizationId=${organizationId}&projectId=${projectId}&location=${location}&userId=${userId}&status=${status}&range=${rangeOfDays}&startDate=${startDate}&endDate=${endDate}&page=${page}&size=${size}`
    );
  }

  downloadExcel(
    organizationId: any, projectId: any, location: any, userId: any, status: any, rangeOfDays: any, startDate: any,endDate:any
  ): Observable<any> {


    rangeOfDays = rangeOfDays === undefined || rangeOfDays === '' ? 0 : rangeOfDays;
    startDate = startDate === undefined || startDate === '' ? '' : startDate;
    endDate = endDate === undefined || endDate === '' ? '' : endDate;
    organizationId = organizationId === undefined || organizationId === 0 ? '' : organizationId;
    projectId = projectId === undefined || projectId === 0 ? '' : projectId;
    location = location === undefined || location === 0 ? '' : location;
    userId = userId === undefined || userId === 0 ? '' : userId;
    status = status === undefined || status === '' ? '' : status;


    return this.http.get<any>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.QRREPORT}/generateSecurityReport?organizationId=${organizationId}&projectId=${projectId}&location=${location}&userId=${userId}&status=${status}&range=${rangeOfDays}&startDate=${startDate}&endDate=${endDate}`,
      { responseType: 'blob' as 'json' }
    );
  }
}
