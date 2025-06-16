import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { ControllerPaths } from 'src/app/Apis/ControllerPaths/ControllerPaths';
import {
  QrReportDto,
  QrReportLocationSummaryDTO,
  QrReportProjectSummaryDTO,
  QrReportUserSummaryDto,
} from 'src/app/Models/Reports/reports';
import { ScheduleSecurityPatrolDto, ScheduleTimeDto, Securitypatrol } from 'src/app/Models/Securitypatrol/securitypatrol';
import { Page } from 'src/app/Models/User/User';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SecuritypatrolService {
  constructor(private http: HttpClient) {}

  private _refreshRequired = new Subject<void>();

  get refreshRequired() {
    return this._refreshRequired;
  }

  //get all securitypatrols to display securitypatrol in front end
  // getAllSecuritypatrol(size: any, index: any): Observable<Page<Securitypatrol>> {
  //   return this.http.get<Page<Securitypatrol>>(
  //     `${environment.baseUrl}${ControllerPaths.SECURITYPATROL}/all/${index}/${size}`
  //   );
  // }

  //adding securitypatrol
  addSecuritypatrol(securitypatrol: any): Observable<any> {
    console.log(securitypatrol);
    return this.http.post<any>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.SECURITYPATROL}/save/schedule`,
      securitypatrol
    );
  }

  deleteSecuritypatrol(scheduleTimeId: number): Observable<string> {
    console.log(scheduleTimeId);
    return this.http
      .delete<string>(
        `${environment.facilitymanagementBaseUrl}/${ControllerPaths.SCHEDULETIME}/${scheduleTimeId}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next(); // Emit refresh event
        })
      );
  }

  //update securitypatrol
  updateSecuritypatrol(securitypatrol: any): Observable<any> {
    console.log(securitypatrol);
    console.log(securitypatrol);
    return this.http.put<any>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.SECURITYPATROL}/update`,
      securitypatrol
    );
  }

  //getting filter data based on securitypatrol name
  // event,this.pageIndex,this.pageSize
  // http://localhost:9000/api/user/securitypatrol/securitypatrols?securitypatrolName=Users&page=0&size=10
  //getAllSecuritypatrol( securitypatrolName: string,page: any,size: any,organizationId:any) {
  //   console.log(securitypatrolName,page,size,organizationId);
  //   return this.http.get<Page<Securitypatrol>>(
  //     `${environment.facilitymanagementBaseUrl}/${ControllerPaths.SECURITYPATROL}/getall/${page}/${size}?organizationId=${organizationId}`
  //   );
  // }

  getAllSecuritypatrolDto(
    userName: string,
    page: any,
    size: any,
    organizationId: any
  ) {
    console.log(userName, page, size, organizationId);
    return this.http.get<Page<Securitypatrol>>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.SECURITYPATROL}/getallsecurityPatrol/${page}/${size}?userName=${userName}&organizationId=${organizationId}`
    );
  }

  getAllSecuritypatrol(
    securityPatrolName: string,
    page: any,
    size: any,
    organizationId: any,
    projectId: number,
    qrgeneratorId: number,
    userId: number
  ) {
    console.log(
      securityPatrolName,
      page,
      size,
      organizationId,
      projectId,
      qrgeneratorId,
      userId
    );
    return this.http.get<Page<QrReportDto>>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.QRREPORT}/getqrscanwithpage?page=${page}&size=${size}&organizationId=${organizationId}&projectId=${projectId}&qrgeneratorId=${qrgeneratorId}&userId=${userId}`
    );
  }

  getAllSecuritypatrolProject(
    securityPatrolName: string,
    page: number,
    size: number,
    organizationId: number,
    projectId: number
  ) {
    console.log(securityPatrolName, page, size, organizationId, projectId);
    return this.http.get<Page<QrReportProjectSummaryDTO>>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.QRREPORT}/getallreportprojectwisepage?page=${page}&size=${size}&organizationId=${organizationId}`
    );
  }

  getAllSecuritypatrolLocation(
    securityPatrolName: string,
    page: number,
    size: number,
    organizationId: number,
    projectId: number
  ) {
    console.log(securityPatrolName, page, size, organizationId, projectId);
    return this.http.get<Page<QrReportLocationSummaryDTO>>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.QRREPORT}/getallreportlocationwisepage?page=${page}&size=${size}&organizationId=${organizationId}&projectId=${projectId}`
    );
  }

  getAllSecuritypatrolUser(
    securityPatrolName: string,
    page: number,
    size: number,
    organizationId: number,
    projectId: number,
    qrgeneratorId: number
  ) {
    console.log(
      securityPatrolName,
      page,
      size,
      organizationId,
      projectId,
      qrgeneratorId
    );
    return this.http.get<Page<QrReportUserSummaryDto>>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.QRREPORT}/getallreportuserwisepage?page=${page}&size=${size}&organizationId=${organizationId}&projectId=${projectId}&qrgeneratorId=${qrgeneratorId}`
    );
  }

  getAll(securityPatrolName: string, page: any, size: any) {
    console.log(securityPatrolName, page, size);
    return this.http.get<Page<Securitypatrol>>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.SECURITYPATROL}/getallsecuritypatrol?securityPatrolName=${securityPatrolName}&page=${page}&size=${size}`
    );
  }

  getAllSecurtiyPatrolNames(projectId: number, securityPatrolName: string) {
    console.log(securityPatrolName, projectId);
    return this.http.get<Securitypatrol>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.SECURITYPATROL}/getallsecuritypatrolformob?securityPatrolName=${securityPatrolName}&projectId=${projectId}`
    );
  }

  getSecurityPatrolById(id: number): Observable<any> {
    return this.http.get<ScheduleSecurityPatrolDto[]>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.SCHEDULETIME}/schedule?scheduleTimeId=${id}`
    );
  }

  getSecurityPatrolByScheduleTimeId(id: number): Observable<any> {
    return this.http.get<ScheduleTimeDto>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.SCHEDULETIME}/scheduletime?scheduleTimeId=${id}`
    );
  }

}
