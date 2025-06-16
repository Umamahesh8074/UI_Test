import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import {
  GETALL,
  GETBYID,
  GETITEMSUBCATEGORYSPEC,
  INACTIVEITEMSUBCATEGORY,
  SAVEITEMSUBCATEGORY,
  UPDATEITEMSUBCATEGORY,
} from 'src/app/Apis/ProcurementApis/ItemSubCategory';
import { Page } from 'src/app/Models/CommanModel/Page';
import { ItemSubCategory } from 'src/app/Models/Procurement/itemsubcategory';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ItemSubCategoryService {
  constructor(private http: HttpClient) {}

  private _refreshRequired = new Subject<void>();

  get refreshRequired() {
    return this._refreshRequired;
  }

  //getting filter data based on item-sub-category name
  getAllItemSubCategory(
    itemsubcategoryName: string,
    itemCategoryId: number,
    status: number,
    page: number,
    size: number,
    itemSubCategoryCode: string,
    workTypeId: number
  ) {
    itemCategoryId = itemCategoryId ? itemCategoryId : 0;
    return this.http.get<Page<ItemSubCategory>>(
      `${environment.procurementBaseUrl}${GETITEMSUBCATEGORYSPEC}?subCategoryName=${itemsubcategoryName}&categoryId=${itemCategoryId}&status=${status}&page=${page}&size=${size}&itemSubCategoryCode=${itemSubCategoryCode}&workTypeId=${workTypeId}`
    );
  }

  //adding item-sub-category
  addItemSubCategory(itemsubcategory: any): Observable<any> {
    return this.http.post<any>(
      `${environment.procurementBaseUrl}${SAVEITEMSUBCATEGORY}`,
      itemsubcategory
    );
  }

  getSubCategoryById(subCategoryId: number) {
    return this.http.get<any>(
      `${environment.procurementBaseUrl}${GETBYID}${subCategoryId}`
    );
  }
  //update item-sub-category
  updateItemSubCategory(itemsubcategory: any): Observable<any> {
    return this.http.put<any>(
      `${environment.procurementBaseUrl}${UPDATEITEMSUBCATEGORY}`,
      itemsubcategory
    );
  }
  deleteItemSubCategory(itemSubCategoryId: number): Observable<string> {
    return this.http
      .delete<string>(
        `${environment.procurementBaseUrl}${INACTIVEITEMSUBCATEGORY}/${itemSubCategoryId}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next(); // Emit refresh event
        })
      );
  }
  //getting item sub category with out pagination
  fetchItemSubCategory(itemcategoryId: number, subCategoryName: string) {
    return this.http.get<any>(
      `${environment.procurementBaseUrl}${GETALL}?itemcategoryId=${itemcategoryId}&subCategoryName=${subCategoryName}`
    );
  }
}
