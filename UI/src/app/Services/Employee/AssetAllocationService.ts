import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { ControllerPaths } from 'src/app/Apis/ControllerPaths/ControllerPaths';
import { Assets } from 'src/app/Models/Employee/assets';
import { AssetAllocation, AssetAllocationDto } from 'src/app/Models/Employee/AssetsAllocation';

import { Page } from 'src/app/Models/User/User';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class AssetAllocationService {
  constructor(private http: HttpClient) {}

  private _refreshRequired = new Subject<void>();

  get refreshRequired() {
    return this._refreshRequired;
  }

  //adding client
  addEmployeeAssetAllocationDetails(AssetAllocation: any): Observable<any> {
    console.log(AssetAllocation);
    return this.http.post<any>(
      `${environment.hrmBaseUrl}${ControllerPaths.ASSETALLOCATION}/save`,
      AssetAllocation
    );
  }


  updateEmployeeAssetAllocationDetails( AssetAllocation: any): Observable<any> {
    console.log(AssetAllocation);

    return this.http.put<any>(
      `${environment.hrmBaseUrl}${ControllerPaths.ASSETALLOCATION}/update`,
      AssetAllocation
    );
  }



  getAllEmployeeAssetAllocationDetails(firstName:string,assetName:string,page:number,size: number) {
    console.log(firstName,page,size);
    if (firstName == undefined||'') firstName = '';
    if (assetName == undefined||'') assetName = '';
    return this.http.get<Page<AssetAllocationDto>>(
      `${environment.hrmBaseUrl}${ControllerPaths.ASSETALLOCATION}/getalldto?firstName=${firstName}&assetName=${assetName}&page=${page}&size=${size}`
    );
  }

  deleteEmployeeAssetAllocationDetails(id: number): Observable<string> {
    console.log(id);
    return this.http.delete<string>(
      `${environment.hrmBaseUrl}${ControllerPaths.ASSETALLOCATION}/${id}`
    ).pipe(
      tap(() => {
        this._refreshRequired.next(); // Emit refresh event
      })
    );
  }


  getEmployeeAssetAllocationDetailsById(id: number): Observable<any> {
    return this.http.get<any>(
      `${environment.hrmBaseUrl}${ControllerPaths.ASSETALLOCATION}/${id}`
    );
  }
}
