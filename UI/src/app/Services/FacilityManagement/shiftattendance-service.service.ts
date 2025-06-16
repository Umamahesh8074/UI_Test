import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, Subject, tap } from 'rxjs';

import { Page } from 'src/app/Models/CommanModel/Page';

//import { LeadSource } from 'src/app/Models/Presales/leadsource';
import { Attendance } from 'src/app/Models/Facility Management/Attendance';
import { User } from 'src/app/Models/User/User';
import { environment } from 'src/environments/environment';
import { GETALLUSERS } from 'src/app/Apis/UserApis/User';
import { Qrgenerator } from 'src/app/Models/Qrgenerator/qrgenerator';
import { ControllerPaths } from 'src/app/Apis/ControllerPaths/ControllerPaths';
import { LocationDto } from 'src/app/Models/Facility Management/Location';
import { AttendanceDto } from 'src/app/Models/Facility Management/AttendanceDto';
import {
  AttendanceCountDto,
  AttendanceReportDto,
} from 'src/app/Models/Facility Management/AttendanceReport';
import { ProjectService } from '../ProjectService/Project/project.service';
import { AdditionalShift } from 'src/app/Models/User/additionalShift';
import { AdditionalShiftDto } from 'src/app/Models/User/AdditionalShiftDto';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';
import { Project } from 'src/app/Models/Project/project';
import { GETALLPROJECTBYORGID } from 'src/app/Apis/ProjectApis/Project';
import { FingerprintUserMappingBean } from 'src/app/Models/Facility Management/FingerprintUserMapping';
import { fingerPrintUserDto } from 'src/app/Models/Facility Management/fingerPrintUserDto';
export const GET_NOTIFICATIONS = ControllerPaths.NOTIFICATION + '/login/user';

@Injectable({
  providedIn: 'root',
})
export class ShiftAttendanceService {
  constructor(
    private http: HttpClient,
    private projectService: ProjectService
  ) {}
  // url = '/api/facility-management/attendance';
  private _refreshRequired = new Subject<void>();

