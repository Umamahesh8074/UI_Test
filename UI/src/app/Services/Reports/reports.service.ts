import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { ControllerPaths } from 'src/app/Apis/ControllerPaths/ControllerPaths';
import { Page, Reports } from 'src/app/Models/Reports/reports';


import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  constructor(private http: HttpClient) {}

  private _refreshRequired = new Subject<void>();

  get refreshRequired() {
    return this._refreshRequired;
  }

  //get all reportss to display reports in front end
  // getAllReports(size: any, index: any): Observable<Page<Reports>> {
  //   return this.http.get<Page<Reports>>(
  //     `${environment.baseUrl}${ControllerPaths.REPORTS}/all/${index}/${size}`
  //   );
  // }

  //adding reports
  addReports(reports: any): Observable<any> {
    console.log(reports);
    return this.http.post<any>(
      `${environment.facilitymanagementBaseUrl}${ControllerPaths.REPORTS}/save`,
      reports
    );
  }


  deleteReports(reportsId: number): Observable<string> {
    console.log(reportsId);
    return this.http.delete<string>(
      `${environment.facilitymanagementBaseUrl}${ControllerPaths.REPORTS}/${reportsId}`
    ).pipe(
      tap(() => {
        this._refreshRequired.next(); // Emit refresh event
      })
    );
  }

  //update reports
  updateReports(reports: any): Observable<any> {
    console.log(reports);
    console.log(reports);
    return this.http.put<any>(
      `${environment.facilitymanagementBaseUrl}${ControllerPaths.REPORTS}/update`,
      reports
    );
  }

  //getting filter data based on reports name
  // event,this.pageIndex,this.pageSize
  // http://localhost:9000/api/user/reports/reportss?reportsName=Users&page=0&size=10
  getAllReports( reportsName: string,page: any,size: any) {
    console.log(reportsName,page,size);
    return this.http.get<Page<Reports>>(
      `${environment.facilitymanagementBaseUrl}${ControllerPaths.REPORTS}/reportss?reportsName=${reportsName}&page=${page}&size=${size}`
    );
  }
}
