import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { ExcelMappingControllerPath } from 'src/app/Apis/commonApis/ReportsControllerPaths';
import {
  IExcelMapping,
  IExcelMappingDto,
} from 'src/app/Models/CommanModel/excelMapping';

import { Page } from 'src/app/Models/User/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ExcelMappingService {
  constructor(private http: HttpClient) {}

  private _refreshRequired = new Subject<void>();

  get refreshRequired() {
    return this._refreshRequired;
  }
  getAllExcelMappings(
    expectedHeader?: string | '',
    page?: number,
    size?: number
  ): Observable<Page<IExcelMappingDto>> {
    page = page !== undefined ? page : 0;
    size = size !== undefined ? size : 0;
    expectedHeader = expectedHeader ? expectedHeader : '';
    return this.http.get<Page<IExcelMappingDto>>(
      `${environment.leadBaseUrl}${ExcelMappingControllerPath.ALL}?expectedHeader=${expectedHeader}&page=${page}&size=${size}`
    );
  }

  addExcelMapping(excelMapping: IExcelMapping): Observable<any> {
    console.log(excelMapping);
    return this.http
      .post<any>(
        `${environment.leadBaseUrl}${ExcelMappingControllerPath.SAVE}`,
        excelMapping
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next(); // Emit refresh event
        })
      );
  }

  deleteExcelMapping(excelMapping: IExcelMapping): Observable<string> {
    console.log(excelMapping);
    return this.http
      .put<any>(
        `${environment.leadBaseUrl}${ExcelMappingControllerPath.UPDATE_STATUS}`,
        excelMapping
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next(); // Emit refresh event
        })
      );
  }

  //update menu
  updateExcelMapping(excelMapping: IExcelMapping): Observable<any> {
    console.log(excelMapping);
    return this.http
      .put<any>(
        `${environment.leadBaseUrl}${ExcelMappingControllerPath.UPDATE}`,
        excelMapping
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next(); // Emit refresh event
        })
      );
  }
  getExcelMappingById(reportFieldId: number) {
    return this.http.get<IExcelMapping>(
      `${environment.leadBaseUrl}${ExcelMappingControllerPath.GET_BY_ID}/${reportFieldId}`
    );
  }
}
