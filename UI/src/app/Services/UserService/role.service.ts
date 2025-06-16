
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { ControllerPaths } from 'src/app/Apis/ControllerPaths/ControllerPaths';

import {
  DELETEROLE,
  FETCHALLROLES,
  GETALLROLES,
  SAVEROLE,
  UPDATEROLE,
} from 'src/app/Apis/UserApis/Role';

import { Page } from 'src/app/Models/CommanModel/Page';

import { Role } from 'src/app/Models/User/Role';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RoleService {

  fetchUserRole(roleId: number) {
    return this.http.get<Role>(
      ` ${environment.userBaseUrl}${ControllerPaths.ROLE}/${roleId}`
    );
  }
  constructor(private http: HttpClient) {}

  private _refreshRequired = new Subject<void>();

  get refreshRequired() {
    return this._refreshRequired;
  }

  //adding role
  addRole(role: any, organizationId: any): Observable<any> {
    console.log(role);

    return this.http.post<any>(
      `${environment.userBaseUrl}${SAVEROLE}/${organizationId}`,
      role
    );
  }

  //delete role
  deleteRole(roleId: number): Observable<string> {
    console.log(roleId);
    return this.http
      .delete<string>(`${environment.userBaseUrl}${DELETEROLE}/${roleId}`)
      .pipe(
        tap(() => {
          this._refreshRequired.next(); // Emit refresh event
        })
      );
  }

  //update role
  updateRole(role: any): Observable<any> {
    console.log(role);
    console.log(role);
    return this.http.put<any>(`${environment.userBaseUrl}${UPDATEROLE}`, role);
  }

  //getting filter data based on role name
  getAllRole(roleName: string, page: any, size: any, organizationId: any) {
    console.log(roleName, page, size);
    return this.http.get<Page<Role>>(
      `${environment.userBaseUrl}${GETALLROLES}?roleName=${roleName}&organizationId=${organizationId}&page=${page}&size=${size}`
    );
  }
  fetchAllRoles(roleName?: string, organizationId?: any): Observable<Role[]> {
    roleName = roleName ? roleName : '';
    return this.http.get<Role[]>(
      `${environment.userBaseUrl}${FETCHALLROLES}?roleName=${roleName}&organizationId=${organizationId}`
    );
  }
}
