import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';

import {
  DELETESTORES,
  GETALLSTORE,
  GETALLSTORES,
  GETBYID,
  GETINCHARGE,
  SAVESTORE,
  UPDATESTORE,
} from 'src/app/Apis/ProcurementApis/Store';
import { Page } from 'src/app/Models/CommanModel/Page';

import { IStore, Store, StoreDto } from 'src/app/Models/Procurement/store';
import { Role } from 'src/app/Models/User/Role';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  constructor(private http: HttpClient) {}
  private _refreshRequired = new Subject<void>();
  public refreshRequired = this._refreshRequired.asObservable();

  getAllStore(): Observable<Store[]> {
    return this.http.get<Store[]>(
      `${environment.procurementBaseUrl}${GETALLSTORE}`
    );
  }

  getStore(storeId: number): Observable<Store> {
    return this.http.get<Store>(
      `${environment.procurementBaseUrl}${GETBYID}` + '/' + storeId
    );
  }

  saveStore(store: any): Observable<any> {
    return this.http.post(
      `${environment.procurementBaseUrl}${SAVESTORE}`,
      store
    );
  }

  editStore(store: any): Observable<any> {
    return this.http.put(
      `${environment.procurementBaseUrl}${UPDATESTORE}`,
      store
    );
  }

  getStoreById(storeId: number): Observable<Role> {
    return this.http.get<Role>(
      `${environment.procurementBaseUrl}${GETBYID}/${storeId}`
    );
  }

  getAllStorePage(
    storeName: string,
    projectId: any,
    page: any,
    size: any,
    contactNumber: string
  ) {
    if (projectId == undefined || 0) projectId = '';
    if (storeName == undefined || 0) storeName = '';
    return this.http.get<Page<StoreDto>>(
      `${environment.procurementBaseUrl}${GETALLSTORES}?storeName=${storeName}&projectId=${projectId}&page=${page}&size=${size}&contactNumber=${contactNumber}`
    );
  }

  getAllStoreWithOutPage(storeName: string, userId?: any, projectId?: number) {
    if (userId == undefined || 0) userId = '';
    if (storeName == undefined || 0) storeName = '';
    if (projectId == undefined || 0) projectId = 0;
    return this.http.get<Store[]>(
      `${environment.procurementBaseUrl}${GETALLSTORES}/withoutpage?storeName=${storeName}&userId=${userId}&projectId=${projectId}`
    );
  }

  deleteStore(storeId: number): Observable<string> {
    return this.http
      .delete<string>(
        `${environment.procurementBaseUrl}${DELETESTORES}/${storeId}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next();
        })
      );
  }

  getInchargeByStoreId(storeId: number) {
    return this.http.get<any>(
      `${environment.procurementBaseUrl}${GETINCHARGE}/getbystoreid?storeId=${storeId}`
    );
  }
}
