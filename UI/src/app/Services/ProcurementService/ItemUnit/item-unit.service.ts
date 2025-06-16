import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import {
  DELETEITEMUNIT,
  GET_MATERIAL_CODES,
  GETALLITEMUNIT,
  GETALLITEMUNITSWITHOUTPAGINATION,
  GETBYIDITEMUNIT,
  GETITEMUNITSBYITEMSPECIFICATIONID,
  SAVEITEMUNIT,
  UPDATEITEMUNIT,
} from 'src/app/Apis/ProcurementApis/ItemUnit';
import { Page } from 'src/app/Models/CommanModel/Page';
import { ItemUnit, ItemUnitDto } from 'src/app/Models/Procurement/itemunit';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ItemUnitService {
  constructor(private http: HttpClient) {}

  private _refreshRequired = new Subject<void>();

  get refreshRequired() {
    return this._refreshRequired;
  }

  //adding item-unit
  addItemUnit(itemunit: any): Observable<any> {
    return this.http.post<any>(
      `${environment.procurementBaseUrl}${SAVEITEMUNIT}`,
      itemunit
    );
  }

  deleteItemUnit(itemunitId: number): Observable<string> {
    return this.http
      .delete<string>(
        `${environment.procurementBaseUrl}${DELETEITEMUNIT}/${itemunitId}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next(); // Emit refresh event
        })
      );
  }

  //update item-unit
  updateItemUnit(itemunit: any): Observable<any> {
    return this.http.put<any>(
      `${environment.procurementBaseUrl}${UPDATEITEMUNIT}`,
      itemunit
    );
  }

  //getting filter data based on item-unit name
  getAllItemUnit(
    materialCode: string,
    categoryId: any,
    subCategoryId: any,
    specificationId: any,
    status: any,
    page: number,
    size: number,
    workTypeId: number
  ) {
    categoryId = categoryId || '';
    subCategoryId = subCategoryId || '';
    specificationId = specificationId || '';
    categoryId = categoryId || '';
    status = status || '';
    return this.http.get<Page<ItemUnit>>(
      `${environment.procurementBaseUrl}${GETALLITEMUNIT}?materialCode=${materialCode}&categoryId=${categoryId}&subCategoryId=${subCategoryId}&specificationId=${specificationId}&status=${status}&page=${page}&size=${size}&workTypeId=${workTypeId}`
    );
  }
  getAllItemUnitByItemSpecificationId(ItemSpecificationId: number) {
    return this.http.get<ItemUnit>(
      `${environment.procurementBaseUrl}${GETITEMUNITSBYITEMSPECIFICATIONID}?ItemSpecificationId=${ItemSpecificationId}`
    );
  }
  getItemUnitByUnitId(selectedUnitId: any) {
    return this.http.get<any>(
      `${environment.procurementBaseUrl}${GETBYIDITEMUNIT}/${selectedUnitId}`
    );
  }

  getMaterialCodes(
    categoryTypeId: number,
    materialCode: string,
    materialCodeId: number
  ) {
    return this.http.get<ItemUnitDto[]>(
      `${environment.procurementBaseUrl}${GET_MATERIAL_CODES}?materialCode=${materialCode}&categoryTypeId=${categoryTypeId}&materialCodeId=${materialCodeId}`
    );
  }

  getAllItemUnitWithOutPage(
    itemUnitName: string,
    categoryId: any,
    subCategoryId: any,
    specificationId: any
  ) {
    categoryId = categoryId || '';
    subCategoryId = subCategoryId || '';
    specificationId = specificationId || '';

    return this.http.get<ItemUnitDto[]>(
      `${environment.procurementBaseUrl}${GETALLITEMUNIT}/withoutpage?unitName=${itemUnitName}&categoryId=${categoryId}&subCategoryId=${subCategoryId}&specificationId=${specificationId}`
    );
  }

  getAllItemUnitBySpecificationId(
    itemUnitName: string,
    categoryId: any,
    subCategoryId: any,
    specificationId: any
  ) {
    categoryId = categoryId || '';
    subCategoryId = subCategoryId || '';
    specificationId = specificationId || '';

    return this.http.get<ItemUnitDto[]>(
      `${environment.procurementBaseUrl}${GETALLITEMUNIT}/withoutpage?specificationId=${specificationId}`
    );
  }
  getAll(itemName: string) {
    return this.http.get<any>(
      `${environment.procurementBaseUrl}${GETALLITEMUNITSWITHOUTPAGINATION}?itemName=${itemName}`
    );
  }
}
