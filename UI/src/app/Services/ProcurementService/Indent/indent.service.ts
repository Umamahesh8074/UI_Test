import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, tap, throwError } from 'rxjs';

import {
  DELETEINDENT,
  DELETEINDENTITEM,
  GETALL_NON_PENDING_INDENT,
  GETALL_STAGES,
  GETALLINDENT,
  GETBYINDENTID,
  MOVE_INDENT_TO_WORK_FLOW,
  MOVE_INDENT_TO_WORK_FLOW_AFTER_REWORK,
  SAVEINDENT,
  UPDATEINDENT,
} from 'src/app/Apis/ProcurementApis/indent';
import { ApprovalIndentDto } from 'src/app/Models/Procurement/approvals';

import { Indent, IndentItemDto } from 'src/app/Models/Procurement/indent';
import { IIndentDto } from 'src/app/Models/Procurement/indentDto';
import { Page } from 'src/app/Models/User/menuItem';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class IndentService {
  constructor(private http: HttpClient) {}

  private _refreshRequired = new Subject<void>();
  get refreshRequired() {
    return this._refreshRequired;
  }

  //getting filter data based on indent name
  getAllIndent(
    indentCode: string,
    page: any,
    size: any,
    startDate: any,
    endDate: any,
    projectId: number,
    stageOwner: string,
    loggedInUserId: number
  ) {
    projectId === undefined || projectId === null ? '' : 0;
    indentCode = indentCode === undefined ? '' : indentCode;
    startDate = startDate === undefined || startDate === null ? '' : startDate;
    endDate = endDate === undefined || endDate === null ? '' : endDate;
    stageOwner = stageOwner === undefined ? '' : stageOwner;
    return this.http
      .get<Page<IIndentDto>>(
        `${environment.procurementBaseUrl}${GETALLINDENT}?indentCode=${indentCode}&page=${page}&size=${size}&startDate=${startDate}&endDate=${endDate}&projectId=${projectId}&stageOwner=${stageOwner}&loggedInUserId=${loggedInUserId}`
      )
      .pipe(
        catchError((error) => {
          return throwError(() => new Error('Failed to fetch indent data.'));
        })
      );
  }

  getAllNonPendingIndent(
    indentName: string,
    page: any,
    size: any,
    startDate: any,
    endDate: any,
    projectId: number,
    stageOwnerName: string,
    stageStatus: string,
    loggedInUserId: number
  ) {
    stageStatus = stageStatus === 'All' ? '' : stageStatus;
    startDate = startDate === undefined || startDate === null ? '' : startDate;
    endDate = endDate === undefined || endDate === null ? '' : endDate;
    return this.http
      .get<Page<IIndentDto>>(
        `${environment.procurementBaseUrl}${GETALL_NON_PENDING_INDENT}?page=${page}&size=${size}&indentCode=${indentName}&startDate=${startDate}&endDate=${endDate}&projectId=${projectId}&stageOwner=${stageOwnerName}&stageStatus=${stageStatus}&loggedInUserId=${loggedInUserId}`
      )
      .pipe(
        catchError((error) => {
          return throwError(() => new Error('Failed to fetch indent data.'));
        })
      );
  }

  //adding indent
  addIndent(formData: any): Observable<String> {
    console.log(formData);
    return this.http.post<String>(
      `${environment.procurementBaseUrl}${SAVEINDENT}`,
      formData
    );
  }

  //delete indent
  deleteIndent(indentId: number): Observable<string> {
    console.log(indentId);

    return this.http
      .delete<string>(
        `${environment.procurementBaseUrl}${DELETEINDENT}/${indentId}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next();
        })
      );
  }

  //update indent
  updateIndent(formData: any, indentType: string): Observable<any> {
    return this.http.put<any>(
      `${environment.procurementBaseUrl}${UPDATEINDENT}?indentType=${indentType}`,
      formData
    );
  }

  getIndentItemsById(indentId: number) {
    console.log(indentId);
    return this.http.get<IndentItemDto>(
      `${environment.procurementBaseUrl}${GETBYINDENTID}/fetch/${indentId}`
    );
  }

  //get pending indents
  getApprovalIndentsByUserId(
    userId: number,
    page: number,
    size: number,
    indentCode: string,
    projectId: number,
    startDate: any,
    endDate: any
  ) {
    userId = userId === undefined ? 0 : userId;
    projectId === undefined || projectId === null ? '' : 0;
    indentCode = indentCode === undefined ? '' : indentCode;
    startDate = startDate === undefined || startDate === null ? '' : startDate;
    endDate = endDate === undefined || endDate === null ? '' : endDate;
    return this.http.get<Page<ApprovalIndentDto[]>>(
      `${environment.procurementBaseUrl}${GETBYINDENTID}/fetch/indents?userId=${userId}&page=${page}&size=${size}&indentCode=${indentCode}&startDate=${startDate}&endDate=${endDate}&projectId=${projectId}`
    );
  }

  //get approved/rej indents

  getApprOrRejOrReworkIndentsByUserId(
    userId: number,
    page: number,
    size: number,
    indentCode: string,
    projectId: number,
    startDate: any,
    endDate: any,
    stageOwner: string,
    stageStatus: string
  ) {
    userId = userId === undefined ? 0 : userId;
    projectId === undefined || projectId === null ? '' : 0;
    indentCode = indentCode === undefined ? '' : indentCode;
    stageOwner = stageOwner === undefined ? '' : stageOwner;
    stageStatus = stageStatus === 'All' ? '' : stageStatus;
    startDate = startDate === undefined || startDate === null ? '' : startDate;
    endDate = endDate === undefined || endDate === null ? '' : endDate;
    return this.http.get<Page<ApprovalIndentDto[]>>(
      `${environment.procurementBaseUrl}${GETBYINDENTID}/fetch/indents/app/rej/rework?userId=${userId}&page=${page}&size=${size}&indentCode=${indentCode}&startDate=${startDate}&endDate=${endDate}&projectId=${projectId}&stageOwner=${stageOwner}&stageStatus=${stageStatus}`
    );
  }

  //get indents with indent items
  getIndentWithIndentItems(indentId: number): Observable<any> {
    console.log(indentId);
    return this.http.get<any>(
      `${environment.procurementBaseUrl}${GETBYINDENTID}/getbyid?indentId=${indentId}`
    );
  }

  //delete indent
  deleteIndentItem(indentId: number): Observable<string> {
    return this.http
      .delete<string>(
        `${environment.procurementBaseUrl}${DELETEINDENTITEM}/${indentId}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next(); // Emit refresh event
        })
      );
  }

  //move to work flow
  moveIndentToWorkFlow(
    indentId: number,
    createdUserId: number
  ): Observable<any> {
    return this.http
      .get<any>(
        `${environment.procurementBaseUrl}${MOVE_INDENT_TO_WORK_FLOW}?incidentId=${indentId}&createdUserId=${createdUserId}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next();
        })
      );
  }

  getStages(incidentId: number, loggedInUserId: number) {
    return this.http.get<any[]>(
      `${environment.procurementBaseUrl}${GETALL_STAGES}?incidentId=${incidentId}&loggedInUserId=${loggedInUserId}`
    );
  }

  getApprovedIndents(
    page: number,
    size: number,
    indentCode: string,
    projectId: number,
    customStartDate: any,
    customEndDate: any,
    createdUserName: string,
    loggedInUserId?: number
  ) {
    indentCode = indentCode == undefined ? '' : indentCode;
    projectId = projectId == undefined ? 0 : projectId;
    customStartDate =
      customStartDate === undefined || customStartDate === null
        ? ''
        : customStartDate;
    customEndDate =
      customEndDate === undefined || customEndDate === null
        ? ''
        : customEndDate;
    return this.http.get<Page<ApprovalIndentDto[]>>(
      `${environment.procurementBaseUrl}${GETBYINDENTID}/getall?page=${page}&size=${size}&indentCode=${indentCode}&projectId=${projectId}&startDate=${customStartDate}&endDate=${customEndDate}&createdUserName=${createdUserName}&loggedInUserId=${loggedInUserId}`
    );
  }

  getIndentItemsByIndentId(indentId: number) {
    return this.http.get<any>(
      `${environment.procurementBaseUrl}${GETBYINDENTID}/fetch/indentbyid?indentId=${indentId}`
    );
  }

  //move to work flow
  moveIndentToWorkFlowAfterRework(
    indentId: number,
    status: string
  ): Observable<any> {
    return this.http
      .get<any>(
        `${environment.procurementBaseUrl}${MOVE_INDENT_TO_WORK_FLOW_AFTER_REWORK}?indentId=${indentId}&status=${status}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next();
        })
      );
  }
}
