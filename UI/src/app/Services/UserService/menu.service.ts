import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import {
  DELETEMENU,
  FETCHALLMENUS,
  GETALLMENUS,
  SAVEMENU,
  UPDATEMENU,
} from 'src/app/Apis/UserApis/Menu';
import { Page } from 'src/app/Models/CommanModel/Page';

import { Menu } from 'src/app/Models/User/menu';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  constructor(private http: HttpClient) {}
  private _refreshRequired = new Subject<void>();

  get refreshRequired() {
    return this._refreshRequired;
  }

  //adding menu
  addMenu(menu: any, organizationId: any): Observable<any> {
    console.log(menu);
    return this.http.post<any>(
      `${environment.userBaseUrl}${SAVEMENU}/${organizationId}`,
      menu
    );
  }

  //delete menu
  deleteMenu(menuId: number): Observable<string> {
    console.log(menuId);
    return this.http
      .delete<string>(`${environment.userBaseUrl}${DELETEMENU}/${menuId}`)
      .pipe(
        tap(() => {
          this._refreshRequired.next(); // Emit refresh event
        })
      );
  }

  //update menu
  updateMenu(menu: any, organizationId: any): Observable<any> {
    console.log(menu);
    console.log(menu);
    return this.http.put<any>(
      `${environment.userBaseUrl}${UPDATEMENU}/${organizationId}`,
      menu
    );
  }

  //getting filter data based on menu name
  getAllMenu(
    menuName: string | '',
    page: number,
    size: number,
    organizationId: any
  ) {
    page = page !== undefined ? page : 0;
    size = size !== undefined ? size : 0;
    menuName = menuName ? menuName : '';
    console.log(menuName, page, size);
    return this.http.get<Page<Menu>>(
      `${environment.userBaseUrl}${GETALLMENUS}?menuName=${menuName}&page=${page}&size=${size}&organizationId=${organizationId}`
    );
  }

  fetchAllMenus(organizationId: any, menuName?: string): Observable<Menu[]> {
    menuName = menuName ? menuName : '';
    return this.http.get<Menu[]>(
      `${environment.userBaseUrl}${FETCHALLMENUS}?menuName=${menuName}&organizationId=${organizationId}`
    );
  }
}
