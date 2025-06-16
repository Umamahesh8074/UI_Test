import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { Page } from 'src/app/Models/User/User';
import { environment } from 'src/environments/environment';

import {
  IStandInUser,
  IStandInUserDto,
} from 'src/app/Models/WorkOrder/StandInUser';
import {
  GETALL_STAND_IN_USER,
  GETALL_STAND_IN_USER_SPEC,
  STAND_IN_USER_BY_ID,
  SAVE_STAND_IN_USER,
  UPDATE_STAND_IN_USER,
} from 'src/app/Apis/WorkOrderApis/StandInUser';

@Injectable({
  providedIn: 'root',
})
export class StandInUserService {
  constructor(private http: HttpClient) {}
  private _refreshRequired = new Subject<void>();
  public refreshRequired = this._refreshRequired.asObservable();

  getAllStandInUsers(
    userName: string,

    page: number,
    size: number
  ): Observable<Page<IStandInUserDto>> {
    return this.http.get<Page<IStandInUserDto>>(
      `${environment.procurementBaseUrl}${GETALL_STAND_IN_USER_SPEC}?userName=${userName}&page=${page}&size=${size}`
    );
  }

  addStandInUser(StandInUser: IStandInUser): Observable<string> {
    console.log(StandInUser);
    return this.http.post<string>(
      `${environment.procurementBaseUrl}${SAVE_STAND_IN_USER}`,
      StandInUser
    );
  }

  getStandInUserById(StandInUserId: number): Observable<IStandInUser> {
    return this.http.get<IStandInUser>(
      `${environment.procurementBaseUrl}${STAND_IN_USER_BY_ID}/${StandInUserId}`
    );
  }

  updateStandInUser(StandInUser: IStandInUser): Observable<string> {
    return this.http.put<string>(
      `${environment.procurementBaseUrl}${UPDATE_STAND_IN_USER}`,
      StandInUser
    );
  }

  inActivateStandInUser(StandInUserId: number): Observable<string> {
    return this.http
      .delete<string>(
        `${environment.procurementBaseUrl}${STAND_IN_USER_BY_ID}/${StandInUserId}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next(); // Emit refresh event
        })
      );
  }

  getAllStandInUserWithOutPage(
    id: number,
    managerId: number,
    managerName: string,
    userId: number,
    userName: string,
    status: string
  ): Observable<IStandInUserDto[]> {
    id = id === undefined ? 0 : id;
    managerId = managerId === undefined ? 0 : managerId;
    managerName = managerName === undefined ? '' : managerName;
    userId = userId === undefined ? 0 : userId;
    userName = userName === undefined ? '' : userName;
    status = status === undefined ? '' : status;

    return this.http.get<IStandInUserDto[]>(
      `${environment.procurementBaseUrl}${GETALL_STAND_IN_USER}?id=${id}&managerId=${managerId}&managerName=${managerName}&userId=${userId}&userName=${userName}&status=${status}`
    );
  }
}
