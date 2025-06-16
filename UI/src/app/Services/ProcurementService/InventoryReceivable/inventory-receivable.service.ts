import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  GetInventoryReceivablesDto,
  IInventoryReceivables,
  InventoryReceivables,
  InventoryReceivablesDto,
} from 'src/app/Models/Procurement/inventory-receivable';
import {
  APP_REJ_IR,
  DELETE_INVENTORY_RECEIVABLE,
  DISPLAY_PENDING_IR,
  GET_ALL,
  GET_ALL_INVENTORY_RECEIVABLE_ITEM,
  GET_ALL_INVENTORY_RECEIVABLE_STAGES,
  GET_INVENTORY_RECEIVABLE_BY_ID,
  GET_INVENTORY_RECEIVABLE_HISTORY,
  GET_INVENTORY_RECEIVABLES,
  GETALL_INVENTORY_RECEIVABLES,
  NON_PENDING_IR,
  PENDING_IR,
  QUOTATION_ITEM_INVENTORY_RECEIVABLES,
  SAVE_INVENTORY_RECEIVABLE,
  UPDATE_INVENTORY_RECEIVABLE,
  UPDATE_INVENTORYRECEIVABLE,
  UPDATE_INVENTORYRECEIVABLE_HISTORY,
} from 'src/app/Apis/ProcurementApis/InventoryReceivable';
import { Page } from 'src/app/Models/User/User';

@Injectable({
  providedIn: 'root',
})
export class InventoryReceivableService {
  constructor(private http: HttpClient) {}

  // Define refreshRequired as a Subject
  private _refreshRequired = new Subject<void>();
  public refreshRequired = this._refreshRequired.asObservable();

  getAllInventoryReceivables(
    projectId: any,
    vendorId: any,
    categoryId: any,
    irId: any,
    poId: any,
    subCategoryId: any,
    specificationId: any,
    inventoryUnitId: any,
    storeId: any,
    page: number,
    size: number,
    workTypeId: any,
    userId: any
  ): Observable<Page<GetInventoryReceivablesDto>> {
    if (projectId == undefined || projectId === 0) projectId = '';
    if (vendorId == undefined || vendorId === 0) vendorId = '';
    if (categoryId == undefined || categoryId === 0) categoryId = '';

    if (irId == undefined || irId === 0) irId = '';
    if (poId == undefined || poId === 0) poId = '';
    if (subCategoryId == undefined || subCategoryId === 0) subCategoryId = '';
    if (specificationId == undefined || specificationId === 0)
      specificationId = '';
    if (inventoryUnitId == undefined || inventoryUnitId === 0)
      inventoryUnitId = '';
    if (storeId == undefined || storeId === 0) storeId = '';
    if (workTypeId == undefined || workTypeId === 0) workTypeId = '';
    return this.http.get<Page<GetInventoryReceivablesDto>>(
      `${environment.procurementBaseUrl}${GET_INVENTORY_RECEIVABLES}?projectId=${projectId}&vendorId=${vendorId}&categoryId=${categoryId}&irId=${irId}&poId=${poId}&subCategoryId=${subCategoryId}&specificationId=${specificationId}&inventoryUnitId=${inventoryUnitId}&storeId=${storeId}&page=${page}&size=${size}&workTypeId=${workTypeId}&userId=${userId}`
    );
  }

  // Fetch inventory receivables by PO ID
  getInventoryReceivablesByPoId(
    poId: number
  ): Observable<IInventoryReceivables[]> {
    return this.http.get<IInventoryReceivables[]>(
      `${environment.procurementBaseUrl}${GETALL_INVENTORY_RECEIVABLES}?poId=${poId}`
    );
  }

  // Add new inventory receivable
  addInventoryReceivable(
    inventoryReceivable: IInventoryReceivables
  ): Observable<string> {
    return this.http.post<string>(
      `${environment.procurementBaseUrl}${SAVE_INVENTORY_RECEIVABLE}`,
      inventoryReceivable
    );
  }

  // Update an existing inventory receivable
  updateInventoryReceivable(
    inventoryReceivable: InventoryReceivables
  ): Observable<string> {
    return this.http.put<string>(
      `${environment.procurementBaseUrl}${UPDATE_INVENTORY_RECEIVABLE}`,
      inventoryReceivable
    );
  }

