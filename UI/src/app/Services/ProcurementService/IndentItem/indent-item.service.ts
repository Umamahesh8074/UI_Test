import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, tap, throwError } from 'rxjs';

import {
  DELETE_INDENT_ITEM,
  DELETEINDENT,
  DELETEINDENTITEM,
  GETALL_INDENT_ITEMS,
  GETALL_PREVIOUS_INDENT_ITEMS,
  GETALLINDENT,
  GETBYINDENTID,
  MOVE_INDENT_TO_WORK_FLOW,
  SAVEINDENT,
  UPDATEINDENT,
} from 'src/app/Apis/ProcurementApis/indent';
import { ApprovalIndentDto } from 'src/app/Models/Procurement/approvals';

import { Indent, IndentItemDto } from 'src/app/Models/Procurement/indent';
import { IIndentDto, IIndentItems } from 'src/app/Models/Procurement/indentDto';
import { Page } from 'src/app/Models/User/menuItem';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class IndentItemService {
  constructor(private http: HttpClient) {}

  private _refreshRequired = new Subject<void>();
  get refreshRequired() {
    return this._refreshRequired;
  }

  getIndentItemsByIndentIdWithPagination(
    indentId: number,
    page: number,
    size: number,
    loggedInUserId: number
  ) {
    return this.http.get<Page<IIndentItems>>(
      `${environment.procurementBaseUrl}${GETALL_INDENT_ITEMS}?indentId=${indentId}&page=${page}&size=${size}&loggedInUserId=${loggedInUserId}`
    );
  }

  getPreviousIndentItemsByIndentIdWithPagination(
    indentId: number,
    page: number,
    size: number,
    loggedInUserId: number
  ) {
    return this.http.get<Page<IIndentItems>>(
      `${environment.procurementBaseUrl}${GETALL_PREVIOUS_INDENT_ITEMS}?indentId=${indentId}&page=${page}&size=${size}&loggedInUserId=${loggedInUserId}`
    );
  }

  deleteIndentItem(indentItemId: number): Observable<string> {
    return this.http
      .delete<string>(
        `${environment.procurementBaseUrl}${DELETE_INDENT_ITEM}?indentItemId=${indentItemId}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next();
        })
      );
  }
}
