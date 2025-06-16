import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import {
  FETCH_PO,
  GET_APPROVAL_PURCHASE_ORDERS,
  GET_APPROVED_PURCHASE_ORDERS,
  GET_NON_PENDING_PURCHASE_ORDERS,
  GET_PURCHASE_ORDER_BY_ID,
  GET_SPEC,
  PO_PDF_GENERATE,
  PO_SEND_TO_WORKFLOW,
  SAVE_PURCHASE_ORDER,
  UPDATE_PURCHASE_ORDER,
} from 'src/app/Apis/ProcurementApis/PurchaseOrder';
import { Page } from 'src/app/Models/CommanModel/Page';
import {
  IPurchaseOrderDto,
  PurchaseOrder,
} from 'src/app/Models/Procurement/purchaseorder';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PurchaseOrderService {
  // Define refreshRequired as a Subject
  private _refreshRequired = new Subject<void>();
  public refreshRequired = this._refreshRequired.asObservable();
  constructor(private http: HttpClient) {}

  savePurchaseOrder(purchaseOrder: PurchaseOrder): Observable<any> {
    console.log('save:', purchaseOrder);
    return this.http.post<any>(
      `${environment.procurementBaseUrl}${SAVE_PURCHASE_ORDER}`,
      purchaseOrder
    );
  }

  //fetching all purchase orders with pagination
  getAllPurcahseOrdersByQuotationId(
    page: number,
    size: number,
    quotationId: number,
    purchaseOrderCode: string,
    projectId: number,
    vendorId: number,
    quotationCode: string,
    stageOwner: string,
    startDate: any,
    endDate: any,
    loggedInUserId: number
  ): Observable<Page<IPurchaseOrderDto[]>> {
    startDate = startDate === undefined || startDate === null ? '' : startDate;
    endDate = endDate === undefined || endDate === null ? '' : endDate;
    return this.http.get<Page<IPurchaseOrderDto[]>>(
      `${environment.procurementBaseUrl}${GET_SPEC}?page=${page}&size=${size}&quotationId=${quotationId}&purchaseOrderCode=${purchaseOrderCode}&projectId=${projectId}&vendorId=${vendorId}&quotationCode=${quotationCode}&stageOwner=${stageOwner}&startDate=${startDate}&endDate=${endDate}&loggedInUserId=${loggedInUserId}`
    );
  }

  //move to work flow
  movePurchaseOrderToWorkFlow(
    purchaseOrderId: number,
    createdUserId: number
  ): Observable<any> {
    return this.http
      .get<any>(
        `${environment.procurementBaseUrl}${PO_SEND_TO_WORKFLOW}?incidentId=${purchaseOrderId}&createdUserId=${createdUserId}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next();
        })
      );
  }

  //get pending  quotations fro approval
  getApprovalPurchaseOrdersByUserId(
    userId: number,
    page: number,
    size: number,
    purchaseOrderCode: string,
    projectId: number,
    vendorId: number,
    quotationCode: string,
    stageOwner: string,
    startDate: any,
    endDate: any
  ) {
    userId = userId === undefined ? 0 : userId;
    projectId === undefined || projectId === null ? '' : 0;
    purchaseOrderCode =
      purchaseOrderCode === undefined ? '' : purchaseOrderCode;
    startDate = startDate === undefined || startDate === null ? '' : startDate;
    endDate = endDate === undefined || endDate === null ? '' : endDate;
    return this.http.get<any>(
      `${environment.procurementBaseUrl}${GET_APPROVAL_PURCHASE_ORDERS}?userId=${userId}&page=${page}&size=${size}&purchaseOrderCode=${purchaseOrderCode}&startDate=${startDate}&endDate=${endDate}&projectId=${projectId}&vendorId=${vendorId}&quotationCode=${quotationCode}&stageOwner=${stageOwner}`
    );
  }

  //get except pending  for quotation approval
  getApproveOrRejectedOrReworkedPurchaseOrdersByUserId(
    userId: number,
    page: number,
    size: number,
    purchaseOrderCode: string,
    projectId: number,
    vendorId: number,
    quotationCode: string,
    stageOwner: string,
    startDate: any,
    endDate: any
  ) {
    userId = userId === undefined ? 0 : userId;
    projectId === undefined || projectId === null ? '' : 0;
    purchaseOrderCode =
      purchaseOrderCode === undefined ? '' : purchaseOrderCode;
    stageOwner = stageOwner === undefined ? '' : stageOwner;
    startDate = startDate === undefined || startDate === null ? '' : startDate;
    endDate = endDate === undefined || endDate === null ? '' : endDate;
    return this.http.get<any>(
      `${environment.procurementBaseUrl}${GET_APPROVED_PURCHASE_ORDERS}?userId=${userId}&page=${page}&size=${size}&purchaseOrderCode=${purchaseOrderCode}&startDate=${startDate}&endDate=${endDate}&projectId=${projectId}&stageOwner=${stageOwner}&vendorId=${vendorId}&quotationCode=${quotationCode}`
    );
  }

  fetchNonPenidngPurchaseOrders(
    page: number,
    size: number,
    purchaseOrderCode: string,
    projectId: number,
    vendorId: number,
    quotationCode: string,
    stageOwner: string,
    startDate: any,
    endDate: any,
    loggedInUserId: number
  ) {
    projectId === undefined || projectId === null ? '' : 0;
    purchaseOrderCode =
      purchaseOrderCode === undefined ? '' : purchaseOrderCode;
    stageOwner = stageOwner === undefined ? '' : stageOwner;
    startDate = startDate === undefined || startDate === null ? '' : startDate;
    endDate = endDate === undefined || endDate === null ? '' : endDate;
    return this.http.get<any>(
      `${environment.procurementBaseUrl}${GET_NON_PENDING_PURCHASE_ORDERS}?page=${page}&size=${size}&purchaseOrderCode=${purchaseOrderCode}&projectId=${projectId}&vendorId=${vendorId}&quotationCode=${quotationCode}&stageOwner=${stageOwner}&startDate=${startDate}&endDate=${endDate}&loggedInUserId=${loggedInUserId}`
    );
  }

  //update purchase order
  updatePurchaseOrder(purchaseOrder: PurchaseOrder) {
    console.log('update:', purchaseOrder);
    return this.http.put<any>(
      `${environment.procurementBaseUrl}${UPDATE_PURCHASE_ORDER}`,
      purchaseOrder
    );
  }

  // Method to fetch all purchase orders based on organizationId for inventory receivables
  fetchAllPurchaseOrders(
    code: string,
    organizationId: number,
    userId?: any
  ): Observable<PurchaseOrder[]> {
    if (code == undefined || 0) code = '';
    if (userId == undefined || 0) userId = '';
    const url = `${environment.procurementBaseUrl}${FETCH_PO}?organizationId=${organizationId}&purchaseOrderCode=${code}&userId=${userId}`;
    return this.http.get<PurchaseOrder[]>(url);
  }
  getPOById(poId: number): Observable<any> {
    return this.http.get<any>(
      `${environment.procurementBaseUrl}${GET_PURCHASE_ORDER_BY_ID}/${poId}`
    );
  }

  generatePoPdf(purchaseOrderId: number) {
    return this.http.get(
      `${environment.procurementBaseUrl}${PO_PDF_GENERATE}?purchaseOrderId=${purchaseOrderId}`,
      { responseType: 'text' }
    );
  }
}
