import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import {
  ADDALLBLOCKS,
  CHECKBLOCKS,
  DELETEBLOCK,
  GETALLBLOCK,
  GETALLBLOCKS,
  GETALLBLOCKSBYPROJECTID,
  GETBLOCKBYID,
  GETBLOCKSBYBLOCKIDSANDPROJECTIDS,
  SAVEBLOCK,
  UPDATEBLOCK,
} from 'src/app/Apis/ProjectApis/Project';
import { Block, BlockDto, Page } from 'src/app/Models/Block/block';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BlockService {
  constructor(private http: HttpClient) {}

  private _refreshRequired = new Subject<void>();

  get refreshRequired() {
    return this._refreshRequired;
  }

  //adding block
  addBlock(block: any): Observable<any> {
    console.log(block);
    return this.http.post<any>(
      `${environment.projectBaseUrl}${ADDALLBLOCKS}`,
      block
    );
  }

  //delete block
  deleteBlock(blockId: number): Observable<string> {
    console.log(blockId);
    return this.http
      .delete<string>(`${environment.projectBaseUrl}${DELETEBLOCK}/${blockId}`)
      .pipe(
        tap(() => {
          this._refreshRequired.next(); // Emit refresh event
        })
      );
  }

  //update block
  updateBlock(block: any): Observable<any> {
    return this.http.put<any>(
      `${environment.projectBaseUrl}${UPDATEBLOCK}`,
      block
    );
  }

  //getting filter data based on block name with pagination
  getAllBlock(blockName: string, page: any, size: any, projectName: string) {
    console.log(blockName, page, size, projectName);
    return this.http.get<Page<Block>>(
      `${environment.projectBaseUrl}${GETALLBLOCKS}?blockName=${blockName}&page=${page}&size=${size}&projectName=${projectName}`
    );
  }

  // get all blocks by project
  getBlocksByProject(blockId?: any): Observable<any> {
    return this.http.get<any>(
      `${environment.projectBaseUrl}${GETALLBLOCKSBYPROJECTID}?blockId=${blockId}`
    );
  }

  //get blocks based on project Id
  getBlocks(projectId: any, blockName?: string) {
    blockName = blockName || '';
    return this.http.get<any>(
      `${environment.projectBaseUrl}${GETALLBLOCK}?projectId=${projectId}&blockName=${blockName}`
    );
  }

  //get projects based on id
  getBlockById(blockId: number): Observable<Block> {
    return this.http.get<Block>(
      `${environment.projectBaseUrl}${GETBLOCKBYID}/${blockId}`
    );
  }

  //add All blocks
  addAllBlocks(block: any) {
    return this.http.post<any>(
      `${environment.projectBaseUrl}${SAVEBLOCK}`,
      block
    );
  }

  validateBlocks(projectId: number) {
    console.log(projectId);
    return this.http.get<number>(
      `${environment.projectBaseUrl}${CHECKBLOCKS}/${projectId}`
    );
  }
  fetchBlocksByBlockIds(
    projectId: any,
    blockIds: any,
    blockName?: string
  ): Observable<BlockDto[]> {
    if (projectId === undefined || projectId === 0) projectId = '';
    if (blockIds === undefined || blockIds === 0) blockIds = '';
    if (blockName === undefined || blockName === null) blockName = '';
    return this.http.get<BlockDto[]>(
      `${environment.projectBaseUrl}${GETBLOCKSBYBLOCKIDSANDPROJECTIDS}?projectIds=${projectId}&blockIds=${blockIds}&blockName=${blockName}`
    );
  }
}
