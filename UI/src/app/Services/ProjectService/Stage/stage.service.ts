import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import {
  ADD_STAGE,
  GET_ALL_STAGES,
  GET_ALL_STAGES_WITHOUT_PAGINATION,
  UPDATE_INITIATE_STATUS,
  UPDATE_STAGE,
} from 'src/app/Apis/ProjectApis/Project';
import { environment } from 'src/environments/environment';
import { Stage, StageDto } from 'src/app/Models/Project/stage';
import { Page } from 'src/app/Models/CommanModel/Page';
import { ControllerPaths } from 'src/app/Apis/ControllerPaths/ControllerPaths';

@Injectable({
  providedIn: 'root',
})
export class StageService {
  private _refresh: any;
  constructor(private http: HttpClient) {}

  private _refreshRequired = new Subject<void>();
  public refreshRequired = this._refreshRequired.asObservable();

  //adding stage
  addStage(stage: any): Observable<any> {
    console.log(stage);
    return this.http.post<any>(
      `${environment.projectBaseUrl}${ADD_STAGE}`,
      stage
    );
  }
  //update block
  updateStage(stage: any): Observable<any> {
    return this.http.put<any>(
      `${environment.projectBaseUrl}${UPDATE_STAGE}`,
      stage
    );
  }

  //update block
  updateInitiateStatus(
    stage: any,
    projectId: number,
    blockId: number
  ): Observable<any> {
    return this.http.put<Stage>(
      `${environment.projectBaseUrl}${UPDATE_INITIATE_STATUS}?projectId=${projectId}&blockId=${blockId}`,
      stage
    );
  }

  getAllStages(
    projectId: number,
    blockId: number,
    planId: number,
    page: any,
    size: any,
    status: string
  ) {
    console.log(page, size, projectId, blockId, planId, status);
    return this.http.get<Page<Stage>>(
      `${environment.projectBaseUrl}${GET_ALL_STAGES}?projectId=${projectId}&planId=${planId}&blockId=${blockId}&page=${page}&size=${size}&status=${status}`
    );
  }

  getStageByID(stageId: number): Observable<any> {
    return this.http.get<Page<Stage>>(
      `${environment.projectBaseUrl}${ControllerPaths.STAGE}/${stageId}`
    );
  }

  deleteStage(stageId: any) {
    console.log(stageId);
    return this.http
      .delete<string>(
        `${environment.projectBaseUrl}${ControllerPaths.STAGE}/${stageId}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next();
        })
      );
  }

  getStages(
    stageName: string,
    projectId?: any,
    planId?: any,
    blockId?: any,
    stageId?: any
  ) {
    console.log(projectId, planId);
    if (projectId === undefined || projectId === 0) projectId = '';
    if (stageId === undefined || stageId === 0) stageId = '';
    if (planId === undefined || planId === 0) planId = '';
    if (blockId === undefined || blockId === 0) blockId = '';
    stageName = stageName === undefined ? '' : stageName;
    return this.http.get<StageDto[]>(
      `${environment.projectBaseUrl}${GET_ALL_STAGES_WITHOUT_PAGINATION}?stageName=${stageName}&projectId=${projectId}&planId=${planId}&stageId=${stageId}&blockId=${blockId}`
    );
  }
}
