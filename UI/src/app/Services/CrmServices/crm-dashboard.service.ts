import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  GET_APPROVED_AMOUNT,
  GET_PAID_AMOUNT,
  GET_PENDING_AMOUNT,
  GET_PENDING_SALE_AGREEMENTS,
  GET_TOTAL_AMOUNT,
  GET_UNITS_COUNT,
  GET_WAITINGFORAPPROVAL_AMOUNT,
} from 'src/app/Apis/CrmApis/PaymentDetailsApis';
import { IApprovedCount, IPaymentCount } from 'src/app/Models/Crm/dashboard';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class DashBoardService {
  constructor(private http: HttpClient) {}

  // Define refreshRequired as a Subject
  private _refreshRequired = new Subject<void>();
  public refreshRequired = this._refreshRequired.asObservable();

  getPaidAmount(
    projectId?: any,
    stageId?: any,
    customerName?: string,
    paymentStatusId?: any,
    actionStatusId?: number,
    phoneNumber?: string,
    unitId?: number,
    transactionTypeId?: number,
    blockId?: any,
    planId?: any,
    status?: string,
    typeId?: number
  ): Observable<IPaymentCount> {
    if (projectId === undefined || projectId === 0) projectId = '';
    if (stageId === undefined || stageId === 0) stageId = '';
    customerName = customerName === undefined ? '' : customerName;
    paymentStatusId = paymentStatusId === undefined ? '' : paymentStatusId;
    actionStatusId = actionStatusId === undefined ? 0 : actionStatusId;
    phoneNumber = phoneNumber === undefined ? '' : phoneNumber;
    unitId = unitId === undefined ? 0 : unitId;
    transactionTypeId = transactionTypeId === undefined ? 0 : transactionTypeId;
    if (blockId === undefined || blockId === 0) blockId = '';
    if (planId === undefined || planId === 0) planId = '';
    typeId = typeId === undefined ? 0 : typeId;
    return this.http.get<IPaymentCount>(
      `${environment.projectBaseUrl}${GET_PAID_AMOUNT}?projectId=${projectId}&stageId=${stageId}&customerName=${customerName}&paymentStatusId=${paymentStatusId}&actionStatusId=${actionStatusId}&phoneNumber=${phoneNumber}&unitId=${unitId}&transactionTypeId=${transactionTypeId}&blockId=${blockId}&planId=${planId}&status=${status}&typeId=${typeId}`
    );
  }

  getPendingAmount(
    projectId?: any,
    stageId?: any,
    customerName?: string,
    paymentStatusId?: any,
    actionStatusId?: number,
    phoneNumber?: string,
    unitId?: number,
    transactionTypeId?: number,
    blockId?: any,
    planId?: any,
    status?: string,
    typeId?: number
  ): Observable<IPaymentCount> {
    if (projectId === undefined || projectId === 0) projectId = '';
    if (stageId === undefined || stageId === 0) stageId = '';
    customerName = customerName === undefined ? '' : customerName;
    paymentStatusId = paymentStatusId === undefined ? '' : paymentStatusId;
    actionStatusId = actionStatusId === undefined ? 0 : actionStatusId;
    phoneNumber = phoneNumber === undefined ? '' : phoneNumber;
    unitId = unitId === undefined ? 0 : unitId;
    transactionTypeId = transactionTypeId === undefined ? 0 : transactionTypeId;
    if (blockId === undefined || blockId === 0) blockId = '';
    if (planId === undefined || planId === 0) planId = '';
    typeId = typeId === undefined ? 0 : typeId;
    return this.http.get<IPaymentCount>(
      `${environment.projectBaseUrl}${GET_PENDING_AMOUNT}?projectId=${projectId}&stageId=${stageId}&customerName=${customerName}&paymentStatusId=${paymentStatusId}&actionStatusId=${actionStatusId}&phoneNumber=${phoneNumber}&unitId=${unitId}&transactionTypeId=${transactionTypeId}&blockId=${blockId}&planId=${planId}&status=${status}&typeId=${typeId}`
    );
  }
  getTotalAmount(
    projectId?: any,
    stageId?: any,
    customerName?: string,
    paymentStatusId?: any,
    actionStatusId?: number,
    phoneNumber?: string,
    unitId?: number,
    transactionTypeId?: number,
    blockId?: any,
    planId?: any,
    status?: string,
    typeId?: number
  ): Observable<IPaymentCount> {
    if (projectId === undefined || projectId === 0) projectId = '';
    if (stageId === undefined || stageId === 0) stageId = '';
    customerName = customerName === undefined ? '' : customerName;
    paymentStatusId = paymentStatusId === undefined ? '' : paymentStatusId;
    actionStatusId = actionStatusId === undefined ? 0 : actionStatusId;
    phoneNumber = phoneNumber === undefined ? '' : phoneNumber;
    unitId = unitId === undefined ? 0 : unitId;
    transactionTypeId = transactionTypeId === undefined ? 0 : transactionTypeId;
    if (blockId === undefined || blockId === 0) blockId = '';
    if (planId === undefined || planId === 0) planId = '';
    typeId = typeId === undefined ? 0 : typeId;
    return this.http.get<IPaymentCount>(
      `${environment.projectBaseUrl}${GET_TOTAL_AMOUNT}?projectId=${projectId}&stageId=${stageId}&customerName=${customerName}&paymentStatusId=${paymentStatusId}&actionStatusId=${actionStatusId}&phoneNumber=${phoneNumber}&unitId=${unitId}&transactionTypeId=${transactionTypeId}&blockId=${blockId}&planId=${planId}&status=${status}&typeId=${typeId}`
    );
  }

  getApprovedAndWaitingForApprovalAmount(
    projectId: any,
    typeCommonReferenceDetailsId: number,
    applicantName?: string,
    actionStatusId?: number,
    unitId?: any,
    transactionTypeId?: number,
    status?: string,
    typeId?: number,
    blockId?: any
  ): Observable<IApprovedCount> {
    if (projectId === undefined || projectId === 0) projectId = '';
    applicantName = applicantName === undefined ? '' : applicantName;
    actionStatusId = actionStatusId === undefined ? 0 : actionStatusId;
    unitId = unitId === undefined ? '' : unitId;
    transactionTypeId = transactionTypeId === undefined ? 0 : transactionTypeId;
    typeId = typeId === undefined ? 0 : typeId;
    status = status === undefined ? '' : status;
    if (blockId === undefined || blockId === 0) blockId = '';
    return this.http.get<IApprovedCount>(
      `${environment.projectBaseUrl}${GET_APPROVED_AMOUNT}?projectId=${projectId}&typeCommonReferenceDetailsId=${typeCommonReferenceDetailsId}&applicantName=${applicantName}&actionStatusId=${actionStatusId}&unitId=${unitId}&transactionTypeId=${transactionTypeId}&status=${status}&blockId=${blockId}&typeId=${typeId}`
    );
  }

  getSaleAgreementsCount(
    projectId?: any,
    blockId?: any,
    status?: string,
    typeId?: number
  ): Observable<IPaymentCount> {
    if (projectId === undefined || projectId === 0) projectId = '';
    if (blockId === undefined || blockId === 0) blockId = '';
    typeId = typeId === undefined ? 0 : typeId;
    status = status === undefined ? '' : status;
    return this.http.get<IPaymentCount>(
      `${environment.projectBaseUrl}${GET_PENDING_SALE_AGREEMENTS}?projectId=${projectId}&blockId=${blockId}&status=${status}&typeId=${typeId}`
    );
  }
  getUnitsCount(
    projectId?: any,
    blockId?: any,
    stageId?: any,
    typeId?: number
  ): Observable<IPaymentCount> {
    if (projectId === undefined || projectId === 0) projectId = '';
    if (stageId === undefined || stageId === 0) stageId = '';
    if (blockId === undefined || blockId === 0) blockId = '';
    typeId = typeId === undefined ? 0 : typeId;
    return this.http.get<IPaymentCount>(
      `${environment.projectBaseUrl}${GET_UNITS_COUNT}?projectId=${projectId}&blockId=${blockId}&typeId=${typeId}`
    );
  }
  getwaitingForApprovalAmount(
    projectId?: any,
    blockId?: any,
    unitId?: any,
    status?: string,
    isAccountTeam?: boolean,
    planId?: any,
    typeId?: number
  ): Observable<IApprovedCount> {
    if (projectId === undefined || projectId === 0) projectId = '';
    if (blockId === undefined || blockId === 0) blockId = '';
    unitId = unitId === undefined ? 0 : unitId;
    isAccountTeam = isAccountTeam === undefined ? false : isAccountTeam;
    status = status === undefined ? '' : status;
    typeId = typeId === undefined ? 0 : typeId;
    if (planId === undefined || planId === 0) planId = '';
    return this.http.get<IApprovedCount>(
      `${environment.projectBaseUrl}${GET_WAITINGFORAPPROVAL_AMOUNT}?projectId=${projectId}&blockId=${blockId}&unitId=${unitId}&status=${status}&isAccountTeam=${isAccountTeam}&typeId=${typeId}`
    );
  }
}
