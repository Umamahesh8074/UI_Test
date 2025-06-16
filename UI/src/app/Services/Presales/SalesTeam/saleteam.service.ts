import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  PresalesControllerPaths,
  salesTeamControllerPaths,
} from 'src/app/Apis/ControllerPaths/ControllerPaths';
import { ISalesTeamDto } from 'src/app/Models/Presales/salesteam';
import { Page } from 'src/app/Models/User/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SaleteamService {
  constructor(private http: HttpClient) {}

  getAllSaleTeam(projectId: number) {
    return this.http.get<any>(
      `${environment.leadBaseUrl}${salesTeamControllerPaths.GETALLSALESTEAM}/${projectId}`
    );
  }

  fetchAllSaleTeam(
    name?: string | '',
    page?: number,
    size?: number,
    projectId?: any,
    headId?:any,
    projectName?:any,
  ) {
    page = page !== undefined ? page : 0;
    size = size !== undefined ? size : 0;
    projectId = projectId || '';
    name = name ? name : '';
    headId=headId||'';
    projectName=projectName||''

    return this.http.get<Page<ISalesTeamDto>>(
      `${environment.leadBaseUrl}${salesTeamControllerPaths.FETCHAll}?name=${name}&page=${page}&size=${size}&headId=${headId}&projectName=${projectName}&projectId=${projectId}`
    );
  }
  getById(id: number) {
    return this.http.get<any>(
      `${environment.leadBaseUrl}${salesTeamControllerPaths.GETBYID}/${id}`
    );
  }
  addSalesTeam(salesTeam: any): Observable<any> {
    return this.http.post<any>(
      `${environment.leadBaseUrl}${salesTeamControllerPaths.SAVE}`,
      salesTeam
    );
  }

  deleteById(id: number): Observable<any> {
    return this.http.delete<any>(
      `${environment.leadBaseUrl}${salesTeamControllerPaths.DELETEBYID}/${id}`
    );
  }

  //update menu
  updateSalesTeam(salesTeam: any): Observable<any> {
    return this.http.put<any>(
      `${environment.leadBaseUrl}${salesTeamControllerPaths.UPDATE}`,
      salesTeam
    );
  }
}
