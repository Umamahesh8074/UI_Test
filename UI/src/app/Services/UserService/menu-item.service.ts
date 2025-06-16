import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';

import {
  DELETEMENUITEM,
  GETALLMENUITEMDTO,
  GETALLMENUITEMS,
  SAVEMENUITEM,
  UPDATEMENUITEM,
} from 'src/app/Apis/UserApis/MenuItem';

import { MenuItem, Page } from 'src/app/Models/User/menuItem';

import { MenuItemDto } from 'src/app/Models/User/menuItemDto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MenuItemService {
  constructor(private http: HttpClient) {}
  private _refreshRequired = new Subject<void>();

  get refreshRequired() {
    return this._refreshRequired;
  }

  //get all menus to display menu in front end
  // getAllMenu(size: any, index: any): Observable<Page<Menu>> {
  //   return this.http.get<Page<Menu>>(
  //     `${environment.baseUrl}${ControllerPaths.MENU}/all/${index}/${size}`
  //   );
  // }

  //adding menu
  addMenuItem(menuItem: any, organizationId: any): Observable<any> {
    console.log(menuItem);
    return this.http.post<any>(
      `${environment.userBaseUrl}${SAVEMENUITEM}/${organizationId}`,

      menuItem
    );
  }

  deleteMenuItem(menuItemId: number): Observable<string> {
    console.log(menuItemId);

    return this.http
      .delete<string>(
        `${environment.userBaseUrl}${DELETEMENUITEM}/${menuItemId}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next(); // Emit refresh event
        })
      );
  }

  //update menu
  updateMenuItem(menuItem: any, organizationId: any): Observable<any> {
    console.log(menuItem);
    console.log(menuItem);
    return this.http.put<any>(
      `${environment.userBaseUrl}${UPDATEMENUITEM}/${organizationId}`,

      menuItem
    );
  }

  //getting filter data based on menu name

  // event,this.pageIndex,this.pageSize
  // http://localhost:9000/api/user/menu/menus?menuName=Users&page=0&size=10

  getAllMenuItem(
    menuItemName: string,
    page: any,
    size: any,
    organizationId: any
  ) {
    console.log(menuItemName, page, size);
    return this.http.get<Page<MenuItemDto>>(
      `${environment.userBaseUrl}${GETALLMENUITEMDTO}?menuItemName=${menuItemName}&page=${page}&size=${size}&organizationId=${organizationId}`
    );
  }

  getAllMenuItems(page: any, size: any) {
    console.log(page, size);
    return this.http.get<Page<MenuItemDto>>(
      `${environment.userBaseUrl}${GETALLMENUITEMDTO}/getAll?page=${page}&size=${size}`
    );
  }
}
