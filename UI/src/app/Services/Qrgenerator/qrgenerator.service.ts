import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { ControllerPaths } from '../../Apis/ControllerPaths/ControllerPaths';
import { Qrgenerator } from '../../Models/Qrgenerator/qrgenerator';
import { Page } from '../../Models/Qrtransactiondata/qrtransactiondata';
import { LocationDto } from 'src/app/Models/Facility Management/Location';

@Injectable({
  providedIn: 'root',
})
export class QrgeneratorService {

  constructor(private http: HttpClient) {}

  private _refreshRequired = new Subject<void>();

  get refreshRequired() {
    return this._refreshRequired;
  }

  //get all qrgenerators to display qrgenerator in front end
  // getAllQrgenerator(size: any, index: any): Observable<Page<Qrgenerator>> {
  //   return this.http.get<Page<Qrgenerator>>(
  //     `${environment.baseUrl}${ControllerPaths.QRGENERATOR}/all/${index}/${size}`
  //   );
  // }

  //adding qrgenerator
  addQrgenerator(qrgenerator: any): Observable<any> {
    console.log(qrgenerator);
    return this.http.post<any>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.QRGENERATOR}/save`,
      qrgenerator
    );
  }

  deleteQrgenerator(id: number): Observable<string> {
    return this.http
      .delete<string>(
        `${environment.facilitymanagementBaseUrl}/${ControllerPaths.QRGENERATOR}/delete/${id}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next(); // Emit refresh event
        })
      );
  }

  //update qrgenerator
  updateQrgenerator(qrgenerator: any): Observable<any> {
    console.log(qrgenerator);
    console.log(qrgenerator);
    return this.http.put<any>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.QRGENERATOR}/update/status`,
      qrgenerator
    );
  }

  //getting filter data based on qrgenerator name
  // event,this.pageIndex,this.pageSize
  // http://localhost:9000/api/user/qrgenerator/qrgenerators?qrgeneratorName=Users&page=0&size=10
  getAllQrgenerator(
    projectName: string,
    page: any,
    size: any,
    orgId: any,
    qrgeneratorName?: any,
    projectId?: any
  ) {
    console.log('' + qrgeneratorName);
    qrgeneratorName = qrgeneratorName || '';
    projectId = projectId || '';
    projectName = projectName || '';
    console.log(projectName, page, size, orgId, qrgeneratorName, projectId);
    return this.http.get<Page<Qrgenerator>>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.QRGENERATOR}/getAll?page=${page}&size=${size}&qrGeneratorName=${qrgeneratorName}&orgId=${orgId}&projectId=${projectId}&projectName=${projectName}`
    );
  }

  getQrgeneratorId(id: any) {
    return this.http.get<Qrgenerator>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.QRGENERATOR}/${id}`);

  }
  getQrgeneratorById(orgId: number,projectId: number): Observable<Qrgenerator[]> {
    return this.http.get<Qrgenerator[]>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.QRGENERATOR}/getAll/withoutpage?&orgId=${orgId}&projectId=${projectId}`
      );
  }


  
  getAllLocationsNames(projectId: number, locationName: string,refernceKey:string) {
    console.log(locationName, projectId);
    return this.http.get<Qrgenerator>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.QRGENERATOR}/getall/locations?locationName=${locationName}&projectId=${projectId}&refernceKey=${refernceKey}`
    );
  }

  getAllLoctionByOrgId(organizationId: number) {
    console.log(organizationId);
    return this.http.get<LocationDto[]>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.QRGENERATOR}/getQrByOrganizationId?organizationId=${organizationId}`
    );
  }


}
