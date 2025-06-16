import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { DELETEROLEREFERENCEPERMISSIONTYPE, GETALLROLEREFERENCEPERMISSIONTYPE, GETALLROLEREFERENCEPERMISSIONTYPEBYNAME, GETROLEREFERENCEPERMISSIONTYPEBYID, SAVEROLEREFERENCEPERMISSIONTYPE, UPDATEROLEREFERENCEPERMISSIONTYPE } from 'src/app/Apis/UserApis/RoleReferencePermission';
import { RoleReferencePermission } from 'src/app/Models/User/RoleReferencePermission';

import { Page } from 'src/app/Models/User/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RoleReferencePermissionService {


  private _refreshRequired = new Subject<void>();

  get refreshRequired() {
    return this._refreshRequired;
  }
  constructor(private http: HttpClient) {}
  private _refresh = new Subject<void>();

  get refresh() {
    return this._refresh;
  }

  addRoleReferencePermission(RoleReferencePermission: any): Observable<any> {
    console.log(RoleReferencePermission);
    return this.http.post<any>(
      `${environment.userBaseUrl}${SAVEROLEREFERENCEPERMISSIONTYPE}`,
      RoleReferencePermission
    );
  }

  editRoleReferencePermission(RoleReferencePermission: any): Observable<any> {
    return this.http.put(
      `${environment.userBaseUrl}${UPDATEROLEREFERENCEPERMISSIONTYPE}`,
      RoleReferencePermission
    );
  }

  getWorkRoleReferencePermissionById(id: number): Observable<RoleReferencePermission> {
    return this.http.get<RoleReferencePermission>(
      `${environment.userBaseUrl}${GETROLEREFERENCEPERMISSIONTYPEBYID}/${id}`
    );
  }

  deleteRoleReferencePermission(id: number): Observable<string> {
    console.log(id);
    return this.http
      .delete<string>(
        `${environment.userBaseUrl}${DELETEROLEREFERENCEPERMISSIONTYPE}/${id}`
      )
      .pipe(
        tap(() => {
          this._refresh.next(); // Emit refresh event
        })
      );
  }

  getAllRoleReferencePermissionByName(name: string, page: any, size: any) {

    return this.http.get<Page<RoleReferencePermission>>(
      `${environment.userBaseUrl}${GETALLROLEREFERENCEPERMISSIONTYPE}?name=${name}&page=${page}&size=${size}`
    );
  }


}
