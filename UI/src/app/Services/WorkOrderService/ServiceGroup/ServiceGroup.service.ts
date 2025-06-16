import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import {
  GET_SERVICE_GROUP_BY_ID,
  GETALL_SERVICE_GROUP,
  GETALL_SERVICE_GROUP_SPEC,
  SAVE_SERVICE_GROUP,
  UPDATE_SERVICE_GROUP,
} from 'src/app/Apis/WorkOrderApis/ServiceGroup';
import { Page } from 'src/app/Models/User/User';
import {
  IServiceGroup,
  ServiceGroup,
  ServiceGroupDto,
} from 'src/app/Models/WorkOrder/ServiceGroup';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ServiceGroupService {
  constructor(private http: HttpClient) {}

  // Define refreshRequired as a Subject
  private _refreshRequired = new Subject<void>();
  public refreshRequired = this._refreshRequired.asObservable();

  addServiceGroup(ServiceGroup: any): Observable<String> {
    console.log(ServiceGroup);
    return this.http.post<String>(
      `${environment.procurementBaseUrl}/${SAVE_SERVICE_GROUP}`,
      ServiceGroup
    );
  }
  updateServiceGroup(ServiceGroup: any): Observable<String> {
    return this.http.put<String>(
      `${environment.procurementBaseUrl}/${UPDATE_SERVICE_GROUP}`,
      ServiceGroup
    );
  }

  getAllServiceGroup(
    serviceGroupName: string,
    serviceCategory: string,
    serviceCode: string,
    serviceGroupDescription: string,
    page: number,
    size: number
  ): Observable<Page<ServiceGroupDto>> {
    console.log(serviceGroupName, page, size);
    return this.http.get<Page<ServiceGroupDto>>(
      `${environment.procurementBaseUrl}${GETALL_SERVICE_GROUP_SPEC}?serviceGroupName=${serviceGroupName}&page=${page}&size=${size}&serviceGroupCategory=${serviceCategory}&serviceGroupCode=${serviceCode}&serviceGroupCodeDescription=${serviceGroupDescription}`
    );
  }

  getAllServiceGroupsWithOutPage(
    serviceGroupCode?: string
  ): Observable<ServiceGroupDto[]> {
    serviceGroupCode = serviceGroupCode === undefined ? '' : serviceGroupCode;
    return this.http.get<ServiceGroupDto[]>(
      `${environment.procurementBaseUrl}${GETALL_SERVICE_GROUP}?serviceGroupCode=${serviceGroupCode}`
    );
  }

  inActivateServiceGroup(serviceGroupId: number): Observable<string> {
    return this.http
      .delete<string>(
        `${environment.procurementBaseUrl}${GET_SERVICE_GROUP_BY_ID}/${serviceGroupId}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next();
        })
      );
  }

  getServiceGroupById(serviceGroupId: number): Observable<IServiceGroup> {
    return this.http.get<IServiceGroup>(
      `${environment.procurementBaseUrl}${GET_SERVICE_GROUP_BY_ID}/${serviceGroupId}`
    );
  }
}
