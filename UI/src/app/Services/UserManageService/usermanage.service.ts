import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  DELETEUSERMANAGEBYID,
  GETALLUSERMANAGEDTO,
  GETALLUSERMANAGES,
  GETMANAGEBYUSERID,
  GETPROJECTS,
  GETUSERMANAGEBYID,
  GETUSERS,
  SAVEUSERMANAGE,
  SAVEUSERMANAGETEAMS,
  UPDATEUSERMANAGE,
} from 'src/app/Apis/UserManageApis/usermanageapis';
import { IUser, Page } from 'src/app/Models/User/User';
import { IUserManageDto, UserManage } from 'src/app/Models/User/UserManage';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsermanageService {
  constructor(private http: HttpClient) {}

  getUserManages(
    referenceId: any,
    referenceKey: any,
    organizationId: any,
    projectId?: any,
    roleId?: any
  ): Observable<IUserManageDto[]> {
    referenceId = referenceId || '';
    referenceKey = referenceKey || '';
    (organizationId = organizationId || ''), (projectId = projectId || '');
    roleId = roleId || '';
    return this.http.get<IUserManageDto[]>(
      `${environment.leadBaseUrl}${GETALLUSERMANAGES}/${referenceId}?referenceKey=${referenceKey}&organizationId=${organizationId}&projectId=${projectId}`
    );
  }

  saveUserManageTeams(
    projectSalesTeams: IUserManageDto[],
    referenceId: any,
    referenceKey: any,
    projectId: any
  ): Observable<any> {
    return this.http.post(
      `${environment.leadBaseUrl}${SAVEUSERMANAGETEAMS}/${referenceId}?referenceKey=${referenceKey}&projectId=${projectId}`,
      projectSalesTeams
    );
  }

  getUserManageDto(
    page: number,
    size: number,
    referenceKey: number,
    projectName?: any,
    userName?: any
  ): Observable<Page<IUserManageDto[]>> {
    projectName = projectName || '';
    userName = userName || '';
    return this.http.get<Page<IUserManageDto[]>>(
      `${environment.leadBaseUrl}${GETALLUSERMANAGEDTO}/${referenceKey}?projectName=${projectName}&userName=${userName}&page=${page}&size=${size}`
    );
  }

  save(projectSalesTeam: any, referenceKey: any): Observable<any> {
    return this.http.post(
      `${environment.leadBaseUrl}${SAVEUSERMANAGE}/${referenceKey}`,
      projectSalesTeam
    );
  }

  update(projectSalesTeam: any, referenceKey: any): Observable<any> {
    return this.http.put(
      `${environment.leadBaseUrl}${UPDATEUSERMANAGE}/${referenceKey}`,
      projectSalesTeam
    );
  }

  getById(id: any): Observable<UserManage> {
    return this.http.get<UserManage>(
      `${environment.leadBaseUrl}${GETUSERMANAGEBYID}/${id}`
    );
  }

  deleteById(id: any): Observable<any> {
    return this.http.delete<any>(
      `${environment.leadBaseUrl}${DELETEUSERMANAGEBYID}/${id}`
    );
  }
  getUsers(
    referenceKey: any,
    organizationId: any,
    projectId: any,
    userName?: any,
    referenceId?: any
  ): Observable<any> {
    projectId = projectId || '';
    userName = userName || '';
    referenceId = referenceId || '';
    return this.http.get<any>(
      `${environment.leadBaseUrl}${GETUSERS}/${referenceKey}?organizationId=${organizationId}&projectId=${projectId}&userName=${userName}&referenceId=${referenceId}`
    );
  }

  getUserManage(userId: any): Observable<any> {
    userId = userId || '';
    return this.http.get<any>(
      `${environment.leadBaseUrl}${GETMANAGEBYUSERID}/${userId}`
    );
  }

  fetchProjectsBasedOnUserId(
    userId: any,
    typeCommonReferenceDetailsId: number,
    status?: string,
    selectedUserManageIds?: any,
    projectIds?: any
  ): Observable<IUserManageDto[]> {
    userId = userId || '';
    if (selectedUserManageIds === undefined || selectedUserManageIds === 0)
      selectedUserManageIds = '';
    if (projectIds === undefined || projectIds === 0) projectIds = '';
    return this.http.get<IUserManageDto[]>(
      `${environment.leadBaseUrl}${GETPROJECTS}?userId=${userId}&typeCommonReferenceDetailsId=${typeCommonReferenceDetailsId}&userMangeIds=${selectedUserManageIds}&projectIds=${projectIds}&status=${status}`
    );
  }
}
