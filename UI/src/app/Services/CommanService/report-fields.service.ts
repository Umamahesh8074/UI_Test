import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { ReportFiledControllerPath } from 'src/app/Apis/commonApis/ReportsControllerPaths';
import {
  IReportField,
  IReportFieldDto,
} from 'src/app/Models/CommanModel/ReportField';
import { LeadSource } from 'src/app/Models/Presales/leadsource';
import { Page } from 'src/app/Models/User/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportFieldsService {
  constructor(private http: HttpClient) {}

  private _refreshRequired = new Subject<void>();

  get refreshRequired() {
    return this._refreshRequired;
  }
  getAllReportFields(
    reportFieldName?: string | '',
    page?: number,
    size?: number
  ): Observable<Page<IReportFieldDto[]>> {
    page = page !== undefined ? page : 0;
    size = size !== undefined ? size : 0;
    reportFieldName = reportFieldName ? reportFieldName : '';
    return this.http.get<Page<IReportFieldDto[]>>(
      `${environment.leadBaseUrl}${ReportFiledControllerPath.ALL}?reportFieldName=${reportFieldName}&page=${page}&size=${size}`
    );
  }
  fetchAllReportFields(isAdding: boolean): Observable<IReportField[]> {
    return this.http.get<IReportField[]>(
      `${environment.leadBaseUrl}${ReportFiledControllerPath.GET_ALL}/${isAdding}`
    );
  }

  addReportField(report: IReportField): Observable<any> {
    console.log(report);
    return this.http
      .post<any>(
        `${environment.leadBaseUrl}${ReportFiledControllerPath.SAVE}`,
        report
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next(); // Emit refresh event
        })
      );
  }

  deleteReportField(report: IReportField): Observable<string> {
    console.log(report);
    return this.http
      .put<any>(
        `${environment.leadBaseUrl}${ReportFiledControllerPath.UPDATE_STATUS}`,
        report
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next(); // Emit refresh event
        })
      );
  }

  //update menu
  updateReport(report: IReportField): Observable<any> {
    console.log(report);
    return this.http
      .put<any>(
        `${environment.leadBaseUrl}${ReportFiledControllerPath.UPDATE}`,
        report
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next(); // Emit refresh event
        })
      );
  }
  getReportFieldById(reportFieldId: number) {
    return this.http.get<IReportField>(
      `${environment.leadBaseUrl}${ReportFiledControllerPath.GET_BY_ID}/${reportFieldId}`
    );
  }
}
