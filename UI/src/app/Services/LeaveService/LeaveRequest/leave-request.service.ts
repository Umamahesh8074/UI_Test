import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { DELETELEAVEREQUEST,  GETALLLEAVEREQUESTBYID, GETALLLEAVEREQUESTBYMANAGERID, GETALLLEAVEREQUESTBYUSERID, GETLEAVESBYORGANIZATIONID, GETTEAMLEAVEREQUESTSBYMANAGERID, GETTEAMLEAVESMANAGERID, SAVELEAVEREQUEST, UPDATELEAVEREQUEST } from 'src/app/Apis/LeaveApis/LeaveRequest';
import { LeaveRequest } from 'src/app/Models/Leave/LeaveRequest';
import { LeaveRequestDto } from 'src/app/Models/Leave/LeaveRequestDto';
import { LeaveRequestPageWithReporteeCount } from 'src/app/Models/Leave/LeaveRequestPageWithCount';
import { Page } from 'src/app/Models/User/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LeaveRequestService {

  private _refreshRequired = new Subject<void>();

  get refreshRequired() {
    return this._refreshRequired;
  }

  constructor(private http: HttpClient) {}

  private _refresh = new Subject<void>();

  get refresh() {
    return this._refresh;
  }

  addLeaveRequest(leaveRequest: any): Observable<any> {
    return this.http.post<any>(
      `${environment.leaveBaseUrl}${SAVELEAVEREQUEST}`,
      leaveRequest
    );
  }

  editLeaveRequest(leaveRequest: any): Observable<any> {
    return this.http.put(
      `${environment.leaveBaseUrl}${UPDATELEAVEREQUEST}`,
      leaveRequest
    );
  }

  getLeaveRequestById(id: number): Observable<LeaveRequest> {
    return this.http.get<LeaveRequest>(
      `${environment.leaveBaseUrl}${GETALLLEAVEREQUESTBYID}/${id}`
    );
  }

  deleteLeaveRequest(id: number): Observable<string> {
    return this.http
      .delete<string>(
        `${environment.leaveBaseUrl}${DELETELEAVEREQUEST}/${id}`
      )
      .pipe(tap(() => this._refresh.next()));
  }

  getAllLeaveRequest(date: string, page: number, size: number): Observable<Page<LeaveRequest>> {
    return this.http.get<Page<LeaveRequest>>(
      `${environment.leaveBaseUrl}${GETALLLEAVEREQUESTBYUSERID}?date=${date}&page=${page}&size=${size}`
    );
  }

  getLeaveRequestsByUserId(userid: number,page: number, size: number): Observable<LeaveRequestPageWithReporteeCount> {
    return this.http.get<LeaveRequestPageWithReporteeCount>(
      `${environment.leaveBaseUrl}${GETALLLEAVEREQUESTBYUSERID}?userId=${userid}&page=${page}&size=${size}`
    );
  }


  
  getTeamLeaveRequestsByManagerId(userName: string, managerId: number, page: number, size: number): Observable<LeaveRequestPageWithReporteeCount> {
    let url = `${environment.leaveBaseUrl}${GETTEAMLEAVEREQUESTSBYMANAGERID}?userId=${managerId}&page=${page}&size=${size}`;
    if (userName) {
        url += `&userName=${userName}`;
    }
    return this.http.get<LeaveRequestPageWithReporteeCount>(url);
}


  getTeamLeavesByManagerId(userId: number): Observable<LeaveRequestDto[]> {
    return this.http.get<LeaveRequestDto[]>(
      `${environment.leaveBaseUrl}${GETTEAMLEAVESMANAGERID}?userId=${userId}`
    );
  }

  getleavesbyorganizationid(organizationId: number, userName: string, page: number, size: number, dateRange: any, startDate: any, endDate: any, status: any):Observable<LeaveRequestDto[]>
  {
    if (dateRange == undefined) dateRange = 0;
    if (startDate == undefined) startDate = '';
    if (endDate == undefined) endDate = '';
    userName =  '';
    return this.http.get<LeaveRequestDto[]>(
      `${environment.leaveBaseUrl}${GETLEAVESBYORGANIZATIONID}?organizationId=${organizationId}&userName=${userName}&page=${page}&size=${size}&range=${dateRange}&startDate=${startDate}&endDate=${endDate}&attendanceStatus=${status}`
    );
  
    
  }
}
