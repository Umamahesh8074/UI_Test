import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import {
  DELETEWEEKOFF,
  GETALLWEEKOFFBYID,
  GETALLWEEKOFFBYUSERID,
  GETTEAMWEEKOFFBYMANAGERID,
  GETTEAMWEEKOFFMANAGERID,
  SAVEWEEKOFF,
  UPDATEWEEKOFF,
} from 'src/app/Apis/LeaveApis/WeekOff';
import { WeekOff } from 'src/app/Models/Leave/WeekOff';
import { WeekOffDto } from 'src/app/Models/Leave/WeekOffDto';
import { WeekOffPageWithReporteeCount } from 'src/app/Models/Leave/WeekOffPageWithReporteeCount';
import { Page } from 'src/app/Models/User/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WeekOffService {
  private _refreshRequired = new Subject<void>();

  get refreshRequired() {
    return this._refreshRequired;
  }

  constructor(private http: HttpClient) {}

  private _refresh = new Subject<void>();

  get refresh() {
    return this._refresh;
  }

  addWeekOff(weekOff: any, orgId: number): Observable<any> {
    return this.http.post<any>(
      `${environment.leaveBaseUrl}${SAVEWEEKOFF}?orgId=${orgId}`,
      weekOff
    );
  }

  editWeekOff(weekOff: any): Observable<any> {
    return this.http.put(
      `${environment.leaveBaseUrl}${UPDATEWEEKOFF}`,
      weekOff
    );
  }

  getWeekOffById(id: number): Observable<WeekOff> {
    return this.http.get<WeekOff>(
      `${environment.leaveBaseUrl}${GETALLWEEKOFFBYID}/${id}`
    );
  }

  deleteWeekOff(id: number): Observable<string> {
    return this.http
      .delete<string>(`${environment.leaveBaseUrl}${DELETEWEEKOFF}/${id}`)
      .pipe(tap(() => this._refresh.next()));
  }

  getAllWeekOff(
    date: string,
    page: number,
    size: number
  ): Observable<Page<WeekOff>> {
    return this.http.get<Page<WeekOff>>(
      `${environment.leaveBaseUrl}${GETALLWEEKOFFBYUSERID}?date=${date}&page=${page}&size=${size}`
    );
  }

  getWeekOffByUserId(
    userid: number,
    page: number,
    size: number
  ): Observable<WeekOffPageWithReporteeCount> {
    return this.http.get<WeekOffPageWithReporteeCount>(
      `${environment.leaveBaseUrl}${GETALLWEEKOFFBYUSERID}?userId=${userid}&page=${page}&size=${size}`
    );
  }

  getTeamWeekOffByManagerId(
    userName: string,
    managerId: number,
    page: number,
    size: number,
    weekOffDay: string
  ): Observable<WeekOffPageWithReporteeCount> {
    weekOffDay = weekOffDay ?? weekOffDay;
    let url = `${environment.leaveBaseUrl}${GETTEAMWEEKOFFBYMANAGERID}?userId=${managerId}&page=${page}&size=${size}&weekOffDay=${weekOffDay}`;
    if (userName) {
      url += `&userName=${userName}`;
    }
    return this.http.get<WeekOffPageWithReporteeCount>(url);
  }

  getTeamWeekOffsByManagerId(
    userId: number,
    status?: string
  ): Observable<WeekOffDto[]> {
    return this.http.get<WeekOffDto[]>(
      `${environment.leaveBaseUrl}${GETTEAMWEEKOFFMANAGERID}?userId=${userId}&status=${status}`
    );
  }
}
