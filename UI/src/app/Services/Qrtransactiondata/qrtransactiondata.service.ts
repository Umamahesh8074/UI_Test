import { environment } from 'src/environments/environment';


import { ControllerPaths } from './../../Apis/ControllerPaths/ControllerPaths';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { Page, Qrtransactiondata } from '../../Models/Qrtransactiondata/qrtransactiondata';

@Injectable({
  providedIn: 'root'
})
export class QrtransactiondataService {
  constructor(private http: HttpClient) {}

  private _refreshRequired = new Subject<void>();

  get refreshRequired() {
    return this._refreshRequired;
  }

  //get all qrtransactiondatas to display qrtransactiondata in front end
  // getAllQrtransactiondata(size: any, index: any): Observable<Page<Qrtransactiondata>> {
  //   return this.http.get<Page<Qrtransactiondata>>(
  //     `${environment.baseUrl}${ControllerPaths.QRTRANSACTIONDATA}/all/${index}/${size}`
  //   );
  // }

  //adding qrtransactiondata
  addQrtransactiondata(qrtransactiondata: any): Observable<any> {
    console.log(qrtransactiondata);
    return this.http.post<any>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.QRTRANSACTIONDATA}/qrtransaction/save`,
      qrtransactiondata
    );
  }


  deleteQrtransactiondata(id: number): Observable<string> {
    console.log(id);
    return this.http.delete<string>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.QRTRANSACTIONDATA}/qrtransaction/${id}`
    ).pipe(
      tap(() => {
        this._refreshRequired.next(); // Emit refresh event
      })
    );
  }

  //update qrtransactiondata
  updateQrtransactiondata(qrtransactiondata: any): Observable<any> {
    console.log(qrtransactiondata);
    console.log(qrtransactiondata);
    return this.http.put<any>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.QRTRANSACTIONDATA}/qrtransaction/update`,
      qrtransactiondata
    );
  }

  //getting filter data based on qrtransactiondata name
  // event,this.pageIndex,this.pageSize
  // http://localhost:9000/api/user/qrtransactiondata/qrtransactiondatas?qrtransactiondataName=Users&page=0&size=10

  getAllQrtransactiondata( qrtransactiondataName: string,page: any,size: any,orgId:any) {
    console.log(qrtransactiondataName,page,size,orgId);
    return this.http.get<Page<Qrtransactiondata>>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.QRTRANSACTIONDATA}/getAll?page=${page}&size=${size}&qrTransactionDataName=${qrtransactiondataName}&organizationId=${orgId}`
    );
  }

  generateExcel(projectName:string): Observable<Blob> {
    // Include responseType: 'blob' in the options object
    return this.http.get(`${environment.facilitymanagementBaseUrl}/${ControllerPaths.QRTRANSACTIONDATA}/generate?projectName=${projectName}`,{ responseType: 'blob' });
}

}
