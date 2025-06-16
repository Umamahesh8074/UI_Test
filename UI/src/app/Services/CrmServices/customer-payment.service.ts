import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import {
  GET_ALL_CUSTOMER_PAYMENT_UNITS,
  GET_ALL_CUSTOMER_PAYMENTS,
  GET_APPROVAL_CUSTOMER_PAYMENTS,
  GET_CUSTOMER_PAYMENT_BY_ID,
  SAVE_CUSTOMER_PAYMENT,
  SAVE_PAYMENT_DETAILS,
  UPDATE_CUSTOMER_PAYMENT,
  UPDATE_PAYMENT_DETAILS,
} from 'src/app/Apis/CrmApis/PaymentDetailsApis';
import { Page } from 'src/app/Models/CommanModel/Page';
import { IPaymentDetailsDto } from 'src/app/Models/Crm/PaymentDetails';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CustomerPaymentService {
  constructor(private http: HttpClient) {}

  // Define refreshRequired as a Subject
  private _refreshRequired = new Subject<void>();
  public refreshRequired = this._refreshRequired.asObservable();

  getAllCustomerPayments(
    customerPaymentId: number,
    stageId: number,
    stageName: string,
    page: number,
    size: number,
    userId: number,
    actionBy: string,
    startDate: any,
    endDate: any,
    actionStatusId: number
  ): Observable<Page<IPaymentDetailsDto>> {
    actionStatusId = actionStatusId === undefined ? 0 : actionStatusId;

    return this.http.get<Page<IPaymentDetailsDto>>(
      `${environment.projectBaseUrl}${GET_ALL_CUSTOMER_PAYMENTS}?&customerPaymentId=${customerPaymentId}&page=${page}&size=${size}&stageId=${stageId}&stageName=${stageName}&logedInUserId=${userId}&startDate=${startDate}&endDate=${endDate}&actionBy=${actionBy}&actionStatusId=${actionStatusId}`
    );
  }

  addCustomerPaymentDetails(
    paymentLedger: any,
    files?: { check?: any },
    files1?: { challana?: any },
    files2?: { email?: any },
    isFromCustomePayment?: boolean
  ): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('paymentLedger', JSON.stringify(paymentLedger));
    if (files && files.check) {
      formData.append('check', files.check);
    }
    if (files1 && files1.challana) {
      formData.append('challanaUrl', files1.challana);
    }
    if (files2 && files2.email) {
      formData.append('mailUrl', files2.email);
    }
    if (isFromCustomePayment) {
      formData.append('isFromCustomerPayment', isFromCustomePayment.toString());
    }

    return this.http.post<string>(
      `${environment.projectBaseUrl}${SAVE_PAYMENT_DETAILS}`,
      formData
    );
  }

  updateCustomerPaymentDetails(
    customerpaymentDetails: any,
    files?: { check?: any },
    files1?: { challana?: any },
    files2?: { email?: any }
  ): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('paymentLedger', JSON.stringify(customerpaymentDetails));
    if (files && files.check) {
      formData.append('check', files.check);
    }
    if (files1 && files1.challana) {
      formData.append('challanaUrl', files1.challana);
    }
    if (files2 && files2.email) {
      formData.append('mailUrl', files2.email);
    }

    return this.http.put<string>(
      `${environment.projectBaseUrl}${UPDATE_PAYMENT_DETAILS}`,
      formData
    );
  }

  getCustomerPaymentUnits(
    unitId: number,
    stageId?: number,
    transactionTypeId?: number
  ) {
    return this.http.get<any>(
      `${environment.projectBaseUrl}${GET_ALL_CUSTOMER_PAYMENT_UNITS}?unitId=${unitId}&stageId=${stageId}&transactionTypeId=${transactionTypeId}`
    );
  }

  getCustomerPaymentsForApprove(
    page: number,
    size: number,
    loggedInUserId: number,
    startDate: any,
    endDate: any,
    customerName: string,
    selectedStatus: string,
    actionBy: string,
    stageId: number,
    stageName: string,
    paymentStatusId?: number,
    actionStatusId?: number,
    projectId?: number,
    unitName?: string,
    transActionTypeId?: number,
    blockId?: number,
    unitId?: number,
    typeId?: number
  ) {
    selectedStatus = selectedStatus === 'All' ? '' : selectedStatus;
    paymentStatusId = paymentStatusId === undefined ? 0 : paymentStatusId;
    actionStatusId = actionStatusId === undefined ? 0 : actionStatusId;
    projectId = projectId === undefined ? 0 : projectId;
    transActionTypeId = transActionTypeId === undefined ? 0 : transActionTypeId;
    blockId = blockId === undefined ? 0 : blockId;
    unitId = unitId === undefined ? 0 : unitId;
    typeId = typeId === undefined ? 0 : typeId;
    return this.http.get<Page<any>>(
      `${environment.projectBaseUrl}${GET_APPROVAL_CUSTOMER_PAYMENTS}?page=${page}&size=${size}&loggedInUserId=${loggedInUserId}&customerName=${customerName}&actionBy=${actionBy}&status=${selectedStatus}&startDate=${startDate}&endDate=${endDate}&stageId=${stageId}&stageName=${stageName}&paymentStatusId=${paymentStatusId}&actionStatusId=${actionStatusId}&projectId=${projectId}&unitName=${unitName}&transActionTypeId=${transActionTypeId}&blockId=${blockId}&unitId=${unitId}&typeId=${typeId}`
    );
  }

  getCustomerPaymentById(customerPaymentId: number): Observable<any> {
    return this.http.get<any>(
      `${environment.projectBaseUrl}${GET_CUSTOMER_PAYMENT_BY_ID}/${customerPaymentId}`
    );
  }
}
