import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { ControllerPaths } from 'src/app/Apis/ControllerPaths/ControllerPaths';
import { Assets } from 'src/app/Models/Employee/assets';

import { Page } from 'src/app/Models/User/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AssetsService {
  constructor(private http: HttpClient) {}

  private _refreshRequired = new Subject<void>();

  get refreshRequired() {
    return this._refreshRequired;
  }

  //adding client
  addEmployeeAssertsDetails(Assets: any): Observable<any> {
    console.log(Assets);
    return this.http.post<any>(
      `${environment.hrmBaseUrl}${ControllerPaths.ASSETS}/save`,
      Assets
    );
  }

  updateEmployeeAssertsDetails(Assets: any): Observable<any> {
    console.log(Assets);

    return this.http.put<any>(
      `${environment.hrmBaseUrl}${ControllerPaths.ASSETS}/update`,
      Assets
    );
  }

  getAllEmployeeAssertsDetails(assetName: string, assetCategory:string,page: number, size: number) {
    console.log(assetName, page, size);
    if (assetName == undefined || '') assetName = '';
    if (assetCategory == undefined || '') assetCategory = '';
    return this.http.get<Page<Assets>>(
      `${environment.hrmBaseUrl}${ControllerPaths.ASSETS}/getall?assetName=${assetName}&assetCategory=${assetCategory}&page=${page}&size=${size}`
    );
  }
  getAllAssets(assetName:any) {
    if (assetName == undefined || '') assetName = '';
    return this.http.get<Page<Assets>>(
      `${environment.hrmBaseUrl}${ControllerPaths.ASSETS}/getall/data?assetName=${assetName}`
    );
  }
  deleteEmployeeAssertsDetails(id: number): Observable<string> {
    console.log(id);
    return this.http
      .delete<string>(
        `${environment.hrmBaseUrl}${ControllerPaths.ASSETS}/${id}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next(); // Emit refresh event
        })
      );
  }

  getEmployeeAssertsDetailsById(id: number): Observable<any> {
    return this.http.get<any>(
      `${environment.hrmBaseUrl}${ControllerPaths.ASSETS}/${id}`
    );
  }
}