  // Delete an inventory receivable
  deleteInventoryReceivable(irId: number): Observable<string> {
    return this.http
      .delete<string>(
        `${environment.procurementBaseUrl}${DELETE_INVENTORY_RECEIVABLE}/${irId}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next();
        })
      );
  }

  // Get inventory receivables without pagination (for example, for fetching data by specific PO ID)
  getInventoryReceivablesWithoutPagination(
    poId: number
  ): Observable<IInventoryReceivables[]> {
    return this.http.get<IInventoryReceivables[]>(
      `${environment.procurementBaseUrl}${GETALL_INVENTORY_RECEIVABLES}?poId=${poId}`
    );
  }

  getInventoryReceivables(
    poId: number,

    page: number,
    size: number
  ): Observable<any> {
    return this.http.get<InventoryReceivablesDto[]>(
      `${environment.procurementBaseUrl}${GETALL_INVENTORY_RECEIVABLES}?poId=${poId}&page=${page}&size=${size}`
    );
  }

  getInventoryDetailsById(irId: any): Observable<any> {
    if (irId == undefined || irId === 0) irId = '';
    return this.http.get<any>(
      `${environment.procurementBaseUrl}${GET_INVENTORY_RECEIVABLE_BY_ID}/getbyirid?irhId=${irId}`
    );
  }

  validateQuantity(
    poId: any,
    quotationItemId: any,
    itemUnitId: any,
    quantityReceived: any,
    irId: any
  ): Observable<any> {
    if (poId == undefined || poId === 0) poId = '';
    if (quotationItemId == undefined || quotationItemId === 0)
      quotationItemId = '';
    if (itemUnitId == undefined || itemUnitId === 0) itemUnitId = '';
    if (quantityReceived == undefined || quantityReceived === 0)
      quantityReceived = '';
    if (irId == undefined || irId === 0) irId = '';

    // Send GET request with query parameters
    return this.http
      .get<any>(
        `${environment.procurementBaseUrl}${QUOTATION_ITEM_INVENTORY_RECEIVABLES}?poId=${poId}&quotationItemId=${quotationItemId}&itemUnitId=${itemUnitId}&quantityReceived=${quantityReceived}&irId=${irId}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next();
        })
      );
  }

  validateQuantityExisting(
    poId: any,
    quotationItemId: any,
    itemUnitId: any,
    quantityReceived: any,
    irId: any
  ): Observable<any> {
    if (poId == undefined || poId === 0) poId = '';
    if (quotationItemId == undefined || quotationItemId === 0)
      quotationItemId = '';
    if (itemUnitId == undefined || itemUnitId === 0) itemUnitId = '';
    if (quantityReceived == undefined || quantityReceived === 0)
      quantityReceived = '';

    if (irId == undefined || irId === 0) irId = '';

    // Send GET request with query parameters
    return this.http
      .get<any>(
        `${environment.procurementBaseUrl}${QUOTATION_ITEM_INVENTORY_RECEIVABLES}/existing?poId=${poId}&quotationItemId=${quotationItemId}&itemUnitId=${itemUnitId}&quantityReceived=${quantityReceived}&irId=${irId}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next();
        })
      );
  }

  updateInventoryReceivables(inventoryReceivable: any): Observable<string> {
    return this.http.post<string>(
      `${environment.procurementBaseUrl}${UPDATE_INVENTORYRECEIVABLE}`,
      inventoryReceivable
    );
  }

  updateInventoryReceivableHistory(
    inventoryReceivable: any
  ): Observable<string> {
    return this.http.post<string>(
      `${environment.procurementBaseUrl}${UPDATE_INVENTORYRECEIVABLE_HISTORY}`,
      inventoryReceivable
    );
  }

  displayInventoryReceivables(
    page: number,
    size: number,
    userId: number,
    poCode: string,
    projectId: number,
    startDate: any,
    endDate: any
  ): Observable<any> {
    return this.http.get<InventoryReceivablesDto[]>(
      `${environment.procurementBaseUrl}${DISPLAY_PENDING_IR}?page=${page}&size=${size}&userId=${userId}&poCode=${poCode}&projectId=${projectId}&startDate=${startDate}&endDate=${endDate}`
    );
  }

  appRejInventoryReceivables(
    page: number,
    size: number,
    userId: number,
    poCode: string,
    projectId: number,
    startDate: any,
    endDate: any
  ): Observable<any> {
    return this.http.get<InventoryReceivablesDto[]>(
      `${environment.procurementBaseUrl}${APP_REJ_IR}?page=${page}&size=${size}&userId=${userId}&poCode=${poCode}&projectId=${projectId}&startDate=${startDate}&endDate=${endDate}`
    );
  }
  getPendingInventoryReceivables(
    page: number,
    size: number,
    userId: number,
    poCode: string,
    projectId: number,
    startDate: any,
    endDate: any
  ): Observable<any> {
    return this.http.get<InventoryReceivablesDto[]>(
      `${environment.procurementBaseUrl}${PENDING_IR}?page=${page}&size=${size}&userId=${userId}&poCode=${poCode}&projectId=${projectId}&startDate=${startDate}&endDate=${endDate}`
    );
  }
  getNonPendingInventoryReceivables(
    page: number,
    size: number,
    userId: number,
    poCode: string,
    projectId: number,
    startDate: any,
    endDate: any
  ): Observable<any> {
    return this.http.get<InventoryReceivablesDto[]>(
      `${environment.procurementBaseUrl}${NON_PENDING_IR}?page=${page}&size=${size}&userId=${userId}&poCode=${poCode}&projectId=${projectId}&startDate=${startDate}&endDate=${endDate}`
    );
  }

  getAllInventoryReceivable(
    projectId: any,
    vendorId: any,
    poId: any,
    page: number,
    size: number
  ): Observable<Page<GetInventoryReceivablesDto>> {
    if (projectId == undefined || projectId === 0) projectId = '';
    if (vendorId == undefined || vendorId === 0) vendorId = '';

    return this.http.get<Page<GetInventoryReceivablesDto>>(
      `${environment.procurementBaseUrl}${GET_ALL}?projectId=${projectId}&vendorId=${vendorId}&poId=${poId}&page=${page}&size=${size}`
    );
  }

  getInventoryReceivableHistory(
    quotationItemId: number,
    irId: number,
    page: number,
    size: number
  ) {
    return this.http.get<any>(
      `${environment.procurementBaseUrl}${GET_INVENTORY_RECEIVABLE_HISTORY}?quotationItemId=${quotationItemId}&irId=${irId}&page=${page}&size=${size}`
    );
  }

  getInventoryReceivableItemsByPoId(poId: number, page: number, size: number) {
    return this.http.get<Page<InventoryReceivablesDto>>(
      `${environment.procurementBaseUrl}${GET_ALL_INVENTORY_RECEIVABLE_ITEM}?poId=${poId}&page=${page}&size=${size}`
    );
  }

  getStages(incidentId: number, loggedInUserId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${environment.procurementBaseUrl}${GET_ALL_INVENTORY_RECEIVABLE_STAGES}?incidentId=${incidentId}&loggedInUserId=${loggedInUserId}`
    );
  }
}
