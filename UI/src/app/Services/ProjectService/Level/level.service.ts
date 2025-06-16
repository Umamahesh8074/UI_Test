import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';

import {
  ADD_ALL_LEVELS,
  CHECKLEVELS,
  DELETE_LEVELS,
  GET_ALL_LEVEL_BY_ID,
  GET_ALL_LEVELS,
  GET_ALL_LEVELS_BY_BLOCK_ID,
  GET_ALL_LEVELS_SPEC,
  UPDATE_ALL_LEVELS,
} from 'src/app/Apis/ProjectApis/Project';

import { Page } from 'src/app/Models/CommanModel/Page';
import { Level } from 'src/app/Models/Project/level';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LevelService {
  constructor(private http: HttpClient) {}

  private _refresh = new Subject<void>();

  get refresh() {
    return this._refresh;
  }

  //fetch levels with pagination
  getAllLevels(
    levelName: any,
    page: number,
    size: number,
    projectName: string,
    blockName: string
  ): Observable<Page<any>> {
    return this.http.get<Page<any>>(
      `${environment.projectBaseUrl}${GET_ALL_LEVELS_SPEC}?levelName=${levelName}&page=${page}&size=${size}&blockName=${blockName}&projectName=${projectName}`
    );
  }

  addLevels(levels: any): Observable<any> {
    return this.http.post<any>(
      `${environment.projectBaseUrl}${ADD_ALL_LEVELS}`,
      levels
    );
  }

  updateLevel(levels: any): Observable<any> {
    return this.http.put<any>(
      `${environment.projectBaseUrl}${UPDATE_ALL_LEVELS}`,
      levels
    );
  }

  //for editing to get project,block,level
  getLevelsByBlockId(levelId: any) {
    console.log(levelId);
    return this.http.get<any>(
      `${environment.projectBaseUrl}${GET_ALL_LEVELS_BY_BLOCK_ID}?levelId=${levelId}`
    );
  }

  //get all levels based on project id
  getLevels(blockId: any, levelName?: string) {
    console.log(blockId);
    levelName=levelName===undefined?'':levelName.toString();
    return this.http.get<any>(
      `${environment.projectBaseUrl}${GET_ALL_LEVELS}?blockId=${blockId}&levelName=${encodeURIComponent(levelName)}`
    );
  }

  getLevelByLevelId(levelId: any) {
    return this.http.get<any>(
      `${environment.projectBaseUrl}${GET_ALL_LEVELS}?levelId=${levelId}`
    );
  }
  getLevelById(levelId: any) {
    return this.http.get<any>(
      `${environment.projectBaseUrl}${GET_ALL_LEVEL_BY_ID}${levelId}`
    );
  }

  deleteLevel(levelId: any) {
    console.log(levelId);
    return this.http
      .delete<string>(
        `${environment.projectBaseUrl}${DELETE_LEVELS}/${levelId}`
      )
      .pipe(
        tap(() => {
          this._refresh.next(); // Emit refresh event
        })
      );
  }

  validateLevels(projectId: number, blockId: number) {
    console.log(projectId);
    return this.http.get<number>(
      `${environment.projectBaseUrl}${CHECKLEVELS}/${projectId}/${blockId}`
    );
  }
}
