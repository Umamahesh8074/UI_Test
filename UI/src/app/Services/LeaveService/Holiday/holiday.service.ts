import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import {
  DELETEHOLIDAY,
  GETALLHOLIDAYBYID,
  GETALLHOLIDAYS,
  SAVEHOLIDAY,
  UPDATEHOLIDAY,
} from 'src/app/Apis/LeaveApis/Holiday';
import { Page } from 'src/app/Models/CommanModel/Page';
import { Holiday } from 'src/app/Models/Leave/Holiday';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HolidayService {
  private _refreshRequired = new Subject<void>();

  get refreshRequired() {
    return this._refreshRequired;
  }

  constructor(private http: HttpClient) {}

  private _refresh = new Subject<void>();

  get refresh() {
    return this._refresh;
  }

  addHoliday(holiday: any): Observable<any> {
    return this.http.post<any>(
      `${environment.leaveBaseUrl}${SAVEHOLIDAY}`,
      holiday
    );
  }

  editHoliday(holiday: any): Observable<any> {
    return this.http.put(
      `${environment.leaveBaseUrl}${UPDATEHOLIDAY}`,
      holiday
    );
  }

  getHolidayById(holidayId: number): Observable<Holiday> {
    return this.http.get<Holiday>(
      `${environment.leaveBaseUrl}${GETALLHOLIDAYBYID}/${holidayId}`
    );
  }

  deleteHoliday(holidayId: number): Observable<string> {
    return this.http
      .delete<string>(
        `${environment.leaveBaseUrl}${DELETEHOLIDAY}/${holidayId}`
      )
      .pipe(tap(() => this._refresh.next()));
  }

  getAllHoliday(date: string, page: number, size: number): Observable<Page<Holiday>> {
    return this.http.get<Page<Holiday>>(
      `${environment.leaveBaseUrl}${GETALLHOLIDAYS}?date=${date}&page=${page}&size=${size}`
    );
  }


  
}
