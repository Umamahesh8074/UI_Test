import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import {
  DELETEWORKFLOWSTAGE,
  GETBYWORKFLOWSTAGEID,
  GETWORKFLOWSTAGEBYDTO,
  GETWORKFLOWSTAGEBYTYPE,
  SAVEWORKFLOWSTAGE,
  UPDATEWORKFLOWSTAGE,
} from 'src/app/Apis/WorkflowApis/WorkflowStage';
import { Page } from 'src/app/Models/CommanModel/Page';
import { WorkflowStageDto } from 'src/app/Models/Workflow/WorkflowStageDto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WorkflowstageService {
  constructor(private http: HttpClient) {}

  private _refreshRequired = new Subject<void>();

  get refreshRequired() {
    return this._refreshRequired;
  }
  //get all workflowstages to display workflowstage in front end
  // getAllWorkflowstage(size: any, index: any): Observable<Page<Workflowstage>> {
  //   return this.http.get<Page<Workflowstage>>(
  //     `${environment.baseUrl}${ControllerPaths.WORKFLOWSTAGE}/all/${index}/${size}`
  //   );
  // }

  //adding workflowstage
  addWorkflowstage(workflowstage: any): Observable<any> {
    console.log(workflowstage);
    return this.http.post<any>(
      `${environment.workflowBaseUrl}${SAVEWORKFLOWSTAGE}`,
      workflowstage
    );
  }

  deleteWorkflowstage(workflowStageId: number): Observable<string> {
    console.log(workflowStageId);
    return this.http
      .delete<string>(
        `${environment.workflowBaseUrl}${DELETEWORKFLOWSTAGE}/${workflowStageId}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next(); // Emit refresh event
        })
      );
  }

  //update workflowstage
  updateWorkflowstage(workflowstage: any): Observable<any> {
    console.log(workflowstage);
    console.log(workflowstage);
    return this.http.put<any>(
      `${environment.workflowBaseUrl}${UPDATEWORKFLOWSTAGE}`,
      workflowstage
    );
  }

  //getting filter data based on workflowstage name
  // event,this.pageIndex,this.pageSize
  // http://localhost:9000/api/user/workflowstage/workflowstages?workflowstageName=Users&page=0&size=10
  getAllWorkflowstage(workflowstageName: string, page: any, size: any) {
    console.log(workflowstageName, page, size);
    return this.http.get<Page<WorkflowStageDto>>(
      `${environment.workflowBaseUrl}${GETWORKFLOWSTAGEBYDTO}?workflowStageName=${workflowstageName}&page=${page}&size=${size}`
    );
  }
  getAllWorkflowstageByType(workflowTypeId: any) {
    return this.http.get<any>(
      `${environment.workflowBaseUrl}${GETWORKFLOWSTAGEBYTYPE}?workflowTypeId=${workflowTypeId}`
    );
  }
  getWorkflowstageByTypeById(workflowStageId: any) {
    return this.http.get<any>(
      `${environment.workflowBaseUrl}${GETBYWORKFLOWSTAGEID}/${workflowStageId}`
    );
  }
}
