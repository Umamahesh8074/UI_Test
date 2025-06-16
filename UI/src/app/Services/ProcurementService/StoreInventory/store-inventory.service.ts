import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Page } from 'src/app/Models/User/User';
import {
  IStoreInventory,
  StoreInventory,
  StoreInventoryDto,
} from 'src/app/Models/Procurement/storeinventory';
import {
  DELETE_STORE_INVENTORY,
  GET_AVAILABLE_STOCK,
  GET_STORE_INVENTORIES,
  GET_STORE_INVENTORY_BY_ID,
  SAVE_STORE_INVENTORY,
  UPDATE_STORE_INVENTORY,
} from 'src/app/Apis/ProcurementApis/storeinventory';
import { IPageResponse } from 'src/app/Models/Procurement/ItemCategory';
import { GET_STORE_INVENTORY } from 'src/app/Apis/ProcurementApis/ItemCategory';

@Injectable({
  providedIn: 'root',
})
export class StoreInventoryService {
  constructor(private http: HttpClient) {}

  // Define refreshRequired as a Subject
  private _refreshRequired = new Subject<void>();
  public refreshRequired = this._refreshRequired.asObservable();

  getAllStoreInventories(
    projectId: any,
    poId: any,
    categoryId: any,
    subCategoryId: any,
    specificationId: any,
    unitId: any,
    workTypeId: any,
    storeId: any,
    page: number,
    size: number,
    userId?: any
  ): Observable<Page<StoreInventoryDto>> {
    if (projectId == undefined || projectId === 0) projectId = '';
    if (storeId == undefined || storeId === 0) storeId = '';
    if (categoryId == undefined || categoryId === 0) categoryId = '';
    // if (categoryId == undefined || categoryId === 0) categoryId = '';
    if (subCategoryId == undefined || subCategoryId === 0) subCategoryId = '';
    if (specificationId == undefined || specificationId === 0)
      specificationId = '';
    if (unitId == undefined || unitId === 0) unitId = '';
    if (poId == undefined || poId === 0) poId = '';
    if (workTypeId == undefined || workTypeId === 0) workTypeId = '';
    if (userId == undefined || userId === 0) userId = '';
    return this.http.get<Page<StoreInventoryDto>>(
      `${environment.procurementBaseUrl}${GET_STORE_INVENTORIES}?projectId=${projectId}&poId=${poId}&categoryId=${categoryId}&subCategoryId=${subCategoryId}&specificationId=${specificationId}&unitId=${unitId}&workTypeId=${workTypeId}&storeId=${storeId}&page=${page}&size=${size}&userId=${userId}`
    );
  }

  getStoreInventory(
    page: number,
    size: number,
    unitId: any
  ): Observable<IPageResponse<any[]>> {
    return this.http.get<IPageResponse<any[]>>(
      `${environment.procurementBaseUrl}${GET_STORE_INVENTORY}?page=${page}&size=${size}&unitId=${unitId}`
    );
  }

  deleteStoreInventory(storeInventoryId: number): Observable<string> {
    return this.http
      .delete<string>(
        `${environment.procurementBaseUrl}${DELETE_STORE_INVENTORY}/${storeInventoryId}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next();
        })
      );
  }

  getStoreInventoryDetailsById(storeInventoryId: any): Observable<any> {
    if (storeInventoryId == undefined || storeInventoryId === 0)
      storeInventoryId = '';
    return this.http.get<any>(
      `${environment.procurementBaseUrl}${GET_STORE_INVENTORY_BY_ID}/getbyinventoryid?storeInventoryId=${storeInventoryId}`
    );
  }

  checkStockAvailable(quantity: number, storeId: number, itemId: number) {
    quantity == null || quantity == undefined ? '' : 0;
    return this.http.get<any>(
      `${environment.procurementBaseUrl}${GET_AVAILABLE_STOCK}?storeId=${storeId}&itemUnitId=${itemId}&quantity=${quantity}`
    );
  }

  addStoreInventory(storeinventory: StoreInventory): Observable<string> {
    return this.http.post<string>(
      `${environment.procurementBaseUrl}${SAVE_STORE_INVENTORY}`,
      storeinventory
    );
  }

  updateInventoryTransfer(storeinventory: StoreInventory): Observable<string> {
    return this.http.put<string>(
      `${environment.procurementBaseUrl}${UPDATE_STORE_INVENTORY}`,
      storeinventory
    );
  }
}
