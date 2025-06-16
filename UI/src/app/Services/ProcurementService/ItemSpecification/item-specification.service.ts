import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import {
  DELETEITEMSPECIFICATION,
  GETALLITEMSPECIFICATION,
  GETITEMSPECIFICATIONBYID,
  GETITEMSPECIFICATIONBYITEMSUBCATEGORYID,
  GETSPECITEMSPECIFICATION,
  SAVEITEMSPECIFICATION,
  UPDATEITEMSPECIFICATION,
} from 'src/app/Apis/ProcurementApis/ItemSpecification';
import { ItemSpecification } from 'src/app/Models/Procurement/itemspecification';
import { Page } from 'src/app/Models/User/menuItem';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ItemSpecificationService {
  constructor(private http: HttpClient) {}

  private _refreshRequired = new Subject<void>();

  get refreshRequired() {
    return this._refreshRequired;
  }

  addItemSpecification(ItemSpecification: any): Observable<any> {
    return this.http.post<any>(
      `${environment.procurementBaseUrl}${SAVEITEMSPECIFICATION}`,
      ItemSpecification
    );
  }

  //delete specification
  deleteItemSpecification(ItemSpecificationId: number): Observable<string> {
    return this.http
      .delete<string>(
        `${environment.procurementBaseUrl}${DELETEITEMSPECIFICATION}/${ItemSpecificationId}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next(); // Emit refresh event
        })
      );
  }

  //update item-specification
  updateItemSpecification(ItemSpecification: any): Observable<any> {
    return this.http.put<any>(
      `${environment.procurementBaseUrl}${UPDATEITEMSPECIFICATION}`,
      ItemSpecification
    );
  }

  //getting filter data based on item-specification name

  getAllItemSpecification(
    workTypeId: any,
    itemSpecificationNameCode: string,
    ItemSpecificationName: string,
    categoryId: any,
    subCategoryId: any,
    status: any,
    page: any,
    size: any
  ) {
    workTypeId = workTypeId || '';
    categoryId = categoryId || '';
    subCategoryId = subCategoryId || '';
    itemSpecificationNameCode = itemSpecificationNameCode || '';
    ItemSpecificationName = ItemSpecificationName || '';
    status = status || '';
    return this.http.get<Page<ItemSpecification>>(
      `${environment.procurementBaseUrl}${GETSPECITEMSPECIFICATION}?workTypeId=${workTypeId}&specificationCode=${itemSpecificationNameCode}&specificationName=${ItemSpecificationName}&categoryId=${categoryId}&subCategoryId=${subCategoryId}&status=${status}&page=${page}&size=${size}`
    );
  }

  //get all item specification
  getItemSpecifications() {
    return this.http.get<any>(
      `${environment.procurementBaseUrl}${GETALLITEMSPECIFICATION}`
    );
  }
  getAllItemSpecificationByItemCategoryId(
    ItemSubCategoryId: any,
    name: string
  ) {
    if (ItemSubCategoryId == undefined || 0) ItemSubCategoryId = '';
    if (name == undefined || 0) name = '';
    return this.http.get<ItemSpecification[]>(
      `${environment.procurementBaseUrl}${GETITEMSPECIFICATIONBYITEMSUBCATEGORYID}?ItemSubCategoryId=${ItemSubCategoryId}&specName=${name}`
    );
  }
  getSpecificationById(selectedSpecificationId: number) {
    return this.http.get<any>(
      `${environment.procurementBaseUrl}${GETITEMSPECIFICATIONBYID}${selectedSpecificationId}`
    );
  }
}
