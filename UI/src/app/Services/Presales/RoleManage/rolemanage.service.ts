import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  GETALLROLEMANAGE,
  SAVEROLEMANAGE,
} from 'src/app/Apis/RoleManageApis/roleManage';
import { IRoleManageDto } from 'src/app/Models/Presales/RoleManage';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RolemanageService {
  constructor(private http: HttpClient) {}

  getRoleManage(
    projectId: number,
    typeCommonRefernceDetailsId: number,
    organizationId: any
  ): Observable<IRoleManageDto[]> {
    return this.http.get<IRoleManageDto[]>(
      `${environment.leadBaseUrl}${GETALLROLEMANAGE}/${projectId}?typeCommonReferenceDetailsId=${typeCommonRefernceDetailsId}&organizationId=${organizationId}`
    );
  }

  saveProjectSalesTeam(
    projectSalesTeams: IRoleManageDto[],
    projectId: any,
    typeCommonRefernceDetailsId: number
  ): Observable<any> {
    return this.http.post(
      `${environment.leadBaseUrl}${SAVEROLEMANAGE}/${projectId}` +
        '?typeCommonReferenceDetailsId=' +
        typeCommonRefernceDetailsId,
      projectSalesTeams
    );
  }
}
