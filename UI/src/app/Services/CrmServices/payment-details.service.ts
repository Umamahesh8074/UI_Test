import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import {
  GENERATE_PAYMENT_RECEIPT,
  GENERATE_PAYMENT_SOA,
  GET_ALL_PAYMENT_DETAILS,
  GET_ALL_PAYMENT_LEDGER,
  GET_FOLLOWUPS_PAYMENTS_AND_APPLICANT_DETAILS,
  GET_PAYMENT_LEDGER_BY_PAYMENT_LEDGER_BY_APPLICANT_ID,
  GET_PAYMENT_LEDGER_BY_PAYMENT_LEDGER_BY_ID,
  PAYMENT_DETAILS_BY_ID,
  PAYMENT_DETAILS_BY_STAGE_ID,
  SAVE_PAYMENT_DETAILS,
  UPDATE_APPROVAL_STATUS,
  UPDATE_PAYMENT_DETAILS,
} from 'src/app/Apis/CrmApis/PaymentDetailsApis';

import {
  IPaymentDetails,
  IPaymentDetailsDto,
  paymentLedger,
} from 'src/app/Models/Crm/PaymentDetails';
import {
  CustomerStagesPaymentsDto,
  FollowUpApplicantAndPaymentsDto,
} from 'src/app/Models/Customer/StagesAndPayments';
import { Page } from 'src/app/Models/User/menuItem';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentDetailsService {
  constructor(private http: HttpClient) {}

  // Define refreshRequired as a Subject
  private _refreshRequired = new Subject<void>();
  public refreshRequired = this._refreshRequired.asObservable();

  addPaymentDetails(
    paymentDetails: IPaymentDetails,
    files?: { check?: any }
  ): Observable<string> {
    console.log(paymentDetails);
    const formData: FormData = new FormData();
    formData.append('paymentDetails', JSON.stringify(paymentDetails));
    console.log(formData);

    console.log(files?.check);
    // Append files to formData
    if (files && files.check) {
      formData.append('check', files.check);
    }

    return this.http.post<string>(
      `${environment.projectBaseUrl}${SAVE_PAYMENT_DETAILS}`,
      formData
    );
  }

  getAllPaymentDetails(
    applicantName: string,
    stageId: any,
    page: number,
    size: number,
    // userId: number,
    paymentDetailsId: number,
    paymentStatusId?: any,
    actionStatusId?: number,
    projectId?: any,
    startDate?: any,
    endDate?: any,
    phoneNumber?: string,
    stageOrder?: number[],
    typeId?: number,
    unitid?: number,
    transactionTypeId?: number,
    blockId?: any,
    planId?: any,
    applicantId?: number
  ): Observable<Page<IPaymentDetailsDto>> {
    // Default values for undefined parameters
    if (stageId === undefined || stageId === 0) stageId = '';
    paymentDetailsId = paymentDetailsId ?? NaN;
    actionStatusId = actionStatusId ?? 0;
    paymentStatusId = paymentStatusId ?? '';
    if (projectId === undefined || projectId === 0) projectId = '';
    startDate = startDate ?? '';
    endDate = endDate ?? '';
    phoneNumber = phoneNumber ?? '';
    stageOrder = stageOrder ?? [];
    typeId = typeId ?? 0;
    unitid = unitid ?? 0;
    transactionTypeId = transactionTypeId ?? 0;
    console.log(applicantName, page, size, stageId);
    console.log(`${paymentStatusId} status...`);
    if (planId === undefined || planId === 0) planId = '';
    applicantId = applicantId ?? 0;
    if (blockId === undefined || blockId === 0) blockId = '';
    // Construct the HTTP request URL with parameters
    return this.http.get<Page<IPaymentDetailsDto>>(
      `${environment.projectBaseUrl}${GET_ALL_PAYMENT_DETAILS}` +
        `?customerName=${applicantName}` +
        `&page=${page}` +
        `&size=${size}` +
        `&stageId=${stageId}` +
        `&paymentDetailsId=${paymentDetailsId}` +
        `&paymentStatusId=${paymentStatusId}` +
        `&actionStatusId=${actionStatusId}` +
        `&projectId=${projectId}` +
        `&startDate=${startDate}` +
        `&endDate=${endDate}` +
        `&phoneNumber=${phoneNumber}` +
        `&stageOrder=${stageOrder.join(',')}` +
        `&typeId=${typeId}` +
        `&unitId=${unitid}` +
        `&transactionTypeId=${transactionTypeId}` +
        `&blockId=${blockId}` +
        `&planId=${planId}` +
        `&applicantId=${applicantId}`
    );
  }

  getpaymentDetailsById(paymentDetailsId: number): Observable<IPaymentDetails> {
    return this.http.get<IPaymentDetails>(
      `${environment.projectBaseUrl}${PAYMENT_DETAILS_BY_ID}${paymentDetailsId}`
    );
  }
  updatePaymentDetails(
    paymentDetails: IPaymentDetails,
    files?: { check?: any }
  ): Observable<string> {
    console.log(paymentDetails);
    const formData: FormData = new FormData();
    formData.append('paymentDetails', JSON.stringify(paymentDetails));
    console.log(formData);

    console.log(files?.check);
    // Append files to formData
    if (files && files.check) {
      formData.append('check', files.check);
    }
    return this.http.put<string>(
      `${environment.projectBaseUrl}${UPDATE_PAYMENT_DETAILS}`,
      formData
    );
  }
  updateApprovalStatus(
    incidentId: number,
    workflowTypeId: number,
    userId: number,
    status: string,
    remarks: string,
    logedInUserId: string
  ) {
    return this.http.get<String>(
      `${environment.projectBaseUrl}${UPDATE_APPROVAL_STATUS}?incidentId=${incidentId}&workFlowTypeId=${workflowTypeId}&status=${status}&remarks=${remarks}&userId=${userId}&logedInUserId=${logedInUserId}`
    );
  }

  getpaymentDetailsByIdForAdding(
    applicantId: number,
    stageId: number,
    paymentDetailsId: number
  ): Observable<IPaymentDetails> {
    return this.http.get<IPaymentDetails>(
      `${environment.projectBaseUrl}${PAYMENT_DETAILS_BY_STAGE_ID}?applicantId=${applicantId}&stageId=${stageId}&paymentDetailsId=${paymentDetailsId}`
    );
  }
  generateReceipt(
    paymentLedgerId: number,
    projectName?: string
  ): Observable<string> {
    const url = `${environment.projectBaseUrl}${GENERATE_PAYMENT_RECEIPT}?paymentLedgerId=${paymentLedgerId}&projectName=${projectName}`;
    return this.http.get(url, { responseType: 'text' }).pipe(
      tap(() => {
        this._refreshRequired.next();
      })
    );
  }
  generateSoa(applicantId: number, projectName: string): Observable<string> {
    const url = `${environment.projectBaseUrl}${GENERATE_PAYMENT_SOA}?applicantId=${applicantId}&projectName=${projectName}`;
    return this.http.get(url, { responseType: 'text' }).pipe(
      tap(() => {
        this._refreshRequired.next();
      })
    );
  }

  getAllPaymentLedger(
    page: number,
    size: number,
    projectId: any,
    typeCommonReferenceDetailsId: number,
    actionStatusId?: number,
    unitId?: any,
    transactionTypeId?: number,
    applicantName?: string,
    roleName?: string,
    blockId?: any,
    typeId?: number
  ): Observable<Page<IPaymentDetailsDto>> {
    actionStatusId = actionStatusId ?? 0;
    if (projectId === undefined || projectId === 0) projectId = '';
    if (blockId === undefined || blockId === 0) blockId = '';
    unitId = unitId ?? 0;
    transactionTypeId = transactionTypeId ?? 0;
    roleName = roleName ?? '';
    typeId = typeId ?? 0;
    return this.http.get<Page<IPaymentDetailsDto>>(
      `${environment.projectBaseUrl}${GET_ALL_PAYMENT_LEDGER}` +
        `?&page=${page}` +
        `&size=${size}` +
        `&projectId=${projectId}` +
        `&typeCommonReferenceDetailsId=${typeCommonReferenceDetailsId}` +
        `&actionStatusId=${actionStatusId}` +
        `&unitId=${unitId}` +
        `&transactionTypeId=${transactionTypeId}` +
        `&applicantName=${applicantName}` +
        `&roleName=${roleName}` +
        `&blockId=${blockId}` +
        `&typeId=${typeId}`
    );
  }
  getPaymentLedgerById(paymentLedgerId: number): Observable<paymentLedger> {
    console.log(paymentLedgerId);
    return this.http.get<paymentLedger>(
      `${environment.projectBaseUrl}${GET_PAYMENT_LEDGER_BY_PAYMENT_LEDGER_BY_ID}${paymentLedgerId}`
    );
  }

  getPaymentLedgerByApplicantId(
    applicantId: number
  ): Observable<paymentLedger> {
    console.log(applicantId);
    return this.http.get<paymentLedger>(
      `${environment.projectBaseUrl}${GET_PAYMENT_LEDGER_BY_PAYMENT_LEDGER_BY_APPLICANT_ID}${applicantId}`
    );
  }

  getFollowUpPayments(
    applicantId: number,
    stageId: number
  ): Observable<FollowUpApplicantAndPaymentsDto> {
    console.log(applicantId);
    return this.http.get<FollowUpApplicantAndPaymentsDto>(
      `${environment.projectBaseUrl}${GET_FOLLOWUPS_PAYMENTS_AND_APPLICANT_DETAILS}?applicantId=${applicantId}&stageId=${stageId}`
    );
  }
}