  get refreshRequired() {
    return this._refreshRequired;
  }
  // getAllUserName(UserName?: string | '', page?: number, size?: number) {
  //   page = page !== undefined ? page : 0;
  //   size = size !== undefined ? size : 0;
  //   UserName = UserName ? UserName : '';
  //   return this.http.get<Page<Attendance>>`${environment.facilitymanagementBaseUrl}/${ControllerPaths.SHIFTATTENDANCE}`;
  // }
  //`${this.fetchUrl}/${employeeId}/${accountId}/${weekStartDate}/${weekEndDate}`;
  //`${this.submitUrl}?employeeId=${employeeId}&accountId=${accountId}&weekStartDate=${weekStartDate}`;
  fetchUser(page?: number, size?: number): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.SHIFTATTENDANCE}/getallAttendance?page=${page}&size=${size}`
    );
  }

  addAttendance(attendance: Attendance): Observable<Attendance> {
    console.log(attendance);
    return this.http.post<Attendance>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.SHIFTATTENDANCE}/save`,
      attendance
    );
  }

  deleteAttendance(id: number): Observable<string> {
    console.log(id);
    return this.http
      .delete<string>(
        `${environment.facilitymanagementBaseUrl}/${ControllerPaths.SHIFTATTENDANCE}/${id}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next(); // Emit refresh event
        })
      );
  }

  // //update menu
  updateAttendance(attendance: any): Observable<any> {
    console.log(attendance);
    return this.http.put<any>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.SHIFTATTENDANCE}/update`,
      attendance
    );
  }

  getAllUser(loginUserId: number, userName: string): Observable<any> {
    return this.http.get<any>(
      `${environment.userBaseUrl}${ControllerPaths.USER}/fetchAllTeamMembers?managerId=${loginUserId}&userName=${userName}`
    );
  }
  getAllQrgenerator(): Observable<Qrgenerator[]> {
    return this.http.get<Qrgenerator[]>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.QRGENERATOR}/getAllQrGenerators`
    );
  }
  getAllAttendance(
    userName: string,
    userId: number,
    page: any,
    size: any,
    rangeOfDays?: any,
    startDate?: any,
    endDate?: any,
    status?: string,
    shiftIds?: number[],
    locationId?: number,
    isExportExcel?: boolean,
    month?: string,
    selectedYearDisplay?: string
  ) {
    console.log(rangeOfDays, 'getting attendance');
    if (rangeOfDays == undefined) rangeOfDays = 0;
    if (startDate == undefined) startDate = '';
    if (endDate == undefined) endDate = '';
    userName = userName || '';
    shiftIds = shiftIds || [0];
    month = month || '';
    selectedYearDisplay = selectedYearDisplay || '';
    const roleId = 0;
    console.log(userName, page, size, userId, shiftIds);
    return this.http.get<any>(
      `${environment.facilitymanagementBaseUrl}${ControllerPaths.SHIFTATTENDANCE}/allAttendance?userName=${userName}&userId=${userId}&page=${page}&size=${size}&range=${rangeOfDays}&startDate=${startDate}&endDate=${endDate}&attendanceStatus=${status}&shiftIds=${shiftIds}&locationId=${locationId}&roleId=${roleId}&isExportExcel=${isExportExcel}&month=${month}&year=${selectedYearDisplay}`,
      {
        responseType: isExportExcel ? ('blob' as 'json') : 'json',
      }
    );
  }

  getQrgeneratorLocation(userId: number): Observable<LocationDto[]> {
    return this.http.get<LocationDto[]>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.QRGENERATOR}/getAllQrGeneratorsbyid?userId=${userId}&type=SPA`
    );
  }

  getAttendanceById(id: any) {
    return this.http
      .get<Attendance>(
        `${environment.facilitymanagementBaseUrl}/${ControllerPaths.SHIFTATTENDANCE}/${id}`
      )
      .pipe(tap((data) => console.log('Data fetched from backend:', data)));
  }

  getAttendanceReport(
    userName: string,
    selectlocationId: number,
    userId: number,
    roleId: number,
    page: number,
    pageSize: number,
    rangeOfDays?: any,
    startDate?: any,
    endDate?: any
  ) {
    if (rangeOfDays == undefined) rangeOfDays = 0;
    if (startDate == undefined) startDate = '';
    if (endDate == undefined) endDate = '';
    return this.http.get<Page<AttendanceReportDto[]>>(
      `${environment.facilitymanagementBaseUrl}${ControllerPaths.SHIFTATTENDANCE}/allReport?userId=${userId}&locationId=${selectlocationId}&roleId=${roleId}&page=${page}&pageSize=${pageSize}&userName=${userName}&range=${rangeOfDays}&startDate=${startDate}&endDate=${endDate}`
    );
  }

  getNotifications(): Observable<any> {
    return this.http.get<any>(
      `${environment.projectBaseUrl}${GET_NOTIFICATIONS}`
    );
  }

  getPresent(
    userId?: number,
    organizationId?: number,
    rangeOfDays?: number,
    customStartDate?: any,
    customEndDate?: any,
    shiftIds?: number[],
    locationId?: number
  ) {
    if (rangeOfDays == undefined) rangeOfDays = 0;
    if (customStartDate == undefined) customStartDate = '';

    if (customEndDate == undefined) customEndDate = '';
    shiftIds = shiftIds || [0];
    return this.http.get<AttendanceCountDto[]>(
      `${environment.facilitymanagementBaseUrl}${ControllerPaths.SHIFTATTENDANCE}/dashboard/attendance/data?userId=${userId}&organizationId=${organizationId}&range=${rangeOfDays}&startDate=${customStartDate}&endDate=${customEndDate}&shiftIds=${shiftIds}&locationId=${locationId}`
    );
  }

  getMyAttendanceReport(
    userId: number,

    page: number,
    pageSize: number,
    rangeOfDays?: any,
    startDate?: any,
    endDate?: any
  ) {
    if (rangeOfDays == undefined) rangeOfDays = 0;
    if (startDate == undefined) startDate = '';
    if (endDate == undefined) endDate = '';
    return this.http.get<Page<AttendanceReportDto[]>>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.SHIFTATTENDANCE}/myattendancereport?userId=${userId}&page=${page}&pageSize=${pageSize}&range=${rangeOfDays}&startDate=${startDate}&endDate=${endDate}`
    );
  }

  fetchProjects(projectName: string, organizationId?: any) {
    return this.projectService.getProjects(projectName, organizationId);
  }

  addAdditionalShift(
    additionalShift: AdditionalShift
  ): Observable<AdditionalShift> {
    console.log(additionalShift);
    return this.http.post<AdditionalShift>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.ADDITIONALSHIFT}/save`,
      additionalShift
    );
  }
  updateAdditionalShift(additionalShift: any): Observable<any> {
    console.log(additionalShift);

    return this.http.put<any>(
      `${environment.facilitymanagementBaseUrl}${ControllerPaths.ADDITIONALSHIFT}/update`,
      additionalShift
    );
  }

  getAllAdditionalShift(
    userName: string,
    userId: number,
    page: any,
    size: any,
    rangeOfDays?: any,
    startDate?: any,
    endDate?: any,
    status?: string
  ) {
    console.log(rangeOfDays, 'getting attendance');
    if (rangeOfDays == undefined) rangeOfDays = 0;
    if (startDate == undefined) startDate = '';
    if (endDate == undefined) endDate = '';
    userName = userName || '';
    console.log(userName, page, size, userId);

    return this.http.get<Page<AdditionalShiftDto[]>>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.ADDITIONALSHIFT}/getallAdditionalShifts?userName=${userName}&userId=${userId}&page=${page}&size=${size}&range=${rangeOfDays}&startDate=${startDate}&endDate=${endDate}&status=${status}`
    );
  }

  getShiftForUser(
    userId: number,
    attendanceDate?: any
  ): Observable<CommonReferenceDetails[]> {
    if (attendanceDate == undefined) attendanceDate = '';
    return this.http.get<CommonReferenceDetails[]>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.ADDITIONALSHIFT}/getShiftByUserAndDate?userId=${userId}&attendanceDate=${attendanceDate}`
    );
  }

  getAdditionalShiftById(id: number): Observable<any> {
    return this.http.get<any>(
      `${environment.facilitymanagementBaseUrl}${ControllerPaths.ADDITIONALSHIFT}/${id}`
    );
  }

  deleteAdditionalShiftById(id: number): Observable<string> {
    console.log(id);
    return this.http
      .delete<string>(
        `${environment.facilitymanagementBaseUrl}${ControllerPaths.ADDITIONALSHIFT}/${id}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next(); // Emit refresh event
        })
      );
  }

  getProjectsByOrgId(
    organizationId: number,
    projectName?: string
  ): Observable<Project[]> {
    return this.http.get<Project[]>(
      `${environment.projectBaseUrl}${GETALLPROJECTBYORGID}?organizationId=${organizationId}&projectName=${projectName}`
    );
  }
  getLocationsByOrgId(organizationId: number): Observable<Qrgenerator[]> {
    return this.http.get<Qrgenerator[]>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.QRGENERATOR}/getQrByOrganizationId?organizationId=${organizationId}`
    );
  }
  // getQrgeneratorById(orgId: number,projectId: any): Observable<Qrgenerator[]> {

  //   if (projectId==0)
  //   {
  //     projectId='';
  //   }
  //   return this.http.get<Qrgenerator[]>(
  //     `${environment.facilitymanagementBaseUrl}/${ControllerPaths.QRGENERATOR}/getLocationForAssigningFingerPrint?&orgId=${orgId}&projectId=${projectId}`
  //     );
  // }

  getNextFingerPrintNumber(locationId: number): Observable<any> {
    return this.http.get<any>(
      `${environment.facilitymanagementBaseUrl}${ControllerPaths.FINGERPRINTUSERMAPPING}/getByLocationId?&locationId=${locationId}`
    );
  }

  addFingerprintUserMapping(
    fingerPringUserMapping: FingerprintUserMappingBean
  ): Observable<FingerprintUserMappingBean> {
    return this.http.post<FingerprintUserMappingBean>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.FINGERPRINTUSERMAPPING}/save`,
      fingerPringUserMapping
    );
  }

  fetchAllFingerPrints(
    page: number,
    size: number,
    userName: string,
    locationId?: number
  ) {
    userName = userName || '';
    return this.http.get<Page<fingerPrintUserDto[]>>(
      `${environment.facilitymanagementBaseUrl}${ControllerPaths.FINGERPRINTUSERMAPPING}/getall?page=${page}&size=${size}&userName=${userName}&location=${locationId}`
    );
  }

  getFingerPrintUserById(id: number) {
    return this.http.get<FingerprintUserMappingBean>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.FINGERPRINTUSERMAPPING}/${id}`
    );
  }
  updateFingerprint(fingerprintUser: any): Observable<any> {
    console.log(fingerprintUser);
    return this.http.put<any>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.FINGERPRINTUSERMAPPING}/update`,
      fingerprintUser
    );
  }
}
