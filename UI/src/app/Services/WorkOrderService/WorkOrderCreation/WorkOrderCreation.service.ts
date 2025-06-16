import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import {
  DELETE_WORK_ORDER_QUANTITY,
  FETCH_ALL_WOC,
  GENERATE_WO_PDF,
  GET_BY_ID,
  GET_PREVIOUS_WORK_ORDER_QUANTITIES_DTO_BY_ID,
  GET_WORK_ORDER_QUANTITIES_BY_ID,
  GET_WORK_ORDER_QUANTITIES_DTO_BY_ID,
  GETALL_APPROVED_REJECTD_WORK_ORDERS,
  GETALL_PENDING_WORK_ORDERS,
  GETALL_REWORK_WORK_ORDERS,
  GETALL_WORK_ORDER,
  GETALL_WORK_ORDER_CREATION_SPEC,
  GETALL_WORK_ORDER_STAGES,
  SAVE_WORK_ORDER_CREATION,
  SAVE_WORK_ORDER_HEADER,
  SAVE_WORK_ORDER_QUANTITY,
  SEND_TO_APPROVE,
  SEND_TO_APPROVE_REWORK_AMENDAMENT,
  UPDATE_WORK_ORDER_CREATION,
  UPDATE_WORK_ORDER_HEADER,
  UPDATE_WORK_ORDER_QUANTITY,
  WORK_ORDER_CREATION_BY_ID,
} from 'src/app/Apis/WorkOrderApis/WorkOrderCreation';
import { Page } from 'src/app/Models/User/User';

