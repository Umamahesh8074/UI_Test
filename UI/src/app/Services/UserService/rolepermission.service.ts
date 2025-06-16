import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  GETALLROLEMENUITEM,
  SAVEROLEMENUITEM,
} from 'src/app/Apis/UserApis/RoleMenuItem';
import {
  IMenuDto,
  MenuDto,
  MenuItemsDto,
} from 'src/app/Models/CommanModel/menuDto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RolepermissionService {
  constructor(private http: HttpClient) {}

  getMenu(roleId: number, organizationId: any): Observable<MenuDto[]> {
    console.log(roleId);
    return this.http.get<MenuDto[]>(
      `${environment.userBaseUrl}${GETALLROLEMENUITEM}/role/permission/${roleId}?organizationId=${organizationId}`
    );
  }

  
  saveRolePermission(menuItems: MenuItemsDto[], roleId: any): Observable<any> {
    return this.http.post(
      `${environment.userBaseUrl}${SAVEROLEMENUITEM}/${roleId}`,
      menuItems
    );
  }

  getMenuSearch(
    roleId: number,
    searchText: any,
    menuItems?: IMenuDto[]
  ): Observable<any[]> {
    console.log(roleId);
    return this.http.post<MenuItemsDto[]>(
      `${environment.userBaseUrl}${GETALLROLEMENUITEM}/role/permission/search/${roleId}?searchText=${searchText}`,
      menuItems
    );
  }
}
