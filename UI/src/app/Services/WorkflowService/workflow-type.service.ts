import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { DELETEWORKFLOWTYPE, FETCHALLWORKFLOWTYPES, GETALLWORKFLOWTYPE, GETALLWORKFLOWTYPEBYNAME, GETWORKFLOWTYPEBYID, SAVEWORKFLOWTYPE, UPDATEWORKFLOWTYPE } from 'src/app/Apis/WorkflowApis/WorkflowType';
import { Page } from 'src/app/Models/CommanModel/Page';

import { WorkflowType } from 'src/app/Models/Workflow/WorkflowType';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkflowTypeService {
  private _refreshRequired = new Subject<void>();

  get refreshRequired() {
    return this._refreshRequired;
  }
  constructor(private http: HttpClient) { }
  private _refresh = new Subject<void>();

  get refresh() {
    return this._refresh;
  }

  getAllWorkflowTypes(page: number, size: number): Observable<Page<WorkflowType[]>> {
    console.log(page, size);
    return this.http.get<Page<WorkflowType[]>>(
      `${environment.workflowBaseUrl}${GETALLWORKFLOWTYPE}/${page}/${size}`
    );
  }

  

  addWorkflowType(workflowType: any): Observable<any> {
    console.log(workflowType);
    return this.http.post<any>(
      `${environment.workflowBaseUrl}${SAVEWORKFLOWTYPE}`,
      workflowType
    );
  }

  editWorkflowType(workflowType: any): Observable<any> {
    return this.http.put(
      `${environment.workflowBaseUrl}${UPDATEWORKFLOWTYPE}`,
      workflowType
    );
  }

  getWorkflowTypeById(workflowTypeId: number): Observable<WorkflowType> {
    return this.http.get<WorkflowType>(
      `${environment.workflowBaseUrl}${GETWORKFLOWTYPEBYID}/${workflowTypeId}`
    );
  }

  deleteWorkflowType(workflowTypeId: number): Observable<string> {
    console.log(workflowTypeId);
    return this.http
      .delete<string>(
        `${environment.workflowBaseUrl}${DELETEWORKFLOWTYPE}/${workflowTypeId}`
      )
      .pipe(
        tap(() => {
          this._refresh.next();// Emit refresh event
        })
      );
  }


  getAllWorkflowTypeName(workFlowTypeName: string, page: any, size: any) {
    console.log(workFlowTypeName, page, size);
    return this.http.get<Page<WorkflowType>>(
      `${environment.workflowBaseUrl}${GETALLWORKFLOWTYPEBYNAME}?name=${workFlowTypeName}&page=${page}&size=${size}`
    );
  }


  fetchAllWorkflowTypes(workFlowTypeName?: string):Observable<WorkflowType[]> {
    workFlowTypeName = workFlowTypeName? workFlowTypeName : '';
    return this.http.get<WorkflowType[]>(
      `${environment.workflowBaseUrl}${FETCHALLWORKFLOWTYPES}?name=${workFlowTypeName}`
    );
  }
}
