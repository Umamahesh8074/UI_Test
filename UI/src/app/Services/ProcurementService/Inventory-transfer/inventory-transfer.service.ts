import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import {
  DELETE_BY_ID__INVENTORY_TRANSFER,
  GET_BY_ID__INVENTORY_TRANSFER,
  GETALL_INVENTORY_TRANSFER,
  SAVE_INVENTORY_TRANSFER,
  UPDATE_INVENTORY_TRANSFER,
} from 'src/app/Apis/ProcurementApis/inventory-transfer';

import {
  IInventoryTransfer,
  InventoryTransfer,
} from 'src/app/Models/Procurement/InventoryTransfer';

import { Page } from 'src/app/Models/Qrgenerator/qrgenerator';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InventoryTransferService {
  constructor(private http: HttpClient) {}
  private _refreshRequired = new Subject<void>();
  public refreshRequired = this._refreshRequired.asObservable();

  getAllInventoryTransfers(
    page: number,
    size: number,
    itemName: string,
    startDate: any,
    endDate: any,
    userId?: any
  ): Observable<Page<InventoryTransfer>> {
    startDate = startDate === undefined || startDate === null ? '' : startDate;
    endDate = endDate === undefined || endDate === null ? '' : startDate;
    if (userId == undefined || 0) userId = '';

    return this.http.get<Page<InventoryTransfer>>(
      `${environment.procurementBaseUrl}${GETALL_INVENTORY_TRANSFER}?&page=${page}&size=${size}&itemName=${itemName}&startDate=${startDate}&endDate=${endDate}&userId=${userId}`
    );
  }

  // Fetch inventory Transfer by transferId ID
  getInventoryTransfersByTransferId(
    transferId: number
  ): Observable<InventoryTransfer[]> {
    return this.http.get<InventoryTransfer[]>(
      `${environment.procurementBaseUrl}${GET_BY_ID__INVENTORY_TRANSFER}${transferId}`
    );
  }

  // Add new inventory Transfer
  addInventoryTransfer(
    inventoryTransfer: IInventoryTransfer
  ): Observable<string> {
    return this.http.post<string>(
      `${environment.procurementBaseUrl}${SAVE_INVENTORY_TRANSFER}`,
      inventoryTransfer
    );
  }

  // Update an existing inventory Transfer
  updateInventoryTransfer(
    inventoryTransfer: InventoryTransfer
  ): Observable<string> {
    return this.http.put<string>(
      `${environment.procurementBaseUrl}${UPDATE_INVENTORY_TRANSFER}`,
      inventoryTransfer
    );
  }

  // Delete an inventory Transfer
  deleteInventoryTransfer(transferId: number): Observable<string> {
    return this.http
      .delete<string>(
        `${environment.procurementBaseUrl}${DELETE_BY_ID__INVENTORY_TRANSFER}${transferId}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next();
        })
      );
  }
}
