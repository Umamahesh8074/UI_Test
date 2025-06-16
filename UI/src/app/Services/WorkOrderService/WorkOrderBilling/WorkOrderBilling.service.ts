import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import {
  GET_WORK_ORDER_BILLING_BY_ID,
  GETALL_APPROVED_REJECTD_WORK_ORDER_BILLINGS,
  GETALL_PENDING_WORK_ORDER_BILLING,
  GETALL_REWORK_WORK_ORDER_BILLINGS,
  GETALL_WORK_ORDER_BILLING_DTO,
  GETALL_WORK_ORDER_BILLING_SPEC,
  SAVE_WORK_ORDER_BILLING,
  SEND_TO_WORK_FLOW,
  SEND_WOB_TO_WORK_FLOW_AFRER_REWORK,
  UPDATE_WORK_ORDER_BILLING,
} from 'src/app/Apis/WorkOrderApis/WorkOrderBilling';
import { GETALL_WORK_ORDER_BILLING_STAGES } from 'src/app/Apis/WorkOrderApis/WorkOrderCreation';
import { Page } from 'src/app/Models/User/User';
import {
  IWorkOrderBillingsDto,
  WorkOrderBillingsDto,
} from 'src/app/Models/WorkOrder/WorkOrderBilling';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WorkOrderBillingService {
  constructor(private http: HttpClient) {}

  private _refreshRequired = new Subject<void>();

  get refreshRequired() {
    return this._refreshRequired;
  }

  fetchAllWorkOrderBilling(
    workOrderNumber: string,
    page: number,
    size: number,
    loggedInUserId: number,
    projectId: number,
    vendorId: number,
    startDate: any,
    endDate: any
  ): Observable<Page<IWorkOrderBillingsDto[]>> {
    console.log(page, size);

    loggedInUserId = loggedInUserId === undefined ? 0 : loggedInUserId;
    projectId === undefined || projectId === null ? '' : 0;
    vendorId === undefined || vendorId === null ? '' : 0;
    startDate = startDate === undefined || startDate === null ? '' : startDate;
    endDate = endDate === undefined || endDate === null ? '' : endDate;
    return this.http.get<Page<IWorkOrderBillingsDto[]>>(
      `${environment.procurementBaseUrl}${GETALL_WORK_ORDER_BILLING_DTO}?workOrderNumber=${workOrderNumber}&page=${page}&size=${size}&loggedInUserId=${loggedInUserId}&projectId=${projectId}&vendorId=${vendorId}&startDate=${startDate}&endDate=${endDate}`
    );
  }
  addWorkOrderBilling(formData: any): Observable<String> {
    console.log(formData);
    return this.http.post<String>(
      `${environment.procurementBaseUrl}${SAVE_WORK_ORDER_BILLING}`,
      formData
    );
  }

  updateWorkOrderBilling(
    formData: any,
    workOrderBillingStatus: string
  ): Observable<String> {
    return this.http.put<String>(
      `${environment.procurementBaseUrl}/${UPDATE_WORK_ORDER_BILLING}?workOrderBillingStatus=${workOrderBillingStatus}`,
      formData
    );
  }

  getWorkOrderBillingById(id: number): Observable<IWorkOrderBillingsDto> {
    return this.http.get<IWorkOrderBillingsDto>(
      `${environment.procurementBaseUrl}${GET_WORK_ORDER_BILLING_BY_ID}/${id}`
    );
  }

  inActivateWorkOrderBilling(id: number): Observable<string> {
    return this.http
      .delete<string>(
        `${environment.procurementBaseUrl}${GET_WORK_ORDER_BILLING_BY_ID}/${id}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next();
        })
      );
  }

  //added siva

  getPendingWorkOrderBillingsBasedOnLoggedIn(
    workOrderNumber: string,
    loggedInUserId: number,
    page: number,
    size: number,
    projectId: number,
    vendorId: number,
    startDate: any,
    endDate: any
  ): Observable<Page<WorkOrderBillingsDto>> {
    console.log(workOrderNumber, page, size);

    projectId === undefined || projectId === null ? '' : 0;
    vendorId === undefined || vendorId === null ? '' : 0;
    startDate = startDate === undefined || startDate === null ? '' : startDate;
    endDate = endDate === undefined || endDate === null ? '' : endDate;

    return this.http.get<Page<IWorkOrderBillingsDto[]>>(
      `${environment.procurementBaseUrl}${GETALL_PENDING_WORK_ORDER_BILLING}?workOrderNumber=${workOrderNumber}&loggedInUserId=${loggedInUserId}&page=${page}&size=${size}&projectId=${projectId}&vendorId=${vendorId}&startDate=${startDate}&endDate=${endDate}`
    );
  }

  getApprovedOrRejectedWorkOrderBillingsBasedOnLoggedIn(
    workOrderNumber: string,
    loggedInUserId: number,
    page: number,
    size: number,
    selectedStatus: string,
    projectId: number,
    vendorId: number,
    startDate: any,
    endDate: any
  ): Observable<Page<WorkOrderBillingsDto>> {
    console.log(workOrderNumber, page, size);
    workOrderNumber = workOrderNumber === undefined ? '' : workOrderNumber;
    loggedInUserId = loggedInUserId === undefined ? 0 : loggedInUserId;
    projectId === undefined || projectId === null ? '' : 0;
    vendorId === undefined || vendorId === null ? '' : 0;
    startDate = startDate === undefined || startDate === null ? '' : startDate;
    endDate = endDate === undefined || endDate === null ? '' : endDate;
    selectedStatus = selectedStatus === 'All' ? '' : selectedStatus;
    return this.http.get<Page<WorkOrderBillingsDto>>(
      `${environment.procurementBaseUrl}${GETALL_APPROVED_REJECTD_WORK_ORDER_BILLINGS}?workOrderNumber=${workOrderNumber}&loggedInUserId=${loggedInUserId}&page=${page}&size=${size}&status=${selectedStatus}&projectId=${projectId}&vendorId=${vendorId}&startDate=${startDate}&endDate=${endDate}`
    );
  }

  getReworkWorkOrderBillingsBasedOnLoggedIn(
    workOrderNumber: string,
    loggedInUserId: number,
    page: number,
    size: number,
    selectedStatus: string,
    projectId: number,
    vendorId: number,
    startDate: any,
    endDate: any
  ): Observable<Page<WorkOrderBillingsDto>> {
    console.log(workOrderNumber, page, size);
    workOrderNumber = workOrderNumber === undefined ? '' : workOrderNumber;
    loggedInUserId = loggedInUserId === undefined ? 0 : loggedInUserId;
    projectId === undefined || projectId === null ? '' : 0;
    vendorId === undefined || vendorId === null ? '' : 0;
    startDate = startDate === undefined || startDate === null ? '' : startDate;
    endDate = endDate === undefined || endDate === null ? '' : endDate;
    selectedStatus = selectedStatus === 'All' ? '' : selectedStatus;
    return this.http.get<Page<WorkOrderBillingsDto>>(
      `${environment.procurementBaseUrl}${GETALL_REWORK_WORK_ORDER_BILLINGS}?workOrderNumber=${workOrderNumber}&loggedInUserId=${loggedInUserId}&page=${page}&size=${size}&status=${selectedStatus}&projectId=${projectId}&vendorId=${vendorId}&startDate=${startDate}&endDate=${endDate}`
    );
  }

  //added siva

  getStages(billingId: number) {
    return this.http.get<any[]>(
      `${environment.procurementBaseUrl}${GETALL_WORK_ORDER_BILLING_STAGES}?billingId=${billingId}`
    );
  }

  //move for approval

  sendForApproval(workOrderBillingId: number) {
    return this.http
      .get<any[]>(
        `${environment.procurementBaseUrl}${SEND_TO_WORK_FLOW}?workOrderBillingId=${workOrderBillingId}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next();
        })
      );
  }

  sendForApprovalAfterReworkOrReject(
    workOrderBillingId: number,
    workOrderBillingStatus: string
  ) {
    return this.http
      .get<any[]>(
        `${environment.procurementBaseUrl}${SEND_WOB_TO_WORK_FLOW_AFRER_REWORK}?workOrderBillingId=${workOrderBillingId}&workOrderBillingStatus=${workOrderBillingStatus}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next();
        })
      );
  }
}