import { IWorkOrderDto } from 'src/app/Models/WorkOrder/WorkOrderCreation';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WorkOrderCreationService {
  constructor(private http: HttpClient) {}

  // Define refreshRequired as a Subject
  private _refreshRequired = new Subject<void>();
  public refreshRequired = this._refreshRequired.asObservable();

  getAllWorkOrderCreationWithPagination(
    workOrderNumber: string,
    page: number,
    size: number,
    loggedInUserId: number,
    projectId: number,
    vendorId: number,
    startDate: any,
    endDate: any,
    workOrderType: string,
    stageOwner: string,
    workOrderCategory: string
  ): Observable<Page<IWorkOrderDto>> {
    projectId === undefined || projectId === null ? '' : 0;
    vendorId === undefined || vendorId === null ? '' : 0;
    startDate = startDate === undefined || startDate === null ? '' : startDate;
    endDate = endDate === undefined || endDate === null ? '' : endDate;
    workOrderType = workOrderType === 'All' ? '' : workOrderType;
    workOrderCategory = workOrderCategory === 'ALL' ? '' : workOrderCategory;

    return this.http.get<Page<IWorkOrderDto>>(
      `${environment.procurementBaseUrl}${GETALL_WORK_ORDER_CREATION_SPEC}?workOrderNumber=${workOrderNumber}&page=${page}&size=${size}&loggedInUserId=${loggedInUserId}&projectId=${projectId}&vendorId=${vendorId}&startDate=${startDate}&endDate=${endDate}&workOrderType=${workOrderType}&stageOwner=${stageOwner}&workOrderCategory=${workOrderCategory}`
    );
  }

  addWorkOrderCreation(formData: any): Observable<String> {
    console.log(formData);
    return this.http.post<String>(
      `${environment.procurementBaseUrl}${SAVE_WORK_ORDER_CREATION}`,
      formData
    );
  }

  getWorkOrderCreationById(id: number, status: string): Observable<any> {
    return this.http.get<any>(
      `${environment.procurementBaseUrl}${WORK_ORDER_CREATION_BY_ID}/${id}/${status}`
    );
  }

  getWOById(
    id: number,
    woqId: number,
    page: number,
    size: number,
    serviceCodeId: number
  ): Observable<any> {
    return this.http.get<any>(
      `${environment.procurementBaseUrl}${GET_BY_ID}?id=${id}&woqId=${woqId}&page=${page}&size=${size}&serviceCodeId=${serviceCodeId}`
    );
  }

  updateWorkOrderCreation(
    WorkOrderCreationDto: any,
    workOrderStatus: string
  ): Observable<String> {
    return this.http.put<String>(
      `${environment.procurementBaseUrl}/${UPDATE_WORK_ORDER_CREATION}?workOrderStatus=${workOrderStatus}`,
      WorkOrderCreationDto
    );
  }

  deleteWorkOrder(workOrderId: number): Observable<string> {
    return this.http
      .delete<string>(
        `${environment.procurementBaseUrl}${WORK_ORDER_CREATION_BY_ID}/${workOrderId}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next();
        })
      );
  }

  deleteWorkOrderQuantity(workOrderQuantityId: number) {
    return this.http
      .delete<string>(
        `${environment.procurementBaseUrl}${DELETE_WORK_ORDER_QUANTITY}?workOrderQuantityId=${workOrderQuantityId}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next();
        })
      );
  }

  getPendingWorkOrdersBasedOnLoggedIn(
    workOrderNumber: string,
    loggedInUserId: number,
    page: number,
    size: number,
    projectId: number,
    vendorId: number,
    startDate: any,
    endDate: any,
    workOrderType: string
  ): Observable<Page<IWorkOrderDto>> {
    workOrderNumber = workOrderNumber === undefined ? '' : workOrderNumber;
    workOrderType = workOrderType === 'All' ? '' : workOrderType;
    loggedInUserId = loggedInUserId === undefined ? 0 : loggedInUserId;
    projectId === undefined || projectId === null ? '' : 0;
    vendorId === undefined || vendorId === null ? '' : 0;
    startDate = startDate === undefined || startDate === null ? '' : startDate;
    endDate = endDate === undefined || endDate === null ? '' : endDate;

    return this.http.get<Page<IWorkOrderDto>>(
      `${environment.procurementBaseUrl}${GETALL_PENDING_WORK_ORDERS}?workOrderNumber=${workOrderNumber}&loggedInUserId=${loggedInUserId}&page=${page}&size=${size}&projectId=${projectId}&vendorId=${vendorId}&startDate=${startDate}&endDate=${endDate}&workOrderType=${workOrderType}`
    );
  }

  getApprovedOrRejectedWorkOrdersBasedOnLoggedIn(
    workOrderNumber: string,
    loggedInUserId: number,
    page: number,
    size: number,
    selectedStatus: string,
    projectId: number,
    vendorId: number,
    startDate: any,
    endDate: any,
    workOrderType: string
  ): Observable<Page<IWorkOrderDto>> {
    workOrderNumber = workOrderNumber === undefined ? '' : workOrderNumber;
    workOrderType = workOrderType === 'All' ? '' : workOrderType;
    selectedStatus = selectedStatus === 'All' ? '' : selectedStatus;

    loggedInUserId = loggedInUserId === undefined ? 0 : loggedInUserId;
    projectId === undefined || projectId === null ? '' : 0;
    vendorId === undefined || vendorId === null ? '' : 0;
    startDate = startDate === undefined || startDate === null ? '' : startDate;
    endDate = endDate === undefined || endDate === null ? '' : endDate;
    return this.http.get<Page<IWorkOrderDto>>(
      `${environment.procurementBaseUrl}${GETALL_APPROVED_REJECTD_WORK_ORDERS}?workOrderNumber=${workOrderNumber}&loggedInUserId=${loggedInUserId}&page=${page}&size=${size}&status=${selectedStatus}&projectId=${projectId}&vendorId=${vendorId}&startDate=${startDate}&endDate=${endDate}&workOrderType=${workOrderType}`
    );
  }

  getReworkWorkOrdersBasedOnLoggedIn(
    workOrderNumber: string,
    loggedInUserId: number,
    page: number,
    size: number,
    selectedStatus: string,
    projectId: number,
    vendorId: number,
    startDate: any,
    endDate: any,
    stageOwner: string
  ): Observable<Page<IWorkOrderDto>> {
    console.log(workOrderNumber, page, size);
    workOrderNumber = workOrderNumber === undefined ? '' : workOrderNumber;
    loggedInUserId = loggedInUserId === undefined ? 0 : loggedInUserId;
    projectId === undefined || projectId === null ? '' : 0;
    vendorId === undefined || vendorId === null ? '' : 0;
    startDate = startDate === undefined || startDate === null ? '' : startDate;
    endDate = endDate === undefined || endDate === null ? '' : endDate;
    selectedStatus = selectedStatus === 'All' ? '' : selectedStatus;

    return this.http.get<Page<IWorkOrderDto>>(
      `${environment.procurementBaseUrl}${GETALL_REWORK_WORK_ORDERS}?workOrderNumber=${workOrderNumber}&loggedInUserId=${loggedInUserId}&page=${page}&size=${size}&status=${selectedStatus}&projectId=${projectId}&vendorId=${vendorId}&startDate=${startDate}&endDate=${endDate}&stageOwner=${stageOwner}`
    );
  }

  //added siva
  getAllWorkOrderWithOutPage(): Observable<any[]> {
    return this.http.get<any[]>(
      `${environment.procurementBaseUrl}${GETALL_WORK_ORDER}`
    );
  }

  getAllWorkOrderWithOutPageByNumber(
    workOrderNumber: any
  ): Observable<IWorkOrderDto[]> {
    return this.http.get<IWorkOrderDto[]>(
      `${environment.procurementBaseUrl}${FETCH_ALL_WOC}?workOrderNumber=${workOrderNumber}`
    );
  }

  getAllWorkOrderWithOutPageById(id: any): Observable<any[]> {
    return this.http.get<any[]>(
      `${environment.procurementBaseUrl}${GETALL_WORK_ORDER}?id=${id}`
    );
  }

  //move for approval

  sendForApproval(workOrderId: number) {
    return this.http
      .get<any[]>(
        `${environment.procurementBaseUrl}${SEND_TO_APPROVE}?workOrderId=${workOrderId}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next();
        })
      );
  }

  //move for approval

  sendForApprovalAfterReworkOrReject(
    workOrderId: number,
    workOrderStatus: string
  ) {
    return this.http
      .get<any[]>(
        `${environment.procurementBaseUrl}${SEND_TO_APPROVE_REWORK_AMENDAMENT}?workOrderId=${workOrderId}&workOrderStatus=${workOrderStatus}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next();
        })
      );
  }

  getStages(workOrderId: number, page: number, size: number) {
    return this.http.get<Page<any[]>>(
      `${environment.procurementBaseUrl}${GETALL_WORK_ORDER_STAGES}?workOrderId=${workOrderId}&page=${page}&size=${size}`
    );
  }

  getWorkorderQuantitiesById(workOrderId: number) {
    return this.http.get<any[]>(
      `${environment.procurementBaseUrl}${GET_WORK_ORDER_QUANTITIES_BY_ID}?workOrderId=${workOrderId}`
    );
  }

  getWorkorderQuantitiesDtoById(
    workOrderId: number,
    page: number,
    size: number,
    serviceCodeId: number
  ) {
    return this.http.get<Page<any[]>>(
      `${environment.procurementBaseUrl}${GET_WORK_ORDER_QUANTITIES_DTO_BY_ID}?workOrderId=${workOrderId}&page=${page}&size=${size}&serviceCodeId=${serviceCodeId}`
    );
  }

  getPreviousWorkorderQuantitiesDtoById(
    workOrderId: number,
    page: number,
    size: number,
    serviceCodeId: number
  ) {
    return this.http.get<Page<any[]>>(
      `${environment.procurementBaseUrl}${GET_PREVIOUS_WORK_ORDER_QUANTITIES_DTO_BY_ID}?workOrderId=${workOrderId}&page=${page}&size=${size}&serviceCodeId=${serviceCodeId}`
    );
  }

  updateWorkOrderQuantity(
    WorkOrderCreationDto: any,
    workOrderStatus: string,
    pageIndex: number,
    pageSize: number
  ): Observable<String> {
    console.log(workOrderStatus);
    return this.http.put<String>(
      `${environment.procurementBaseUrl}${UPDATE_WORK_ORDER_QUANTITY}?workOrderStatus=${workOrderStatus}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
      WorkOrderCreationDto
    );
  }

  saveWorkOrderQuantity(
    WorkOrderCreationDto: any,
    workOrderId: number,
    woStatus: string
  ): Observable<String> {
    return this.http.post<String>(
      `${environment.procurementBaseUrl}${SAVE_WORK_ORDER_QUANTITY}?workOrderId=${workOrderId}&woStatus=${woStatus}`,
      WorkOrderCreationDto
    );
  }

  addWorkOrderHeader(formData: any, workOrderId: number): Observable<String> {
    console.log(formData, workOrderId);
    return this.http.post<String>(
      `${environment.procurementBaseUrl}${SAVE_WORK_ORDER_HEADER}?workOrderId=${workOrderId}`,
      formData
    );
  }

  updateWorkOrderHeader(
    formData: any,
    workOrderId: number
  ): Observable<String> {
    console.log(formData, workOrderId);
    return this.http.put<String>(
      `${environment.procurementBaseUrl}${UPDATE_WORK_ORDER_HEADER}?workOrderId=${workOrderId}`,
      formData
    );
  }

  generatePdfWithWaterMark(workOrderId: number, workOrderStatus: string) {
    return this.http.get(
      `${environment.procurementBaseUrl}${GENERATE_WO_PDF}?woId=${workOrderId}&workOrderStatus=${workOrderStatus}`,
      { responseType: 'text' }
    );
  }

  // generateCostSheet(applicantId: number): Observable<string> {
  //   const url = `${environment.projectBaseUrl}${GENERATE_COST_SHEET}?applicantId=${applicantId}`;
  //   return this.http.get(url, { responseType: 'text' }).pipe(
  //     tap(() => {
  //       this._refreshRequired.next();
  //     })
  //   );
  // }
}
