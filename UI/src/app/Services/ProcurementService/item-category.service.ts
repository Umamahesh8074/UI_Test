import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  DELETEITEMCATEGORY,
  GETALL,
  GETBYID,
  GETITEMCATEGORYSPEC,
  SAVEITEMCATEGORY,
  UPDATEITEMCATEGORY,
} from 'src/app/Apis/ProcurementApis/ItemCategory';

import {
  IItemCategory,
  IItemCategoryDto,
  IPageResponse,
} from 'src/app/Models/Procurement/ItemCategory';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ItemCategoryService {
  constructor(private http: HttpClient) {}

  //getting all pagable categories
  getItemCategories(
    name: string,
    status: string,
    page: number,
    size: number,
    workTypeId: number,
    categoryCode: string
  ): Observable<IPageResponse<IItemCategoryDto[]>> {
    status = status || '';
    return this.http.get<IPageResponse<IItemCategoryDto[]>>(
      `${environment.procurementBaseUrl}${GETITEMCATEGORYSPEC}?categoryName=${name}&status=${status}&page=${page}&size=${size}&workTypeId=${workTypeId}&categoryCode=${categoryCode}`
    );
  }

  saveItemCategory(itemCategory: IItemCategory): Observable<any> {
    return this.http.post<any>(
      `${environment.procurementBaseUrl}${SAVEITEMCATEGORY}`,
      itemCategory
    );
  }
  updateItemCategory(itemCategory: IItemCategory): Observable<any> {
    //TODO need to add status also
    console.log(JSON.stringify(itemCategory));
    return this.http.put<any>(
      `${environment.procurementBaseUrl}${UPDATEITEMCATEGORY}`,
      itemCategory
    );
  }

  deleteItemCategory(itemCategoryId: number): Observable<any> {
    return this.http.delete<any>(
      `${environment.procurementBaseUrl}${DELETEITEMCATEGORY}/${itemCategoryId}`
    );
  }

  //fetching item categories
  fetchItemCategories(
    categoryName: string,
    workTypeId: number
  ): Observable<any> {
    console.log(categoryName);
    return this.http.get<any>(
      `${environment.procurementBaseUrl}${GETALL}?workTypeId=${workTypeId}&categoryName=${categoryName}`
    );
  }

  getCategoryById(categoryId: number) {
    return this.http.get<any>(
      `${environment.procurementBaseUrl}${GETBYID}${categoryId}`
    );
  }

  getItemCategory(categoryName: any) {
    if (categoryName == undefined || categoryName === 0) categoryName = '';

    return this.http.get<any>(
      `${environment.procurementBaseUrl}${GETALL}?categoryName=${categoryName}`
    );
  }
}
