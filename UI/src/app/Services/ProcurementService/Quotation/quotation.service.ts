import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import {
  ControllerPaths,
  ProcurementControllerPaths,
} from 'src/app/Apis/ControllerPaths/ControllerPaths';
import { GET_QUOTATION_BY_ID } from 'src/app/Apis/ProcurementApis/Quotation';
import { ApprovalIndentDto } from 'src/app/Models/Procurement/approvals';
import {
  IQuotation,
  Quotation,
  QuotationDto,
} from 'src/app/Models/Procurement/quotation';
import { Page } from 'src/app/Models/User/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class QuotationService {
  constructor(private http: HttpClient) {}

  private _refreshRequired = new Subject<void>();

  get refreshRequired() {
    return this._refreshRequired;
  }

  //adding quotation
  addQuotation(formData: any): Observable<any> {
    console.log(formData);
    return this.http.post<any>(
      `${environment.procurementBaseUrl}${ControllerPaths.QUOTATION}/save`,
      formData
    );
  }

  deleteQuotation(quotationId: number): Observable<string> {
    console.log(quotationId);
    return this.http
      .delete<string>(
        `${environment.procurementBaseUrl}${ControllerPaths.QUOTATION}/${quotationId}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next();
        })
      );
  }

  //update quotation
  updateQuotations(
    quotations: QuotationDto[],
    workflowTypeId: number,
    userId: number,
    remarks: string
  ): Observable<any> {
    console.log(quotations);
    return this.http.put<string>(
      `${environment.procurementBaseUrl}${ControllerPaths.QUOTATION}/updatestatus?workflowTypeId=${workflowTypeId}&userId=${userId}&remarks=${remarks}`,
      quotations
    );
  }

  //getting filter data based on quotation name
  // event,this.pageIndex,this.pageSize
  // http://localhost:9000/api/user/quotation/quotations?quotationName=Users&page=0&size=10
  getAllQuotation(quotationName: string, page: any, size: any) {
    console.log(quotationName, page, size);
    return this.http.get<Page<Quotation>>(
      `${environment.procurementBaseUrl}${ControllerPaths.QUOTATION}/quotations?quotationName=${quotationName}&page=${page}&size=${size}`
    );
  }

  fetchQuotations(userId: number, page: any, size: any) {
    console.log(page, size);
    return this.http.get<Page<ApprovalIndentDto[]>>(
      `${environment.procurementBaseUrl}${ControllerPaths.QUOTATION}/fetch/quotations?userId=${userId}&page=${page}&size=${size}`
    );
  }

  fetchQuotationBasedonId(id: number, page: any, size: any) {
    console.log(id, page, size);
    return this.http.get<Page<ApprovalIndentDto>>(
      `${environment.procurementBaseUrl}${ControllerPaths.QUOTATION}/fetch/quotationbyid?id=${id}&page=${page}&size=${size}`
    );
  }

  fetchQuotationBasedonIndentId(
    id: number,
    quotationId: number,
    page: any,
    size: any,
    status: boolean,
    startDate: any,
    endDate: any,
    quotationCode: string,
    vendorId: number,
    projectId: number,
    loggedInUserId: number
  ) {
    console.log(id, page, size);
    quotationCode = quotationCode == undefined ? '' : quotationCode;
    vendorId = vendorId == undefined ? 0 : vendorId;
    projectId = projectId == undefined ? 0 : projectId;
    startDate = startDate === undefined || startDate === null ? '' : startDate;
    endDate = endDate === undefined || endDate === null ? '' : endDate;
    return this.http.get<Page<QuotationDto[]>>(
      `${environment.procurementBaseUrl}${ControllerPaths.QUOTATION}/get/quotationbyid?indentId=${id}&page=${page}&size=${size}&quotationId=${quotationId}&status=${status}&startDate=${startDate}&endDate=${endDate}&quotationCode=${quotationCode}&vendorId=${vendorId}&projectId=${projectId}&loggedInUserId=${loggedInUserId}`
    );
  }

  fetchApprovalQuotations(id: number, page: any, size: any) {
    console.log(id, page, size);
    return this.http.get<Page<QuotationDto[]>>(
      `${environment.procurementBaseUrl}${ControllerPaths.QUOTATION}/get/quotationbyid?quotationId=${id}&page=${page}&size=${size}`
    );
  }

  createQuotation(id: number, page: any, size: any) {
    console.log(id);
    return this.http.get<Page<ApprovalIndentDto>>(
      `${environment.procurementBaseUrl}${ControllerPaths.QUOTATION}/createandfetch/quotation?indentId=${id}&page=${page}&size=${size}`
    );
  }
  //get quotaion to display quotation details to raise purcahse order for approved quotation
  getQuotation(quotationId: number): Observable<any> {
    console.log('quotationId ', quotationId);
    return this.http.get<any>(
      `${environment.procurementBaseUrl}${GET_QUOTATION_BY_ID}?quotationId=${quotationId}`
    );
  }

  fetchQuotationForApproval(userId: number, page: any, size: any) {
    console.log(page, size);
    return this.http.get<Page<ApprovalIndentDto[]>>(
      `${environment.procurementBaseUrl}${ControllerPaths.QUOTATION}/approvalquotations?userId=${userId}&page=${page}&size=${size}`
    );
  }

  updateApprovedQuotations(
    quotations: QuotationDto[],
    workflowTypeId: number,
    userId: number,
    remarks: string
  ): Observable<any> {
    console.log(quotations);
    return this.http.put<string>(
      `${environment.procurementBaseUrl}${ControllerPaths.QUOTATION}/update/approvalstatus?workflowTypeId=${workflowTypeId}&userId=${userId}&remarks=${remarks}`,
      quotations
    );
  }

  //move to work flow
  moveQuotationToWorkFlow(
    quotationId: number,
    createdUserId: number
  ): Observable<any> {
    return this.http
      .get<any>(
        `${environment.procurementBaseUrl}${ControllerPaths.QUOTATION}/send/workflow?incidentId=${quotationId}&createdUserId=${createdUserId}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next();
        })
      );
  }

  moveQuotationToWorkFlowAfterRework(
    quotationId: number,
    status: string
  ): Observable<any> {
    return this.http
      .get<any>(
        `${environment.procurementBaseUrl}${ControllerPaths.QUOTATION}/send/workflow/rework?quotationId=${quotationId}&status=${status}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next();
        })
      );
  }

  getStages(incidentId: number, loggedInUserId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${environment.procurementBaseUrl}${ControllerPaths.QUOTATION}/stages?incidentId=${incidentId}&loggedInUserId=${loggedInUserId}`
    );
  }

  //get pending  quotations fro approval
  getApprovalQuotationsByUserId(
    userId: number,
    page: number,
    size: number,
    quotationCode: string,
    projectId: number,
    startDate: any,
    endDate: any,
    vendorId?: number,
    indentCode?: string,
    stageOwner?: string
  ) {
    userId = userId === undefined ? 0 : userId;
    projectId === undefined || projectId === null ? '' : 0;
    quotationCode = quotationCode === undefined ? '' : quotationCode;
    startDate = startDate === undefined || startDate === null ? '' : startDate;
    endDate = endDate === undefined || endDate === null ? '' : endDate;
    vendorId = vendorId == undefined ? 0 : vendorId;
    indentCode = indentCode === undefined ? '' : indentCode;
    stageOwner = stageOwner === undefined ? '' : stageOwner;
    return this.http.get<Page<ApprovalIndentDto[]>>(
      `${environment.procurementBaseUrl}${ControllerPaths.QUOTATION}/get/quotations?userId=${userId}&page=${page}&size=${size}&quotationCode=${quotationCode}&startDate=${startDate}&endDate=${endDate}&projectId=${projectId}&vendorId=${vendorId}&indentCode=${indentCode}&stageOwner=${stageOwner}`
    );
  }

  //get except pending  for quotation approval
  getApproveOrRejectedOrReworkedQuotationsByUserId(
    userId: number,
    page: number,
    size: number,
    quotationCode: string,
    projectId: number,
    startDate: any,
    endDate: any,
    stageOwner: string,
    stageStatus: string,
    vendorId?: number,
    indentCode?: string
  ) {
    userId = userId === undefined ? 0 : userId;
    projectId === undefined || projectId === null ? '' : 0;
    quotationCode = quotationCode === undefined ? '' : quotationCode;
    stageOwner = stageOwner === undefined ? '' : stageOwner;
    stageStatus = stageStatus === 'All' ? '' : stageStatus;
    startDate = startDate === undefined || startDate === null ? '' : startDate;
    endDate = endDate === undefined || endDate === null ? '' : endDate;
    vendorId = vendorId === undefined ? 0 : vendorId;
    indentCode = indentCode === undefined ? '' : indentCode;
    return this.http.get<Page<ApprovalIndentDto[]>>(
      `${environment.procurementBaseUrl}${ControllerPaths.QUOTATION}/fetch/quotations/app/rej/rework?userId=${userId}&page=${page}&size=${size}&quotationCode=${quotationCode}&startDate=${startDate}&endDate=${endDate}&projectId=${projectId}&stageOwner=${stageOwner}&stageStatus=${stageStatus}&vendorId=${vendorId}&indentCode=${indentCode}`
    );
  }

  fetchNonPenidngQuotations(
    page: number,
    size: number,
    quotationCode: string,
    projectId: number,
    vendorId: number,
    startDate: any,
    endDate: any,
    stageOwner: string,
    stageStatus: string,
    loggedInUserId: number
  ) {
    projectId === undefined || projectId === null ? '' : 0;
    quotationCode = quotationCode === undefined ? '' : quotationCode;
    stageOwner = stageOwner === undefined ? '' : stageOwner;
    stageStatus = stageStatus === 'All' ? '' : stageStatus;
    startDate = startDate === undefined || startDate === null ? '' : startDate;
    endDate = endDate === undefined || endDate === null ? '' : endDate;
    vendorId = vendorId === undefined ? 0 : vendorId;
    return this.http.get<Page<QuotationDto[]>>(
      `${environment.procurementBaseUrl}${ControllerPaths.QUOTATION}/quotations?page=${page}&size=${size}&quotationCode=${quotationCode}&projectId=${projectId}&vendorId=${vendorId}&startDate=${startDate}&endDate=${endDate}&stageOwner=${stageOwner}&stageStatus=${stageStatus}&loggedInUserId=${loggedInUserId}`
    );
  }

  fetchQuotationBasedonQuotationId(quotationId: number, page: any, size: any) {
    return this.http.get<Page<any[]>>(
      `${environment.procurementBaseUrl}${ControllerPaths.QUOTATION_ITEM}?page=${page}&size=${size}&quotationId=${quotationId}`
    );
  }

  getPreviousQuotationItemsByQuotationIdWithPagination(
    quotationId: number,
    page: number,
    size: number
  ) {
    console.log(quotationId, page, size);
    return this.http.get<Page<any[]>>(
      `${environment.procurementBaseUrl}${ControllerPaths.QUOTATION_ITEM}/pre/quotation/items?quotationId=${quotationId}&page=${page}&size=${size}`
    );
  }

  //for edit
  fetchQuotatiByQuotationId(quotationId: number) {
    return this.http.get<IQuotation>(
      `${environment.procurementBaseUrl}${ControllerPaths.QUOTATION}/getquotation?quotationId=${quotationId}`
    );
  }
  updateQuotation(formData: any, quotationType?: string): Observable<any> {
    console.log(formData);
    return this.http.put<any>(
      `${environment.procurementBaseUrl}${ControllerPaths.QUOTATION}/update?quotationType=${quotationType}`,
      formData
    );
  }

  fetchApprovedQuotations(
    page: number,
    size: number,
    projectId: number,
    vendorId: number,
    quotationCode: string,
    startDate: any,
    endDate: any,
    loggedInUserId: number
  ) {
    projectId === undefined || projectId === null ? '' : 0;
    quotationCode = quotationCode === undefined ? '' : quotationCode;
    startDate = startDate === undefined || startDate === null ? '' : startDate;
    endDate = endDate === undefined || endDate === null ? '' : endDate;
    return this.http.get<Page<QuotationDto[]>>(
      `${environment.procurementBaseUrl}${ControllerPaths.QUOTATION}/getall/quotations?page=${page}&size=${size}&quotationCode=${quotationCode}&startDate=${startDate}&endDate=${endDate}&projectId=${projectId}&vendorId=${vendorId}&loggedInUserId=${loggedInUserId}`
    );
  }

  deleteQuotationItem(quotationItemId: number): Observable<string> {
    return this.http
      .delete<string>(
        `${environment.procurementBaseUrl}${ControllerPaths.QUOTATIONITEM}?id=${quotationItemId}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next();
        })
      );
  }

  deleteQuoTermsAndCond(id: number): Observable<string> {
    return this.http
      .delete<string>(
        `${environment.procurementBaseUrl}${ProcurementControllerPaths.QUO_TERMS_AND_COND}?id=${id}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next();
        })
      );
  }

  getVendorHistory(
    page: number,
    size: number,
    vendorId: number,
    quotationId: number,
    materialCodeId: number,
    projectId: number
  ) {
    return this.http.get<Page<any>>(
      `${environment.procurementBaseUrl}${ControllerPaths.QUOTATION}/vendor/history?page=${page}&size=${size}&vendorId=${vendorId}&quotationId=${quotationId}&materialCodeId=${materialCodeId}&projectId=${projectId}`
    );
  }

  validateVendor(vendorId: number, indentId: number, quotationId: number) {
    return this.http.get<boolean>(
      `${environment.procurementBaseUrl}${ControllerPaths.QUOTATION}/validate/vendor?vendorId=${vendorId}&quotationId=${quotationId}&indentId=${indentId}`
    );
  }

  getQuotationCharges(quotationId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${environment.procurementBaseUrl}${ControllerPaths.QUOTATION_CHARGE}/getall?quotationId=${quotationId}`
    );
  }
}
