import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { PresalesControllerPaths } from 'src/app/Apis/ControllerPaths/ControllerPaths';
import { ReportsControllerPaths } from 'src/app/Apis/commonApis/ReportsControllerPaths';
import { IReports } from 'src/app/Models/CommanModel/Reports';
import { LeadSource } from 'src/app/Models/Presales/leadsource';
import { Page } from 'src/app/Models/User/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private http: HttpClient) {}

  private _refreshRequired = new Subject<void>();

  get refreshRequired() {
    return this._refreshRequired;
  }
  getAllReports(reportName?: string | '', page?: number, size?: number) {
    page = page !== undefined ? page : 0;
    size = size !== undefined ? size : 0;
    reportName = reportName ? reportName : '';
    return this.http.get<Page<IReports>>(
      `${environment.leadBaseUrl}${ReportsControllerPaths.ALL}?reportName=${reportName}&page=${page}&size=${size}`
    );
  }

  fetchAllReports(isAdding: boolean): Observable<IReports[]> {
    return this.http.get<IReports[]>(
      `${environment.leadBaseUrl}${ReportsControllerPaths.GET_ALL}/${isAdding}`
    );
  }

  addReport(report: IReports): Observable<any> {
    console.log(report);
    return this.http
      .post<any>(
        `${environment.leadBaseUrl}${ReportsControllerPaths.SAVE}`,
        report
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next(); // Emit refresh event
        })
      );
  }

  deleteReport(report: IReports): Observable<string> {
    console.log(report);
    return this.http
      .put<any>(
        `${environment.leadBaseUrl}${ReportsControllerPaths.UPDATE_STATUS}`,
        report
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next(); // Emit refresh event
        })
      );
  }

  //update menu
  updateReport(report: IReports): Observable<any> {
    console.log(report);
    return this.http
      .put<any>(
        `${environment.leadBaseUrl}${ReportsControllerPaths.UPDATE}`,
        report
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next(); // Emit refresh event
        })
      );
  }
  getReportById(reportId: number) {
    return this.http.get<IReports>(
      `${environment.leadBaseUrl}${ReportsControllerPaths.GET_BY_ID}/${reportId}`
    );
  }
}
